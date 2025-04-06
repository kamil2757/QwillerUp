from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class Level(models.Model):
    level = models.IntegerField()
    experience_required = models.IntegerField()
    reward = models.CharField(default='ice')

    def __str__(self):
        return self.level


class CustomUsers(AbstractUser):
    username = models.CharField(
        _("username"),
        max_length=18,
        unique=True,
        help_text=_(
            "Required. 18 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=AbstractUser.username.field.validators,
        error_messages=AbstractUser.username.field.error_messages,
    )
    photo = models.ImageField(upload_to='avatars/', null=True, blank=True)
    description = models.CharField(default="У тебя пока нет описания, но ты можешь добавить его в настройках",
                                   max_length=128)
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