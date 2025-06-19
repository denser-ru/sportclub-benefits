from pydantic import BaseModel, Field, ConfigDict


class Benefit(BaseModel):
    """
    Represents a benefit provided by the sport club.
    """
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str = Field(..., description="Название преимущества.")
    descripcion: str = Field(..., description="Детальное описание преимущества.")
    descuento: int | None = Field(None, description="Процент скидки, если применимо.")
    activo: bool = Field(..., description="Статус активности преимущества.")