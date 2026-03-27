from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.api.routes.templates import router as templates_router
from app.api.routes.app_requests import router as app_requests_router
from app.api.routes.deployments import router as deployments_router
from app.api.routes.prompt import router as prompt_router

app = FastAPI(title="app-deploy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api")
app.include_router(templates_router, prefix="/api")
app.include_router(app_requests_router, prefix="/api")
app.include_router(deployments_router, prefix="/api")
app.include_router(prompt_router, prefix="/api")
