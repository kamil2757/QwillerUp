from django.db import models

from Users.models import CustomUsers
from django.contrib.auth import get_user_model

User = get_user_model()


class Medals(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    img = models.URLField()
    equipped = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class UserMedals(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    medal = models.ForeignKey(Medals, on_delete=models.CASCADE)