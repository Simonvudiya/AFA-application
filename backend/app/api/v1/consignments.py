from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.consignment_service import ConsignmentService
from app.schemas.consignment import ConsignmentCreate, ConsignmentUpdate, ConsignmentOut
from app.core.dependencies import get_current_user, require_role

router = APIRouter(prefix="/consignments", tags=["consignments"])

@router.post("/", response_model=ConsignmentOut)
async def create_consignment(
    data: ConsignmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = ConsignmentService(db)
    # Automatically assign border point from user's station
    # Set reference, validate crop, unit conversion, etc.
    return service.create(data, current_user)

@router.get("/border/{border_id}/today", response_model=dict)
async def get_border_today(
    border_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = ConsignmentService(db)
    return service.get_today_summary(border_id)

@router.get("/national/dashboard", response_model=dict)
async def national_dashboard(
    db: Session = Depends(get_db),
    _ = Depends(require_role(["super_admin", "headquarters_admin"]))
):
    service = ConsignmentService(db)
    return service.get_national_summary()
