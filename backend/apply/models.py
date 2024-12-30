from django.db import models
from registration.models import Candidate
from company_registration.models import Company


class Apply(models.Model):
    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.CASCADE,
        related_name="apply",
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="apply",
    )
    job_id = models.IntegerField(null=True)
    job_title = models.CharField(
        max_length=255,
        null=True,
    )
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Candidate {self.candidate.full_name} - Company {self.company.name} at {self.time}"

    class Meta:
        db_table = "apply"
