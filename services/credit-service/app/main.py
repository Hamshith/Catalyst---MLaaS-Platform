from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api.credit_routes import (
    router as credit_router
)


app = FastAPI(
    title="Credit Service",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    credit_router
)


@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "credit-service"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }