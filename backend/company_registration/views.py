from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password, make_password
from rest_framework import status
from .models import Company
from .serializers import CompanySerializer


class CompanyRegisterView(APIView):
    def post(self, request):
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


class CompanyProfileUpdateView(APIView):
    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required to update profile."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            company = Company.objects.get(email=email)
        except Company.DoesNotExist:
            return Response(
                {"error": "Company not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Company profile updated successfully!",
                    "company": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
