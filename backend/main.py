import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api import endpoints
from clients.sportclub_client import SportclubAPIError
from core.config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Tech Challenge API", description="API for managing sport club benefits.", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(SportclubAPIError)
async def sportclub_api_exception_handler(request: Request, exc: SportclubAPIError):
    """
    Handles the expected unavailability of the external API gracefully.
    It logs a clean warning and returns a 503 response to the client.
    """
    logger.warning(f"Handled a predictable external API failure. Reason: {exc}")
    return JSONResponse(
        status_code=503,
        content={"detail": "The external benefits service is currently unavailable."},
    )

app.include_router(endpoints.router, prefix="/api/v1", tags=["Benefits"])

@app.get("/health", tags=["Monitoring"])
def health_check():
    return {"status": "ok"}