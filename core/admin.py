from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline
from courses.admin import CourseAdmin
from courses.models import Course
from .models import User 

@admin.register(User)
class UserAdmin(BaseUserAdmin):
  add_fieldsets = (
    (None, {
    'classes': ('wide',),
    'fields': ('username', 'password1', 'password2', 'email', 'first_name', 'last_name', 'role'),
  }),
  )


class CustomCourseAdmin(CourseAdmin):
  pass
  
admin.site.unregister(Course)
admin.site.register(Course, CustomCourseAdmin)
