from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from admin_app.views import admin_login,AdminLeaderShipView,FaqView

urlpatterns = [
    path("web/admin/login/", admin_login, name="admin_login"),
     path(
        "admin/leadership/section/",
        AdminLeaderShipView.as_view(),
        name="AdminLeaderShip_details",
    ),
    path(
        "admin/leadership/section/<int:pk>/",
        AdminLeaderShipView.as_view(),
        name="AdminLeaderShip_edit",
    ),
    path("admin/faq/section/", FaqView.as_view(), name="FaqView_details"),
    path("admin/faq/section/<int:pk>/", FaqView.as_view(), name="Faq_edit"),
   
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
