from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Manages application settings loaded from environment variables.
    """
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    sportclub_api_base_url: str = "https://api-beneficios.dev.sportclub.com.ar/api"
    
    # НОВАЯ ПЕРЕМЕННАЯ: по умолчанию INFO (для прода)
    log_level: str = "INFO"


settings = Settings()