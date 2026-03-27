from fastapi import APIRouter, HTTPException
from app.schemas.application import ApplicationRequestCreate, ApplicationRequestResponse

router = APIRouter()

APP_REQUESTS = []
REQUEST_COUNTER = 1


@router.post("/app-requests", response_model=ApplicationRequestResponse)
def create_app_request(payload: ApplicationRequestCreate):
    global REQUEST_COUNTER

    new_request = {
        "id": REQUEST_COUNTER,
        "app_name": payload.app_name,
        "description": payload.description,
        "template_name": payload.template_name,
        "environment": payload.environment,
        "requires_database": payload.requires_database,
        "requires_cache": payload.requires_cache,
        "ingress_type": payload.ingress_type,
        "owner_team": payload.owner_team,
        "status": "PENDING"
    }

    APP_REQUESTS.append(new_request)
    REQUEST_COUNTER += 1
    return new_request


@router.get("/app-requests")
def list_app_requests():
    return {"items": APP_REQUESTS}


@router.get("/app-requests/{request_id}")
def get_app_request(request_id: int):
    for item in APP_REQUESTS:
        if item["id"] == request_id:
            return item
    raise HTTPException(status_code=404, detail="Request not found")
