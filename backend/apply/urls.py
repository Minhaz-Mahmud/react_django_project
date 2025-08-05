from django.urls import path
from apply.views import (
    UpdateApplicationResponse,
    candidate_details,
    applied_jobs_view,
    get_candidate_applied_jobs,
    CandidateAppliedJobsAPIView,
)

urlpatterns = [
    path(
        "candidate/details/<int:candidate_id>/",
        candidate_details,
        name="candidate-details",
    ),
    path("candidate/applied-jobs/", applied_jobs_view, name="applied_jobs_view"),
    path(
        "candidate/applied-jobs/<int:candidate_id>/",
        get_candidate_applied_jobs,
        name="get_candidate_applied_jobs",
    ),
    path(
        "applications/update-response/",
        UpdateApplicationResponse.as_view(),
        name="update_application_response",
    ),
     path('candidate-applied-job-ids/<int:candidate_id>/', CandidateAppliedJobsAPIView.as_view(), name='candidate_applied_job_ids'),


]
