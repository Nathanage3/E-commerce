from rest_framework import serializers
from django.db import transaction
from .models import Collection, Promotion, Course, CourseProgress, \
  Review, Customer, InstructorEarnings, Lesson, Order, OrderItem, \
  Cart, CartItem, WishList, Purchase
from courses.signals import order_created
from courses.signals.handlers import create_purchase
from core.models import User


class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ['id', 'description', 'discount']


class CollectionSerializer(serializers.ModelSerializer):
    courses_count = serializers.IntegerField()
    class Meta:
        model = Collection
        fields = ['id', 'title', 'courses_count']


class CourseSerializer(serializers.ModelSerializer):
    instructor = serializers.StringRelatedField()
    promotions = PromotionSerializer(many=True, read_only=True)
    ratingCount = serializers.IntegerField(read_only=True)
    oldPrice = serializers.IntegerField(read_only=True)
    rating = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'collection', 'title', 'description', 'ratingCount', 'oldPrice', 'duration', 'price', 'currency',  'rating',
        'instructor', 'level', 'syllabus', 'prerequisites', 'image', 'file', 'promotions'
        ]


class SimpleCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'instructor', 'description', 'objectives', 'duration']


class CourseProgressSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CourseProgress
        fields = ['id', 'course_id', 'completed', 'progress', 'last_accessed']

    def validate_course_id(self, value):
        if not Course.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid course_id: Course does not exist.")
        return value

 
class ReviewSerializer(serializers.ModelSerializer):
    course = serializers.StringRelatedField()

    class Meta:
        model = Review
        fields = ['id', 'name', 'course', 'rating', 'comment', 'created_at']

    def create(self, validated_data):
        course_id = self.context['course_id']
        return Review.objects.create(course_id=course_id, **validated_data)


class CustomerSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Customer
        fields = ['id', 'user_id', 'bio', 'website', 'profile_picture']


class InstructorEarningsSerializer(serializers.ModelSerializer):

    class Meta:
        model = InstructorEarnings
        fields = ['id', 'total_earnings', 'last_payout']

    def validate_instructor_id(self, value):
        if not User.objects.filter(id=value, role='instructor').exists():
            raise serializers.ValidationError("Instructor does not exist.")
        return value

    def create(self, validated_data):
        instructor_id = validated_data.get('instructor_id')
        instructor, created = InstructorEarnings.objects.get_or_create(instructor_id=instructor_id)
        instructor.total_earnings = validated_data.get('total_earnings', instructor.total_earnings)
        instructor.last_payout = validated_data.get('last_payout', instructor.last_payout)
        instructor.save()
        return instructor
    

class LessonSerializer(serializers.ModelSerializer):
    course = SimpleCourseSerializer(read_only=True)
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'course', 'order', 'file', 'is_active']


class SimpleCourseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Course
    fields = ['id', 'title', 'price', 'instructor']


class OrderItemSerializer(serializers.ModelSerializer):
    course = SimpleCourseSerializer()
    class Meta:
        model = OrderItem
        fields = ['id', 'course', 'price']


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'placed_at', 'payment_status']


class CreateOrderSerializer(serializers.Serializer):
    cart_id = serializers.UUIDField()

    def validate_cart_id(self, id):
        if not Cart.objects.filter(pk=id).exists():
            raise serializers.ValidationError('Invalid cart id')
        elif not CartItem.objects.filter(cart_id=id).exists():
            raise serializers.ValidationError('Empty cart')
        return id

    def save(self, **kwargs):
        with transaction.atomic():
            cart_id = self.validated_data['cart_id']
            customer, created = Customer.objects.get_or_create(user_id=self.context['user_id'])
            order = Order.objects.create(customer=customer)
            cart_items = CartItem.objects.select_related('course').filter(cart_id=cart_id)
            for item in cart_items:
                order_item = OrderItem(
                    order=order,
                    course=item.course,
                    price=item.course.price,
                )
                order_item.save()  # Save each OrderItem individually
            Cart.objects.filter(pk=cart_id).delete()
            order_created.send_robust(sender=self.__class__, order=order)
            return order


class UpdateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['payment_status']


class SimpleCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'instructor', 'duration', 'price']


class CartItemSerializer(serializers.ModelSerializer):
    course = SimpleCourseSerializer()
   
    class Meta:
        model = CartItem
        fields = ['id', 'course']


class CartSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'created_at', 'items', 'total_price']

    def get_total_price(self, cart: Cart):
        return sum([item.course.price for item in cart.items.all()])


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


class WishListItemSerializer(serializers.ModelSerializer):
    course_title = serializers.ReadOnlyField(source='course.title')

    class Meta:
        model = WishList
        fields = ['id', 'course', 'course_title']


class AddWishListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishList
        fields = ['course']

class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = ['id', 'order', 'course', 'customer', 'instructor', 'purchased_date']