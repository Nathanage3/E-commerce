from django.urls import path, include
from rest_framework_nested import routers
from courses import views as views
from orders import views as order_views

# Main router for Course-related viewsets
router = routers.DefaultRouter()
router.register('courses', views.CourseViewSet, basename='courses')
router.register('collections', views.CollectionViewSet)
router.register('customers', views.CustomerViewSet)
router.register('course-progress', views.CourseProgressViewSet)
router.register('instructor-earnings', views.InstructorEarningsViewSet,  basename='instructor-earnings')
router.register('orders', order_views.OrderViewSet, basename='orders')


# Nested routers for Course-related models
course_router = routers.NestedDefaultRouter(router, 'courses', lookup='course')
course_router.register('reviews', views.ReviewViewSet, basename='course-reviews')
course_router.register('progress', views.CourseProgressViewSet, basename='course-progress')
course_router.register('images', views.CourseImageViewSet, basename='course-images')
course_router.register('videos', views.CourseVideoViewSet, basename='course-videos')


urlpatterns = [
    path('', include(router.urls)),
    path('', include(course_router.urls)),
    path('instructors/<int:instructor_pk>/earnings/', views.InstructorEarningsViewSet.as_view({'get': 'list'})),
]
