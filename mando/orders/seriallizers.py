from rest_framework import serializers
from django.db import transaction
from .models import Order, OrderItem
from courses.models import Course, Customer
from cart.models import Cart, CartItem


class SimpleCourseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Course
    fields = ['id', 'title', 'price']


class OrderItemSerializer(serializers.ModelSerializer):
    course = SimpleCourseSerializer()
    class Meta:
        model = OrderItem
        fields = ['id', 'course', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    class Meta:
        model = Order
        fields = ['id', 'customer', 'items', 'placed_at', 'payment_status']

class CreateOrderSerializer(serializers.Serializer):
    cart_id = serializers.UUIDField()

    def validate_cart_id(self, id):
        if not Cart.objects.filter(pk=id).exists():
            raise serializers.ValidationError('Invalid cart id')
        elif not CartItem.objects.filter(pk=id).exists():
            raise serializers.ValidationError('Empty id')
        return id

    def save(self, **kwargs):
        with transaction.atomic():
            cart_id = self.validated_data['cart_id']
            (customer, created) = Customer.objects.get_or_create(user_id=self.context['user_id'])
            order = Order.objects.create(customer=customer)
            cart_items = CartItem.objects \
                                 .select_related('course') \
                                 .filter(cart_id=cart_id)
            order_items = [
                OrderItem(
                    order=order,
                    course=item.course,
                    price=item.course.price,
                        ) for item in cart_items
                    ]
            OrderItem.objects.bulk_create(order_items)
            Cart.objects.filter(pk=cart_id).delete()
            return order


class UpdateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['payment_status']