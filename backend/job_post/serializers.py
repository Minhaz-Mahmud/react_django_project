from rest_framework import serializers
from .models import JobPost


class JobPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = [
            "id",
            "company",
            "title",
            "tags",
            "job_type",
            "salary_range",
            "job_time",
            "description",
            "active_recruiting",
            "posted_at",
            "updated_at",
        ]
        read_only_fields = ["id", "posted_at", "updated_at"]

    def validate_tags(self, value):
        tags = value.split(",")
        if len(tags) > 6:
            raise serializers.ValidationError("A maximum of 6 tags are allowed.")
        return value
