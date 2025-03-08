from django.urls import path
from .views import GetCompanyDetailView

urlpatterns = [
    path(
        "get/company/details/<int:company_id>/",
        GetCompanyDetailView.as_view(),
        name="get_company_detail",
    ),
]
