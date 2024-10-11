from rest_framework import serializers
from django.db import transaction
from .models import Collection, Promotion, Course, CourseProgress, \
  Review, Customer, InstructorEarnings, Lesson, Order, OrderItem, \
  Cart, CartItem, WishList, WishListItem
from courses.signals import order_created
from core.models import User


class PromotionSerializer(serializers.ModelSerializer):
    instructor = serializers.CharField(read_only=True)
    class Meta:
        model = Promotion
        fields = ['id', 'instructor', 'course', 'title', 'message', 'discount', 'start_date', 'end_date']


class CollectionSerializer(serializers.ModelSerializer):
    courses_count = serializers.IntegerField()
    class Meta:
        model = Collection
        fields = ['id', 'title', 'courses_count']


class CourseSerializer(serializers.ModelSerializer):
    instructor = serializers.StringRelatedField()
    promotions = PromotionSerializer(many=True, required=False)
    ratingCount = serializers.IntegerField(read_only=True)
    oldPrice = serializers.IntegerField(read_only=True)
    rating = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'collection', 'title','courseFor', 'objectives', 'sections', 'description', 'ratingCount', 'oldPrice',
                  'duration', 'price', 'currency',  'rating', 'instructor', 'level', 'syllabus', 'prerequisites',
                  'image', 'file', 'promotions', 'last_update'
        ]
    def create(self, validated_data):
        promotions_data = validated_data.pop('promotions', [])
        course = Course.objects.create(**validated_data)

        for promotion_data in promotions_data:
            Promotion.objects.create(course=course, instructor=course.instructor, **promotion_data)

        return course
    
    def update(self, instance, validated_data):
        promotions_data = validated_data.pop('promotions', [])
        instance = super().update(instance, validated_data)

        for promotion_data in promotions_data:
            Promotion.objects.create(course=instance, instructor=instance.instructor, **promotion_data)
        return instance

class SimpleCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'instructor', 'description', 'objectives', 'duration']


class LessonSerializer(serializers.ModelSerializer):
    course = SimpleCourseSerializer(read_only=True)
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'course', 'order', 'file', 'is_active']


class CourseProgressSerializer(serializers.ModelSerializer):
    #course_id = serializers.IntegerField(write_only=True)
    course = SimpleCourseSerializer()
    lesson = LessonSerializer()

    class Meta:
        model = CourseProgress
        fields = ['id', 'course', 'lesson', 'completed', 'progress', 'last_accessed']

    
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
        fields = ['id', 'total_earnings', 'last_payout', 'deduction']

    def validate_instructor_id(self, value):
        if not User.objects.filter(id=value, role='instructor').exists():
            raise serializers.ValidationError("Instructor does not exist.")
        return value    


class SimpleCourseSerializer(serializers.ModelSerializer):
  price = serializers.CharField(read_only=True)
  class Meta:
    model = Course
    fields = ['id', 'title', 'price']


class OrderItemSerializer(serializers.ModelSerializer):
    course = SimpleCourseSerializer()
    customer = serializers.CharField(read_only=True)
    instructor = serializers.CharField(read_only=True)
    price = serializers.IntegerField(read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id', 'course', 'customer', 'instructor', 'price', 'purchase_at']


class OrderSerializer(serializers.ModelSerializer):
    items  = OrderItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = ['id', 'placed_at', 'payment_status', 'items', 'total_price']

    def get_total_price(self, cart: Cart):
        return sum([item.course.price for item in cart.items.all()])


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
                OrderItem.objects.create(
                    order=order,
                    course=item.course,
                    price=item.course.price,
                )
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
    customer_id = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'created_at', 'customer_id', 'items', 'total_price']
    
    def get_customer_id(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, "user"):
            customer = Customer.objects.get(user=request.user)
            return customer.id
        return None

    def get_total_price(self, cart: Cart):
        return sum([item.course.price for item in cart.items.all()])


class WishListItemSerializer(serializers.ModelSerializer):
    course = SimpleCourseSerializer()
    
    class Meta:
        model = WishListItem
        fields = ['id', 'course']


class WishListSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    items = WishListItemSerializer(many=True, read_only=True)
    class Meta:
        model = WishList
        fields = ['id', 'created_at', 'items']