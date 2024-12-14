from django.urls import path
from .views import CompanyListView, CompanyDetailView

urlpatterns = [
    path("list/", CompanyListView.as_view(), name="company-list"),
    path(
        "<int:company_id>/details/",
        CompanyDetailView.as_view(),
        name="company_detail",
    ),
]
