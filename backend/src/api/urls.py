from django.urls import include, path
from . import views

urlpatterns = [
    path('hello/', views.HelloWorldView.as_view(), name='hello'),
    path('auth/', include('djoser.urls.authtoken')),
]
