from django.urls import include, path
from . import views

urlpatterns = [
    path('hello/', views.HelloView.as_view(), name='hello'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/permissions/', views.PermissionsView.as_view(), name='permissions'),
]
