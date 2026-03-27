from fastapi import APIRouter

router = APIRouter()

@router.get("/api/healthz")
def healthz():
    return {"status": "ok", "service": "app-deploy-backend"}