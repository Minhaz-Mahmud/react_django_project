from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import Candidate
from registration.serializer import CandidateSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

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

        # Serialize the candidate data and add the id field
        candidate_data = CandidateSerializer(candidate).data

        # Include candidate id in the response
        response_data = {
            "message": "Login successful",
            "candidate": {
                "id": candidate.id,
                "full_name": candidate.full_name,
                "email": candidate.email,
                "phone_number": candidate.phone_number,
                "location": candidate.location,
                "profile_picture": candidate.profile_picture.url if candidate.profile_picture else None,
                "resume": candidate.resume.url if candidate.resume else None,
                "skills": candidate.skills,
            }
        }

        return Response(response_data, status=status.HTTP_200_OK)




class CandidateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            candidate = Candidate.objects.get(user=request.user)
        except Candidate.DoesNotExist:
            return Response(
                {"error": "Candidate not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Return candidate data
        candidate_data = CandidateSerializer(candidate).data
        return Response(
            {"candidate": candidate_data},
            status=status.HTTP_200_OK,
        )





from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import Candidate

class CandidateUpdateView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, pk):
        try:
            candidate = Candidate.objects.get(id=pk)
            
            # Update candidate data
            candidate.full_name = request.data.get('full_name', candidate.full_name)
            candidate.email = request.data.get('email', candidate.email)
            candidate.phone_number = request.data.get('phone_number', candidate.phone_number)
            candidate.location = request.data.get('location', candidate.location)
            candidate.skills = request.data.get('skills', candidate.skills)
            
            if 'resume' in request.data:
                candidate.resume = request.data['resume']
            if 'profile_picture' in request.data:
                candidate.profile_picture = request.data['profile_picture']
            
            candidate.save()

            # Serialize the candidate data
            candidate_data = CandidateSerializer(candidate).data

            # Prepare the response data
            response_data = {
                "message": "Profile updated successfully!",
                "candidate": {
                    "id": candidate.id,
                    "full_name": candidate.full_name,
                    "email": candidate.email,
                    "phone_number": candidate.phone_number,
                    "location": candidate.location,
                    "profile_picture": candidate.profile_picture.url if candidate.profile_picture else None,
                    "resume": candidate.resume.url if candidate.resume else None,
                    "skills": candidate.skills,
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Candidate.DoesNotExist:
            return Response({"message": "Candidate not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


# class CandidateUpdateView(APIView):
#     parser_classes = [MultiPartParser, FormParser]

#     def put(self, request, pk):
#         try:
#             candidate = Candidate.objects.get(id=pk)
            
#             # Update candidate data
#             candidate.full_name = request.data.get('full_name', candidate.full_name)
#             candidate.email = request.data.get('email', candidate.email)
#             candidate.phone_number = request.data.get('phone_number', candidate.phone_number)
#             candidate.location = request.data.get('location', candidate.location)
#             candidate.skills = request.data.get('skills', candidate.skills)
            
#             if 'resume' in request.data:
#                 candidate.resume = request.data['resume']
#             if 'profile_picture' in request.data:
#                 candidate.profile_picture = request.data['profile_picture']
            
#             candidate.save()

#             # Return success response
#             serializer = CandidateSerializer(candidate)
#             return Response({"message": "Profile updated successfully!", "data": serializer.data}, status=200)

#         except Candidate.DoesNotExist:
#             return Response({"message": "Candidate not found."}, status=404)
#         except Exception as e:
#             return Response({"message": f"Error: {str(e)}"}, status=400)





from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Candidate
from django.contrib.auth.hashers import make_password

class CandidateChangePasswordView(APIView):
    def put(self, request, pk):
        try:
            candidate = Candidate.objects.get(id=pk)
            new_password = request.data.get("password")

            if not new_password:
                return Response({"message": "New password is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Hash and save the new password
            candidate.password = make_password(new_password)
            candidate.save()

            return Response({"message": "Password updated successfully!"}, status=status.HTTP_200_OK)

        except Candidate.DoesNotExist:
            return Response({"message": "Candidate not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
