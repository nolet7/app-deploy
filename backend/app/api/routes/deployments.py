from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.api.routes.app_requests import get_app_request_by_id

router = APIRouter()

DEPLOYMENTS = []
NEXT_DEPLOYMENT_ID = 1


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

    matched_request = get_app_request_by_id(payload.request_id)
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
