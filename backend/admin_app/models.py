from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class adminLogin(models.Model):
    admin_email = models.CharField(max_length=100, default="ccadminme@gmail.com")
    admin_password = models.CharField(max_length=100, default="12345678")

    def __str__(self):
        return self.admin_email
    

class AdminLeaderShipModel(models.Model):
    image = models.ImageField(
        upload_to="leadership_profile_picture/", null=True, blank=True
    )
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=50, null=True, blank=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "LeaderShips"

class AdminFaqModel(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "FAQs"