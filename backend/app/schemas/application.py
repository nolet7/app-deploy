from pydantic import BaseModel, Field
from typing import Optional


class ApplicationRequestCreate(BaseModel):
    app_name: str
    description: str
    template_name: str
    environment: str = "dev"
    requires_database: bool = False
    requires_cache: bool = False
    ingress_type: str = Field(default="internal", alias="ingress")
    owner_team: str = "platform"

    class Config:
        populate_by_name = True


class ApplicationRequestResponse(BaseModel):
    id: int
    app_name: str
    description: str
    template_name: str
    environment: str
    requires_database: bool
    requires_cache: bool
    ingress_type: str
    owner_team: str
    status: str