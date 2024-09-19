# In courses/apps.py
from django.apps import AppConfig

class CoursesConfig(AppConfig):
    name = 'courses'
    label = 'my_courses'
    path = '/app/courses'

