from django.db import models
from django.core.validators import MinLengthValidator
from django.contrib.auth.hashers import make_password


class Company(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(
        max_length=11,
        validators=[MinLengthValidator(11)],
    )
    location = models.CharField(max_length=255)
    description = models.TextField()
    website = models.URLField(max_length=255, blank=True, null=True)
    ceo_phone = models.CharField(
        max_length=11,
        validators=[MinLengthValidator(11)],
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
    password = models.CharField(max_length=255)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()

    def __str__(self):
        return self.name
