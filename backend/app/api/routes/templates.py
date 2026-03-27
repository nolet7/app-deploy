from fastapi import APIRouter
from app.services.repo_service import load_all_templates

router = APIRouter()

@router.get("/api/templates")
def list_templates():
    return {"templates": load_all_templates()}