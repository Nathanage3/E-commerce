from django.apps import AppConfig
import os

class CoreConfig(AppConfig):
    name = 'courses'
    path = os.path.join(os.path.dirname(__file__), 'courses')