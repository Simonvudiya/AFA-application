from sqlalchemy.orm import Session
from app.models.consignment import Consignment
from app.models.crop import CropProduct
from app.schemas.consignment import ConsignmentCreate, ConsignmentOut
from datetime import datetime, timezone
from app.services.unit_conversion import convert_to_standard
import random

class ConsignmentService:
    def __init__(self, db: Session):
        self.db = db

    def _generate_reference(self) -> str:
        return f"AFAB-{random.randint(10000000, 99999999)}"

    def create(self, data: ConsignmentCreate, officer) -> ConsignmentOut:
        reference = self._generate_reference()
        crop_product = self.db.query(CropProduct).filter(CropProduct.id == data.crop_product_id).first()
        bag_weight_kg = crop_product.default_bag_weight_kg if crop_product else None
        std_quantity, std_unit = convert_to_standard(data.quantity, data.unit, bag_weight_kg)
        consignment = Consignment(
            reference=reference,
            border_point_id=data.border_point_id,
            officer_id=officer.id,
            crop_product_id=data.crop_product_id,
            direction=data.direction,
            quantity=data.quantity,
            unit=data.unit,
            standard_quantity=std_quantity,
            standard_unit=std_unit,
            vehicle_reg=data.vehicle_reg,
            trader_company=data.trader_company,
            remarks=data.remarks,
            status="draft",
            date=datetime.now(timezone.utc),
        )
        self.db.add(consignment)
        self.db.commit()
        self.db.refresh(consignment)
        return ConsignmentOut.model_validate(consignment)

    def get_today_summary(self, border_id: int) -> dict:
        today = datetime.now(timezone.utc).date()
        consignments = (
            self.db.query(Consignment)
            .filter(Consignment.border_point_id == border_id)
            .filter(Consignment.date >= today)
            .all()
        )
        return {
            "total": len(consignments),
            "by_direction": {},
            "items": [ConsignmentOut.model_validate(c) for c in consignments],
        }

    def get_national_summary(self) -> dict:
        total = self.db.query(Consignment).count()
        return {"total_consignments": total}
