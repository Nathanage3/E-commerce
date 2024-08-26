from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
  """
    Custom permission to only allow admins to edit or delete, while others can only read.
  """
  def has_permission(self, request, view):
    if request.method in SAFE_METHODS:
      return True
    return bool(request.user and request.user.is_staff)
    

class ViewCustomerHistoryPermission(permissions.BasePermission):
  def has_permission(self, request, view):
    return request.user.has_perm('courses.view_history')
