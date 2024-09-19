from django.apps import AppConfig
import os

class CoursesConfig(AppConfig):
    name = 'courses'
    path = os.path.join(os.path.dirname(__file__), 'courses')
