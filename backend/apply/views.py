from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apply.models import Apply
from registration.models import Candidate
from company_registration.models import Company


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Apply
from registration.models import Candidate
from company_registration.models import Company

class ApplyToJobView(APIView):
    def post(self, request, *args, **kwargs):
        candidate_id = request.data.get("candidate_id")
        company_id = request.data.get("company_id")
        job_id=request.data.get("job_id")
        job_title=request.data.get("job_title")

        # Directly create the application without any checks
        Apply.objects.create(candidate_id=candidate_id, company_id=company_id,job_id=job_id,job_title=job_title)

        return Response(
            {"message": "Application submitted successfully!"},
            status=status.HTTP_201_CREATED
        )
