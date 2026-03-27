from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "app-deploy"
    environment: str = "dev"


settings = Settings()
