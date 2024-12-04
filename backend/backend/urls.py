from django.contrib import admin
from django.urls import path
from registration.views import CandidateView
from login.views import CandidateLoginView
from company_registration.views import CompanyRegisterView, CompanyLoginView
from job_post.views import JobPostCreateView, CompanyJobsView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),
    path("candidates/", CandidateView.as_view(), name="candidate-list"),
    path("login/", CandidateLoginView.as_view(), name="login"),
    path(
        "api/company/register/", CompanyRegisterView.as_view(), name="company-register"
    ),
    path("api/company/login/", CompanyLoginView.as_view(), name="company-login"),
    path("api/company/post-job/", JobPostCreateView.as_view(), name="company-job-post"),
    path("api/company/posted-jobs/", CompanyJobsView.as_view(), name="posted-jobs"),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
