from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from resume_builder.views import (
    generate_cv,
    generate_cv2,
    GetResumes,
    view_cv,
    delete_resume,
)

urlpatterns = [
    path("generate-cv/", generate_cv, name="generate_cv"),
    path("generate-cv2/", generate_cv2, name="generate_cv2"),
    path("candidate/get/resumes/", GetResumes.as_view(), name="get_resumes"),
    path("cv/<str:file_name>/", view_cv, name="view_cv"),
    path("delete_resume/<int:resume_id>/", delete_resume, name="delete_resume"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
