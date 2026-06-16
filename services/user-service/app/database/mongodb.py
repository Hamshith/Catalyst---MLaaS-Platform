from dotenv import load_dotenv
from pymongo import MongoClient
import os


load_dotenv()


client = MongoClient(
    os.getenv("MONGO_URI")
)


db = client[
    os.getenv("MONGODB_DATABASE")
]


users_collection = db["users"]

registration_otps_collection = db[
    "registration_otps"
]

password_reset_otps_collection = db[
    "password_reset_otps"
]

refresh_tokens_collection = db[
    "refresh_tokens"
]


registration_otps_collection.create_index(
    "expires_at",
    expireAfterSeconds=0
)

password_reset_otps_collection.create_index(
    "expires_at",
    expireAfterSeconds=0
)

refresh_tokens_collection.create_index(
    "expires_at",
    expireAfterSeconds=0
)