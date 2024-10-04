from django.db.models import OuterRef, Subquery
from django.db.utils import IntegrityError
from django.db.models.aggregates import Count
from django.http import HttpResponse
from django.shortcuts import render
from django.shortcuts import redirect, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, DestroyModelMixin
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework import permissions
from .models import Course, Collection, Promotion, Customer, Review, CourseProgress, Lesson, \
    Order, OrderItem, Cart, CartItem, WishList, Purchase
from .serializers import CourseSerializer, CollectionSerializer, PromotionSerializer, \
    InstructorEarningsSerializer, ReviewSerializer, CourseProgressSerializer,CustomerSerializer,\
    InstructorEarnings, LessonSerializer, CreateOrderSerializer, OrderSerializer, UpdateOrderSerializer, \
    OrderItemSerializer, CartSerializer, AddCartItemSerializer, CartItemSerializer, \
AddWishListItemSerializer, WishListItemSerializer, PurchaseSerializer
from .permissions import IsAdminOrReadOnly, ViewCustomerHistoryPermission, IsInstructor, \
    IsStudentOrInstructor, IsInstructorOrReadOnly
from .pagination import DefaultPagination


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'user_id'
    
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
    http_method_names = ['get', 'post', 'delete', 'put'] # CRUD

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
    queryset = Collection.objects.annotate(
        courses_count=Count('courses')).all()
    
    serializer_class = CollectionSerializer
    permission_classes = [IsAdminOrReadOnly]


class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [IsAdminOrReadOnly]


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    def get_serializer_context(self):
        return {'course_id': self.kwargs['course_pk']}

    def get_queryset(self):
        return Review.objects.filter(course_id=self.kwargs['course_pk'])
  
class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated, IsInstructorOrReadOnly]
    
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


class CourseProgressViewSet(viewsets.ModelViewSet):
    serializer_class = CourseProgressSerializer
    permission_classes = [IsStudentOrInstructor]

    def get_queryset(self):
        queryset = CourseProgress.objects.prefetch_related('student').select_related('course')
        if self.request.user.is_staff:
            return queryset.all()
        return queryset.filter(student=self.request.user)

    def perform_create(self, serializer):
        try:
            serializer.save(student=self.request.user)
        except IntegrityError:
            return Response({"error": "Duplicate entry"}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        # Calculate progress based on the number of videos watched
        videos_watched = request.data.get('videos_watched')
        if videos_watched is not None:
            total_videos = instance.course.lessons.count()  # Assuming lessons are videos
            if total_videos > 0:
                progress = (videos_watched / total_videos) * 100
                instance.progress = progress

        # Save and automatically set 'completed' if progress is 100%
        instance.save()
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class InstructorEarningsViewSet(viewsets.ModelViewSet):
    serializer_class = InstructorEarningsSerializer
    permission_classes = [IsInstructor]

    def get_queryset(self):
        queryset = InstructorEarnings.objects.select_related('instructor')
        if self.request.user.is_staff:
            return queryset.all()
        return queryset.filter(instructor=self.request.user).all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.calculate_total_earnings()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_create(self, serializer):
        instance = serializer.save(instructor=self.request.user)
        instance.calculate_total_earnings()

class OrderViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.request.method in ['PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_serializer_context(self):
        return {'user_id': self.request.user.id}
    
    def create(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(
            data=request.data,
            context={'user_id': self.request.user.id})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateOrderSerializer
        elif self.request.method == 'PATCH':
            return UpdateOrderSerializer
        return OrderSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        (customer_id, created) = Customer.objects.only('id')\
            .get_or_create(user_id=self.request.user.id)
        return Order.objects.filter(customer_id=customer_id)


class OrderItemViewSet(ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


class CartViewSet(CreateModelMixin, RetrieveModelMixin, DestroyModelMixin, GenericViewSet):
    queryset = Cart.objects.prefetch_related('items__course').all()
    serializer_class = CartSerializer


class CartItemViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'delete']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AddCartItemSerializer
        return CartItemSerializer

    def get_serializer_context(self):
        return {'cart_id': self.kwargs['cart_pk']}

    def get_queryset(self):
        return CartItem.objects.filter(cart_id=self.kwargs['cart_pk']).select_related('course').all()

class WishListViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'delete']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AddWishListItemSerializer
        return WishListItemSerializer

    def get_serializer_context(self):
        return {'wishlist_id': self.kwargs['wishlist_pk']}

    def get_queryset(self):
        return WishList.objects.filter(id=self.kwargs['wishlist_pk'])\
                               .select_related('course').all()


class PurchaseViewSet(ModelViewSet):
    queryset = Purchase.objects.all()
    # Purchase.objects.select_related('course', 'customer', 'instructor').all()
    serializer_class = PurchaseSerializer

def home(request):
    return HttpResponse("Welcome to the home page!")