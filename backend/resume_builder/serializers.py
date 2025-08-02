from rest_framework import serializers
from .models import CandidateCV

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateCV
        fields = [
            "id", "cv_file", "email", "created_at","template_number",
            "name", "title", "phone", "gender", "dob", "address", "religion",
            "skillset", "education", "experience", "thumbnail"
        ]