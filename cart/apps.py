from django.apps import AppConfig
import os

class CartConfig(AppConfig):
    name = 'cart'
    path = os.path.join(os.path.dirname(__file__), 'cart')
