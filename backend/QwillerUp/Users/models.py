from django.contrib.auth.models import AbstractUser
from django.db import models


class Level(models.Model):
    level = models.IntegerField()
    experience_required = models.IntegerField()
    reward = models.CharField(default='ice')

    def __str__(self):
        return self.level


class CustomUsers(AbstractUser):
    photo = models.ImageField(upload_to='avatars/', null=True, blank=True)
    description = models.TextField(blank=True)
    experience = models.IntegerField(default=0)
    ice_count = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    schedule_type = models.IntegerField(blank=True, null=True)
    level = models.IntegerField(default=0)
    last_active_date = models.DateField(null=True)
    # level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.username

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']


class Medals(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    img = models.URLField()

    def __str__(self):
        return self.title


class UserMedals(models.Model):
    user = models.ForeignKey(CustomUsers, on_delete=models.CASCADE)
    medal = models.ForeignKey(Medals, on_delete=models.CASCADE)
    equipped = models.BooleanField(default=False)