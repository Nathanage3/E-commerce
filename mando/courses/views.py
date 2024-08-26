from rest_framework import viewsets
from rest_framework.permissions import IsAdminOrReadOnly
from .models import Course, Collection, Promotion, CourseImage, Review, CourseProgress, Order
from .serializers import CourseSerializer, CollectionSerializer, PromotionSerializer,\
    CourseImageSerializer, ReviewSerializer, CourseProgressSerializer
from .permissions import IsAdminOrReadOnly
from orders.models import OrderItem

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminOrReadOnly]

    pagination_class = DefaultPagination

    search_fields = ['title']
    ordering_fields = ['price', 'last_update', 'rating']

    http_method_names = ['get', 'post', 'delete', 'put'] # CRUD
 

    def get_serializer_context(self):
        return {'request': self.request}

    def destroy(self, request, *args, **kwargs):
        if OrderItem.objects.filter(course_id=kwargs['pk']).count() > 0:
            return Response({'error': 'course cannot be deleted because it is associated with an order item.'}, 
                            status=status.HTTP_405_METHOD_NOT_ALLOWED)
        return super().destroy(request, *args, **kwargs)



class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [IsAdminOrReadOnly]


class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [IsAdminOrReadOnly]


class CourseImageViewSet(viewsets.ModelViewSet):
    serializer_class = CourseImageSerializer

    def get_serializer_context(self):
        return {'course_id': self.kwargs['course_pk']}

    def get_queryset(self):
        CourseImage.objects.filter(course_id=self.kwargs['course_pk'])



class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    def get_serializer_context(self):
        return {'course_id': self.kwargs['course_pk']}

    def get_queryset(self):
        return Review.objects.filter(course_id=self.kwargs['course_pk'])

    
class CourseProgressViewSet(viewsets.ModelViewSet):
    queryset = CourseProgress.objects.select_related('course').all()
    serializer_class = CourseProgressSerializer
    permission_classes = [IsAdminOrReadOnly]