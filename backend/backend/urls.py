from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from registration.views import CandidateView
from login.views import CandidateLoginView, CandidateUpdateView, CandidateChangePasswordView
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
from apply.views import (
    ApplyToJobView,
    CompanyApplicationsAPIView,
    candidate_details,
    ApplicationDeleteView,
)

from mail.views import BasicEmailView
from chatbot.views import find_jobs


urlpatterns = [
    path('api/find-jobs/', find_jobs, name='find-jobs'),
    path("apply/", ApplyToJobView.as_view(), name="apply_to_job"),
    path(
        "applications/<int:company_id>/",
        CompanyApplicationsAPIView.as_view(),
        name="company-applications",
    ),
    path("candidates/<int:candidate_id>/", candidate_details, name="candidate_details"),
    path(
        "applications_del/<int:application_id>/",
        ApplicationDeleteView.as_view(),
        name="delete_application",
    ),
    path(
        "api/candidate/cp/<int:pk>/",
        CandidateChangePasswordView.as_view(),
        name="change-password",
    ),

     path("api/send-email/", BasicEmailView.as_view(), name="send-email"),
    
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
    path("api/", include("resume_builder.urls")),
    path("api/", include("mail.urls")),
    path("api/", include("numerics.urls")),
    path("api/", include("job_post.urls")),
    path("api/", include("apply.urls")),
    path("api/", include("company_registration.urls")),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
