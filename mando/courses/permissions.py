from rest_framework import permissions

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
