from typing import List
from fastapi import APIRouter, Depends, HTTPException

from domain.models import Benefit
from services.benefit_service import BenefitService, get_benefit_service

router = APIRouter()


@router.get(
    "/beneficios",
    response_model=List[Benefit],
    summary="Получить список всех преимуществ",
    response_description="Список всех активных и неактивных преимуществ.",
)
async def list_benefits(
    service: BenefitService = Depends(get_benefit_service),
):
    """
    Получает полный список всех преимуществ, доступных в системе.
    """
    return await service.get_all()


@router.get(
    "/beneficios/{benefit_id}",
    response_model=Benefit,
    summary="Получить преимущество по ID",
    response_description="Детальная информация о конкретном преимуществе.",
)
async def get_benefit(
    benefit_id: int,
    service: BenefitService = Depends(get_benefit_service),
):
    """
    Получает детали конкретного преимущества по его уникальному идентификатору.
    \f
    :param benefit_id: ID преимущества для поиска.
    """
    benefit = await service.get_by_id(benefit_id)
    if benefit is None:
        raise HTTPException(status_code=404, detail="Benefit not found")
    return benefit