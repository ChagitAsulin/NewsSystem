from fastapi import FastAPI
from app.api.routes_news import router as news_router
from app.api.routes_notifications import router as notifications_router

app = FastAPI(title="NewsSystem Gateway")

app.include_router(news_router)
app.include_router(notifications_router)

@app.get("/health")
def health():
    return {"status": "ok"}
