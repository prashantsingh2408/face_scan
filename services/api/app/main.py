from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from app.config import settings
from app.routers import chat, health, recommendations, scan


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield


app = FastAPI(title="Face scan API", version="0.1.0", lifespan=lifespan)

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(scan.router, prefix="/v1", tags=["scan"])
app.include_router(recommendations.router, prefix="/v1", tags=["recommendations"])
app.include_router(chat.router, prefix="/v1", tags=["chat"])
