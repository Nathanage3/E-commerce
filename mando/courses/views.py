from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import Course, Collection, Promotion, CourseImage, Customer, Review, CourseProgress
from .serializers import CourseSerializer, CollectionSerializer,\
    CourseImageSerializer, ReviewSerializer, CourseProgressSerializer, CustomerSerializer
from .permissions import IsAdminOrReadOnly, ViewCustomerHistoryPermission
from orders.models import OrderItem
from .pagination import DefaultPagination


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


# class PromotionViewSet(viewsets.ModelViewSet):
#     queryset = Promotion.objects.all()
#     serializer_class = PromotionSerializer
#     permission_classes = [IsAdminOrReadOnly]


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