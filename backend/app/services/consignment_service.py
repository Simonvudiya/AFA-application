from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.models.consignment import Consignment
from app.models.crop import Crop, CropProduct
from app.models.directorate import Directorate, Department
from app.schemas.consignment import ConsignmentCreate, ConsignmentOut
from datetime import datetime, timezone
from app.services.unit_conversion import convert_to_standard
import random

class ConsignmentService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def _generate_reference(self) -> str:
        return f"AFAB-{random.randint(10000000, 99999999)}"

    async def create(self, data: ConsignmentCreate, officer) -> ConsignmentOut:
        reference = self._generate_reference()
        crop_product = (await self.db.execute(select(CropProduct).where(CropProduct.id == data.crop_product_id))).scalar_one_or_none()
        bag_weight_kg = crop_product.default_bag_weight_kg if crop_product else None
        std_quantity, std_unit = convert_to_standard(data.quantity, data.unit, bag_weight_kg)

        crop_id = data.crop_id
        directorate_id = data.directorate_id
        department_id = data.department_id

        if not crop_id and crop_product:
            crop_id = crop_product.crop_id

        if crop_id and not directorate_id:
            crop = (await self.db.execute(select(Crop).where(Crop.id == crop_id))).scalar_one_or_none()
            if crop:
                directorate_id = crop.directorate_id
                department_id = crop.department_id

        time_entry = None
        if data.time_of_entry:
            try:
                time_entry = datetime.fromisoformat(data.time_of_entry)
            except Exception:
                time_entry = datetime.now(timezone.utc)

        consignment = Consignment(
            reference=reference,
            border_point_id=data.border_point_id,
            officer_id=officer.id,
            crop_product_id=data.crop_product_id,
            crop_id=crop_id,
            directorate_id=directorate_id,
            department_id=department_id,
            direction=data.direction,
            quantity=data.quantity,
            unit=data.unit,
            standard_quantity=std_quantity,
            standard_unit=std_unit,
            country_origin=data.country_origin,
            country_destination=data.country_destination,
            vehicle_reg=data.vehicle_reg,
            trader_company=data.trader_company,
            transporter=data.transporter,
            permit_number=data.permit_number,
            packaging_type=data.packaging_type,
            no_of_packages=data.no_of_packages,
            purpose=data.purpose,
            variety=data.variety,
            inspection_status=data.inspection_status,
            remarks=data.remarks,
            gps_coordinates=data.gps_coordinates,
            time_of_entry=time_entry,
            status="draft",
            date=datetime.now(timezone.utc),
        )
        self.db.add(consignment)
        await self.db.commit()
        await self.db.refresh(consignment)
        consignment_dict = {
            "id": consignment.id,
            "reference": consignment.reference,
            "date": str(consignment.date),
            "time_of_entry": str(consignment.time_of_entry) if consignment.time_of_entry else None,
            "border_point_id": consignment.border_point_id,
            "officer_id": consignment.officer_id,
            "crop_product_id": consignment.crop_product_id,
            "crop_id": consignment.crop_id,
            "directorate_id": consignment.directorate_id,
            "department_id": consignment.department_id,
            "direction": consignment.direction.value if consignment.direction else None,
            "quantity": consignment.quantity,
            "unit": consignment.unit,
            "standard_quantity": consignment.standard_quantity,
            "standard_unit": consignment.standard_unit,
            "country_origin": consignment.country_origin,
            "country_destination": consignment.country_destination,
            "vehicle_reg": consignment.vehicle_reg,
            "trader_company": consignment.trader_company,
            "transporter": consignment.transporter,
            "permit_number": consignment.permit_number,
            "packaging_type": consignment.packaging_type,
            "no_of_packages": consignment.no_of_packages,
            "purpose": consignment.purpose,
            "variety": consignment.variety,
            "inspection_status": consignment.inspection_status,
            "remarks": consignment.remarks,
            "gps_coordinates": consignment.gps_coordinates,
            "status": consignment.status,
            "created_at": str(consignment.created_at),
        }
        return ConsignmentOut.model_validate(consignment_dict)

    async def get_one(self, consignment_id: int):
        result = await self.db.execute(
            select(Consignment)
            .options(selectinload(Consignment.officer))
            .where(Consignment.id == consignment_id)
        )
        return result.scalar_one_or_none()

    async def update(self, consignment_id: int, data: dict) -> ConsignmentOut | None:
        consignment = await self.get_one(consignment_id)
        if not consignment:
            return None
        for key, value in data.items():
            if hasattr(consignment, key) and value is not None:
                setattr(consignment, key, value)
        consignment.updated_at = datetime.now(timezone.utc)
        await self.db.commit()
        await self.db.refresh(consignment)
        consignment_dict = {
            "id": consignment.id,
            "reference": consignment.reference,
            "date": str(consignment.date),
            "time_of_entry": str(consignment.time_of_entry) if consignment.time_of_entry else None,
            "border_point_id": consignment.border_point_id,
            "officer_id": consignment.officer_id,
            "crop_product_id": consignment.crop_product_id,
            "crop_id": consignment.crop_id,
            "directorate_id": consignment.directorate_id,
            "department_id": consignment.department_id,
            "direction": consignment.direction.value if consignment.direction else None,
            "quantity": consignment.quantity,
            "unit": consignment.unit,
            "standard_quantity": consignment.standard_quantity,
            "standard_unit": consignment.standard_unit,
            "country_origin": consignment.country_origin,
            "country_destination": consignment.country_destination,
            "vehicle_reg": consignment.vehicle_reg,
            "trader_company": consignment.trader_company,
            "transporter": consignment.transporter,
            "permit_number": consignment.permit_number,
            "packaging_type": consignment.packaging_type,
            "no_of_packages": consignment.no_of_packages,
            "purpose": consignment.purpose,
            "variety": consignment.variety,
            "inspection_status": consignment.inspection_status,
            "remarks": consignment.remarks,
            "gps_coordinates": consignment.gps_coordinates,
            "status": consignment.status,
            "created_at": str(consignment.created_at),
        }
        return ConsignmentOut.model_validate(consignment_dict)

    async def delete(self, consignment_id: int) -> bool:
        consignment = await self.get_one(consignment_id)
        if not consignment:
            return False
        await self.db.delete(consignment)
        await self.db.commit()
        return True

    async def get_today_summary(self, border_id: int) -> dict:
        today = datetime.now(timezone.utc).date()
        result = await self.db.execute(
            select(Consignment)
            .where(Consignment.border_point_id == border_id)
            .where(Consignment.date >= today)
        )
        consignments = result.scalars().all()
        return {
            "total": len(consignments),
            "by_direction": {},
            "items": [ConsignmentOut.model_validate(c) for c in consignments],
        }

    async def get_national_summary(self) -> dict:
        total = (await self.db.execute(select(func.count()).select_from(Consignment))).scalar() or 0
        total_volume = (await self.db.execute(select(func.coalesce(func.sum(Consignment.standard_quantity), 0)))).scalar() or 0
        imports = (await self.db.execute(select(func.coalesce(func.sum(Consignment.standard_quantity), 0)).where(Consignment.direction == "Import into Kenya"))).scalar() or 0
        exports = (await self.db.execute(select(func.coalesce(func.sum(Consignment.standard_quantity), 0)).where(Consignment.direction == "Export from Kenya"))).scalar() or 0

        border_result = await self.db.execute(
            select(Consignment.border_point_id, func.count().label("count"))
            .group_by(Consignment.border_point_id)
            .order_by(func.count().desc())
            .limit(5)
        )
        border_rows = border_result.all()
        from app.models.border_point import BorderPoint
        border_activity = []
        for bp_id, count in border_rows:
            bp = (await self.db.execute(select(BorderPoint).where(BorderPoint.id == bp_id))).scalar_one_or_none()
            border_activity.append({
                "border_point_id": bp_id,
                "name": bp.name if bp else f"BP-{bp_id}",
                "count": count,
            })

        crop_result = await self.db.execute(
            select(CropProduct.name, func.sum(Consignment.standard_quantity).label("volume"))
            .join(Consignment, Consignment.crop_product_id == CropProduct.id)
            .group_by(CropProduct.name)
            .order_by(func.sum(Consignment.standard_quantity).desc())
            .limit(5)
        )
        top_crops = [{"name": row[0], "volume": float(row[1] or 0)} for row in crop_result.all()]

        return {
            "totalTransactions": total,
            "totalVolume": float(total_volume),
            "imports": float(imports),
            "exports": float(exports),
            "borderActivity": border_activity,
            "topCrops": top_crops,
        }
