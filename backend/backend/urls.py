from django.contrib import admin
from django.urls import path
from registration.views import CandidateView
from login.views import LoginView
from company_registration.views import CompanyRegisterView
# from company_registration.views import CompanyRegisterView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("candidates/", CandidateView.as_view(), name="candidate-list"),
    path("login/", LoginView.as_view(), name="login"),
    path('api/company/register/', CompanyRegisterView.as_view(), name='company-register'),
]
