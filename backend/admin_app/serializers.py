from rest_framework import serializers
from .models import AdminLeaderShipModel, AdminFaqModel

class LeadershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminLeaderShipModel
        fields = [
            "id",
            "image",
            "name",
            "position",
            "description",
            "created_at",
            "updated_at",
        ]

class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminFaqModel
        fields = ["id", "title", "description", "created_at", "updated_at"]
