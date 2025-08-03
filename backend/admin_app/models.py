from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class adminLogin(models.Model):
    admin_email = models.CharField(max_length=100, default="ccadminme@gmail.com")
    admin_password = models.CharField(max_length=100, default="12345678")

    def __str__(self):
        return self.admin_email