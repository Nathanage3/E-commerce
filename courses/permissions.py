from rest_framework import permissions
from rest_framework import viewsets, status
from .models import OrderItem
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
    
class IsOwnerOrReadOnly(permissions.BasePermission):
   def has_permission(self, request, view):
      if request.method in permissions.SAFE_METHODS:
         return True
      # write permissions are only allowed to the owner of promotion
      return request.user.is_authenticated and request.user == "instructor"
   

class IsStudentAndPurchasedCourse(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if user is a student and has purchased the course
        if request.user and request.user.is_authenticated:
            course_id = view.kwargs.get('course_pk') or view.kwargs.get('section_pk') or view.kwargs.get('lesson_id')
            logger.debug(f"Checking purchase for course_id: {course_id}, user: {request.user.id}")
            has_purchased = OrderItem.objects.filter(
                order__customer=request.user.customer_profile,
                course_id=course_id,
                order__payment_status='C'
            ).exists()
            logger.debug(f"Purchase status for course_id {course_id}: {has_purchased}")
            return has_purchased
        return False
