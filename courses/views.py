from django.db.utils import IntegrityError
from django.db import transaction
from django.db.models.aggregates import Count
from django.http import HttpResponse, FileResponse
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated, SAFE_METHODS
from .models import Course, Collection, Promotion, Customer, Review, CourseProgress, Lesson, \
    Order, OrderItem, Cart, CartItem, Rating, WishList, WishListItem, Section
from .serializers import CourseSerializer, CourseDetailSerializer, CollectionSerializer, PromotionSerializer, \
    InstructorEarningsSerializer, RatingSerializer, ReviewSerializer, CourseProgressSerializer,CustomerSerializer, \
    InstructorEarnings, LessonSerializer, OrderSerializer, OrderItemSerializer, CartSerializer, CartItemSerializer, \
    WishListItemSerializer, WishListItemSerializer, WishListSerializer, SectionSerializer
from .permissions import IsAdminOrReadOnly, ViewCustomerHistoryPermission, IsInstructor, \
    IsStudentOrInstructor, IsInstructorOrReadOnly, IsStudentOrAdmin, IsInstructorOrAdmin, IsStudentAndPurchasedCourse
from .pagination import DefaultPagination
from uuid import uuid4
import logging
import os


logger = logging.getLogger(__name__)


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
    pagination_class = DefaultPagination
    search_fields = ['title']
    ordering_fields = ['price', 'last_update', 'id']
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
        
        if self.request.user.is_authenticated:
            if self.request.user.role == "instructor":
                return queryset.filter(instructor=self.request.user)
        # For anonymous user, all active courses
        queryset = queryset.filter(is_active=True)
    
        if ordering:
            try:
                queryset = queryset.order_by(ordering)
            except TypeError as e:
                print(f"TypeError: {e}")
                # Handle the error or provide a default ordering
                queryset = queryset.order_by('id')
        return queryset


    @action(detail=True, methods=['get'], permission_classes=[IsInstructorOrAdmin])
    def statistics(self, request, pk=None):
        # Custom action to retrieve the ratingCount and numberOfStudent for specific course
        course = self.get_object()
        data = {
            "ratingCount": course.ratingCount,
            "numberOfStudents": course.numberOfStudents,
            
        }
        return Response(data)


    def get_permissions(self):
        if self.action == 'destroy':
            self.permission_classes = [IsInstructorOrAdmin]
        elif self.action == 'retrieve':
            self.permission_classes = []
        elif self.action == 'create':
            self.permission_classes = [IsInstructorOrReadOnly]
        elif self.action == 'update':
            self.permission_classes = [IsInstructor]
        else:
            self.permission_classes = []
        return super().get_permissions()
     
class FullCourseViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CourseDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        purchased_course_ids = OrderItem.objects.filter(
            order__customer=user.customer_profile,
            order__payment_status='C'
        ).values_list('course_id', flat=True)
        return Course.objects.filter(id__in=purchased_course_ids).distinct()


class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.annotate(courses_count=Count('courses')).all()
    serializer_class = CollectionSerializer
    permission_classes = [IsAdminOrReadOnly]


class SectionViewSet(viewsets.ModelViewSet):
    serializer_class = SectionSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated(), IsStudentAndPurchasedCourse()]
        return [IsInstructor()]

    def get_queryset(self):
        course_id = self.kwargs['course_pk']
        user = self.request.user

        if self.request.method in SAFE_METHODS:
            if OrderItem.objects.filter(
                course_id=course_id,
                order__customer=user.customer_profile,
                order__payment_status='C'
            ).exists():
                return Section.objects.filter(course_id=course_id)
            raise PermissionDenied("You do not have permission to access this course's sections.")
        
        if not Course.objects.filter(id=course_id, instructor=user).exists():
            raise PermissionDenied("You do not have permission to access this course's sections.")
        
        return Section.objects.filter(course_id=course_id, course__instructor=user)

    def perform_create(self, serializer):
        course_id = self.kwargs['course_pk']
        course = get_object_or_404(Course, id=course_id)
        serializer.save(course=course)


class PromotionViewSet(viewsets.ModelViewSet):
    serializer_class = PromotionSerializer
    permission_classes = [IsInstructorOrReadOnly]

    def get_queryset(self):
        course_id = self.kwargs['course_pk']
        user = self.request.user

        if not Course.objects.filter(id=course_id, instructor=user).exists():
            raise PermissionDenied("You do not have permission to access this course's promotions.")
        return Promotion.objects.filter(course_id=course_id)

    def perform_create(self, serializer):
        course_id = self.kwargs['course_pk']
        course = Course.objects.get(id=course_id)
        if course.instructor != self.request.user:
            raise PermissionDenied("You do not have permissions to create a promotion for this course.")
        serializer.save(instructor=self.request.user, course=course)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    def get_serializer_context(self):
        return {'course_id': self.kwargs['course_pk']}

    def get_queryset(self):
        return Review.objects.filter(course_id=self.kwargs['course_pk'])


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


class BaseLessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer

    def mark_as_opened_and_update_progress(self, request, lesson):
        lesson.opened = True
        lesson.save()

        user = request.user
        course_progress, created = CourseProgress.objects.get_or_create(
            student=user, course=lesson.section.course
        )
        course_progress.completed_lessons.add(lesson)
        course_progress.save()
        return lesson
    
    def get_queryset(self):
        section_id = self.kwargs['section_pk']
        return Lesson.objects.filter(section_id=section_id)

    def perform_create(self, serializer):
        course_id = self.kwargs['course_pk']
        section_id = self.kwargs['section_pk']
        course = Course.objects.get(Course, id=course_id)
        section = Section.objects.get(Section, id=section_id)
        order = Lesson.objects.filter(section=section).count() + 1
        serializer.save(section=section, order=order)

  
class LessonViewSet(BaseLessonViewSet):
   
    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated(), IsStudentAndPurchasedCourse()]
        return [IsInstructor()]
    
    def retrieve(self, request, *args, **kwargs):
        lesson = self.get_object()
        return Response(LessonSerializer(lesson, context={'request': request}).data)
 
    @action(detail=True, methods=['get'], url_path='file')
    def view_file(self, request, *args, **kwargs):
        lesson = self.get_object()
        lesson = self.mark_as_opened_and_update_progress(request, lesson)
        file_path = lesson.file.path
        return FileResponse(open(file_path, 'rb'), content_type='video/mp4')


class InstructorEarningsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InstructorEarningsSerializer
    permission_classes = [IsInstructor]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsInstructor()]
        return [IsAdminUser()]

    def get_queryset(self):
        queryset = InstructorEarnings.objects.select_related('instructor')
        if self.request.user.is_staff:
            return queryset.all()
        return queryset.filter(instructor=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.calculate_earnings()  # Update total_earnings
        total_students = instance.total_students_enrolled()  # Get total students enrolled

        # Serialize and include total_students_enrolled in response
        serializer = self.get_serializer(instance)
        data = serializer.data
        data['total_students_enrolled'] = total_students
        return Response(data)

    def perform_create(self, serializer):
        instance = serializer.save(instructor=self.request.user)
        instance.calculate_earnings()  # Automatically update earnings on creation


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsStudentOrAdmin]

    def get_queryset(self):
        customer = self.request.user.customer_profile
        return Order.objects.filter(customer=customer)

    def get_cart(self, request):
        try:
            return request.user.customer_profile.cart
        except Customer.DoesNotExist:
            logger.error('Customer profile not found')
            return Response({'detail': 'Customer profile not found'}, status=status.HTTP_400_BAD_REQUEST)
        except Cart.DoesNotExist:
            return Response({'detail': 'Your cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='checkout')
    @transaction.atomic
    def checkout(self, request):
        customer = request.user.customer_profile
        cart = self.get_cart(request)

        if isinstance(cart, Response):
            return cart  # Return the error response from get_cart

        if not cart.items.exists():
            logger.error('Cart is empty')
            return Response({'detail': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        # Check if the customer already purchased any course in the cart
        purchased_courses = OrderItem.objects.filter(order__customer=customer).values_list('course_id', flat=True)
        cart_courses = cart.items.values_list('course_id', flat=True)
        duplicate_courses = set(cart_courses).intersection(set(purchased_courses))  # Corrected from using 'and' to 'intersection'
        if duplicate_courses:
            logger.info(f"Customer {customer.id} has already purchased course: {duplicate_courses}")
            return Response({'detail': f"You have already purchased course: {list(duplicate_courses)}"}, status=status.HTTP_400_BAD_REQUEST)


        logger.info(f"Creating order for customer: {customer.id}")
        order = Order.objects.create(customer=customer, payment_status='C')
        logger.info(f"Order created: {order.id}")

        for item in cart.items.all():
            try:
                order_item = OrderItem.objects.create(
                    order=order,
                    course=item.course,
                    price=item.course.price,
                    customer=customer,
                    instructor=item.course.instructor
                )
                logger.info(f"OrderItem created: {order_item.id} for course: {item.course.id}")

                progress, created = CourseProgress.objects.get_or_create(student=request.user, course=item.course)
                if created:
                    logger.info(f"CourseProgress created: {progress}")
                else:
                    logger.info(f"CourseProgress already exists for student: {request.user}, course: {item.course}")
            except IntegrityError as e:
                logger.error(f"CourseProgress entry error for student: {request.user}, course: {item.course} - {str(e)}")

            item.course.update_student_count()
            logger.info(f"Updated number of students for course: {item.course.id}")

        cart.items.all().delete()
        cart.delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()
    permission_classes = [IsStudentOrAdmin]


import logging

logger = logging.getLogger(__name__)

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer

    def get_queryset(self):
        customer = self.request.user.customer_profile
        logger.debug(f"Fetching cart for customer: {customer.id}")
        return Cart.objects.filter(customer=customer)

    def get_cart(self, request):
        """Get or Create cart associated with the current user"""
        customer = request.user.customer_profile
        cart, created = Cart.objects.get_or_create(customer=customer)
        logger.debug(f"{'Created' if created else 'Fetched'} cart for customer: {customer.id}")
        return cart

    @action(detail=False, methods=['post'], url_path='add-item')
    def add_item(self, request):
        logger.debug(f"Received add-item request with method: {request.method}")
        cart = self.get_cart(request)
        course_id = request.data.get('course_id')
        if not course_id:
            logger.error("course_id is required")
            return Response({'detail': 'course_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            course = Course.objects.get(id=course_id)
            logger.debug(f"Course found: {course.id}")
        except Course.DoesNotExist:
            logger.error(f"Invalid course_id: {course_id}")
            return Response({'detail': 'Invalid course_id'}, status=status.HTTP_404_NOT_FOUND)
        if CartItem.objects.filter(cart=cart, course=course).exists():
            logger.warning(f"Item already in the cart: {course.id}")
            return Response({'detail': 'Item already in the cart'}, status=status.HTTP_400_BAD_REQUEST)
        CartItem.objects.create(cart=cart, course=course)
        logger.info(f"Added course {course.id} to cart for customer {cart.customer.id}")
        return Response(CartSerializer(cart, context={'request': request}).data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        customer = self.request.user.customer_profile
        existing_cart = Cart.objects.filter(customer=customer).first()
        if existing_cart:
            logger.error("Cart already exists for this customer.")
            raise serializers.ValidationError({"detail": "Cart already exists for this customer."})
        serializer.save(customer=customer)


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAdminUser]  # Changed to ensure POST is only for admin
        else:
            self.permission_classes = [IsStudentOrAdmin]
        return super(CartItemViewSet, self).get_permissions()

    def get_cart(self, request):
        """Get the cart associated with the current user"""
        customer = request.user.customer_profile
        cart, created = Cart.objects.get_or_create(customer=customer)
        logger.debug(f"{'Created' if created else 'Fetched'} cart for customer: {customer.id}")
        return cart
    
    def get_queryset(self):
        cart = self.get_cart(self.request)
        logger.debug(f"Fetching cart items for cart: {cart.id}")
        return CartItem.objects.filter(cart=cart)
    
    def create(self, request, *args, **kwargs):
        cart = self.get_cart(request)
        course_id = request.data.get('course_id')
        
        if not course_id:
            logger.error("course_id is required")
            return Response({'detail': 'course_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            course = Course.objects.get(id=course_id)
            logger.debug(f"Course found: {course.id}")
        except Course.DoesNotExist:
            logger.error(f"Invalid course_id: {course_id}")
            return Response({'detail': 'Invalid course_id'}, status=status.HTTP_404_NOT_FOUND)
        
        cart_item, created = CartItem.objects.get_or_create(cart=cart, course=course)
        if not created:
            logger.warning(f"Item already in the cart: {course.id}")
            return Response({'detail': 'Item Already in cart'}, status=status.HTTP_200_OK)
        
        logger.info(f"Added course {course.id} to cart item: {cart_item.id}")
        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, pk=None):
        cart_item = self.get_object()
        logger.info(f"Removing item {cart_item.id} from cart")
        cart_item.delete()
        return Response({'detail': 'Item removed from the cart'}, status=status.HTTP_204_NO_CONTENT)

    def list(self, request, cart_pk=None):
        cart = self.get_cart(request)
        cart_items = cart.items.all()
        logger.debug(f"Listing items for cart: {cart.id}")
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)


class WishListViewSet(viewsets.ModelViewSet):
    serializer_class = WishListSerializer
    permission_classes = [IsStudentOrAdmin]

    def get_queryset(self):
        return WishList.objects.filter(customer=self.request.user.customer_profile)


class WishListItemViewSet(viewsets.ModelViewSet):
    serializer_class = WishListItemSerializer
    permission_classes = [IsStudentOrAdmin]

    def get_queryset(self):
        wishlist = WishList.objects.get(pk=self.kwargs['wishlist_pk'])
        return WishListItem.objects.filter(wishlist=wishlist)


class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs['course_pk']
        return Rating.objects.filter(course_id=course_id)

    def retrieve(self, request, course_pk=None, pk=None):
        try:
            rating = self.get_queryset().get(pk=pk)
            if rating.course.id != int(course_pk):
                return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
            serializer = self.get_serializer(rating)
            return Response(serializer.data)
        except Rating.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request, course_pk=None):
        try:
            course = Course.objects.get(pk=course_pk)
        except Course.DoesNotExist:
            return Response({'detail': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user has purchased the course
        purchased = OrderItem.objects.filter(
            order__customer=request.user.customer_profile,
            course=course,
            order__payment_status='C'
        ).exists()

        if not purchased:
            return Response({'detail': 'You can only rate courses you have purchased.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user has already rated the course
        existing_rating = Rating.objects.filter(user=request.user, course=course).first()
        if existing_rating:
            return Response({'detail': 'You have already rated this course.'}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['user'] = request.user.id
        data['course'] = course.id

        serializer = self.get_serializer(data=data, context={'request': request, 'view': self})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, course_pk=None, pk=None):
        try:
            rating = self.get_queryset().get(pk=pk)
            if rating.course.id != int(course_pk):
                return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
            if rating.user != request.user:
                return Response({'detail': 'You do not have permission to edit this rating.'}, status=status.HTTP_403_FORBIDDEN)
            serializer = self.get_serializer(rating, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Rating.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, course_pk=None, pk=None):
        try:
            rating = self.get_queryset().get(pk=pk)
            if rating.course.id != int(course_pk):
                return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
            if rating.user != request.user:
                return Response({'detail': 'You do not have permission to delete this rating.'}, status=status.HTTP_403_FORBIDDEN)
            rating.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Rating.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)


def home(request):
    return HttpResponse("Welcome to the home page!")