from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, serializers
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User

from .models import ResearchArea, ResearchGroupComponent, ResearchProject, Publication, Course

# ----------------- SERIALIZER -----------------

class ResearchAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchArea
        fields = '__all__'


class UserPublicSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'groups']


class ResearchGroupComponentSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    projects = serializers.PrimaryKeyRelatedField(
        many=True, queryset=ResearchProject.objects.all()
    )
    owned_projects = serializers.PrimaryKeyRelatedField(
        many=True, queryset=ResearchProject.objects.all()
    )
    teached_courses = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Course.objects.all()
    )
    publications = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Publication.objects.all()
    )

    class Meta:
        model = ResearchGroupComponent
        fields = '__all__'


class ResearchGroupComponentShortSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)

    class Meta:
        model = ResearchGroupComponent
        fields = ['user']

class PublicationShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = ['id', 'title', 'description', 'publication_date']

class ResearchProjectSerializer(serializers.ModelSerializer):
    research_area_detail = ResearchAreaSerializer(source='research_area', read_only=True)
    project_owner_detail = ResearchGroupComponentShortSerializer(source='project_owner', read_only=True)
    components = serializers.PrimaryKeyRelatedField(
        many=True, queryset=ResearchGroupComponent.objects.all()
    )
    publications = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Publication.objects.all()
    )

    class Meta:
        model = ResearchProject
        fields = '__all__'


class ResearchProjectShortSerializer(serializers.ModelSerializer):
    research_area_detail = ResearchAreaSerializer(source='research_area', read_only=True)

    class Meta:
        model = ResearchProject
        fields = ['id', 'title', 'description', 'research_area_detail']


class PublicationSerializer(serializers.ModelSerializer):
    components = serializers.PrimaryKeyRelatedField(
        many=True, queryset=ResearchGroupComponent.objects.all()
    )
    research_project = ResearchProjectShortSerializer(read_only=True)

    class Meta:
        model = Publication
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    teacher_detail = ResearchGroupComponentShortSerializer(source='teacher', many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

class CourseShortSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = ['id', 'name']

# ----------------- PAGINATION -----------------

class DefaultPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        # allow client to disable pagination per-request with ?page_size=0 or ?page_size=all
        param = request.query_params.get(self.page_size_query_param)
        if param in ('0', 'all'):
            return None
        return super().paginate_queryset(queryset, request, view)

# ----------------- VIEWSETS -----------------

class ResearchAreaViewSet(viewsets.ModelViewSet):
    queryset = ResearchArea.objects.prefetch_related('projects')
    serializer_class = ResearchAreaSerializer
    permission_classes = [DjangoModelPermissions]
    pagination_class = DefaultPagination

class ResearchGroupComponentViewSet(viewsets.ModelViewSet):
    queryset = ResearchGroupComponent.objects.prefetch_related(
        'projects', 'owned_projects', 'teached_courses', 'publications', 'user__groups'
    ).select_related('user')
    pagination_class = DefaultPagination

    def get_permissions(self):
        if self.request.method == 'GET':
            return []
        return [DjangoModelPermissions()]

    def get_queryset(self):
        queryset = super().get_queryset()
        username = self.request.query_params.get('username')
        if username:
            queryset = queryset.filter(user__username=username)
        return queryset

    def get_serializer_class(self):
        """
        Use a short serializer for paginated list responses and the full serializer
        for non-paginated requests or detail endpoints.
        """
        # if this is not a list action, use the full serializer
        if getattr(self, 'action', None) not in ('list', None) and self.request.method != 'GET':
            return ResearchGroupComponentSerializer

        params = self.request.query_params
        page_size_param = params.get(self.pagination_class.page_size_query_param)

        # Client explicitly disabled pagination with ?page_size=0 or ?page_size=all
        if page_size_param in ('0', 'all'):
            return ResearchGroupComponentShortSerializer

        return ResearchGroupComponentSerializer

class AllUsersViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.prefetch_related('groups')
    serializer_class = UserPublicSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = DefaultPagination

class ResearchProjectViewSet(viewsets.ModelViewSet):
    queryset = ResearchProject.objects.select_related(
        'research_area', 'project_owner'
    ).prefetch_related('components', 'publications')
    pagination_class = DefaultPagination

    def get_permissions(self):
        if self.request.method == 'GET':
            return []
        return [DjangoModelPermissions()]
    
    def get_serializer_class(self):
        """
        Use a short serializer for paginated list responses and the full serializer
        for non-paginated requests or detail endpoints.
        """
        # if this is not a list action, use the full serializer
        if getattr(self, 'action', None) not in ('list', None) and self.request.method != 'GET':
            return ResearchProjectSerializer

        params = self.request.query_params
        page_size_param = params.get(self.pagination_class.page_size_query_param)

        # Client explicitly disabled pagination with ?page_size=0 or ?page_size=all
        if page_size_param in ('0', 'all'):
            return ResearchProjectShortSerializer

        return ResearchProjectSerializer

class PublicationViewSet(viewsets.ModelViewSet):
    queryset = Publication.objects.select_related(
        'research_project'
    ).prefetch_related('components')
    pagination_class = DefaultPagination

    def get_permissions(self):
        if self.request.method == 'GET':
            return []
        return [DjangoModelPermissions()]
    
    def get_serializer_class(self):
        """
        Use a short serializer for paginated list responses and the full serializer
        for non-paginated requests or detail endpoints.
        """
        # if this is not a list action, use the full serializer
        if getattr(self, 'action', None) not in ('list', None) and self.request.method != 'GET':
            return PublicationSerializer

        params = self.request.query_params
        page_size_param = params.get(self.pagination_class.page_size_query_param)

        # Client explicitly disabled pagination with ?page_size=0 or ?page_size=all
        if page_size_param in ('0', 'all'):
            return PublicationShortSerializer

        return PublicationSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.prefetch_related('teachers')
    permission_classes = [DjangoModelPermissions]
    pagination_class = DefaultPagination

    def get_serializer_class(self):
        """
        Use a short serializer for paginated list responses and the full serializer
        for non-paginated requests or detail endpoints.
        """
        # if this is not a list action, use the full serializer
        if getattr(self, 'action', None) not in ('list', None) and self.request.method != 'GET':
            return CourseSerializer

        params = self.request.query_params
        page_size_param = params.get(self.pagination_class.page_size_query_param)

        # Client explicitly disabled pagination with ?page_size=0 or ?page_size=all
        if page_size_param in ('0', 'all'):
            return CourseShortSerializer

        return CourseSerializer

# ----------------- SIMPLE API VIEWS -----------------

class PermissionsView(APIView):
    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication failed.'}, status=401)
        permissions = user.get_all_permissions()
        return Response({'permissions': list(permissions)})
    
class IsComponentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        is_component = user.groups.filter(name='Componente').exists()
        return Response({'is_component': is_component})
