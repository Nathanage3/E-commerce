from django.db import models
from courses.models import Course
from uuid import uuid4


class Cart(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return str(self.id)


class CartItem(models.Model):
  cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
  course = models.ForeignKey(Course, on_delete=models.CASCADE)

  def __str__(self):
    return f"{self.course.title} (x{self.quantity})"