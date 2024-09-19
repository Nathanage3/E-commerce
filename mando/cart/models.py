from django.db import models
from courses.models import Course
from uuid import uuid4


class Cart(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid4)
  created_at = models.DateTimeField(auto_now_add=True)


class CartItem(models.Model):
  cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
  course = models.ForeignKey(Course, on_delete=models.CASCADE)

  class Meta:
    unique_together = [['cart', 'course']]

  def __str__(self):
    return self.course.title