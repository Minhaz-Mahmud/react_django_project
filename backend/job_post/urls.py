from django.urls import path
from job_post.views import (
    GetActiveRecruitmentStatusView,
    UpdateActiveRecruitmentStatusView,
)

urlpatterns = [
    path(
        "get-active-recruitment-status/",
        GetActiveRecruitmentStatusView.as_view(),
        name="get-active-status",
    ),
    path(
        "update-active-recruitment-status/",
        UpdateActiveRecruitmentStatusView.as_view(),
        name="update-active-status",
    ),
]
