from django.db import models

class scrapeData(models.Model):
    location_Id = models.CharField(max_length=10)
    occupancy = models.IntegerField()

class Report(models.Model):
    location_Id = models.CharField(max_length=10)
    crowd_Level = models.CharField(max_length=20)

class updateKeyLocation(models.Model):
    location_Id = models.CharField(max_length=10)
    occupancy = models.CharField(max_length=20)

class updateUserLocation(models.Model):
    user_Id = models.CharField(max_length=10)
    latitude = models.FloatField()
    longitude = models.FloatField()
    
