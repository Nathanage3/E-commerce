from django.shortcuts import render
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .seriallizers import CreateOrderSerializer, OrderSerializer, UpdateOrderSerializer, \
    OrderItemSerializer
from courses.models import Customer
from .models import Order, OrderItem


class OrderViewSet(ModelViewSet):
    http_method_names = ['get', 'patch', 'delete', 'head', 'options']
    def get_permissions(self):
        if self.request.method in ['PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_serializer_context(self):
        return {'user_id': self.request.user.id}

    def create(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(        # import CreateOrderSerializer
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
        (customer_id, created) = Customer.objects.only('id').get_or_create(user_id=self.request.user.id)
        return Order.objects.filter(customer_id=customer_id)


class OrderItemViewSet(ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer