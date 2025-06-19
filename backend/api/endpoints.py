from typing import List
from fastapi import APIRouter, Depends, HTTPException

from domain.models import Benefit
from services.benefit_service import BenefitService, get_benefit_service

router = APIRouter()


@router.get(
    "/beneficios",
    response_model=List[Benefit],
    summary="Get a list of all benefits",
    response_description="A list of all active and inactive benefits.",
)
async def list_benefits(
    service: BenefitService = Depends(get_benefit_service),
):
    """
    Retrieves the complete list of all benefits available in the system.
    """
    return await service.get_all()


@router.get(
    "/beneficios/{benefit_id}",
    response_model=Benefit,
    summary="Get a benefit by ID",
    response_description="Detailed information about a specific benefit.",
)
async def get_benefit(
    benefit_id: int,
    service: BenefitService = Depends(get_benefit_service),
):
    """
    Retrieves the details of a specific benefit by its unique identifier.
    \f
    :param benefit_id: The ID of the benefit to search for.
    """
    benefit = await service.get_by_id(benefit_id)
    if benefit is None:
        raise HTTPException(status_code=404, detail="Benefit not found")
    return benefit