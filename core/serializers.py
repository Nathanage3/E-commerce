from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer,\
                               UserSerializer as BaseUserSerializer, \
                               SetUsernameSerializer as BaseSetUsernameSerializer, SetPasswordSerializer as BaseSetPasswordSerializer
from rest_framework import serializers
from .models import User


class UserCreateSerializer(BaseUserCreateSerializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=True)
    class Meta(BaseUserCreateSerializer.Meta):
        model = User  # Ensure this points to your custom User model
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'role']


class UserSerializer(BaseUserSerializer):
    profile_picture = serializers.ImageField(read_only=True)
    id = serializers.IntegerField(read_only=True)
    #role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=True)
    class Meta(BaseUserSerializer.Meta):
        model = User  # Ensure this points to your custom User model
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'profile_picture']


class SetPasswordSerializer(BaseSetPasswordSerializer):
    new_password = serializers.CharField(write_only=True)
    re_new_password = serializers.CharField(write_only=True)

    class Meta:
        model = User  # Ensure this points to your custom User model
        fields = ['current_password', 'new_password', 're_new_password']



class SetEmailSerializer(serializers.Serializer):
    new_email = serializers.EmailField(write_only=True)
    re_new_email = serializers.EmailField(write_only=True)

    class Meta:
        model = User  # Ensure this points to your custom User model
        fields = ['current_password', 'new_email', 're_new_email']

    def validate(self, attrs):
        if attrs['new_email'] != attrs['re_new_email']:
            raise serializers.ValidationError({"email": "Emails do not match"})
        return attrs
