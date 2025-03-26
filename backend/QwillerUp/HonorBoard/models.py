from django.db import models
from django.utils.timezone import now


class HonorBoard(models.Model):
    date = models.DateField(default=now, unique=True)
    entries = models.JSONField()

