# Generated by Django 5.1.3 on 2024-11-25 16:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company_registration', '0004_rename_type_company_user_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='user_type',
            field=models.CharField(default='company', editable=False),
        ),
    ]
