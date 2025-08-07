from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from .models import ResearchArea, ResearchGroupComponent, ResearchProject, Publication, Course
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from django.contrib.auth.models import User

# Serializers
class ResearchAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchArea
        fields = '__all__'

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']

class ResearchGroupComponentSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)

    class Meta:
        model = ResearchGroupComponent
        fields = '__all__'

class ResearchProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchProject
        fields = '__all__'

class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

# ViewSets
class ResearchAreaViewSet(viewsets.ModelViewSet):
    queryset = ResearchArea.objects.all()
    serializer_class = ResearchAreaSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

class ResearchGroupComponentViewSet(viewsets.ModelViewSet):
    queryset = ResearchGroupComponent.objects.all()
    serializer_class = ResearchGroupComponentSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

class ResearchProjectViewSet(viewsets.ModelViewSet):
    queryset = ResearchProject.objects.all()
    serializer_class = ResearchProjectSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

class PublicationViewSet(viewsets.ModelViewSet):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

class HelloView(APIView):
    def post(self, request):
        name = request.data.get('name', 'default_name') 
        return Response({'message': f'Hello, {name}!'})

class PermissionsView(APIView):
    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication failed.'}, status=401)

        # Get all permissions (user and group)
        permissions = user.get_all_permissions()
        return Response({'permissions': list(permissions)})

