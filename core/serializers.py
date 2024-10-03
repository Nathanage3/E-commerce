from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer,\
                               UserSerializer as BaseUserSerializer, \
                               SetUsernameSerializer as BaseSetUsernameSerializer
from rest_framework import serializers
from .models import User


class UserCreateSerializer(BaseUserCreateSerializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=True)
    class Meta(BaseUserCreateSerializer.Meta):
        model = User  # Ensure this points to your custom User model
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'role']


class UserSerializer(BaseUserSerializer):
    profile_picture = serializers.ImageField(read_only=True)
    class Meta(BaseUserSerializer.Meta):
        model = User  # Ensure this points to your custom User model
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'profile_picture']


class SetUsernameSerializer(BaseSetUsernameSerializer):
    username = serializers.CharField(required=True)
   
    class Meta:
        model = User  # Ensure this points to your custom User model
        fields = ['current_password', 'username']