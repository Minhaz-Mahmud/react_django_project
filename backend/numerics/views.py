# # from django.shortcuts import render
# # from django.http import JsonResponse
# # from job_post.models import JobPost
# # from company_registration.models import Company
# # from registration.models import Candidate


# # def get_totals(request):
# #     total_job_posts = JobPost.objects.count()
# #     total_candidates = Candidate.objects.count()
# #     total_companies = Company.objects.count()

# #     data = {
# #         "total_job_posts": total_job_posts,
# #         "total_candidates": total_candidates,
# #         "total_companies": total_companies,
# #     }

# #     return JsonResponse(data)

# from django.shortcuts import render
# from django.http import JsonResponse
# from django.views import View
# from job_post.models import JobPost
# from company_registration.models import Company
# from registration.models import Candidate


# class GetTotalsView(View):
#     def get(self, request, *args, **kwargs):
#         total_job_posts = JobPost.objects.count()
#         total_candidates = Candidate.objects.count()
#         total_companies = Company.objects.count()

#         data = {
#             "total_job_posts": total_job_posts,
#             "total_candidates": total_candidates,
#             "total_companies": total_companies,
#         }

#         return JsonResponse(data)


from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from job_post.models import JobPost
from company_registration.models import Company
from registration.models import Candidate


class GetTotalsView(View):
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
