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
    return service.create(data, current_user)

@router.get("/")
async def list_consignments(
    db: AsyncSession = Depends(get_db),
    border_point_id: int | None = Query(None),
    directorate_id: int | None = Query(None),
    crop_product_id: int | None = Query(None),
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
    query = query.order_by(Consignment.date.desc())
    result = await db.execute(query)
    items = result.scalars().unique().all()
    return [
        {
            "id": c.id,
            "reference": c.reference,
            "date": str(c.date) if c.date else None,
            "border_point_id": c.border_point_id,
            "officer_id": c.officer_id,
            "officer_name": c.officer.full_name if c.officer else None,
            "crop_product_id": c.crop_product_id,
            "direction": c.direction.value if c.direction else None,
            "quantity": c.quantity,
            "unit": c.unit,
            "standard_quantity": c.standard_quantity,
            "standard_unit": c.standard_unit,
            "vehicle_reg": c.vehicle_reg,
            "trader_company": c.trader_company,
            "inspection_status": c.inspection_status,
            "status": c.status,
            "created_at": str(c.created_at) if c.created_at else None,
        }
        for c in items
    ]

@router.get("/border/{border_id}/today", response_model=dict)
async def get_border_today(
    border_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = ConsignmentService(db)
    return service.get_today_summary(border_id)

@router.get("/national/dashboard", response_model=dict)
async def national_dashboard(
    db: AsyncSession = Depends(get_db),
    _ = Depends(require_role(["super_admin", "headquarters_admin"]))
):
    service = ConsignmentService(db)
    return service.get_national_summary()
