from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['name', 'email', 'phone_number', 'location', 'description', 'website', 'ceo_phone', 'company_type']
