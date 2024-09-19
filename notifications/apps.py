from django.apps import AppConfig
import os

class NotificationsConfig(AppConfig):
    name = 'notifications'
    path = os.path.join(os.path.dirname(__file__), 'notifications')
