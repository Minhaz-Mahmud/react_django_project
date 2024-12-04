# Generated by Django 5.1.2 on 2024-11-26 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('registration', '0002_alter_candidate_phone_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidate',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to='media/profile_pictures/'),
        ),
        migrations.AlterField(
            model_name='candidate',
            name='resume',
            field=models.FileField(blank=True, null=True, upload_to='media/resumes/'),
        ),
    ]