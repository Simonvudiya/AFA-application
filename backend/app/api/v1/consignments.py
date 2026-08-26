from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.services.consignment_service import ConsignmentService
from app.schemas.consignment import ConsignmentCreate, ConsignmentUpdate, ConsignmentOut
from app.core.dependencies import get_current_user, require_role
from app.models.consignment import Consignment
from app.models.border_point import BorderPoint
from app.models.border_point import border_point_directorates

router = APIRouter(prefix="/consignments", tags=["consignments"])

@router.post("/", response_model=ConsignmentOut)
async def create_consignment(
    data: ConsignmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = ConsignmentService(db)
    return await service.create(data, current_user)

@router.get("/")
async def list_consignments(
    db: AsyncSession = Depends(get_db),
    border_point_id: int | None = Query(None),
    directorate_id: int | None = Query(None),
    crop_product_id: int | None = Query(None),
    officer_id: int | None = Query(None),
    status: str | None = Query(None),
    _ = Depends(get_current_user)
):
    query = select(Consignment).options(selectinload(Consignment.officer))
    if border_point_id:
        query = query.where(Consignment.border_point_id == border_point_id)
    if directorate_id:
        query = query.join(BorderPoint, Consignment.border_point_id == BorderPoint.id).join(
            border_point_directorates, BorderPoint.id == border_point_directorates.c.border_point_id
        ).where(border_point_directorates.c.directorate_id == directorate_id)
    if crop_product_id:
        query = query.where(Consignment.crop_product_id == crop_product_id)
    if officer_id:
        query = query.where(Consignment.officer_id == officer_id)
    if status:
        query = query.where(Consignment.status == status)
    query = query.order_by(Consignment.date.desc())
    result = await db.execute(query)
    items = result.scalars().unique().all()
    return [
        {
            "id": c.id,
            "reference": c.reference,
            "date": str(c.date) if c.date else None,
            "time_of_entry": str(c.time_of_entry) if c.time_of_entry else None,
            "border_point_id": c.border_point_id,
            "officer_id": c.officer_id,
            "officer_name": c.officer.full_name if c.officer else None,
            "crop_product_id": c.crop_product_id,
            "crop_id": c.crop_id,
            "directorate_id": c.directorate_id,
            "department_id": c.department_id,
            "direction": c.direction.value if c.direction else None,
            "quantity": c.quantity,
            "unit": c.unit,
            "standard_quantity": c.standard_quantity,
            "standard_unit": c.standard_unit,
            "country_origin": c.country_origin,
            "country_destination": c.country_destination,
            "vehicle_reg": c.vehicle_reg,
            "trader_company": c.trader_company,
            "transporter": c.transporter,
            "permit_number": c.permit_number,
            "packaging_type": c.packaging_type,
            "no_of_packages": c.no_of_packages,
            "purpose": c.purpose,
            "variety": c.variety,
            "inspection_status": c.inspection_status,
            "remarks": c.remarks,
            "gps_coordinates": c.gps_coordinates,
            "status": c.status,
            "created_at": str(c.created_at) if c.created_at else None,
        }
        for c in items
    ]

@router.get("/{consignment_id}")
async def get_consignment(
    consignment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = ConsignmentService(db)
    item = await service.get_one(consignment_id)
    if not item:
        raise HTTPException(status_code=404, detail="Consignment not found")
    return {
        "id": item.id,
        "reference": item.reference,
        "date": str(item.date) if item.date else None,
        "time_of_entry": str(item.time_of_entry) if item.time_of_entry else None,
        "border_point_id": item.border_point_id,
        "officer_id": item.officer_id,
        "officer_name": item.officer.full_name if item.officer else None,
        "crop_product_id": item.crop_product_id,
        "crop_id": item.crop_id,
        "directorate_id": item.directorate_id,
        "department_id": item.department_id,
        "direction": item.direction.value if item.direction else None,
        "quantity": item.quantity,
        "unit": item.unit,
        "standard_quantity": item.standard_quantity,
        "standard_unit": item.standard_unit,
        "country_origin": item.country_origin,
        "country_destination": item.country_destination,
        "vehicle_reg": item.vehicle_reg,
        "trader_company": item.trader_company,
        "transporter": item.transporter,
        "permit_number": item.permit_number,
        "packaging_type": item.packaging_type,
        "no_of_packages": item.no_of_packages,
        "purpose": item.purpose,
        "variety": item.variety,
        "inspection_status": item.inspection_status,
        "remarks": item.remarks,
        "gps_coordinates": item.gps_coordinates,
        "status": item.status,
        "created_at": str(item.created_at) if item.created_at else None,
    }

@router.put("/{consignment_id}")
async def update_consignment(
    consignment_id: int,
    data: ConsignmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = ConsignmentService(db)
    updated = await service.update(consignment_id, data.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Consignment not found")
    return updated

@router.delete("/{consignment_id}")
async def delete_consignment(
    consignment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = ConsignmentService(db)
    ok = await service.delete(consignment_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Consignment not found")
    return {"detail": "Deleted"}

@router.get("/border/{border_id}/today", response_model=dict)
async def get_border_today(
    border_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = ConsignmentService(db)
    return await service.get_today_summary(border_id)

@router.get("/national/dashboard", response_model=dict)
async def national_dashboard(
    db: AsyncSession = Depends(get_db),
    _ = Depends(require_role(["super_admin", "headquarters_admin"]))
):
    service = ConsignmentService(db)
    return await service.get_national_summary()