from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from resume_builder.views import (
    generate_cv,
    generate_cv2,
    generate_cv3,
    GetResumes,
    view_cv,
    get_resume_data,
    delete_resume,
)

urlpatterns = [
    path("generate-cv/", generate_cv, name="generate_cv"),
    path("generate-cv2/", generate_cv2, name="generate_cv2"),
    path("generate-cv3/", generate_cv3, name="generate_cv3"),
    path("candidate/get/resumes/", GetResumes.as_view(), name="get_resumes"),
    path("cv/<str:file_name>/", view_cv, name="view_cv"),
    path("delete_resume/<int:resume_id>/", delete_resume, name="delete_resume"),
    path("get-resume-data/<int:resume_id>/", get_resume_data, name="get_resume_data"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
