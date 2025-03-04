from django.db import models
from company_registration.models import Company


class JobPost(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="job_posts",
    )
    title = models.CharField(max_length=255)
    job_location = models.CharField(max_length=255, null=True, blank=True)
    tags = models.CharField(
        max_length=255,
        help_text="Comma-separated tags (max 6)",
    )
    job_type = models.CharField(
        max_length=20,
        choices=[
            ("Remote", "Remote"),
            ("Hybrid", "Hybrid"),
            ("Onsite", "Onsite"),
        ],
    )
    salary_range = models.CharField(max_length=50)
    job_time = models.CharField(max_length=50, default="9am-5pm")
    description = models.TextField()
    active_recruiting = models.BooleanField(default=True)
    posted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} at {self.company.name}"
