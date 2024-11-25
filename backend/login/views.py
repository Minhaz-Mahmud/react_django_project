from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import Candidate
from registration.serializer import CandidateSerializer


class CandidateLoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"message": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            candidate = Candidate.objects.get(email=email)
        except Candidate.DoesNotExist:
            return Response(
                {"message": "Invalid email or password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check the password
        if not check_password(password, candidate.password):
            return Response(
                {"error": "Invalid password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Return candidate data
        candidate_data = CandidateSerializer(candidate).data
        return Response(
            {"message": "Login successful", "candidate": candidate_data},
            status=status.HTTP_200_OK,
        )
