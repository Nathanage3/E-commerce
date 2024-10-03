from django.contrib import admin
from decimal import Decimal
from django.core.validators import MinValueValidator, FileExtensionValidator, \
    MaxValueValidator
from django.core.exceptions import ValidationError
from django.db import models
from django.conf import settings
from datetime import timedelta
from uuid import uuid4


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
    CURRENCY_USD = 'USD'
    CURRENCY_EUR = 'EUR'
    CURRENCY_GBP = 'GBP'
    
    CURRENCY_CHOICES = [
        (CURRENCY_USD, "US Dollar"),
        (CURRENCY_EUR, "Euro"),
        (CURRENCY_GBP, "British Pound")
    ]

    LEVEL_BEGINNER = "Beginner"
    LEVEL_INTERMEDIATE = "Intermediate"
    LEVEL_ADVANCED = "Advanced"
    
    LEVEL_CHOICES = [
        (LEVEL_BEGINNER, "Beginner"),
        (LEVEL_INTERMEDIATE, "Intermediate"),
        (LEVEL_ADVANCED, "Advanced")
    ]
    title = models.CharField(max_length=255)
    objectives = models.TextField(default="")
    sections = models.IntegerField(default=0)
    duration = models.TimeField()
    image = models.ImageField(upload_to='course/images', blank=True, null=True,
                              validators=[FileExtensionValidator(allowed_extensions=['jpg', 'png'])])
    file = models.FileField(
        upload_to='course/lessons/videos',
        validators=[FileExtensionValidator(allowed_extensions=['mp4'])]
    )
    slug = models.SlugField(default='-')
    courseFor = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2,
                               validators=[MinValueValidator(Decimal('0.01'))])
    oldPrice = models.DecimalField(max_digits=10, decimal_places=2,
                               validators=[MinValueValidator(Decimal('0.01'))])
    rating = models.FloatField(default=1.0, validators=[MinValueValidator(Decimal('1.0')), 
                               MaxValueValidator(Decimal('5.0'))])
    currency = models.CharField(
        max_length=10, choices=CURRENCY_CHOICES, default=CURRENCY_USD)
    ratingCount = models.PositiveIntegerField(blank=True, null=True)
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='courses')
    syllabus = models.TextField(blank=True, null=True) #  store information about the content or topics covered in the course
    prerequisites = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    level = models.CharField(max_length=12, choices=LEVEL_CHOICES, 
        default=LEVEL_BEGINNER)
    collection = models.ForeignKey(Collection, on_delete=models.PROTECT, related_name='courses')
    promotions = models.ManyToManyField(Promotion, blank=True)
    last_update = models.DateTimeField(auto_now=True)


    class Meta:
        unique_together = ['file']
    
    def clean(self):
        if Course.objects.filter(file=self.file).exists():
            raise ValidationError("This video file already exists.")

    def __str__(self):
        return f'Video for {self.course.title}'
    
    def __str__(self):
        return self.title


class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='course/lessons/videos', null=True, blank=True,
                            validators=[FileExtensionValidator(allowed_extensions=['mp4'])])
    order = models.PositiveIntegerField()  # Helps in sorting lessons
    is_active = models.BooleanField(default=True)  # Mark if the lesson is available for students
    
    def __str__(self):
        return f'{self.title} - {self.course.title}'
    

class CourseProgress(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='course_progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='progress')
    completed = models.BooleanField(default=False)
    progress = models.FloatField(default=0.0, validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])  # percentage
    last_accessed = models.DateTimeField(auto_now=True)
    completed_lessons = models.ManyToManyField(Lesson, blank=True, related_name='completed_by')  # Track completed lessons

    def __str__(self):
        return f'{self.student.username} - {self.course.title}'

    def calculate_progress(self):
        total_lessons = self.course.lessons.count()
        completed_lessons = self.completed_lessons.count()
        
        if total_lessons > 0:
            self.progress = (completed_lessons / total_lessons) * 100
        
        self.completed = self.progress >= 100.0

    def save(self, *args, **kwargs):
        if not self.pk:  # Check if the instance is being created
            super().save(*args, **kwargs)
        self.calculate_progress()
        super().save(*args, **kwargs)


class Review(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField()
    comment = models.TextField()
    name = models.CharField(max_length=255)
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
        permissions = [
        ('view_history', 'Can view history')
        ]

class InstructorEarnings(models.Model):
    instructor = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, 
                                      related_name='earnings')
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2,
    validators=[MinValueValidator(Decimal('0.0'))])
    last_payout = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f'Earnings for {self.instructor.username}'
    
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
    
class Cart(models.Model): # Updated
  #id = models.UUIDField(primary_key=True, default=uuid4)
  #created_at = models.DateTimeField(auto_now_add=True)
  id = models.UUIDField(primary_key=True, default=uuid4) 
  created_at = models.DateTimeField(auto_now_add=True)
  customer = models.OneToOneField(Customer, on_delete=models.CASCADE, related_name='cart')


class CartItem(models.Model):
  cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
  course = models.ForeignKey(Course, on_delete=models.CASCADE)

  class Meta:
    unique_together = [['cart', 'course']]

  def __str__(self):
    return self.course.title


class WishList(models.Model):
  course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='wishlist')


class Purchase(models.Model):
    orderitem = models.ForeignKey(OrderItem, on_delete=models.PROTECT)
    course = models.ForeignKey(Course, on_delete=models.PROTECT, related_name='purchase')
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    purchase_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Purchase {self.id} - {self.course.title} by {self.customer.user.username}"