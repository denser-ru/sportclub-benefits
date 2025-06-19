from pydantic import BaseModel, Field, ConfigDict


class Benefit(BaseModel):
    """
    Represents a benefit provided by the sport club.
    """
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str = Field(..., description="Name of the benefit.")
    descripcion: str = Field(..., description="Detailed description of the benefit.")
    descuento: int | None = Field(None, description="Discount percentage, if applicable.")
    activo: bool = Field(..., description="Activation status of the benefit.")