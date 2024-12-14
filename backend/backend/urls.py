from django.contrib import admin
from django.urls import path, include
from registration.views import CandidateView
from login.views import CandidateLoginView, CandidateUpdateView
from company_registration.views import (
    CompanyRegisterView,
    CompanyLoginView,
    CompanyProfileUpdateView,
)
from job_post.views import (
    JobPostCreateView,
    CompanyJobsView,
    JobPostDeleteView,
    JobPostListView,
)
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path(
        "api/candidate/update/<int:pk>/",
        CandidateUpdateView.as_view(),
        name="candidate-update",
    ),
    path("admin/", admin.site.urls),
    path("candidates/", CandidateView.as_view(), name="candidate-list"),
    path("login/", CandidateLoginView.as_view(), name="login"),
    path(
        "api/company/register/", CompanyRegisterView.as_view(), name="company-register"
    ),
    path("api/company/login/", CompanyLoginView.as_view(), name="company-login"),
    path("api/company/post-job/", JobPostCreateView.as_view(), name="company-job-post"),
    path("api/company/posted-jobs/", CompanyJobsView.as_view(), name="posted-jobs"),
    path(
        "api/company/delete-job/<int:job_id>/",
        JobPostDeleteView.as_view(),
        name="job-post-delete",
    ),
    path(
        "api/company/update-profile/",
        CompanyProfileUpdateView.as_view(),
        name="company-profile-update",
    ),
    path("job-posts/", JobPostListView.as_view(), name="job-posts"),
    path("api/company/location/", include("map.urls")),
    path("api/all/company/", include("all_company.urls")),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
