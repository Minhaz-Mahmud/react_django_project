from rest_framework import serializers
from .models import CandidateCV


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateCV
        fields = ["id", "cv_file", "email", "created_at"]
