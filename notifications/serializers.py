from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 
            'user', 
            'title', 
            'message', 
            'notification_type', 
            'read', 
            'created_at', 
            'expires_at', 
            'is_expired'
        ]
        read_only_fields = ['created_at', 'is_expired']

    def get_is_expired(self, obj):
        return obj.is_expired()