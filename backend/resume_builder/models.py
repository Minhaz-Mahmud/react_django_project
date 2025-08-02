from django.db import models
from registration.models import Candidate

class CandidateCV(models.Model):
    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.CASCADE,
        related_name="candidate_cv",
        null=True,
    )
    email = models.EmailField()
    name = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    dob = models.CharField(max_length=50, blank=True)
    address = models.TextField(blank=True)
    religion = models.CharField(max_length=50, blank=True)
    skillset = models.JSONField(default=list, blank=True)
    education = models.JSONField(default=dict, blank=True)
    experience = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    template_number = models.CharField(max_length=100, blank=True)
    cv_file = models.FileField(upload_to="gen_cv/", null=True, blank=True)
    thumbnail = models.ImageField(upload_to="thumbnails/", null=True, blank=True)

    def __str__(self):
        return f"Resume {self.id} - {self.candidate}"