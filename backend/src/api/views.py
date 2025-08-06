
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, generics, permissions
from .models import ResearchArea, ResearchGroupComponent, ResearchProject, Publication, Course
from rest_framework import serializers

# Serializers
class ResearchAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchArea
        fields = '__all__'

class ResearchGroupComponentSerializer(serializers.ModelSerializer):
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
    permission_classes = [permissions.IsAuthenticated]

class ResearchGroupComponentViewSet(viewsets.ModelViewSet):
    queryset = ResearchGroupComponent.objects.all()
    serializer_class = ResearchGroupComponentSerializer
    permission_classes = [permissions.IsAuthenticated]

class ResearchProjectViewSet(viewsets.ModelViewSet):
    queryset = ResearchProject.objects.all()
    serializer_class = ResearchProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

class PublicationViewSet(viewsets.ModelViewSet):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    permission_classes = [permissions.IsAuthenticated]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

class HelloView(APIView):
    def post(self, request):
        name = request.data.get('name', 'default_name') 
        return Response({'message': f'Hello, {name}!'})

class PermissionsView(APIView):
    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=401)

        # Get all permissions (user and group)
        permissions = user.get_all_permissions()
        return Response({'permissions': list(permissions)})

