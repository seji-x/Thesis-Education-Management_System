# Generated by Django 4.2.7 on 2024-11-10 06:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0024_usersubjectscore_average_score_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='classsubject',
            name='year',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
