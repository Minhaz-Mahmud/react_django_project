from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apply.models import Apply
from registration.models import Candidate
from company_registration.models import Company
from rest_framework.pagination import PageNumberPagination
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
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
        job_id = request.data.get("job_id")
        job_title = request.data.get("job_title")

        # Directly create the application without any checks
        Apply.objects.create(
            candidate_id=candidate_id,
            company_id=company_id,
            job_id=job_id,
            job_title=job_title,
        )

        return Response(
            {"message": "Application submitted successfully!"},
            status=status.HTTP_201_CREATED,
        )


class ApplicationPagination(PageNumberPagination):
    page_size = 5  # Number of applications per page
    page_size_query_param = "page_size"
    max_page_size = 50


class CompanyApplicationsAPIView(APIView):
    pagination_class = ApplicationPagination

    def get(self, request, company_id, *args, **kwargs):
        applications = Apply.objects.filter(company_id=company_id).values(
            "id",
            "candidate__full_name",
            "job_id",
            "job_title",
            "time",
            "candidate_id",
        )

        if applications.exists():
            paginator = self.pagination_class()
            paginated_apps = paginator.paginate_queryset(
                applications, request, view=self
            )
            return paginator.get_paginated_response(paginated_apps)

        return Response(
            {"message": "No applications found for this company."},
            status=status.HTTP_404_NOT_FOUND,
        )


def candidate_details(request, candidate_id):
    candidate = get_object_or_404(Candidate, id=candidate_id)
    data = {
        "full_name": candidate.full_name,
        "email": candidate.email,
        "phone_number": candidate.phone_number,
        "location": candidate.location,
        "skills": candidate.skills.split(",") if candidate.skills else [],
        "resume": candidate.resume.url if candidate.resume else None,
        "profile_picture": (
            candidate.profile_picture.url if candidate.profile_picture else None
        ),
    }
    return JsonResponse(data)


class ApplicationDeleteView(APIView):
    def delete(self, request, application_id):
        try:
            application = Apply.objects.get(id=application_id)
            application.delete()
            return Response(
                {"message": "Application deleted successfully."},
                status=status.HTTP_204_NO_CONTENT,
            )
        except Apply.DoesNotExist:
            return Response(
                {"error": "Application not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
