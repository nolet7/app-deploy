from fastapi import APIRouter, HTTPException
from app.api.routes.app_requests import APP_REQUESTS
from app.services.repo_service import load_template_by_name
from app.services.bolt_prompt_builder import build_bolt_prompt

router = APIRouter()


@router.get("/app-requests/{request_id}/prompt")
def generate_prompt(request_id: int):
    app_request = None

    for item in APP_REQUESTS:
        if item["id"] == request_id:
            app_request = item
            break

    if not app_request:
        raise HTTPException(status_code=404, detail="Request not found")

    template = load_template_by_name(app_request["template_name"])
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    prompt = build_bolt_prompt(app_request, template)

    return {
        "request_id": request_id,
        "template_name": app_request["template_name"],
        "prompt": prompt
    }