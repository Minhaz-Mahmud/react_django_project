from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from admin_app.views import admin_login

urlpatterns = [
    path("web/admin/login/", admin_login, name="admin_login"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
