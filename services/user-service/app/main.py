from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os

from app.api.auth import router as auth_router
from app.api.user import router as users_router

from app.database.mongodb import db


app = FastAPI(
    title="MLaaS User Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "service": "user-service",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    users_router,
    prefix="/users",
    tags=["Users"]
)