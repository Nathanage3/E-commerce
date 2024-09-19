from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline
from courses.admin import CourseAdmin
from courses.models import Course
from .models import User
from courses.admin import CourseImageInLine
 

@admin.register(User)
class UserAdmin(BaseUserAdmin):
  add_fieldsets = (
    (None, {
    'classes': ('wide',),
    'fields': ('username', 'password1', 'password2', 'email', 'first_name', 'last_name'),
  }),
  )


class CustomCourseAdmin(CourseAdmin):
  inlines = [CourseImageInLine]
  
admin.site.unregister(Course)
admin.site.register(Course, CustomCourseAdmin)
