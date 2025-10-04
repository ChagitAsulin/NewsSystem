from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import health, routes_news

app = FastAPI(title="Gateway")

# CORS — לאפשר ל-Next.js על localhost:3000 לגשת
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="")
app.include_router(routes_news.router, prefix="/news", tags=["news"])
