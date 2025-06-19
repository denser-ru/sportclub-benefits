from typing import List, Optional
from fastapi import Depends

from clients.sportclub_client import SportclubClient, get_sportclub_client
from domain.models import Benefit


class BenefitService:
    def __init__(self, client: SportclubClient):
        self.client = client

    async def get_all(self) -> List[Benefit]:
        """Get all benefits by calling the client."""
        return await self.client.get_all_benefits()

    async def get_by_id(self, benefit_id: int) -> Optional[Benefit]:
        """Get a single benefit by ID by calling the client."""
        return await self.client.get_benefit_by_id(benefit_id)


def get_benefit_service(
    client: SportclubClient = Depends(get_sportclub_client),
) -> BenefitService:
    """Dependency provider for BenefitService."""
    return BenefitService(client)