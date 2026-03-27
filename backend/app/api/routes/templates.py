from fastapi import APIRouter, HTTPException
from app.services.repo_service import load_all_templates, load_template_by_name

router = APIRouter()


@router.get("/templates")
def list_templates():
    return {"templates": load_all_templates()}


@router.get("/templates/{template_name}")
def get_template(template_name: str):
    template = load_template_by_name(template_name)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template
