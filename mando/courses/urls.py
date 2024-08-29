from django.urls import path, include
from rest_framework_nested import routers
from courses import views as course_views
from cart import views as cart_views

# Main router for Course-related viewsets
router = routers.DefaultRouter()
router.register('courses', course_views.CourseViewSet, basename='courses')
router.register('collections', course_views.CollectionViewSet)
router.register('customers', course_views.CustomerViewSet)

# Nested routers for Course-related models
course_router = routers.NestedDefaultRouter(router, 'courses', lookup='course')
course_router.register('reviews', course_views.ReviewViewSet, basename='course-reviews')
course_router.register('progress', course_views.CourseProgressViewSet, basename='course-progress')
course_router.register('images', course_views.CourseImageViewSet, basename='course-images')

# If you want to include carts within the courses context

# course_router.register('carts', cart_views.CartViewSet, basename='course-carts')
# course_cart_router = routers.NestedDefaultRouter(course_router, 'carts', lookup='cart')
# course_cart_router.register('items', cart_views.CartItemViewSet, basename='course-cart-items')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(course_router.urls)),
    #path('', include(course_cart_router.urls)),
    path('instructors/<int:instructor_pk>/earnings/', course_views.InstructorEarningsViewSet.as_view({'get': 'list'})),
]
