from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.core.validators import MinLengthValidator


class Candidate(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]
    
    # Basic Information
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(
        max_length=11,
        validators=[
            MinLengthValidator(11),
        ],
    )
    location = models.CharField(max_length=255)
    
    # Personal Details
    dob = models.DateField(null=True, blank=True, verbose_name="Date of Birth")
    gender = models.CharField(
        max_length=1, 
        choices=GENDER_CHOICES, 
        null=True, 
        blank=True
    )
    religion = models.CharField(max_length=100, null=True, blank=True)
    
    # Education
    high_school_name = models.CharField(max_length=255, null=True, blank=True, verbose_name="High School Name")
    high_school_degree = models.CharField(max_length=255, null=True, blank=True, verbose_name="High School Certificate/Degree")
    high_school_passing_year = models.PositiveIntegerField(null=True, blank=True, verbose_name="High School Passing Year")
    high_school_grade = models.CharField(max_length=50, null=True, blank=True, verbose_name="High School Grade")
    
    university_name = models.CharField(max_length=255, null=True, blank=True, verbose_name="University Name")
    university_degree = models.CharField(max_length=255, null=True, blank=True, verbose_name="University Certificate/Degree")
    university_passing_year = models.PositiveIntegerField(null=True, blank=True, verbose_name="University Passing Year")
    university_grade = models.CharField(max_length=50, null=True, blank=True, verbose_name="University Grade")
    
    # Professional
    professional_experience = models.TextField(null=True, blank=True, help_text="Describe your professional experience")
    skills = models.TextField(help_text="Comma-separated list of skills")
    
    # Files
    resume = models.FileField(upload_to="resumes/", null=True, blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", null=True, blank=True
    )
    
    # Authentication
    password = models.CharField(max_length=128, null=True, blank=True)

    def __str__(self):
        return self.full_name

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()