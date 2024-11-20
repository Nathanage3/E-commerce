from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('instructor', 'Instructor')
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    
    def __str__(self):
        return self.username