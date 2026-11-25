from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter
from memes.views import MemeViewSet, RegistrationView, TemplateViewSet

router = DefaultRouter()
router.register("templates", TemplateViewSet, basename="template")
router.register("memes", MemeViewSet, basename="meme")
urlpatterns = [
    path("api/auth/register/", RegistrationView.as_view(), name="register"),
    path("api/auth/token/", obtain_auth_token, name="token"),
    path("api/", include(router.urls)),
]
