from rest_framework.views import APIView
from rest_framework.response import Response
import rest_framework
from rest_framework import status
from .serializers import JobPostSerializer
from company_registration.models import Company
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
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

        jobs = JobPost.objects.filter(company=company)
        serializer = JobPostSerializer(jobs, many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class JobPostDeleteView(APIView):
    def delete(self, request, job_id):
        if request.user.is_authenticated:
            try:
                company = Company.objects.get(email=request.user.email)
            except Company.DoesNotExist:
                return Response(
                    {"error": "Invalid company association."},
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

        try:
            job_post = JobPost.objects.get(id=job_id, company=company)
            job_post.delete()
            return Response(
                {"message": "Job post deleted successfully."},
                status=status.HTTP_204_NO_CONTENT,
            )
        except JobPost.DoesNotExist:
            return Response(
                {"error": "Job post not found."},
                status=status.HTTP_404_NOT_FOUND,
            )


class JobPostPagination(PageNumberPagination):
    page_size = 6  # Number of posts per page
    page_size_query_param = "page_size"
    max_page_size = 10


class JobPostListView(ListAPIView):
    serializer_class = JobPostSerializer
    pagination_class = JobPostPagination
    queryset = JobPost.objects.all().order_by("-posted_at")


class GetActiveRecruitmentStatusView(APIView):
    def get(self, request):
        company_id = request.query_params.get("company_id")

        if not company_id:
            return Response(
                {"error": "Company ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            company = Company.objects.get(id=company_id)

        except Company.DoesNotExist:
            return Response(
                {"error": "Invalid company ID provided."},
                status=status.HTTP_404_NOT_FOUND,
            )

        job_posts = JobPost.objects.filter(company=company)
        active_recruitment_status = job_posts.values("id", "title", "active_recruiting")

        return Response(
            active_recruitment_status,
            status=status.HTTP_200_OK,
        )


class UpdateActiveRecruitmentStatusView(APIView):
    def post(self, request):
        company_id = request.data.get("company_id")
        recruits = request.data.get("recruits")

        if not company_id or not recruits:
            return Response(
                {"error": "Company ID and recruits data are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return Response(
                {"error": "Invalid company ID provided."},
                status=status.HTTP_404_NOT_FOUND,
            )

        for recruit in recruits:
            try:
                job_post = JobPost.objects.get(id=recruit["id"], company=company)
                job_post.active_recruiting = recruit["active_recruiting"]
                job_post.save()
            except JobPost.DoesNotExist:
                continue

        return Response(
            {"message": "Recruitment status updated successfully."},
            status=status.HTTP_200_OK,
        )


class GetJobDetailView(APIView):
    def get(self, request, job_id):
        try:
            jobpost = JobPost.objects.get(id=job_id)
            serializer = JobPostSerializer(jobpost)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except JobPost.DoesNotExist:
            return Response(
                {"error": "Job post not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
