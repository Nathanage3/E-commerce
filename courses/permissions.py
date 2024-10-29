from rest_framework import permissions
from rest_framework import viewsets, status
from .models import OrderItem, Course
import logging

logger = logging.getLogger(__name__)


class IsAdminOrReadOnly(permissions.BasePermission):
  """
    Custom permission to only allow admins to edit or delete, while others can only read.
  """
  def has_permission(self, request, view):
    if request.method in permissions.SAFE_METHODS:
      return True
    return bool(request.user and request.user.is_staff)
    

class ViewCustomerHistoryPermission(permissions.BasePermission):
  def has_permission(self, request, view):
    return request.user.has_perm('courses.view_history')


class IsStudentOrInstructor(permissions.BasePermission):
    """
    Custom permission to allow students to view/edit their own progress
    and instructors to view the progress of students in their courses.
    """
    def has_permission(self, request, view):
        # Allow access for authenticated users who are students, instructors, or admins
        return request.user.is_authenticated and (
            request.user.role == 'student' or 
            request.user.role == 'instructor' or 
            request.user.is_staff
        )
  

class IsInstructorOrAdmin(permissions.BasePermission):
   """Custom permissions to allow instructor view/edit their course
   """
   def has_permission(self, request, view):
      # Allow access to authenticated user who is instructor or staff
      return request.user.is_authenticated and (
         request.user.role == 'instructor' or 
         request.user.is_staff
         )



class IsStudentOrAdmin(permissions.BasePermission):
  """Custom permission to allow students to view/edit their own progress
     and instructors to view the progress of students in their courses.
  """
  def has_permission(self, request, view):
     # Allow access for authenticated users who are students and Admin
     return request.user.is_authenticated and (
        request.user.role == 'student' or
        request.user.is_staff
     )

class IsInstructorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow read-only access for authenticated users (students)
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        # Allow full access for instructors and admins
        return request.user.is_authenticated and (request.user.role == 'instructor' or \
                                                  request.user.is_staff)


class IsInstructor(permissions.BasePermission):
    """
    Custom permission to allow only instructors to view their own earnings.
    """
    def has_permission(self, request, view):
        # Allow admin users full access
        if request.user.is_staff:
            return True

        # Instructors can view only their own earnings
        return request.user.is_authenticated and (
           request.user.role == "instructor"
          )
    
# class IsOwnerOrReadOnly(permissions.BasePermission):
#    def has_permission(self, request, view):
#       if request.method in permissions.SAFE_METHODS:
#          return True
#       # write permissions are only allowed to the owner of promotion
#       return request.user.is_authenticated and request.user == "instructor"
   

# class IsStudentAndPurchasedCourse(permissions.BasePermission):
#     def has_permission(self, request, view):
#         # Check if user is a student and has purchased the course
#         if request.user and request.user.is_authenticated:
#             course_id = view.kwargs.get('course_pk') or view.kwargs.get('section_pk') or view.kwargs.get('lesson_id')
#             logger.debug(f"Checking purchase for course_id: {course_id}, user: {request.user.id}")
#             has_purchased = OrderItem.objects.filter(
#                 order__customer=request.user.customer_profile,
#                 course_id=course_id,
#                 order__payment_status='C'
#             ).exists()
#             logger.debug(f"Purchase status for course_id {course_id}: {has_purchased}")
#             return has_purchased
#         return False

# class IsStudentAndPurchasedCourse(permissions.BasePermission):
#     def has_permission(self, request, view):
#         # Check if the user is authenticated
#         if not request.user.is_authenticated:
#             return False

#         # First, check if the user is an instructor
#         course_id = view.kwargs.get('course_pk') or view.kwargs.get('section_pk') or view.kwargs.get('lesson_pk')
#         logger.debug(f"Checking if user {request.user.id} is an instructor for course_id: {course_id}")

#         if Course.objects.filter(id=course_id, instructor=request.user).exists():
#             logger.debug(f"User {request.user.id} is an instructor for course_id: {course_id}")
#             return True

#         # If not an instructor, check if the user has purchased the course
#         logger.debug(f"Checking purchase for course_id: {course_id}, user: {request.user.id}")
#         has_purchased = OrderItem.objects.filter(
#             order__customer=request.user.customer_profile,
#             course_id=course_id,
#             order__payment_status='C'
#         ).exists()

#         logger.debug(f"Purchase status for course_id {course_id}: {has_purchased}")
#         return has_purchased
class IsStudentAndPurchasedCourse(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            logger.debug(f"User {request.user.id} is not authenticated")
            return False
        
        # Get course_id from URL kwargs
        course_id = view.kwargs.get('course_pk')
        if not course_id:
            logger.debug("Course ID not found in view kwargs")
            return False
        
        # Ensure the user is not the instructor of the course
        if Course.objects.filter(id=course_id, instructor=request.user).exists():
            logger.debug(f"User {request.user.id} is an instructor for course_id: {course_id}")
            return False
        
        # Check if the user has purchased the course
        has_purchased = OrderItem.objects.filter(
            order__customer=request.user.customer_profile,
            course_id=course_id,
            order__payment_status='C'
        ).exists()
        
        logger.debug(f"Purchase status for user {request.user.id} and course_id {course_id}: {has_purchased}")
        return has_purchased


class IsInstructorOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        course_id = view.kwargs['course_pk']
        course = Course.objects.get(id=course_id)
        return request.user.role == 'instructor' and request.user == course.instructor