from rest_framework import serializers
from .models import Candidate

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = [
            'full_name', 'email', 'phone_number', 'location',
            'dob', 'gender', 'religion',
            'high_school_name', 'high_school_degree', 'high_school_passing_year', 'high_school_grade',
            'university_name', 'university_degree', 'university_passing_year', 'university_grade',
            'professional_experience', 'skills',
            'resume', 'profile_picture', 'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'dob': {'required': False},
            'gender': {'required': False},
            'religion': {'required': False},
            'high_school_name': {'required': False},
            'high_school_degree': {'required': False},
            'high_school_passing_year': {'required': False},
            'high_school_grade': {'required': False},
            'university_name': {'required': False},
            'university_degree': {'required': False},
            'university_passing_year': {'required': False},
            'university_grade': {'required': False},
            'professional_experience': {'required': False},
            'resume': {'required': False},
            'profile_picture': {'required': False},
        }

    def validate_email(self, value):
        if Candidate.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        candidate = Candidate(**validated_data)
        if password:
            candidate.set_password(password)
        candidate.save()
        return candidate