# Generated by Django 4.2.15 on 2024-10-18 15:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0015_alter_courseprogress_unique_together_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='instructorearnings',
            name='deduction_percentage',
            field=models.DecimalField(decimal_places=2, default=50, max_digits=5),
        ),
    ]