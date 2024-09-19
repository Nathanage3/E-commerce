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
    def has_object_permission(self, request, view, obj):
        # Allow admin users full access
        if request.user.is_staff:
            return True

        # Students can view and update only their own course progress
        if hasattr(request.user, 'customer') and obj.student == request.user.customer:
            return True

        # Instructors can view the progress of students in their own courses
        if hasattr(request.user, 'instructor') and obj.course.instructor == request.user.instructor:
            return True

        return False


class IsInstructor(permissions.BasePermission):
    """
    Custom permission to allow only instructors to view their own earnings.
    """
    def has_object_permission(self, request, view, obj):
        # Allow admin users full access
        if request.user.is_staff:
            return True

        # Instructors can view only their own earnings
        return hasattr(request.user, 'instructor') and obj.instructor == request.user
