# Generated by Django 5.1.2 on 2024-11-14 19:47

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone_number', models.CharField(max_length=11, validators=[django.core.validators.MinLengthValidator(11)])),
                ('location', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('website', models.URLField(blank=True, max_length=255, null=True)),
                ('ceo_phone', models.CharField(max_length=11, validators=[django.core.validators.MinLengthValidator(11)])),
                ('company_type', models.CharField(choices=[('Multinational', 'Multinational'), ('International', 'International'), ('Startup', 'Startup'), ('Small Business', 'Small Business')], max_length=50)),
            ],
        ),
    ]
