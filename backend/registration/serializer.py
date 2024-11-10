from rest_framework import serializers
from .models import Candidate

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ['full_name', 'email', 'phone_number', 'location', 'skills', 'resume', 'profile_picture', 'password']
        extra_kwargs = {
            'password': {'write_only': True} 
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
