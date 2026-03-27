from fastapi import APIRouter, HTTPException
from pathlib import Path
import json

from app.api.routes.app_requests import APP_REQUESTS
from app.services.repo_service import load_template_by_name
from app.services.bolt_prompt_builder import build_bolt_prompt

router = APIRouter()

GENERATED_ROOT = Path("/tmp/generated-apps")
GENERATED_ROOT.mkdir(parents=True, exist_ok=True)


@router.post("/app-requests/{request_id}/generate")
def generate_app(request_id: int):
    app_request = next((r for r in APP_REQUESTS if r["id"] == request_id), None)
    if not app_request:
        raise HTTPException(status_code=404, detail="Request not found")

    template = load_template_by_name(app_request["template_name"])
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    prompt = build_bolt_prompt(app_request, template)

    app_dir = GENERATED_ROOT / f"{app_request['app_name']}-{request_id}"
    app_dir.mkdir(parents=True, exist_ok=True)

    metadata = {
        "request_id": request_id,
        "app_name": app_request["app_name"],
        "template_name": app_request["template_name"],
        "environment": app_request["environment"],
        "status": "GENERATED",
        "prompt": prompt,
        "output_dir": str(app_dir),
    }

    with open(app_dir / "generation.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    with open(app_dir / "README.generated.md", "w", encoding="utf-8") as f:
        f.write(
            f"# Generated App Placeholder\n\n"
            f"App: {app_request['app_name']}\n\n"
            f"Template: {app_request['template_name']}\n\n"
            f"Request ID: {request_id}\n"
        )

    app_request["status"] = "GENERATED"

    return {
        "request_id": request_id,
        "status": "GENERATED",
        "app_name": app_request["app_name"],
        "template_name": app_request["template_name"],
        "output_dir": str(app_dir),
        "files": [
            "generation.json",
            "README.generated.md"
        ]
    }


@router.get("/app-requests/{request_id}/generation")
def get_generation(request_id: int):
    app_request = next((r for r in APP_REQUESTS if r["id"] == request_id), None)
    if not app_request:
        raise HTTPException(status_code=404, detail="Request not found")

    app_dir = GENERATED_ROOT / f"{app_request['app_name']}-{request_id}"
    metadata_file = app_dir / "generation.json"

    if not metadata_file.exists():
        raise HTTPException(status_code=404, detail="Generation not found")

    with open(metadata_file, "r", encoding="utf-8") as f:
        return json.load(f)
