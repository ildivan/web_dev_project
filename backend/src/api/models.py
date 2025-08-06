
from django.db import models

class ResearchArea(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class ResearchGroupComponent(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='research_group_component', primary_key=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.username

class ResearchProject(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    research_area = models.ForeignKey(ResearchArea, on_delete=models.CASCADE, related_name='projects')
    project_owner = models.ForeignKey(ResearchGroupComponent, on_delete=models.CASCADE, related_name='owned_projects')
    components = models.ManyToManyField(ResearchGroupComponent, related_name='projects', blank=True)

    def __str__(self):
        return self.title

class Publication(models.Model):
    title = models.CharField(max_length=200)
    publication_date = models.DateField()
    description = models.TextField(blank=True)
    research_project = models.ForeignKey(ResearchProject, on_delete=models.CASCADE, related_name='publications')
    components = models.ManyToManyField(ResearchGroupComponent, related_name='publications', blank=True)

    def __str__(self):
        return self.title

class Course(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    teacher = models.ForeignKey(ResearchGroupComponent, on_delete=models.CASCADE, related_name='teached_courses')

    def __str__(self):
        return self.name
