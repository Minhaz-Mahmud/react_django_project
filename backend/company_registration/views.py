from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from rest_framework import status
from .models import Company
from .serializers import CompanySerializer


class CompanyRegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CompanySerializer(data=request.data)

        if serializer.is_valid():
            company = serializer.save()  # The password will be hashed here
            return Response(
                {
                    "message": "Company registered successfully!",
                    "company": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyLoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            company = Company.objects.get(email=email)
        except Company.DoesNotExist:
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if check_password(password, company.password):
            return Response(
                {
                    "message": "Login successful!",
                    "company": {
                        "id": company.id,
                        "name": company.name,
                        "email": company.email,
                    },
                    "access_token": "mock_access_token_123",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
