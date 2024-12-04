from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import JobPostSerializer
from company_registration.models import Company
from job_post.models import JobPost


class JobPostCreateView(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            try:
                company = Company.objects.get(email=request.user.email)
            except Company.DoesNotExist:
                return Response(
                    {
                        "error": "You must be associated with a registered company to post jobs."
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
        else:
            company_email = request.data.get("company_email")
            if not company_email:
                return Response(
                    {"error": "Company email is required for unauthenticated users."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            try:
                company = Company.objects.get(email=company_email)
            except Company.DoesNotExist:
                return Response(
                    {"error": "Invalid company email provided."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        # Add the company to the request data
        data = request.data.copy()
        data["company"] = company.id

        # Serialize and validate data
        serializer = JobPostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class CompanyJobsView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            try:
                company = Company.objects.get(email=request.user.email)
            except Company.DoesNotExist:
                return Response(
                    {"error": "Invalid company association."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        else:
            company_email = request.query_params.get("company_email")
            if not company_email:
                return Response(
                    {"error": "Company email is required for unauthenticated users."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            try:
                company = Company.objects.get(email=company_email)
            except Company.DoesNotExist:
                return Response(
                    {"error": "Invalid company email provided."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        # Retrieve jobs for the company
        jobs = JobPost.objects.filter(company=company)
        serializer = JobPostSerializer(jobs, many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


