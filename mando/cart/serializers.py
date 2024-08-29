from rest_framework import serializers
from .models import Cart, CartItem
from courses.models import Course


class SimpleCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'price']

class CartItemSerializer(serializers.ModelSerializer):
    course = SimpleCourseSerializer()
    price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'course', 'price']
    
    def get_total_price(self, item: CartItem):
        return item.course.price


class CartSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'created_at', 'items', 'total_price']

    def get_total_price(self, cart: Cart):
        return [item.course.price for item in cart.items.all()]

class AddCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'course']

    def create(self, validated_data):
        cart_id = self.context['cart_id']
        return CartItem.objects.create(cart_id=cart_id, **validated_data)


