from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

DEPLOYMENTS = []
NEXT_DEPLOYMENT_ID = 1

try:
    from app.api.routes.app_requests import APP_REQUESTS
except Exception:
    APP_REQUESTS = []


class DeploymentCreate(BaseModel):
    request_id: int
    environment: str = "dev"
    status: str = "DEPLOYED"
    namespace: str
    image_tag: str = "v1.0.0"


@router.get("/api/deployments")
def list_deployments():
    return {"items": DEPLOYMENTS}


@router.post("/api/deployments")
def create_deployment(payload: DeploymentCreate):
    global NEXT_DEPLOYMENT_ID

    matched_request = None
    for item in APP_REQUESTS:
        if item.get("id") == payload.request_id:
            matched_request = item
            break

    if not matched_request:
        raise HTTPException(status_code=404, detail="App request not found")

    deployment = {
        "id": NEXT_DEPLOYMENT_ID,
        "request_id": payload.request_id,
        "app_name": matched_request["app_name"],
        "environment": payload.environment,
        "status": payload.status,
        "namespace": payload.namespace,
        "image_tag": payload.image_tag,
    }

    DEPLOYMENTS.append(deployment)
    NEXT_DEPLOYMENT_ID += 1
    return deployment
