# Generated by Django 4.2.15 on 2024-11-07 16:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0002_rename_ratingcount_course_rating_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='average_rating',
            field=models.FloatField(blank=True, default=0.0),
        ),
    ]
