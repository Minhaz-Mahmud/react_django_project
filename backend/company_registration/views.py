from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Company
from .serializers import CompanySerializer

class CompanyRegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CompanySerializer(data=request.data)
        
        if serializer.is_valid():
            company = serializer.save()
            return Response(
                {"message": "Company registered successfully!", "company": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )
