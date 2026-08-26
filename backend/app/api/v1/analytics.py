from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.consignment import Consignment
from app.models.directorate import Directorate
from app.models.border_point import BorderPoint
from app.models.border_point import border_point_directorates

router = APIRouter(prefix="/analytics")

@router.get("/directorate-volumes")
async def directorate_volumes(
    db: AsyncSession = Depends(get_db),
    border_point_id: int | None = Query(None),
    crop_id: int | None = Query(None),
):
    query = select(Consignment)
    if border_point_id:
        query = query.where(Consignment.border_point_id == border_point_id)
    if crop_id:
        query = query.where(Consignment.crop_id == crop_id)

    result = await db.execute(
        select(Directorate.name, func.sum(Consignment.standard_quantity).label("volume"))
        .join(Consignment, Consignment.directorate_id == Directorate.id)
        .group_by(Directorate.name)
        .order_by(func.sum(Consignment.standard_quantity).desc())
    )
    data = [{"directorate": row[0], "volume": float(row[1] or 0)} for row in result.all()]
    return {"value": data}

@router.get("/overview")
async def analytics_overview(
    db: AsyncSession = Depends(get_db),
    border_point_id: int | None = Query(None),
):
    query = select(Consignment)
    if border_point_id:
        query = query.where(Consignment.border_point_id == border_point_id)

    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar() or 0
    total_volume = (await db.execute(select(func.coalesce(func.sum(Consignment.standard_quantity), 0)).select_from(query.subquery()))).scalar() or 0

    return {
        "totalConsignments": total,
        "totalVolume": float(total_volume),
    }
