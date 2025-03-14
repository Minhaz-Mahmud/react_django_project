from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"

    def create(self, validated_data):
        password = validated_data.get("password")
        if password:
            validated_data["password"] = make_password(password)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Only update fields that are provided
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
