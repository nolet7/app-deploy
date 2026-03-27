from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.api.routes.templates import router as templates_router
from app.api.routes.app_requests import router as app_requests_router
from app.api.routes.deployments import router as deployments_router
from app.api.routes.prompt import router as prompt_router
from app.api.routes.generation import router as generation_router

app = FastAPI(
    title="app-deploy API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(templates_router)
app.include_router(app_requests_router)
app.include_router(deployments_router)
app.include_router(prompt_router)
app.include_router(generation_router)
