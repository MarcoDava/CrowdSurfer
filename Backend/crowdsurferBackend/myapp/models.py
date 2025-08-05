# models.py
from django.db import models

class Report(models.Model):
    CROWD_CHOICES = [
        ('quiet', 'Quiet'),
        ('not_busy', 'Not Busy'),
        ('busy', 'Busy'),
        ('very_busy', 'Very Busy'),
    ]

    location_Id = models.CharField(max_length=10)  # Or use a ForeignKey if locations are in DB
    crowd_Level = models.CharField(max_length=20, choices=CROWD_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)

