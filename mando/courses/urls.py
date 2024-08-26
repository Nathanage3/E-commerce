from django.urls import path, include
from rest_framework import routers
from . import views
 

 # Create a router for the main API endpoints
 router = routers.DefaultRouter()
 router.register('courses', views.CourseViewSet, basename='courses')