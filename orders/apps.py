from django.apps import AppConfig
import os

class OrdersConfig(AppConfig):
    name = 'orders'
    path = os.path.join(os.path.dirname(__file__), 'orders')
