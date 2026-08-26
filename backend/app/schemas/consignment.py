from pydantic import BaseModel

class ConsignmentCreate(BaseModel):
    border_point_id: int
    crop_product_id: int
    crop_id: int
    directorate_id: int | None = None
    department_id: int | None = None
    direction: str
    quantity: float
    unit: str
    country_origin: str | None = None
    country_destination: str | None = None
    vehicle_reg: str | None = None
    trader_company: str | None = None
    transporter: str | None = None
    permit_number: str | None = None
    packaging_type: str | None = None
    no_of_packages: int | None = None
    purpose: str | None = None
    variety: str | None = None
    inspection_status: str | None = None
    remarks: str | None = None
    gps_coordinates: str | None = None
    time_of_entry: str | None = None

class ConsignmentUpdate(BaseModel):
    status: str | None = None
    remarks: str | None = None
    inspection_status: str | None = None

class ConsignmentOut(BaseModel):
    id: int
    reference: str
    date: str
    time_of_entry: str | None
    border_point_id: int
    officer_id: int
    crop_product_id: int
    crop_id: int
    directorate_id: int | None
    department_id: int | None
    direction: str
    quantity: float
    unit: str
    standard_quantity: float | None
    standard_unit: str | None
    country_origin: str | None
    country_destination: str | None
    vehicle_reg: str | None
    trader_company: str | None
    transporter: str | None
    permit_number: str | None
    packaging_type: str | None
    no_of_packages: int | None
    purpose: str | None
    variety: str | None
    inspection_status: str | None
    remarks: str | None
    gps_coordinates: str | None
    status: str
    created_at: str

    class Config:
        from_attributes = True
