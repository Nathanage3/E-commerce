from django.contrib import admin
from decimal import Decimal
from django.core.validators import MinValueValidator, FileExtensionValidator
from django.db import models
from django.conf import settings


class Collection(models.Model):
    title = models.CharField(max_length=255)
    featured_course = models.ForeignKey(
        'Course', on_delete=models.SET_NULL,
        null=True,
        related_name='+',  # Prevents reverse relation from 'Course' to 'Collection'
        blank=True
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title']


class Promotion(models.Model):
    description = models.CharField(max_length=255)
    discount = models.FloatField()

    def __str__(self):
        return f'{self.description} - {self.discount}%'


class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2,
    validators=[MinValueValidator(Decimal('0.01'))])
    rating = models.FloatField(default=0.0)
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='courses')
    syllabus = models.TextField(blank=True, null=True) #  store information about the content or topics covered in the course
    prerequisites = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    collection = models.ForeignKey(Collection, on_delete=models.PROTECT, related_name='courses')
    promotions = models.ManyToManyField(Promotion, blank=True)
    last_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class CourseProgress(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='course_progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='progress')
    completed = models.BooleanField(default=False)
    progress = models.FloatField(default=0.0)  # percentage of course completed
    last_accessed = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.student.username} - {self.course.title}'


class Review(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField()
    comment = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review for {self.course.title} by {self.user.username}'


class Customer(models.Model):
    STUDENT = 'student'
    INSTRUCTOR = 'instructor'

    ROLE_CHOICES = [
        (STUDENT, 'Student'),
        (INSTRUCTOR, 'Instructor'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                related_name='customer_profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=STUDENT)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} ({self.get_role_display()})'


    @admin.display(ordering='user__first_name')
    def first_name(self):
        return self.user.first_name
  
    @admin.display(ordering='user__last_name')
    def last_name(self):
        return self.user.last_name

    class Meta:
        ordering = ['user__first_name', 'user__last_name']
        # permissions = [
        # ('view_history', 'Can view history')
        # ]
  

class InstructorEarnings(models.Model):
    instructor = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='earnings')
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2,
    validators=[MinValueValidator(Decimal('0.0'))])
    last_payout = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f'Earnings for {self.instructor.username}'


class CourseImage(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='course/images', blank=True, null=True)
    video = models.FileField(upload_to='course/videos', blank=True, null=True)

    def __str__(self):
        return f'Video for {self.course.title}'
