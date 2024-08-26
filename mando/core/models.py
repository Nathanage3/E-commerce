from django.contrib.auth.models import AbstractUser
from django.db import models
'''
from django.db.models.signals import post_save
from django.dispatch import receiver
from courses.models import Customer
'''

class User(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username

"""
@receiver(post_save, sender=User)
def create_customer_profile(sender, instance, created, **kwargs):
    if created:
        Customer.objects.create(user=instance, role='student')  # Default role as student

@receiver(post_save, sender=User)
def save_customer_profile(sender, instance, **kwargs):
    instance.customer_profile.save() 
"""