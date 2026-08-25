from pydantic import BaseModel

class ConsignmentCreate(BaseModel):
    border_point_id: int
    crop_product_id: int
    direction: str
    quantity: float
    unit: str
    vehicle_reg: str | None = None
    trader_company: str | None = None
    remarks: str | None = None

class ConsignmentUpdate(BaseModel):
    status: str | None = None
    remarks: str | None = None

class ConsignmentOut(BaseModel):
    id: int
    reference: str
    date: str
    border_point_id: int
    officer_id: int
    crop_product_id: int
    direction: str
    quantity: float
    unit: str
    standard_quantity: float | None
    standard_unit: str | None
    vehicle_reg: str | None
    trader_company: str | None
    inspection_status: str | None
    status: str
    created_at: str

    class Config:
        from_attributes = True
