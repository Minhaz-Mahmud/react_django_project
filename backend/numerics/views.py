from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from job_post.models import JobPost
from company_registration.models import Company
from registration.models import Candidate

from mail.models import Application_Mail
from apply.models import Apply
from rest_framework.views import APIView


class GetTotalCountsWeb(View):
    def get(self, request, *args, **kwargs):
        try:
            total_job_posts = JobPost.objects.count()
            total_candidates = Candidate.objects.count()
            total_companies = Company.objects.count()

            data = {
                "total_job_posts": total_job_posts,
                "total_candidates": total_candidates,
                "total_companies": total_companies,
            }

            return JsonResponse(data, status=200)
        except Exception as e:
            error_data = {
                "error": str(e),
                "message": "An error occurred while fetching the totals.",
            }
            return JsonResponse(error_data, status=500)


# class GetTotalCountCompDash(APIView):

#     def get(self, request, *args, **kwargs):
#         try:
#             company_id = request.user.company.id

#             job_posts_count = JobPost.objects.filter(company_id=company_id).count()
#             applications_count = Application_Mail.objects.filter(
#                 company_id=company_id
#             ).count()
#             apply_count = Apply.objects.filter(company_id=company_id).count()

#             data = {
#                 "job_posts_count": job_posts_count,
#                 "applications_count": applications_count,
#                 "apply_count": apply_count,
#             }

#             return JsonResponse(
#                 data,
#                 status=200,
#             )
#         except Exception as e:
#             error_data = {
#                 "error": str(e),
#                 "message": "An error occurred while fetching the counts.",
#             }
#             return JsonResponse(
#                 error_data,
#                 status=500,
#             )


class GetTotalCountCompDash(APIView):

    def get(self, request, *args, **kwargs):
        try:
            company_id = request.GET.get("company_id")

            if not company_id:
                return JsonResponse({"error": "Company ID is required"}, status=400)

            job_posts_count = JobPost.objects.filter(company_id=company_id).count()
            applications_count = Application_Mail.objects.filter(
                company_id=company_id
            ).count()
            apply_count = Apply.objects.filter(company_id=company_id).count()

            data = {
                "job_posts_count": job_posts_count,
                "applications_count": applications_count,
                "apply_count": apply_count,
            }

            return JsonResponse(data, status=200)

        except Exception as e:
            return JsonResponse(
                {
                    "error": str(e),
                    "message": "An error occurred while fetching the counts.",
                },
                status=500,
            )
