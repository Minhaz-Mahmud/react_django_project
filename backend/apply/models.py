from django.db import models
from registration.models import Candidate  # Ensure this is the correct import path
from company_registration.models import Company 
from job_post.models import JobPost # Replace `your_company_app` with the app name containing the Company model

class Apply(models.Model):  # Class name updated to Apply
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name="apply")
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="apply")
    job_id = models.IntegerField(null=True)
    job_title = models.CharField(max_length=255,null=True)
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Candidate {self.candidate.full_name} - Company {self.company.name} at {self.time}"

    class Meta:
        db_table = "apply"  # Set the database table name to 'apply'
