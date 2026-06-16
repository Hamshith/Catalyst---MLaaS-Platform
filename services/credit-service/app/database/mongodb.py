from app.core.config import settings
from pymongo import MongoClient

client = MongoClient(
    settings.MONGODB_URI
)


db = client[settings.MONGODB_DATABASE]

users_collection = db["users"]
credit_transactions_collection = db["credit_transactions"]