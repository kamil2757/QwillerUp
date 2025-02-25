from django.contrib.auth.models import AbstractUser
from django.db import models



class CustomUsers(AbstractUser):
    photo = models.URLField(blank=True)
    description = models.TextField(blank=True)
    experience = models.IntegerField(default=0)
    ice_count = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    schedule_type = models.IntegerField(blank=True, null=True)
    level = models.IntegerField(default=0)

    def __str__(self):
        return self.username

