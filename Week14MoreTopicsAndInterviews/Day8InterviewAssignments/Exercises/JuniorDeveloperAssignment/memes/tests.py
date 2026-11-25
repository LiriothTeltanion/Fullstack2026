"""API contract tests using Django's isolated test database."""
from django.db import IntegrityError, transaction
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from .models import Meme, MemeTemplate, Rating, User


class MemeApiTests(APITestCase):
    def setUp(self):
        sample_writer_phrase = "Demo-Maple-River-47"
        sample_reader_phrase = "Demo-Cedar-Cloud-52"
        self.user = User.objects.create_user(username="sample_writer", password=sample_writer_phrase)
        self.other = User.objects.create_user(username="sample_reader", password=sample_reader_phrase)
        self.template = MemeTemplate.objects.create(
            name="Two-line card",
            image_url="https://example.com/card.png",
            default_top_text="One more exercise",
            default_bottom_text="One more small win",
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def make_meme(self):
        return Meme.objects.create(
            template=self.template, created_by=self.user,
            top_text="A sample caption", bottom_text="A second caption",
        )

    def test_registration_hashes_password_and_token_authenticates(self):
        self.client.credentials()
        response = self.client.post("/api/auth/register/", {
            "username": "new_sample_writer", "password": "Demo-Silver-Garden-83",
        })
        self.assertEqual(response.status_code, 201)
        self.assertNotIn("password", response.data)
        user = User.objects.get(username="new_sample_writer")
        self.assertTrue(user.check_password("Demo-Silver-Garden-83"))
        response = self.client.post("/api/auth/token/", {
            "username": user.username, "password": "Demo-Silver-Garden-83",
        })
        self.assertEqual(response.status_code, 200)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + response.data["token"])
        self.assertEqual(self.client.get("/api/templates/").status_code, 200)

    def test_registration_rejects_weak_duplicate_and_bad_login(self):
        self.client.credentials()
        self.assertEqual(self.client.post("/api/auth/register/", {
            "username": "short_password", "password": "12",
        }).status_code, 400)
        self.assertEqual(self.client.post("/api/auth/register/", {
            "username": self.user.username, "password": "Demo-Silver-Garden-83",
        }).status_code, 400)
        self.assertEqual(self.client.post("/api/auth/token/", {
            "username": self.user.username, "password": "wrong",
        }).status_code, 400)

    def test_unauthenticated_requests_require_token(self):
        self.client.credentials()
        for endpoint in ["/api/templates/", "/api/memes/", "/api/memes/random/", "/api/memes/top/"]:
            with self.subTest(endpoint=endpoint):
                self.assertEqual(self.client.get(endpoint).status_code, 401)

    def test_template_list_pagination_and_retrieval(self):
        MemeTemplate.objects.bulk_create([
            MemeTemplate(name=f"Card {i}", image_url="https://example.com/card.png")
            for i in range(12)
        ])
        response = self.client.get("/api/templates/")
        self.assertEqual(response.data["count"], 13)
        self.assertEqual(len(response.data["results"]), 10)
        self.assertIsNotNone(response.data["next"])
        self.assertEqual(len(self.client.get("/api/templates/?page=2").data["results"]), 3)
        response = self.client.get(f"/api/templates/{self.template.id}/")
        self.assertEqual(response.data["name"], "Two-line card")

    def test_create_meme_uses_template_defaults_and_authenticated_author(self):
        response = self.client.post("/api/memes/", {
            "template": self.template.id, "top_text": " ", "created_by": self.other.id,
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["top_text"], self.template.default_top_text)
        self.assertEqual(response.data["bottom_text"], self.template.default_bottom_text)
        self.assertEqual(response.data["image_url"], self.template.image_url)
        self.assertEqual(response.data["created_by"], self.user.id)
        self.assertEqual(response.data["average_rating"], 0)
        self.assertEqual(Meme.objects.count(), 1)

    def test_create_meme_preserves_explicit_text_and_rejects_missing_template(self):
        response = self.client.post("/api/memes/", {
            "template": self.template.id, "top_text": " Original ", "bottom_text": " Caption ",
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["top_text"], "Original")
        self.assertEqual(response.data["bottom_text"], "Caption")
        self.assertEqual(self.client.post("/api/memes/", {"template": 999999}).status_code, 400)

    def test_memes_paginate_and_missing_meme_returns_404(self):
        for _ in range(12):
            self.make_meme()
        response = self.client.get("/api/memes/")
        self.assertEqual(response.data["count"], 12)
        self.assertEqual(len(response.data["results"]), 10)
        self.assertEqual(self.client.get("/api/memes/999999/").status_code, 404)

    def test_rating_is_updated_for_same_user_and_average_uses_all_users(self):
        meme = self.make_meme()
        endpoint = f"/api/memes/{meme.id}/rate/"
        self.assertEqual(self.client.post(endpoint, {"value": 2}).status_code, 201)
        response = self.client.post(endpoint, {"value": 5})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["updated"])
        self.assertEqual(Rating.objects.count(), 1)
        other_token = Token.objects.create(user=self.other)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {other_token.key}")
        self.assertEqual(self.client.post(endpoint, {"value": 1}).status_code, 201)
        response = self.client.get(f"/api/memes/{meme.id}/")
        self.assertEqual(response.data["rating_count"], 2)
        self.assertEqual(response.data["average_rating"], 3)

    def test_invalid_rating_values_leave_no_records(self):
        meme = self.make_meme()
        for value in [-1, 0, 6, 1.5, "word"]:
            with self.subTest(value=value):
                self.assertEqual(self.client.post(f"/api/memes/{meme.id}/rate/", {"value": value}).status_code, 400)
        self.assertEqual(Rating.objects.count(), 0)

    def test_database_enforces_one_rating_per_user_and_valid_range(self):
        meme = self.make_meme()
        Rating.objects.create(meme=meme, user=self.user, value=3)
        with self.assertRaises(IntegrityError), transaction.atomic():
            Rating.objects.create(meme=meme, user=self.user, value=4)
        with self.assertRaises(IntegrityError), transaction.atomic():
            Rating.objects.create(meme=meme, user=self.other, value=6)

    def test_random_empty_and_populated(self):
        self.assertEqual(self.client.get("/api/memes/random/").status_code, 404)
        meme = self.make_meme()
        response = self.client.get("/api/memes/random/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], meme.id)

    def test_top_ten_is_sorted_by_average(self):
        for i in range(12):
            meme = self.make_meme()
            Rating.objects.create(meme=meme, user=self.user, value=i % 5 + 1)
        response = self.client.get("/api/memes/top/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 10)
        scores = [item["average_rating"] for item in response.data]
        self.assertEqual(scores, sorted(scores, reverse=True))
