# Generated by Django 4.2.15 on 2024-10-15 11:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0008_course_numberofstudents'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='objectives',
            field=models.JSONField(blank=True, default=list),
        ),
    ]