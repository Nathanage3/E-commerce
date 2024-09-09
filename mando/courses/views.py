from django.db.models import OuterRef, Subquery
from django.db.models.aggregates import Count
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import Course, Collection, Promotion, CourseImage, Customer, Review, CourseProgress, CourseVideo
from .serializers import CourseSerializer, CollectionSerializer, PromotionSerializer, InstructorEarningsSerializer, \
    CourseImageSerializer, ReviewSerializer, CourseProgressSerializer,CustomerSerializer, CourseVideoSerializer, InstructorEarnings
from .permissions import IsAdminOrReadOnly, ViewCustomerHistoryPermission
from orders.models import OrderItem
from .pagination import DefaultPagination


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


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related('instructor', 'collection').prefetch_related('images').all().order_by('id')

    serializer_class = CourseSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = DefaultPagination
    search_fields = ['title']
    ordering_fields = ['price', 'last_update', 'rating', 'id']

    http_method_names = ['get', 'post', 'delete', 'put'] # CRUD
    def get_serializer_context(self):
        return {'request': self.request}

    def destroy(self, request, *args, **kwargs):
        if OrderItem.objects.filter(course_id=kwargs['pk']).count() > 0:
            return Response({'error': 'course cannot be deleted because it is associated with an order item.'}, 
                            status=status.HTTP_405_METHOD_NOT_ALLOWED)
        return super().destroy(request, *args, **kwargs)


class CollectionViewSet(viewsets.ModelViewSet):
    latest_course = Course.objects.filter(collection=OuterRef('pk')).order_by('-last_update').values('id')[:1]

    queryset = Collection.objects.annotate(
        latest_course_id=Subquery(latest_course),
        course_count=Count('courses')
        ).select_related('featured_course').prefetch_related('courses').all()
    
    serializer_class = CollectionSerializer
    permission_classes = [IsAdminOrReadOnly]


class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [IsAdminOrReadOnly]


class CourseImageViewSet(viewsets.ModelViewSet):
    serializer_class = CourseImageSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {'course_id': self.kwargs['course_pk']}

    def get_queryset(self):
        return CourseImage.objects.filter(course_id=self.kwargs['course_pk'])
    
class CourseVideoViewSet(viewsets.ModelViewSet):
    serializer_class = CourseVideoSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {'course_id': self.kwargs['course_pk']}
    
    def get_queryset(self):
        return CourseVideo.objects.filter(course_id=self.kwargs['course_pk'])


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    def get_serializer_context(self):
        return {'course_id': self.kwargs['course_pk']}

    def get_queryset(self):
        return Review.objects.filter(course_id=self.kwargs['course_pk'])


class CourseProgressViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing course progress instances.
    """
    queryset = CourseProgress.objects.prefetch_related('student').select_related('course').all()
    serializer_class = CourseProgressSerializer
    permission_classes = [IsAdminOrReadOnly]

    def perform_create(self, serializer):
        """
        Custom create method to handle additional logic when a new course progress is created.
        """
        serializer.save()

    def update(self, request, *args, **kwargs):
        """
        Custom update method to handle progress updates.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Calculate progress based on the number of videos watched
        videos_watched = request.data.get('videos_watched')
        if videos_watched is not None:
            total_videos = CourseImage.objects.filter(course=instance.course).count()
            progress = (videos_watched / total_videos) * 100
            instance.progress = progress

        # Save and automatically set 'completed' if progress is 100%
        instance.save()
        self.perform_update(serializer)

        return Response(serializer.data)

    def perform_update(self, serializer):
        """
        Custom perform_update method to handle additional logic during updates.
        """
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        """
        Custom destroy method to handle deletion of course progress.
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class InstructorEarningsViewSet(viewsets.ModelViewSet):
    serializer_class = InstructorEarningsSerializer

    def get_queryset(self):
        instructor_pk = self.kwargs.get('instructor_pk')
        return InstructorEarnings.objects.filter(instructor_id=instructor_pk).all()