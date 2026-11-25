from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Meme, MemeTemplate, Rating, User


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["id", "username", "password"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemeTemplate
        fields = ["id", "name", "image_url", "default_top_text", "default_bottom_text"]


class MemeSerializer(serializers.ModelSerializer):
    image_url = serializers.URLField(source="template.image_url", read_only=True)
    average_rating = serializers.FloatField(read_only=True, default=0)
    rating_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Meme
        fields = ["id", "template", "image_url", "created_by", "top_text", "bottom_text", "created_at", "average_rating", "rating_count"]
        read_only_fields = ["id", "created_by", "created_at"]

    def validate(self, attrs):
        template = attrs["template"]
        # Missing or blank text inherits the reusable template's defaults.
        attrs["top_text"] = attrs.get("top_text", "").strip() or template.default_top_text
        attrs["bottom_text"] = attrs.get("bottom_text", "").strip() or template.default_bottom_text
        return attrs


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ["value"]
