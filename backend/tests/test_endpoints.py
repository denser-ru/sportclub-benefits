import pytest
from fastapi.testclient import TestClient

from main import app
from services.benefit_service import get_benefit_service
from clients.sportclub_client import SportclubAPIError
from domain.models import Benefit

# --- Mock Data ---
SAMPLE_BENEFITS_LIST = [
    Benefit(id=1, nombre="Benefit 1", descripcion="Desc 1", activo=True),
    Benefit(id=2, nombre="Benefit 2", descripcion="Desc 2", activo=False),
]
SAMPLE_BENEFIT_SINGLE = Benefit(
    id=1, nombre="Benefit 1", descripcion="Desc 1", activo=True
)

# --- Mock Services ---
class MockSuccessBenefitService:
    async def get_all(self):
        return SAMPLE_BENEFITS_LIST

    async def get_by_id(self, benefit_id: int):
        if benefit_id == 1:
            return SAMPLE_BENEFIT_SINGLE
        return None

class MockErrorBenefitService:
    async def get_all(self):
        raise SportclubAPIError("External API is down")

    async def get_by_id(self, benefit_id: int):
        raise SportclubAPIError("External API is down")


client = TestClient(app)

# --- Tests ---
def test_get_all_benefits_success():
    app.dependency_overrides[get_benefit_service] = MockSuccessBenefitService
    response = client.get("/api/v1/beneficios")
    assert response.status_code == 200
    # Сравниваем JSON, т.к. клиент получает именно его
    assert response.json() == [b.model_dump() for b in SAMPLE_BENEFITS_LIST]
    app.dependency_overrides.clear()

def test_get_benefit_by_id_success():
    app.dependency_overrides[get_benefit_service] = MockSuccessBenefitService
    response = client.get("/api/v1/beneficios/1")
    assert response.status_code == 200
    assert response.json() == SAMPLE_BENEFIT_SINGLE.model_dump()
    app.dependency_overrides.clear()

def test_get_benefit_by_id_not_found():
    app.dependency_overrides[get_benefit_service] = MockSuccessBenefitService
    response = client.get("/api/v1/beneficios/999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Benefit not found"}
    app.dependency_overrides.clear()

def test_get_all_benefits_api_error():
    """
    Tests the 503 Service Unavailable response when the external API fails.
    """
    app.dependency_overrides[get_benefit_service] = MockErrorBenefitService
    response = client.get("/api/v1/beneficios")
    assert response.status_code == 503
    assert response.json() == {
        "detail": "The external benefits service is currently unavailable."
    }
    app.dependency_overrides.clear()