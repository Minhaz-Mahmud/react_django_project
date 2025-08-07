from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Candidate
from . serializer import *
from .serializer import CandidateSerializer
from django.db import IntegrityError
from django.core.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)

class CandidateView(APIView):
    serializer_class = CandidateSerializer


    def get(self, request):
        try:
            candidates = Candidate.objects.all()
            serializer = self.serializer_class(candidates, many=True)
            return Response({
                'success': True,
                'message': 'Candidates retrieved successfully',
                'data': serializer.data,
                'count': candidates.count()
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error retrieving candidates: {str(e)}")
            return Response({
                'success': False,
                'message': 'Failed to retrieve candidates',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            
            if serializer.is_valid():
                # Hash password before saving if provided
                if 'password' in serializer.validated_data and serializer.validated_data['password']:
                    candidate = serializer.save()
                    candidate.set_password(serializer.validated_data['password'])
                else:
                    candidate = serializer.save()
                
                # Return success response with candidate data
                response_data = self.serializer_class(candidate).data
                
                return Response({
                    'success': True,
                    'message': f'Registration successful! Welcome {candidate.full_name}',
                    'data': response_data,
                   
                }, status=status.HTTP_201_CREATED)
            
            else:
                # Format validation errors nicely
                formatted_errors = {}
                for field, errors in serializer.errors.items():
                    if field == 'email':
                        if any('already exists' in str(error) or 'unique' in str(error) for error in errors):
                            formatted_errors[field] = ['This email is already registered']
                        else:
                            formatted_errors[field] = errors
                    elif field == 'phone_number':
                        formatted_errors[field] = ['Please enter a valid 11-digit phone number']
                    else:
                        formatted_errors[field] = errors
                
                logger.warning(f"Validation errors: {formatted_errors}")
                
                return Response({
                    'success': False,
                    'message': 'Registration failed due to validation errors',
                    'errors': formatted_errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except IntegrityError as e:
            logger.error(f"Database integrity error: {str(e)}")
            
            # Handle email uniqueness constraint only
            if 'email' in str(e).lower():
                error_message = 'This email address is already registered'
            else:
                error_message = 'Registration failed due to a database constraint'
            
            return Response({
                'success': False,
                'message': error_message,
                'error': 'duplicate_email'
            }, status=status.HTTP_409_CONFLICT)
            
        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            return Response({
                'success': False,
                'message': 'Invalid data provided',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Unexpected error during registration: {str(e)}")
            return Response({
                'success': False,
                'message': 'An unexpected error occurred. Please try again later.',
                'error': 'server_error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        




from rest_framework.permissions import AllowAny
from .models import Candidate
from .serializer import CandidateSerializer


class AdminCandidateListAPIView(APIView):
   

    def get(self, request):
        candidates = Candidate.objects.all()
        serializer = CandidateSerializer(candidates, many=True)
        return Response(serializer.data)


class AdminCandidateDeleteAPIView(APIView):
   
    def delete(self, request, pk):
        try:
            candidate = Candidate.objects.get(pk=pk)
            candidate.delete()
            return Response({"detail": "Candidate deleted"}, status=status.HTTP_204_NO_CONTENT)
        except Candidate.DoesNotExist:
            return Response({"error": "Candidate not found"}, status=status.HTTP_404_NOT_FOUND)
        


