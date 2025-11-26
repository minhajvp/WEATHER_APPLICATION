from django.db import models

# Create your models here.

class Weather(models.Model):
    city = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    temprature = models.FloatField(null=True,blank=True)
    windspeed = models.FloatField(null=True,blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.city} fetched at {self.created_at}"