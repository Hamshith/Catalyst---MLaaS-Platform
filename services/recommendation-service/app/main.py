from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os

from app.api.recommendations import router as recommendation_router


app = FastAPI(
    title="Recommendation Service"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    recommendation_router
)


@app.get("/")
def health_check():
    return {
        "message": "Recommendation Service Running"
    }