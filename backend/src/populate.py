import sys
import os
import random
from datetime import date, timedelta
from faker import Faker

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))  # aggiunge /app/src
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import ResearchArea, ResearchGroupComponent, ResearchProject, Publication, Course

fake = Faker("it_IT")  # locale italiano

NUM_AREAS = 5
NUM_COMPONENTS = 15
NUM_PROJECTS = 8
NUM_PUBLICATIONS = 20
NUM_COURSES = 10

def create_research_areas():
    areas = []
    for _ in range(NUM_AREAS):
        area = ResearchArea.objects.create(
            name=fake.unique.word().capitalize(),
            description=fake.text(max_nb_chars=200)
        )
        areas.append(area)
    return areas

def create_components():
    components = []
    for _ in range(NUM_COMPONENTS):
        user = User.objects.create_user(
            username=fake.unique.user_name(),
            email=fake.email(),
            password="test1234"
        )
        comp = ResearchGroupComponent.objects.create(
            user=user,
            description=fake.text(max_nb_chars=150)
        )
        components.append(comp)
    return components

def create_projects(areas, components):
    projects = []
    for _ in range(NUM_PROJECTS):
        owner = random.choice(components)
        project = ResearchProject.objects.create(
            title=fake.sentence(nb_words=4),
            description=fake.text(max_nb_chars=300),
            start_date=date.today() - timedelta(days=random.randint(100, 2000)),
            end_date=None if random.random() < 0.5 else date.today(),
            research_area=random.choice(areas),
            project_owner=owner
        )
        project.components.set(random.sample(components, k=random.randint(2, 6)))
        projects.append(project)
    return projects

def create_publications(projects, components):
    for _ in range(NUM_PUBLICATIONS):
        project = random.choice(projects)
        pub = Publication.objects.create(
            title=fake.sentence(nb_words=6),
            publication_date=date.today() - timedelta(days=random.randint(30, 1000)),
            description=fake.text(max_nb_chars=250),
            research_project=project
        )
        pub.components.set(random.sample(components, k=random.randint(1, 4)))

def create_courses(components):
    for _ in range(NUM_COURSES):
        teacher = random.choice(components)
        Course.objects.create(
            name=fake.sentence(nb_words=3),
            description=fake.text(max_nb_chars=200),
            start_date=date.today() - timedelta(days=random.randint(30, 1000)),
            end_date=None if random.random() < 0.5 else date.today(),
            teacher=teacher
        )

if __name__ == "__main__":
    print("🔄 Popolamento database in corso...")

    areas = create_research_areas()
    components = create_components()
    projects = create_projects(areas, components)
    create_publications(projects, components)
    create_courses(components)

    print("✅ Popolamento completato!")
