from django.db import models

class scrapeData(models.Model):
    location_Id = models.CharField(max_length=10)
    occupancy = models.IntegerField()
    data = models.JSONField()

class Report(models.Model):
    location_Id = models.CharField(max_length=10)
    crowd_Level = models.CharField(max_length=20)