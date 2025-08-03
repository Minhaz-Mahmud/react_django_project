from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Candidate
from . serializer import *

class CandidateView(APIView):
    serializer_class = CandidateSerializer

    def get(self, request):
        candidates = Candidate.objects.all()
        serializer = self.serializer_class(candidates, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        




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
        


