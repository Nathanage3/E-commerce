# Generated by Django 4.2.15 on 2024-10-16 20:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0012_remove_lesson_course_section_lesson_section'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='duration',
            field=models.IntegerField(default=0),
        ),
    ]
