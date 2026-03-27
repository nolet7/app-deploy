from fastapi import APIRouter

router = APIRouter()

@router.get("/deployments")
def list_deployments():
    return {"deployments": []}
