from django.core.validators import MinValueValidator
from courses.models import Customer
from courses.models import Course
from decimal import Decimal
from django.core.validators import MinValueValidator
from django.db import models


class Order(models.Model):
    PAYMENT_STATUS_PENDING = 'P'
    PAYMENT_STATUS_COMPLETE = 'C'
    PAYMENT_STATUS_FAILED = 'F'
    PAYMENT_STATUS_CHOICES = [
        (PAYMENT_STATUS_PENDING, "Pending"),
        (PAYMENT_STATUS_COMPLETE, "Complete"),
        (PAYMENT_STATUS_FAILED, "Failed")
    ]
    placed_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=1,
                                    choices=PAYMENT_STATUS_CHOICES,
                                    default=PAYMENT_STATUS_PENDING
                                    )
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)

    class Meta:
        permissions = [
        ('cancel_order', 'Can cancel order')
        ]
    def __str__(self):
        return f"Order {self.id} - {self.get_payment_status_display()}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='items')
    course = models.ForeignKey(Course, on_delete=models.PROTECT, related_name='orderitems')
    price = models.DecimalField(max_digits=6, decimal_places=2,
                                validators=[MinValueValidator(Decimal('0.00'))])

    def __str__(self):
        return f"{self.course.title} - {self.price}"