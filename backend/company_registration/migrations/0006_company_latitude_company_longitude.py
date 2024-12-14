# Generated by Django 5.1.2 on 2024-12-14 14:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company_registration', '0005_alter_company_user_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='latitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='company',
            name='longitude',
            field=models.FloatField(blank=True, null=True),
        ),
    ]