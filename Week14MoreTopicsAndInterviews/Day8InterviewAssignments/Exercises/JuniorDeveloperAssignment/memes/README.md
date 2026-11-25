# Meme API application

- models.py defines User, MemeTemplate, Meme and Rating.
- serializers.py validates public request data and applies template defaults.
- views.py exposes registration, templates, memes and ratings.
- pagination.py bounds list sizes.
- tests.py checks the API with Django's test database.
- migrations contains the versioned database schema.
