from rest_framework import serializers
from django.contrib.auth.models import User
from djoser.serializers import UserSerializer
from django.contrib.auth.models import User
from .models import ResearchArea, ResearchGroupComponent, ResearchProject, Publication, Course

class PermissionFieldsMixin(serializers.ModelSerializer):
    can_change = serializers.SerializerMethodField(read_only=True)
    can_delete = serializers.SerializerMethodField(read_only=True)

    class Meta:
        abstract = True  # tells DRF this is not a real serializer

    def get_can_change(self, obj):
        return self._has_perm(obj, "change")

    def get_can_delete(self, obj):
        return self._has_perm(obj, "delete")

    def _has_perm(self, obj, action: str) -> bool:
        user = self.context["request"].user
        app_label = obj._meta.app_label
        model_name = obj._meta.model_name
        codename = f"{app_label}.{action}_{model_name}"
        # check global (model-level) and object-level
        return user.has_perm(codename) or user.has_perm(codename, obj)


# SHORT SERIALIZERS

class UserMeSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class UserPublicSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'groups']

class ResearchProjectShortSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResearchProject
        fields = '__all__'

class PublicationShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = '__all__'

class ResearchGroupComponentShortSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)

    class Meta:
        model = ResearchGroupComponent
        fields = '__all__'

class CourseShortSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = '__all__'

# EDIT SERIALIZERS

class ResearchGroupComponentEditSerializer(serializers.ModelSerializer):
    user =  serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    projects = serializers.PrimaryKeyRelatedField(many=True, queryset=ResearchProject.objects.all(), required=False)
    teached_courses = serializers.PrimaryKeyRelatedField(many=True, queryset=Course.objects.all(), required=False)
    publications = serializers.PrimaryKeyRelatedField(many=True, queryset=Publication.objects.all(), required=False)

    class Meta:
        model = ResearchGroupComponent
        fields = '__all__'

class ResearchProjectEditSerializer(PermissionFieldsMixin):
    research_area = serializers.PrimaryKeyRelatedField(queryset=ResearchArea.objects.all())
    project_owner = serializers.PrimaryKeyRelatedField(queryset=ResearchGroupComponent.objects.all())
    components = serializers.PrimaryKeyRelatedField(many=True, queryset=ResearchGroupComponent.objects.all(), required=False)

    class Meta:
        model = ResearchProject
        fields = '__all__'

# LIST SERIALIZERS

class ResearchAreaListSerializer(PermissionFieldsMixin):
    projects = serializers.PrimaryKeyRelatedField(many=True, queryset=ResearchProject.objects.all())

    class Meta:
        model = ResearchArea
        fields = '__all__'


class ResearchGroupComponentListSerializer(PermissionFieldsMixin):
    projects = serializers.PrimaryKeyRelatedField(many=True, queryset=ResearchProject.objects.all(), required=False)
    owned_projects = serializers.PrimaryKeyRelatedField(many=True, queryset=ResearchProject.objects.all(), required=False)
    teached_courses = serializers.PrimaryKeyRelatedField(many=True, queryset=Course.objects.all(), required=False)
    publications = serializers.PrimaryKeyRelatedField(many=True, queryset=Publication.objects.all(), required=False)
    user = UserPublicSerializer(read_only=True)

    class Meta:
        model = ResearchGroupComponent
        fields = '__all__'

class ResearchProjectListSerializer(PermissionFieldsMixin):
    research_area = serializers.PrimaryKeyRelatedField(queryset=ResearchArea.objects.all())
    project_owner = serializers.PrimaryKeyRelatedField(queryset=ResearchGroupComponent.objects.all())
    components = serializers.PrimaryKeyRelatedField(many=True, queryset=ResearchGroupComponent.objects.all(), required=False)
    publications = serializers.PrimaryKeyRelatedField(many=True, queryset=Publication.objects.all(), required=False)

    class Meta:
        model = ResearchProject
        fields = '__all__'


class PublicationListSerializer(PermissionFieldsMixin):
    components = serializers.PrimaryKeyRelatedField(many=True, queryset=ResearchGroupComponent.objects.all(), required=False)
    research_project = serializers.PrimaryKeyRelatedField(queryset=ResearchProject.objects.all())

    class Meta:
        model = Publication
        fields = '__all__'

class CourseListSerializer(PermissionFieldsMixin):
    teachers = serializers.PrimaryKeyRelatedField(many=True, queryset=ResearchGroupComponent.objects.all(), required=False)

    class Meta:
        model = Course
        fields = '__all__'

# DETAIL SERIALIZERS

class ResearchAreaDetailSerializer(PermissionFieldsMixin):
    projects = serializers.SerializerMethodField()

    class Meta:
        model = ResearchArea
        fields = '__all__'

    def get_projects(self, obj):
        qs = obj.projects.all()
        return ResearchProjectShortSerializer(qs, many=True).data

class ResearchGroupComponentDetailSerializer(PermissionFieldsMixin):
    user = UserPublicSerializer(read_only=True)
    projects = ResearchProjectShortSerializer(many=True)
    owned_projects = ResearchProjectShortSerializer(many=True)
    teached_courses = CourseShortSerializer(many=True)
    publications = PublicationShortSerializer(many=True)

    class Meta:
        model = ResearchGroupComponent
        fields = '__all__'

class ResearchProjectDetailSerializer(PermissionFieldsMixin):
    research_area = ResearchAreaListSerializer()
    project_owner = ResearchGroupComponentShortSerializer()
    components = ResearchGroupComponentShortSerializer(many=True)
    publications = PublicationShortSerializer(many=True)

    class Meta:
        model = ResearchProject
        fields = '__all__'

class PublicationDetailSerializer(PermissionFieldsMixin):
    components = ResearchGroupComponentShortSerializer(many=True)
    research_project = ResearchProjectShortSerializer()

    class Meta:
        model = Publication
        fields = '__all__'

class CourseDetailSerializer(PermissionFieldsMixin):
    teachers = ResearchGroupComponentShortSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'
