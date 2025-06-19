import httpx
import logging
from typing import List, Optional
from collections.abc import AsyncGenerator
from fastapi import Depends

from core.config import settings
from domain.models import Benefit

logger = logging.getLogger(__name__)

class SportclubAPIError(Exception):
    pass

class SportclubClient:
    def __init__(self, client: httpx.AsyncClient, base_url: str):
        self._client = client
        self._base_url = base_url

    async def get_all_benefits(self) -> List[Benefit]:
        url = f"{self._base_url}/beneficios"
        logger.info(f"Requesting all benefits from: {url}")
        try:
            response = await self._client.get(url, timeout=5.0) # Добавим таймаут для предсказуемости
            response.raise_for_status()
            return [Benefit.model_validate(item) for item in response.json()]
        except httpx.RequestError as e:
            # ИСПРАВЛЕНО: Четкое описание ошибки и уровень WARNING
            error_details = f"{e.__class__.__name__}: {e}"
            logger.warning(f"Request to '{url}' failed. Details: {error_details}")
            raise SportclubAPIError(f"Could not connect to external API. Reason: {error_details}") from e
        except httpx.HTTPStatusError as e:
            logger.warning(f"API at '{url}' returned an error status: {e.response.status_code}")
            raise SportclubAPIError(f"External API returned status {e.response.status_code}") from e

    async def get_benefit_by_id(self, benefit_id: int) -> Optional[Benefit]:
        url = f"{self._base_url}/beneficios/{benefit_id}"
        logger.info(f"Requesting benefit by ID from: {url}")
        try:
            response = await self._client.get(url, timeout=5.0)
            if response.status_code == 404:
                return None
            response.raise_for_status()
            return Benefit.model_validate(response.json())
        except httpx.RequestError as e:
            error_details = f"{e.__class__.__name__}: {e}"
            logger.warning(f"Request to '{url}' failed. Details: {error_details}")
            raise SportclubAPIError(f"Could not connect to external API. Reason: {error_details}") from e
        except httpx.HTTPStatusError as e:
            logger.warning(f"API at '{url}' returned an error status: {e.response.status_code}")
            raise SportclubAPIError(f"External API returned status {e.response.status_code}") from e


async def get_sportclub_client() -> AsyncGenerator[SportclubClient, None]:
    async with httpx.AsyncClient() as client:
        yield SportclubClient(client=client, base_url=settings.sportclub_api_base_url)