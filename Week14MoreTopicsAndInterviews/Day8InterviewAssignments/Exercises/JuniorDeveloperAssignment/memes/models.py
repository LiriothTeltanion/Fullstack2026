"""Users, reusable templates, authored memes and one rating per user."""
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class User(AbstractUser):
    pass


class MemeTemplate(models.Model):
    name = models.CharField(max_length=120)
    image_url = models.URLField()
    default_top_text = models.CharField(max_length=200, blank=True)
    default_bottom_text = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name


class Meme(models.Model):
    template = models.ForeignKey(MemeTemplate, on_delete=models.PROTECT, related_name="memes")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="memes")
    top_text = models.CharField(max_length=200, blank=True)
    bottom_text = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]


class Rating(models.Model):
    meme = models.ForeignKey(Meme, on_delete=models.CASCADE, related_name="ratings")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ratings")
    value = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["meme", "user"], name="one_rating_per_user_and_meme"),
            models.CheckConstraint(condition=models.Q(value__gte=1, value__lte=5), name="rating_between_one_and_five"),
        ]
