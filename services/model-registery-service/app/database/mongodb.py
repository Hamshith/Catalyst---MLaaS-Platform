from pymongo import MongoClient

from app.core.config import (
    settings
)


client = MongoClient(
    settings.MONGODB_URI
)

database = client[
    settings.MONGODB_DATABASE
]

models_collection = database[
    "models"
]