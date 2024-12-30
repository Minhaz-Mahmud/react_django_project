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
    created_at = models.DateTimeField(auto_now_add=True)
    cv_file = models.FileField(upload_to="gen_cv/", null=True, blank=True)
    thumbnail = models.ImageField(upload_to="thumbnails/", null=True, blank=True)

    def __str__(self):
        return f"Resume {self.id} - {self.candidate}"
