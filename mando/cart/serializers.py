from rest_framework import serializers
from .models import Cart, CartItem
from courses.serializers import CourseSerializer


class CartItemSerializer(serializers.ModelSerializer):
  course = CourseSerializer()
    
  class Meta:
    model = CartItem
    fields = ['id', 'course']


class CartSerializer(serializers.ModelSerializer):
  items = CartItemSerializer(many=True)
    
  class Meta:
    model = Cart
    fields = ['id', 'created_at', 'items']


class AddCartItemSerializer(serializers.ModelSerializer):
  course_id = serializers.IntegerField()

  def save(self, *args, **kwargs):
    cart_id = self.context['cart_id']
    course_id = self.validated_data['course_id']

    try:
      cart_item = CartItem.objects.get(cart_id=cart_id, course_id=course_id)
      cart_item.save()
      self.instance = cart_item
    
    except CartItem.DoesNotExist:
      self.instance = CartItem.objects.create(cart_id=cart_id, **self.validated_data)
      return self.instance
    
    class Meta:
      model = CartItem
      fields = ['id', 'course_id']