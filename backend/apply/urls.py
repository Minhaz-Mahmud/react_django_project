from django.urls import path
from apply.views import candidate_details

urlpatterns = [
    path(
        "candidate/details/<int:candidate_id>/",
        candidate_details,
        name="candidate-details",
    ),
]
