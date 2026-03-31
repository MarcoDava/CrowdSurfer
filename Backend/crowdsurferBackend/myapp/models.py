from django.db import models


class scrapeData(models.Model):
    """Occupancy readings scraped from the McMaster Library website."""
    location_Id = models.CharField(max_length=50)
    occupancy = models.IntegerField()  # 0–100
    scraped_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-scraped_at']


class Report(models.Model):
    """Crowd-level report submitted by a user."""
    CROWD_LEVELS = [
        ('quiet', 'Quiet'),
        ('not_busy', 'Not Busy'),
        ('busy', 'Busy'),
        ('very_busy', 'Very Busy'),
        ('full', 'Full'),
    ]
    location_Id = models.CharField(max_length=50)
    user_Id = models.CharField(max_length=100, default='anonymous')
    crowd_Level = models.CharField(max_length=20, choices=CROWD_LEVELS)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class keyLocation(models.Model):
    """
    A tracked building/study-space.
    Occupancy is recomputed by ReportAlgorithm and cached here.
    """
    location_Id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100, default='')
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)
    # Tuning knobs for the proximity algorithm
    radius_meters = models.IntegerField(default=100)   # how close a user must be to count
    capacity = models.IntegerField(default=500)        # expected maximum occupancy
    # Cached computed value (0–100)
    occupancy = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']


class userLocation(models.Model):
    """
    Current GPS position of an active user.
    One row per user_Id — updated in place on every check-in.
    """
    user_Id = models.CharField(max_length=100, unique=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)
