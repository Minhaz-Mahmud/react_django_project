from django.db import models
from registration.models import Candidate
from company_registration.models import Company
from job_post.models import JobPost


class Application_Mail(models.Model):
    job_post = models.ForeignKey(
        JobPost, on_delete=models.CASCADE, related_name="applications"
    )
    candidate = models.ForeignKey(
        Candidate, on_delete=models.CASCADE, related_name="applications"
    )
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="applications"
    )
    applicant_email = models.EmailField()
    mailed = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application by {self.candidate.name} for {self.job_post.title}"
