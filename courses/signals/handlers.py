from django.db.models.signals import post_save
from django.conf import settings
from django.dispatch import receiver
from courses.models import Lesson, CourseProgress, Customer, OrderItem, Order, Purchase


@receiver(post_save, sender=Lesson)
def update_course_progress(sender, instance, **kwargs):
    # Get all CourseProgress instances where this lesson is marked as completed
    course_progresses = CourseProgress.objects.filter(completed_lessons=instance)
    
    for course_progress in course_progresses:
        course_progress.calculate_progress()
        course_progress.save()


@receiver(post_save, sender=Order)
def create_course_progress(sender, instance, created, **kwargs):
    if instance.payment_status == Order.PAYMENT_STATUS_COMPLETE:
        for item in instance.items.all():
            CourseProgress.objects.get_or_create(student=instance.customer, course=item.course)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_customer_for_new_user(sender, **kwargs):
    if kwargs['created']:
        Customer.objects.create(user=kwargs['instance'])


@receiver(post_save, sender=OrderItem)
def create_purchase(sender, instance, created, **kwargs):
    if created:
        course = instance.course
        customer = instance.order.customer
        instructor = course.instructor

        Purchase.objects.create(
            orderitem=instance,
            course=course,
            customer=customer,
            instructor=instructor
        )