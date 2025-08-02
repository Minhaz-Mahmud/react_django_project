from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import Candidate
from registration.serializer import CandidateSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import Candidate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Candidate
from django.contrib.auth.hashers import make_password
from company_registration.models import Company


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

        # Serialize the candidate data
        candidate_data = CandidateSerializer(candidate).data

        # Prepare the response data with all fields
        response_data = {
            "message": "Login successful",
            "candidate": {
                "id": candidate.id,
                "full_name": candidate.full_name,
                "email": candidate.email,
                "phone_number": candidate.phone_number,
                "location": candidate.location,
                "dob": str(candidate.dob) if candidate.dob else None,
                "gender": candidate.gender,
                "religion": candidate.religion,
                "high_school_name": candidate.high_school_name,
                "high_school_degree": candidate.high_school_degree,
                "high_school_passing_year": candidate.high_school_passing_year,
                "high_school_grade": candidate.high_school_grade,
                "university_name": candidate.university_name,
                "university_degree": candidate.university_degree,
                "university_passing_year": candidate.university_passing_year,
                "university_grade": candidate.university_grade,
                "professional_experience": candidate.professional_experience,
                "skills": candidate.skills,
                "profile_picture": candidate.profile_picture.url if candidate.profile_picture else None,
                "resume": candidate.resume.url if candidate.resume else None,
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
        

class CandidateUpdateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    
    def put(self, request, pk):
        try:
            candidate = Candidate.objects.get(id=pk)
            
            # Update text fields only if they are provided and not empty
            if request.data.get('full_name'):
                candidate.full_name = request.data.get('full_name')
            if request.data.get('phone_number'):
                candidate.phone_number = request.data.get('phone_number')
            if request.data.get('location'):
                candidate.location = request.data.get('location')
            if request.data.get('dob'):
                candidate.dob = request.data.get('dob')
            if request.data.get('gender'):
                candidate.gender = request.data.get('gender')
            if request.data.get('religion'):
                candidate.religion = request.data.get('religion')
            if request.data.get('high_school_name'):
                candidate.high_school_name = request.data.get('high_school_name')
            if request.data.get('high_school_degree'):
                candidate.high_school_degree = request.data.get('high_school_degree')
            if request.data.get('high_school_passing_year'):
                candidate.high_school_passing_year = request.data.get('high_school_passing_year')
            if request.data.get('high_school_grade'):
                candidate.high_school_grade = request.data.get('high_school_grade')
            if request.data.get('university_name'):
                candidate.university_name = request.data.get('university_name')
            if request.data.get('university_degree'):
                candidate.university_degree = request.data.get('university_degree')
            if request.data.get('university_passing_year'):
                candidate.university_passing_year = request.data.get('university_passing_year')
            if request.data.get('university_grade'):
                candidate.university_grade = request.data.get('university_grade')
            if request.data.get('professional_experience'):
                candidate.professional_experience = request.data.get('professional_experience')
            if request.data.get('skills'):
                candidate.skills = request.data.get('skills')
            
            # Handle file uploads - only update if new files are provided
            if 'resume' in request.FILES:
                candidate.resume = request.FILES['resume']
            if 'profile_picture' in request.FILES:
                candidate.profile_picture = request.FILES['profile_picture']
            
            candidate.save()

            # Return updated candidate data in the same format as login
            response_data = {
                "message": "Profile updated successfully!",
                "candidate": {
                    "id": candidate.id,
                    "full_name": candidate.full_name,
                    "email": candidate.email,
                    "phone_number": candidate.phone_number,
                    "location": candidate.location,
                    "dob": str(candidate.dob) if candidate.dob else None,
                    "gender": candidate.gender,
                    "religion": candidate.religion,
                    "high_school_name": candidate.high_school_name,
                    "high_school_degree": candidate.high_school_degree,
                    "high_school_passing_year": candidate.high_school_passing_year,
                    "high_school_grade": candidate.high_school_grade,
                    "university_name": candidate.university_name,
                    "university_degree": candidate.university_degree,
                    "university_passing_year": candidate.university_passing_year,
                    "university_grade": candidate.university_grade,
                    "professional_experience": candidate.professional_experience,
                    "skills": candidate.skills,
                    "profile_picture": candidate.profile_picture.url if candidate.profile_picture else None,
                    "resume": candidate.resume.url if candidate.resume else None,
                }
            }
            
            return Response(response_data, status=status.HTTP_200_OK)

        except Candidate.DoesNotExist:
            return Response({"message": "Candidate not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)






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



class CompanyChangePasswordView(APIView):
    def put(self, request, pk):
        try:
            company = Company.objects.get(id=pk)
            new_password = request.data.get("password")

            if not new_password:
                return Response({"message": "New password is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Hash and save the new password
            company.password = make_password(new_password)
            company.save()

            return Response({"message": "Password updated successfully!"}, status=status.HTTP_200_OK)

        except Company.DoesNotExist:
            return Response({"message": "Candidate not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)