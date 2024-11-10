from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class Candidate(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    location = models.CharField(max_length=255)
    skills = models.TextField(help_text="Comma-separated list of skills")
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    password = models.CharField(max_length=128, null=True, blank=True) 

    def __str__(self):
        return self.full_name

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()
