from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .pagination import DefaultPagination

from guardian.shortcuts import assign_perm, remove_perm, get_objects_for_user
from django.contrib.auth.models import User
from django.db import transaction

from .models import ResearchArea, ResearchGroupComponent, ResearchProject, Publication, Course
from . import serializers as api_serializers
from . import permissions as api_permissions


# ----------------- HELPERS / BASES -----------------

class DynamicSerializerMixin:
    """Select serializer dynamically:
    - use detailed_serializer_class (or serializer_class) for non-list write actions
    - use short_serializer_class when client disables pagination (?page_size=0 or all)
    - otherwise use serializer_class
    """
    short_serializer_class = None
    # serializer used for detail (single-object) GET responses
    detail_serializer_class = None
    edit_serializer_class = None

    def get_serializer_class(self):
        # detail GET -> use detail serializer when provided
        if getattr(self, 'action', None) == 'retrieve' and self.request.method == 'GET':
            return self.detail_serializer_class or self.serializer_class

        # non-list write actions (create/update/partial_update) -> use edit serializer
        if getattr(self, 'action', None) not in ('list', None) and self.request.method != 'GET':
            return self.edit_serializer_class or self.serializer_class

        # list action: choose between paginated (serializer_class) and non-paginated (short)
        params = self.request.query_params
        page_size_param = getattr(self.pagination_class, 'page_size_query_param', 'page_size')
        if params.get(page_size_param) in ('0', 'all'):
            return self.short_serializer_class or self.serializer_class

        return self.serializer_class
    
    


class BaseModelViewSet(DynamicSerializerMixin, viewsets.ModelViewSet):
    permission_classes = [api_permissions.ModelOrObjectPermissions]
    pagination_class = DefaultPagination

    def get_queryset(self):
        """
        Support ?editable=1 (or true/yes) to return only objects the request.user
        can change (object-level 'change_<model>' permission).
        If the user has the model-level change permission, return the full queryset.
        """
        queryset = super().get_queryset()
        params = getattr(self.request, "query_params", {})
        editable = params.get('editable')
        if editable and str(editable).lower() in ('1', 'true', 'yes'):
            user = self.request.user
            if not user or not user.is_authenticated:
                return queryset.none()
            model = queryset.model
            app_label = model._meta.app_label
            model_name = model._meta.model_name
            perm = f"{app_label}.change_{model_name}"
            # If user has the model-level change perm, return all
            if user.has_perm(perm):
                return queryset
            # Otherwise return only objects for which the user has the object perm
            return get_objects_for_user(user, perm, klass=queryset)
        return queryset
            

# ----------------- VIEWSETS -----------------


class ResearchAreaViewSet(BaseModelViewSet):
    queryset = ResearchArea.objects.prefetch_related('projects').order_by('id')
    serializer_class = api_serializers.ResearchAreaListSerializer
    detail_serializer_class = api_serializers.ResearchAreaDetailSerializer

class ResearchGroupComponentViewSet(BaseModelViewSet):
    queryset = ResearchGroupComponent.objects.prefetch_related(
        'projects', 'owned_projects', 'teached_courses', 'publications', 'user__groups'
    ).select_related('user').order_by('user_id')

    # use list serializer (PK relationships) for paginated GET
    serializer_class = api_serializers.ResearchGroupComponentListSerializer
    detail_serializer_class = api_serializers.ResearchGroupComponentDetailSerializer
    short_serializer_class = api_serializers.ResearchGroupComponentShortSerializer
    edit_serializer_class = api_serializers.ResearchGroupComponentEditSerializer
    
    def perform_create(self, serializer):
        # Salva il progetto assegnando owner come l'utente richiedente
        with transaction.atomic():
            component = serializer.save()
            courses = set(component.teached_courses.all())
            for course in courses:
                assign_perm('api.change_course', component.user, course)
                assign_perm('api.delete_course', component.user, course)

    def perform_update(self, serializer):
        component = serializer.instance  # istanza prima dell'update
        old_courses = set(component.teached_courses.all())
        # Salva l'istanza aggiornata + perm changes in a transaction
        with transaction.atomic():
            component = serializer.save()
            new_courses = set(component.teached_courses.all())
            # Gestisci i permessi

            for course in new_courses - old_courses:
                assign_perm('api.change_course', component.user, course)
                assign_perm('api.delete_course', component.user, course)

            for course in old_courses - new_courses:
                remove_perm('api.change_course', component.user, course)
                remove_perm('api.delete_course', component.user, course)

class AllUsersViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.prefetch_related('groups').order_by('id')
    serializer_class = api_serializers.UserPublicSerializer
    permission_classes = [IsAuthenticated]

class ResearchProjectViewSet(BaseModelViewSet):
    queryset = ResearchProject.objects.select_related(
        'research_area', 'project_owner'
    ).prefetch_related('components', 'publications').order_by('id')

    serializer_class = api_serializers.ResearchProjectListSerializer
    detail_serializer_class = api_serializers.ResearchProjectDetailSerializer
    short_serializer_class = api_serializers.ResearchProjectShortSerializer
    edit_serializer_class = api_serializers.ResearchProjectEditSerializer

    def perform_create(self, serializer):
        with transaction.atomic():
            project = serializer.save()
            new_owner = project.project_owner

            # grant project perms to new owner
            assign_perm('api.change_researchproject', new_owner.user, project)
            assign_perm('api.delete_researchproject', new_owner.user, project)

    def perform_update(self, serializer):
        project = serializer.instance  # istanza prima dell'update
        old_owner = project.project_owner
        # Salva l'istanza aggiornata inside a transaction
        with transaction.atomic():
            project = serializer.save()
            new_owner = project.project_owner
            # Gestisci i permessi
            if old_owner != new_owner:
                remove_perm('api.change_researchproject', old_owner.user, project)
                remove_perm('api.delete_researchproject', old_owner.user, project)
                assign_perm('api.change_researchproject', new_owner.user, project)
                assign_perm('api.delete_researchproject', new_owner.user, project)


class PublicationViewSet(BaseModelViewSet):
    queryset = Publication.objects.select_related(
        'research_project'
    ).prefetch_related('components').order_by('id')

    serializer_class = api_serializers.PublicationListSerializer
    detail_serializer_class = api_serializers.PublicationDetailSerializer
    short_serializer_class = api_serializers.PublicationShortSerializer

    def perform_create(self, serializer):
        # Salva il progetto assegnando owner come l'utente richiedente
        with transaction.atomic():
            publication = serializer.save()
            project_owner = publication.research_project.project_owner
            assign_perm('api.change_publication', project_owner.user, publication)
            assign_perm('api.delete_publication', project_owner.user, publication)

    def perform_update(self, serializer):
        publication = serializer.instance  # istanza prima dell'update
        old_owner = publication.research_project.project_owner
        # Salva l'istanza aggiornata + perms in transaction
        with transaction.atomic():
            publication = serializer.save()
            new_owner = publication.research_project.project_owner
            # Gestisci i permessi
            if old_owner != new_owner:
                remove_perm('api.change_publication', old_owner.user, publication)
                remove_perm('api.delete_publication', old_owner.user, publication)
                assign_perm('api.change_publication', new_owner.user, publication)
                assign_perm('api.delete_publication', new_owner.user, publication)

class CourseViewSet(BaseModelViewSet):
    queryset = Course.objects.prefetch_related('teachers').order_by('id')
    serializer_class = api_serializers.CourseListSerializer
    detail_serializer_class = api_serializers.CourseDetailSerializer
    short_serializer_class = api_serializers.CourseShortSerializer

    def perform_create(self, serializer):
        with transaction.atomic():
            course = serializer.save()
            # Assegna permessi di cambio/cancellazione a ciascun membro 
            for teacher in course.teachers.all():
                    assign_perm('api.change_course', teacher.user, course)
                    assign_perm('api.delete_course', teacher.user, course)

    def perform_update(self, serializer):
        course = serializer.instance  # istanza prima dell'update
        old_teachers = set(course.teachers.all())
        # Salva l'istanza aggiornata + perms in transaction
        with transaction.atomic():
            course = serializer.save()
            new_teachers = set(course.teachers.all())

            # Calcola utenti aggiunti e rimossi
            added = new_teachers - old_teachers
            removed = old_teachers - new_teachers

            # Assegna permessi ai nuovi membri
            for teacher in added:
                if teacher != self.request.user:
                    assign_perm('api.change_course', teacher.user, course)
                    assign_perm('api.delete_course', teacher.user, course)

            # Rimuovi permessi agli utenti rimossi
            for teacher in removed:
                remove_perm('api.change_course', teacher.user, course)
                remove_perm('api.delete_course', teacher.user, course)

# ----------------- API VIEWS -----------------

class PermissionsView(APIView):
    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication failed.'}, status=401)
        permissions = user.get_all_permissions()
        return Response({'permissions': list(permissions)})