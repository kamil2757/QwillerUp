from tkinter.constants import CASCADE

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class GoalsTemplate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    day_of_week = models.IntegerField()


class TasksTemplate(models.Model):
    goal = models.ForeignKey(GoalsTemplate, on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    planned_time = models.IntegerField()

    def __str__(self):
        return self.title


class GoalsTemplateActive(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)


class TasksTemplateActive(models.Model):
    goal = models.ForeignKey(GoalsTemplateActive, on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    spent_time = models.IntegerField(default=0)
    planned_time = models.IntegerField()

    def __str__(self):
        return self.title

