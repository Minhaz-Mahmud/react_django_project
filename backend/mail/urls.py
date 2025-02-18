from django.urls import path
from mail.views import SendEmailView

urlpatterns = [
    path("send-email/", SendEmailView.as_view(), name="send_email"),
]
