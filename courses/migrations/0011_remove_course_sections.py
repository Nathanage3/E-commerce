# Generated by Django 4.2.15 on 2024-10-16 10:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0010_remove_customer_role'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='sections',
        ),
    ]
