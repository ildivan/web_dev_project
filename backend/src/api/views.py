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
    components_detail = ResearchGroupComponentShortSerializer(source='components', many=True, read_only=True)
    publications = PublicationShortSerializer(many=True, read_only=True)

    class Meta:
        model = ResearchProject
        fields = '__all__'


class ResearchProjectShortSerializer(serializers.ModelSerializer):
    research_area_detail = ResearchAreaSerializer(source='research_area', read_only=True)

    class Meta:
        model = ResearchProject
        fields = ['id', 'title', 'description', 'research_area_detail']


class PublicationSerializer(serializers.ModelSerializer):
    components_detail = ResearchGroupComponentShortSerializer(source='components', many=True, read_only=True)
    research_project_detail = ResearchProjectShortSerializer(source='research_project', read_only=True)

    class Meta:
        model = Publication
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    teacher_detail = ResearchGroupComponentShortSerializer(source='teacher', read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

# ----------------- PAGINATION -----------------

class DefaultPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

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
    serializer_class = ResearchGroupComponentSerializer
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

class AllUsersViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.prefetch_related('groups')
    serializer_class = UserPublicSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = DefaultPagination

class ResearchProjectViewSet(viewsets.ModelViewSet):
    queryset = ResearchProject.objects.select_related(
        'research_area', 'project_owner'
    ).prefetch_related('components', 'publications')
    serializer_class = ResearchProjectSerializer
    pagination_class = DefaultPagination

    def get_permissions(self):
        if self.request.method == 'GET':
            return []
        return [DjangoModelPermissions()]

class PublicationViewSet(viewsets.ModelViewSet):
    queryset = Publication.objects.select_related(
        'research_project'
    ).prefetch_related('components')
    serializer_class = PublicationSerializer
    pagination_class = DefaultPagination

    def get_permissions(self):
        if self.request.method == 'GET':
            return []
        return [DjangoModelPermissions()]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related('teacher')
    serializer_class = CourseSerializer
    permission_classes = [DjangoModelPermissions()]
    pagination_class = DefaultPagination

# ----------------- SIMPLE API VIEWS -----------------

class HelloView(APIView):
    def post(self, request):
        name = request.data.get('name', 'default_name') 
        return Response({'message': f'Hello, {name}!'})

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
