from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import check_password
from rest_framework import status
from .models import Company
from .serializers import CompanySerializer


class CompanyRegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CompanySerializer(data=request.data)

        if serializer.is_valid():
            company = serializer.save()
            return Response(
                {
                    "message": "Company registered successfully!",
                    "company": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class CompanyLoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"message": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            company = Company.objects.get(email=email)
        except Company.DoesNotExist:
            return Response(
                {"message": "Invalid email or password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check the password
        if not check_password(password, company.password):
            return Response(
                {"error": "Invalid password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Return company data
        company_data = CompanySerializer(company).data
        return Response(
            {"message": "Login successful", "company": company_data},
            status=status.HTTP_200_OK,
        )


class CompanyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            company = Company.objects.get(id=request.user.id)
        except Company.DoesNotExist:
            return Response(
                {"error": "Company not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Return company data
        company_data = CompanySerializer(company).data
        return Response(
            {"company": company_data},
            status=status.HTTP_200_OK,
        )
