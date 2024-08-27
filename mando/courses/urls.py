from django.urls import path, include
from rest_framework import routers
from . import views
 

 # Create a router for the main API endpoints
router = routers.DefaultRouter()
router.register('courses', views.CourseViewSet, basename='courses')
router.register('collections', views.CollectionViewSet)
router.register('customers', views.CustomerViewSet)

urlpatterns = [
  path('', include(router.urls))
]