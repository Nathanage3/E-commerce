from django.urls import path, include
from rest_framework_nested import routers
from courses import views as views


# Main router for Course-related viewsets
router = routers.DefaultRouter()
router.register('courses', views.CourseViewSet, basename='courses')
router.register('collections', views.CollectionViewSet, basename='collections')
router.register('customers', views.CustomerViewSet, basename='customers')
router.register('course-progress', views.CourseProgressViewSet, basename='course-progress')
router.register('instructor-earnings', views.InstructorEarningsViewSet,  basename='instructor-earnings')
router.register('orders', views.OrderViewSet, basename='orders')
router.register('order-items', views.OrderItemViewSet, basename='order-items')
router.register('carts', views.CartViewSet, basename='carts')
router.register('cart-items', views.CartItemViewSet, basename='cart-items')


# Nested routers for Course-related models
course_router = routers.NestedDefaultRouter(router, 'courses', lookup='course')
course_router.register('reviews', views.ReviewViewSet, basename='course-reviews')
course_router.register('progress', views.CourseProgressViewSet, basename='course-progress')
course_router.register('promotions', views.PromotionViewSet, basename='promotions')
course_router.register('sections', views.SectionViewSet, basename='sections')
course_router.register('ratings', views.RatingViewSet, basename="ratings")
# Nested router for lessons under sections

section_router = routers.NestedDefaultRouter(course_router, r'sections', lookup='section')
section_router.register(r'lessons', views.LessonViewSet, basename='lessons')


urlpatterns = [
    path('', include(router.urls)),
    path('', views.home, name='home'), 
    path('', include(course_router.urls)),
    path('', include(section_router.urls)),
    path('instructors/<int:instructor_pk>/earnings/', views.InstructorEarningsViewSet.as_view({'get': 'list'})),
]