# Generated by Django 4.2.16 on 2024-12-04 00:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0007_section_default'),
    ]

    operations = [
        migrations.CreateModel(
            name='Description',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
            ],
        ),
    ]