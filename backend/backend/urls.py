from django.contrib import admin
from django.urls import path
from registration.views import CandidateView
from login.views import CandidateLoginView
from company_registration.views import CompanyRegisterView, CompanyLoginView
from django.conf import settings
from django.conf.urls.static import static



# from company_registration.views import CompanyRegisterView, CompanyLoginView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("candidates/", CandidateView.as_view(), name="candidate-list"),
    path("login/", CandidateLoginView.as_view(), name="login"),
    path("api/company/register/", CompanyRegisterView.as_view(), name="company-register"
    ),
    path("api/company/login/", CompanyLoginView.as_view(), name="company-login"),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
