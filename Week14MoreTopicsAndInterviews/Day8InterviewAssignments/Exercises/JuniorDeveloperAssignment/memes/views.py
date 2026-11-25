import random
from django.db.models import Avg, Count, Value
from django.db.models.functions import Coalesce
from rest_framework import generics, mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Meme, MemeTemplate, Rating
from .serializers import MemeSerializer, RatingSerializer, RegistrationSerializer, TemplateSerializer


class RegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegistrationSerializer


class TemplateViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = MemeTemplate.objects.all()
    serializer_class = TemplateSerializer


class MemeViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = MemeSerializer

    def get_queryset(self):
        return Meme.objects.select_related("template", "created_by").annotate(
            average_rating=Coalesce(Avg("ratings__value"), Value(0.0)),
            rating_count=Count("ratings"),
        ).order_by("-created_at", "-id")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=["get"], url_path="random")
    def random_meme(self, request):
        queryset = self.get_queryset()
        count = queryset.count()
        if count == 0:
            return Response({"detail": "There are no memes yet."}, status=status.HTTP_404_NOT_FOUND)
        meme = queryset.order_by("id")[random.randrange(count)]
        return Response(self.get_serializer(meme).data)

    @action(detail=False, methods=["get"], url_path="top")
    def top(self, request):
        memes = self.get_queryset().order_by("-average_rating", "-rating_count", "id")[:10]
        return Response(self.get_serializer(memes, many=True).data)

    @action(detail=True, methods=["post"], url_path="rate")
    def rate(self, request, pk=None):
        meme = self.get_object()
        serializer = RatingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        rating, created = Rating.objects.update_or_create(
            meme=meme,
            user=request.user,
            defaults={"value": serializer.validated_data["value"]},
        )
        return Response(
            {"meme": meme.pk, "value": rating.value, "updated": not created},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
