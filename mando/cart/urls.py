from django.urls import path, include
from rest_framework_nested import routers
from . import views

# Main router for CartViewSet
router = routers.DefaultRouter()
router.register('carts', views.CartViewSet, basename='carts')

# Nested router for CartItemViewSet under carts/<cart_pk>/items/
cart_router = routers.NestedDefaultRouter(router, 'carts', lookup='cart')
cart_router.register('items', views.CartItemViewSet, basename='cart-items')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(cart_router.urls)),
]
