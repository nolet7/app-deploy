from pydantic import BaseModel
from typing import Optional


class DeploymentCreate(BaseModel):
    request_id: int
    environment: str = "dev"
    status: str = "DEPLOYED"
    namespace: str
    image_tag: str = "v1.0.0"


class DeploymentResponse(BaseModel):
    id: int
    request_id: int
    app_name: str
    environment: str
    status: str
    namespace: str
    image_tag: str
