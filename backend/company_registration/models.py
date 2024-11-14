from django.db import models
from django.core.validators import MinLengthValidator

# from .validators import unique_email_validator

class Company(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(
        max_length=11,
        validators=[
            MinLengthValidator(11),
            # unique_email_validator,
        ],
    )
    location = models.CharField(max_length=255)
    description = models.TextField()
    website = models.URLField(max_length=255, blank=True, null=True)
    ceo_phone = models.CharField(
        max_length=11,
        validators=[
            MinLengthValidator(11),
        ],
    )
    company_type = models.CharField(
        max_length=50,
        choices=[
            ("Multinational", "Multinational"),
            ("International", "International"),
            ("Startup", "Startup"),
            ("Small Business", "Small Business"),
        ],
    )

    def __str__(self):
        return self.name


# class JobPost(models.Model):
#     company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='job_posts')
#     job_title = models.CharField(max_length=255)
#     job_description = models.TextField()
#     salary_range = models.CharField(max_length=100)
#     job_type = models.CharField(max_length=50, choices=[
#         ('Remote', 'Remote'),
#         ('Hybrid', 'Hybrid'),
#         ('Onsite', 'Onsite'),
#     ])
#     required_skills = models.TextField(help_text="Comma-separated list of required skills")
#     posted_at = models.DateTimeField(auto_now_add=True)
#     application_deadline = models.DateField()

#     def __str__(self):
#         return f"{self.job_title} at {self.company.name}"


# class JobApplication(models.Model):
#     candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
#     job_post = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name='applications')
#     applied_at = models.DateTimeField(auto_now_add=True)
#     cover_letter = models.TextField(null=True, blank=True)
#     resume = models.FileField(upload_to='applications/', null=True, blank=True)

#     def __str__(self):
#         return f"Application for {self.job_post.job_title} by {self.candidate.user.username}"
