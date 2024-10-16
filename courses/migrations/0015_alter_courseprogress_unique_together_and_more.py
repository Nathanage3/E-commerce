# Generated by Django 4.2.15 on 2024-10-18 00:09

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('courses', '0014_alter_course_objectives'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='courseprogress',
            unique_together={('student', 'course')},
        ),
        migrations.RemoveField(
            model_name='courseprogress',
            name='lesson',
        ),
    ]
