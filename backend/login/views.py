from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import Candidate


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        # Validate that the email and password are provided
        if not email or not password:
            return Response(
                {"detail": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Attempt to retrieve the candidate by email
        try:
            candidate = Candidate.objects.get(email=email)
        except Candidate.DoesNotExist:
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Check if the password matches
        if check_password(password, candidate.password):
            return Response(
                {"detail": "Login successful!"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
