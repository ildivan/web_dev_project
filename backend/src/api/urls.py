from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('research-areas', views.ResearchAreaViewSet)
router.register('group-components', views.ResearchGroupComponentViewSet)
router.register('projects', views.ResearchProjectViewSet)
router.register('publications', views.PublicationViewSet)
router.register('courses', views.CourseViewSet)

urlpatterns = [
    path('hello/', views.HelloView.as_view(), name='hello'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/permissions/', views.PermissionsView.as_view(), name='permissions'),
    path('', include(router.urls)),  
]
