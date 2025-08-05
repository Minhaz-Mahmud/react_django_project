from rest_framework.response import Response
from rest_framework import status
from apply.models import Apply
from registration.models import Candidate
from company_registration.models import Company
from rest_framework.pagination import PageNumberPagination
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from job_post.models import JobPost
from django.views import View
from django.shortcuts import render
from django.db import connection
from django.utils.timezone import localdate


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
            "application_response",
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
    
    # Calculate age if dob is available
    age = None
    if candidate.dob:
        today = localdate()
        age = today.year - candidate.dob.year - ((today.month, today.day) < (candidate.dob.month, candidate.dob.day))
    
    data = {
        # Basic Information
        "full_name": candidate.full_name,
        "email": candidate.email,
        "phone_number": candidate.phone_number,
        "location": candidate.location,
        
        # Personal Details
        "dob": candidate.dob.strftime("%Y-%m-%d") if candidate.dob else None,
        "age": age,
        "gender": candidate.get_gender_display() if candidate.gender else None,
        "religion": candidate.religion,
        
        # Education - High School
        "high_school_name": candidate.high_school_name,
        "high_school_degree": candidate.high_school_degree,
        "high_school_passing_year": candidate.high_school_passing_year,
        "high_school_grade": candidate.high_school_grade,
        
        # Education - University
        "university_name": candidate.university_name,
        "university_degree": candidate.university_degree,
        "university_passing_year": candidate.university_passing_year,
        "university_grade": candidate.university_grade,
        
        # Professional
        "professional_experience": candidate.professional_experience,
        "skills": candidate.skills.split(",") if candidate.skills else [],
        
        # Files
        "resume": candidate.resume.url if candidate.resume else None,
        "profile_picture": candidate.profile_picture.url if candidate.profile_picture else None,
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


def get_candidate_applied_jobs(request, candidate_id):
    """
    SQL JOIN query.
    combines data from Apply, JobPost, and Company models.
    """
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT 
                a.id AS apply_id,
                a.time AS applied_time,
                a.job_id,
                a.company_id as company_id,
                a.application_response as Application_response,
                j.title AS job_title,
                j.job_location,
                j.job_type,
                j.salary_range,
                j.job_time,
                j.description AS job_description,
                c.name AS company_name,
                c.email AS company_email,
                c.phone_number AS Phone,
                c.location AS company_location,
                c.website AS company_website,
                c.company_type
            FROM 
                apply a
            JOIN 
                job_post_jobpost j ON a.job_id = j.id
            JOIN 
                company_registration_company c ON a.company_id = c.id
            WHERE 
                a.candidate_id = %s
            ORDER BY 
                a.time DESC
        """,
            [candidate_id],
        )

        # Convert query results to a list of dictionaries
        columns = [col[0] for col in cursor.description]
        applied_jobs = [dict(zip(columns, row)) for row in cursor.fetchall()]

    return JsonResponse({"applied_jobs": applied_jobs})


def applied_jobs_view(request):
    return render(request, "applied_jobs.html")


class UpdateApplicationResponse(APIView):
    def post(self, request):
        application_id = request.data.get("application_id")
        new_response = request.data.get("response")

        if not application_id or not new_response:
            return Response(
                {"error": "Application ID and response are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            application = Apply.objects.get(id=application_id)
            application.application_response = new_response
            application.save()
            return Response(
                {"message": "Response updated successfully."},
                status=status.HTTP_200_OK,
            )
        except Apply.DoesNotExist:
            return Response(
                {"error": f"Application not found with id {application_id}."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
