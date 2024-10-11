from rest_framework import permissions
from rest_framework import viewsets, status


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
    def has_object_permission(self, request, view, obj):
        # Allow admin users full access
        if request.user.is_staff:
            return True

        # Instructors can view only their own earnings
        return request.user.is_authenticated and request.user.role == 'instructor'\
            and obj.instructor == request.user
    
class IsOwnerOrReadOnly(permissions.BasePermission):
   def has_object_permission(self, request, view, obj):
      if request.method in permissions.SAFE_METHODS:
         return True
      # write permissions are only allowed to the owner of promotion
      return obj.instructor == request.user