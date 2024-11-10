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