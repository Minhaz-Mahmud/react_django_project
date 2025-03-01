from django.urls import path
from mail.views import SendEmailView, ApplicationMailView

urlpatterns = [
    path("send-email/", SendEmailView.as_view(), name="send_email"),
    path("contact-email/", ApplicationMailView.as_view(), name="application_mail"),
]
