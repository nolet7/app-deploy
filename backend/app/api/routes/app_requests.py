from fastapi import APIRouter, HTTPException
from app.schemas.application import ApplicationRequestCreate, ApplicationRequestResponse

router = APIRouter()

APP_REQUESTS = []
NEXT_REQUEST_ID = 1


def get_app_request_by_id(request_id: int):
    for item in APP_REQUESTS:
        if item["id"] == request_id:
            return item
    return None


@router.get("/app-requests")
def list_app_requests():
    return {"items": APP_REQUESTS}


@router.post("/app-requests", response_model=ApplicationRequestResponse)
def create_app_request(payload: ApplicationRequestCreate):
    global NEXT_REQUEST_ID

    ingress_value = getattr(payload, "ingress_type", None)
    if not ingress_value:
        ingress_value = getattr(payload, "ingress", "internal")

    item = {
        "id": NEXT_REQUEST_ID,
        "app_name": payload.app_name,
        "description": payload.description,
        "template_name": payload.template_name,
        "environment": payload.environment,
        "requires_database": payload.requires_database,
        "requires_cache": payload.requires_cache,
        "ingress_type": ingress_value,
        "owner_team": payload.owner_team,
        "status": "PENDING",
    }

    APP_REQUESTS.append(item)
    NEXT_REQUEST_ID += 1
    return item


@router.get("/app-requests/{request_id}")
def get_app_request(request_id: int):
    item = get_app_request_by_id(request_id)
    if not item:
        raise HTTPException(status_code=404, detail="App request not found")
    return item