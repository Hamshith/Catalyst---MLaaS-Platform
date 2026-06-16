from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os

from app.api.datasets import router as datasets_router
from app.api.requests import router as requests_router


app = FastAPI(
    title="Dataset Service"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(datasets_router)
app.include_router(requests_router)