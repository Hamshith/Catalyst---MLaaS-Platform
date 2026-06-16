from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os

from app.api.model_routes import (
    router as model_router
)


app = FastAPI(
    title="Model Registry Service",
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
    model_router
)


@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "model-registry-service"
    }