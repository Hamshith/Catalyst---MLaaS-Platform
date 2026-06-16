from app.core.config import settings
from pymongo import MongoClient

client = MongoClient(settings.MONGO_URI)

db = client[settings.MONGODB_DATABASE]