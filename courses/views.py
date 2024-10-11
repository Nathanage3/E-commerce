from django.db.utils import IntegrityError
from django.db.models.aggregates import Count
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import Course, Collection, Promotion, Customer, Review, CourseProgress, Lesson, \
    Order, OrderItem, Cart, CartItem, WishList, WishListItem
from .serializers import CourseSerializer, CollectionSerializer, PromotionSerializer, \
    InstructorEarningsSerializer, ReviewSerializer, CourseProgressSerializer,CustomerSerializer,\
    InstructorEarnings, LessonSerializer, OrderSerializer, OrderItemSerializer, CartSerializer, CartItemSerializer, \
    WishListItemSerializer, WishListItemSerializer, WishListSerializer
from .permissions import IsAdminOrReadOnly, ViewCustomerHistoryPermission, IsInstructor, \
    IsStudentOrInstructor, IsInstructorOrReadOnly, IsOwnerOrReadOnly
from .pagination import DefaultPagination
from uuid import uuid4


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=True, permission_classes=[ViewCustomerHistoryPermission])
    def history(self, request, pk):
        return Response('Ok')

    @action(detail=False, methods=['GET', 'PUT'], permission_classes=[IsAuthenticated])
    def me(self, request):
        (customer, created) = Customer.objects.get_or_create(user_id=request.user.id)
        if request.method == 'GET':
            serializer = CustomerSerializer(customer)
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            serializer = CustomerSerializer(customer, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        
    @action(detail=False, methods=['PUT'], permission_classes=[IsAuthenticated])
    def update_profile_picture(self, request):
        try:
            customer = Customer.objects.get(user=request.user)
            user = request.user
            if 'profile_picture' in request.FILES:
                profile_picture = request.FILES['profile_picture']
            
                # Update profile picture for Customer
                customer.profile_picture = profile_picture
                customer.save()
            
                # Update profile picture for User
                user.profile_picture = profile_picture
                user.save()
            
                return Response({'status': 'Profile picture updated'}, status=200)
            return Response({'error': 'No profile picture uploaded'}, status=400)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=404)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related('instructor', 'collection').all().order_by('id')
    serializer_class = CourseSerializer
    #permission_classes = [IsAdminOrReadOnly, IsInstructorOrReadOnly]
    pagination_class = DefaultPagination
    search_fields = ['title']
    ordering_fields = ['price', 'last_update', 'rating', 'id']
    http_method_names = ['get', 'post', 'delete', 'put', 'patch'] # CRUD

    def get_serializer_context(self):
        return {'request': self.request}

    def destroy(self, request, *args, **kwargs):
        if OrderItem.objects.filter(course_id=kwargs['pk']).exists():
            return Response({'error': 'course cannot be deleted because it is associated with an order item.'}, 
                            status=status.HTTP_405_METHOD_NOT_ALLOWED)
        return super().destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        ordering = self.request.query_params.get('ordering', None)
        if ordering:
            try:
                queryset = queryset.order_by(ordering)
            except TypeError as e:
                print(f"TypeError: {e}")
                # Handle the error or provide a default ordering
                queryset = queryset.order_by('id')
        return queryset


    def get_permissions(self):
        if self.action == 'destroy':
            self.permission_classes = [IsAdminOrReadOnly]
        elif self.action == 'retrieve':
            self.permission_classes = [IsStudentOrInstructor]
        elif self.action == 'create':
            self.permission_classes = [IsInstructorOrReadOnly]
        elif self.action == 'update':
            self.permission_classes = [IsInstructor]
        else:
            self.permission_classes = [IsAdminOrReadOnly]
        return super().get_permissions()
     

class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.annotate(courses_count=Count('courses')).all()
    serializer_class = CollectionSerializer
    permission_classes = [IsAdminOrReadOnly]


class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [IsOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    def get_serializer_context(self):
        return {'course_id': self.kwargs['course_pk']}

    def get_queryset(self):
        return Review.objects.filter(course_id=self.kwargs['course_pk'])


class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    permission_classes = [IsInstructorOrReadOnly]
    
    def get_queryset(self):
        course_id = self.kwargs.get('course_pk')
        if course_id:
            return Lesson.objects.filter(course_id=course_id)
        return Lesson.objects.all()

    def perform_create(self, serializer):
        course_id = self.kwargs.get('course_pk')
        course = get_object_or_404(Course, pk=course_id)
        order = Lesson.objects.filter(course=course).count() + 1 
        serializer.save(course=course, order=order)


# class CourseProgressViewSet(viewsets.ReadOnlyModelViewSet):
#     serializer_class = CourseProgressSerializer
#     permission_classes = [IsStudentOrInstructor]

#     def get_queryset(self):
#         queryset = CourseProgress.objects.prefetch_related('student').select_related('course')
#         if self.request.user.is_staff:
#             return queryset.all()
#         # Get the cutomer instance linked to the current course

#         customer = Customer.objects.get(user=self.request.user)

#         # Check if the user has completed the payment for the course
#         purchased_courses = OrderItem.objects.filter(
#             order__customer=customer,
#             order__payment_status='C'
#         ).values_list('course', flat=True)

#         print(f"Purchased course: {purchased_courses}") # Debugger
        
#         filtered_queryset = queryset.filter(student=self.request.user, course__in=purchased_courses)
#         print(f"Filtered CourseProgress: {filtered_queryset}")
#         return filtered_queryset
import logging

logger = logging.getLogger(__name__)

class CourseProgressViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CourseProgressSerializer
    permission_classes = [IsStudentOrInstructor]

    def get_queryset(self):
        queryset = CourseProgress.objects.prefetch_related('student').select_related('course')
        
        if self.request.user.is_staff:
            logger.info(f"Admin user accessing CourseProgress")
            return queryset.all()

        # Get the customer instance linked to the current user
        customer = Customer.objects.get(user=self.request.user)

        # Check if the user has completed the payment for the course
        purchased_courses = OrderItem.objects.filter(
            order__customer=customer,
            order__payment_status='C'
        ).values_list('course_id', flat=True)

        logger.info(f"Purchased courses: {purchased_courses}")
        
        filtered_queryset = queryset.filter(student=self.request.user, course_id__in=purchased_courses)
        logger.info(f"Filtered CourseProgress: {filtered_queryset}")
        return filtered_queryset


class InstructorEarningsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InstructorEarningsSerializer
    permission_classes = [IsInstructor]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permission() for permission in [IsInstructor]]
        else:
            return [permission() for permission in [IsAdminUser]]
    
    def get_queryset(self):
        queryset = InstructorEarnings.objects.select_related('instructor')
        if self.request.user.is_staff:
            return queryset.all()
        return queryset.filter(instructor=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.calculate_total_earnings()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_create(self, serializer):
        instance = serializer.save(instructor=self.request.user)
        instance.calculate_total_earnings()


# class OrderViewSet(viewsets.ModelViewSet):
#     serializer_class = OrderSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         customer = self.request.user.customer_profile
#         return Order.objects.filter(customer=customer)

#     def get_cart(self, request):
#         customer = self.request.user.customer_profile
#         if not customer:
#             logger.error('Customer profile not found')
#             return Response({'detail': 'Customer profile not found'}, status=status.HTTP_400_BAD_REQUEST)
#         return customer.cart

#     @action(detail=False, methods=['post'], url_path='checkout')
#     def checkout(self, request):
#         user = request.user
#         try:
#             customer = user.customer_profile
#         except Customer.DoesNotExist:
#             logger.error('Customer profile not found')
#             return Response({'detail': 'Customer profile not found'}, status=status.HTTP_400_BAD_REQUEST)

#         cart = self.get_cart(request)
#         if not cart.items.exists():
#             logger.error('Cart is empty')
#             return Response({'detail': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

#         logger.info(f"Creating order for customer: {customer.id}")
#         order = Order.objects.create(customer=customer, payment_status='C')
#         logger.info(f"Order created: {order.id}")

#         for item in cart.items.all():
#             order_item = OrderItem.objects.create(
#                 order=order, 
#                 course=item.course, 
#                 price=item.course.price,
#                 customer=customer,
#                 instructor=item.course.instructor
#             )
#             logger.info(f"OrderItem created: {order_item.id} for course: {item.course.id}")

#             # Fetch or create lesson
#             lesson = Lesson.objects.filter(course=item.course).first()
#             if not lesson:
#                 lesson = Lesson.objects.create(title='Default Lesson', course=item.course)
#                 logger.info(f"Default lesson created for course: {item.course.id}")

#             try:
#                 # Ensure unique combination of student, course, and lesson
#                 progress, created = CourseProgress.objects.get_or_create(student=user, course=item.course, lesson=lesson)
#                 if created:
#                     logger.info(f"CourseProgress created: {progress}")
#                 else:
#                     logger.info(f"CourseProgress already exists for student: {user}, course: {item.course}, lesson: {lesson}")
#             except IntegrityError as e:
#                 logger.error(f"CourseProgress entry error for student: {user}, course: {item.course}, lesson: {lesson} - {str(e)}")

#         cart.items.all().delete()
#         cart.delete()
#         return Response(OrderSerializer(order).data)

import logging

# Configure logging
logger = logging.getLogger(__name__)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        customer = self.request.user.customer_profile
        return Order.objects.filter(customer=customer)

    def get_cart(self, request):
        customer = self.request.user.customer_profile
        if not customer:
            logger.error('Customer profile not found')
            return Response({'detail': 'Customer profile not found'}, status=status.HTTP_400_BAD_REQUEST)
        return customer.cart

    @action(detail=False, methods=['post'], url_path='checkout')
    def checkout(self, request):
        user = request.user
        try:
            customer = user.customer_profile
        except Customer.DoesNotExist:
            logger.error('Customer profile not found')
            return Response({'detail': 'Customer profile not found'}, status=status.HTTP_400_BAD_REQUEST)

        cart = self.get_cart(request)
        if not cart.items.exists():
            logger.error('Cart is empty')
            return Response({'detail': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        logger.info(f"Creating order for customer: {customer.id}")
        order = Order.objects.create(customer=customer, payment_status='C')
        logger.info(f"Order created: {order.id}")

        for item in cart.items.all():
            order_item = OrderItem.objects.create(
                order=order, 
                course=item.course, 
                price=item.course.price,
                customer=customer,
                instructor=item.course.instructor
            )
            logger.info(f"OrderItem created: {order_item.id} for course: {item.course.id}")

            # Fetch or create lesson
            lesson = Lesson.objects.filter(course=item.course).first()
            if not lesson:
                lesson = Lesson.objects.create(title='Default Lesson', course=item.course)
                logger.info(f"Default lesson created for course: {item.course.id}")

            try:
                # Directly copy OrderItem to CourseProgress
                progress, created = CourseProgress.objects.get_or_create(
                    student=user, 
                    course=item.course, 
                    lesson=lesson,
                    defaults={'completed': False, 'progress': 0.0}
                )
                if created:
                    logger.info(f"CourseProgress created: {progress}")
                else:
                    logger.info(f"CourseProgress already exists for student: {user}, course: {item.course}, lesson: {lesson}")
            except IntegrityError as e:
                logger.error(f"CourseProgress entry error for student: {user}, course: {item.course}, lesson: {lesson} - {str(e)}")

        cart.items.all().delete()
        cart.delete()
        return Response(OrderSerializer(order).data)


class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()
    permission_classes = [IsAuthenticated]


# class CartViewSet(viewsets.ModelViewSet):
#     serializer_class = CartSerializer
#     queryset = Cart.objects.all()
#     permission_classes = [IsAuthenticated]

#     def get_cart(self, request):
#         """Get or Create associated with the current user"""
#         customer = request.user.customer_profile
#         cart, created = Cart.objects.get_or_create(customer=customer)
#         return cart

#     # Add items to cart (POST request to a custom route)
#     @action(detail=False, methods=['post'], url_path='add-item')
#     def add_item(self, request):
#         cart = self.get_cart(request)
#         course_id = request.data.get('course_id')

#         if not course_id:
#             return Response({'detail': 'course_id is requered'}, status=status.HTTP_400_BAD_REQUEST)
        
#         try:
#             course = Course.objects.get(id=course_id)
#         except Course.DoesNotExist:
#             return Response({'detail': 'Invalid course_id'}, status=status.HTTP_404_NOT_FOUND)
        
#         CartItem.objects.create(cart=cart, course=course)
#         return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

#     def perform_create(self, serializer):
#         customer = Customer.objects.get(user=self.request.user)
#         serializer.save(customer=customer)

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    queryset = Cart.objects.all()
    permission_classes = [IsAuthenticated]

    def get_cart(self, request):
        """Get or Create cart associated with the current user"""
        customer = request.user.customer_profile
        cart, created = Cart.objects.get_or_create(customer=customer)
        return cart

    @action(detail=False, methods=['post'], url_path='add-item')
    def add_item(self, request):
        cart = self.get_cart(request)
        course_id = request.data.get('course_id')

        # Check if course_id is provided
        if not course_id:
            return Response({'detail': 'course_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Ensure the course exists
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'detail': 'Invalid course_id'}, status=status.HTTP_404_NOT_FOUND)
        
        # Add item to cart
        CartItem.objects.create(cart=cart, course=course)
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        customer = Customer.objects.get(user=self.request.user)
        # Ensure no duplicate cart creation
        existing_cart = Cart.objects.filter(customer=customer).first()
        if existing_cart:
            return Response({'detail': 'Cart already exists for this customer'}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save(customer=customer)


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_cart(self, request):
        """Get the cart associated with the current user"""
        customer = request.user.customer_profile
        cart, created = Cart.objects.get_or_create(customer=customer)
        return cart
    
    def get_queryset(self):
        # Limit the query to the current user's cart items
        cart = self.get_cart(self.request)
        return CartItem.objects.filter(cart=cart)
    
    # Add an Item to the cart (POST)
    def create(self, request, *args, **kwargs):
        cart = self.get_cart(request)
        course_id = request.data.get('course_id')
        
        if not course_id:
            return Response({'detail': 'course_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'detail': 'Invalid  course_id'}, status=status.HTTP_404_NOT_FOUND)
        
        # Add item to the cart or update if already exists
        cart_item, created = CartItem.objects.get_or_create(cart=cart, course=course)
        if not created:
            return Response({'detail': 'Item Already in cart'}, status=status.HTTP_200_OK)
        
        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)
    
    # Remove an Item from the Cart (DELETE)
    def destroy(self, request, pk=None):
        cart_item = self.get_object()
        cart_item.delete()
        return Response({'detail' : 'Item removed from the cart'}, status=status.HTTP_204_NO_CONTENT)

    # Retrieve the cart items (GET)
    def list(self, request, cart_pk=None):
        cart = self.get_cart(request)
        cart_items = cart.items.all()
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)


class WishListViewSet(viewsets.ModelViewSet):
    serializer_class = WishListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WishList.objects.filter(customer=self.request.user.customer_profile)


class WishListItemViewSet(viewsets.ModelViewSet):
    serializer_class = WishListItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        wishlist = WishList.objects.get(pk=self.kwargs['wishlist_pk'])
        return WishListItem.objects.filter(wishlist=wishlist)


def home(request):
    return HttpResponse("Welcome to the home page!")