from django.urls import path
from apply.views import (
    UpdateApplicationResponse,
    candidate_details,
    applied_jobs_view,
    get_candidate_applied_jobs,
)

urlpatterns = [
    path(
        "candidate/details/<int:candidate_id>/",
        candidate_details,
        name="candidate-details",
    ),
    # URL for the page that displays applied jobs
    path("candidate/applied-jobs/", applied_jobs_view, name="applied_jobs_view"),
    # API endpoint to fetch applied jobs data
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
]
