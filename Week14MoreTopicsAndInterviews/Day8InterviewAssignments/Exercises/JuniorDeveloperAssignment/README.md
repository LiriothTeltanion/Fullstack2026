# 🧩 Junior Developer Assignment - Meme API

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

A Django REST Framework API with PostgreSQL, token authentication, reusable meme templates, authored memes and user ratings.

## ▶️ How to run

Use Python 3.12 or newer and PostgreSQL. Copy `.env.example` to `.env`, replace the local password and secret key, then run:

```bash
docker compose up --build
```

Compose reads `.env`, starts PostgreSQL, applies migrations and starts the local API at `http://127.0.0.1:8000/api/`. The database uses a named Docker volume. The development server and debug mode are for local practice.

Without Docker, install `requirements.txt`, export the variables from `.env.example` in the terminal, then run `python manage.py migrate` and `python manage.py runserver`. The local Python process reads environment variables directly.

## API

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register/` | Username and password, stored with Django password hashing |
| POST | `/api/auth/token/` | Exchange username and password for a token |
| GET / POST | `/api/templates/` | Paginated templates or create a template |
| GET | `/api/templates/{id}/` | Retrieve a template |
| GET / POST | `/api/memes/` | Paginated memes or create using a template |
| GET | `/api/memes/{id}/` | Retrieve a meme and its rating statistics |
| POST | `/api/memes/{id}/rate/` | Set `value` from 1 to 5 for the current user |
| GET | `/api/memes/random/` | Retrieve a random meme, or 404 for an empty collection |
| GET | `/api/memes/top/` | At most ten memes ordered by rating average |

Send `Authorization: Token YOUR_LOCAL_TOKEN` on the protected endpoints. Registration and token creation are public. Django REST Framework's token scheme requires HTTPS for a deployment that carries real credentials.

Lists use ten results per page. `?page=2` selects another page and `?page_size=20` changes its size up to 100.

## Data and defaults

- `User` extends Django's user model.
- `MemeTemplate` stores name, image URL and default top/bottom text.
- `Meme` belongs to the authenticated author and template. Missing or blank captions inherit template defaults at creation time.
- `Rating` has database constraints for one rating per user/meme and an integer value from 1 to 5. Rating again updates that user's existing record.
- Meme responses include the image URL, average rating and rating count. Unrated memes have average zero.
- Templates can be created through the API. The app starts with an empty collection.

## Tests

```bash
python manage.py test
python manage.py makemigrations --check --dry-run
```

These commands use the configured PostgreSQL database and Django's isolated test database. For an explicit SQLite smoke test, set `MEMES_USE_SQLITE=1` before the same commands. PostgreSQL remains the normal configuration.

The tests cover registration, hashing, token access, pagination, defaults, ownership, rating changes, range and uniqueness constraints, random selection and top-ten ordering.

Created 2026-11-25, Asia/Jerusalem.

[DRF token authentication](https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication) · [Django database constraints](https://docs.djangoproject.com/en/5.2/ref/models/constraints/)

## Verification on 2026-11-25

Twelve API tests passed using an isolated SQLite test database selected explicitly with MEMES_USE_SQLITE=1. Django system checks passed, and makemigrations --check --dry-run reported no schema changes. PostgreSQL and Docker runtime verification are pending on a host with those services available.
