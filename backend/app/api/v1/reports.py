from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.consignment import Consignment
from app.models.consignment import DirectionEnum
from app.models.border_point import BorderPoint
from app.models.crop import Crop, CropProduct, CropCategory

router = APIRouter(prefix="/reports")

@router.get("/national/summary")
async def national_summary(
    db: AsyncSession = Depends(get_db),
    border_point_id: int | None = Query(None),
    crop_id: int | None = Query(None),
    direction: str | None = Query(None),
    status: str | None = Query(None),
):
    query = select(Consignment)
    if border_point_id:
        query = query.where(Consignment.border_point_id == border_point_id)
    if crop_id:
        query = query.where(Consignment.crop_id == crop_id)
    if direction:
        query = query.where(Consignment.direction == direction)
    if status:
        query = query.where(Consignment.status == status)

    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar() or 0
    total_volume_q = (await db.execute(select(func.coalesce(func.sum(Consignment.standard_quantity), 0)).select_from(query.subquery()))).scalar() or 0
    imports_q = (await db.execute(select(func.coalesce(func.sum(Consignment.standard_quantity), 0)).where(Consignment.direction == DirectionEnum.IMPORT).select_from(query.subquery()))).scalar() or 0
    exports_q = (await db.execute(select(func.coalesce(func.sum(Consignment.standard_quantity), 0)).where(Consignment.direction == DirectionEnum.EXPORT).select_from(query.subquery()))).scalar() or 0

    border_result = await db.execute(
        select(Consignment.border_point_id, func.count().label("count"))
        .select_from(Consignment)
        .group_by(Consignment.border_point_id)
        .order_by(func.count().desc())
        .limit(5)
    )
    border_rows = border_result.all()
    border_activity = []
    for bp_id, count in border_rows:
        bp = (await db.execute(select(BorderPoint).where(BorderPoint.id == bp_id))).scalar_one_or_none()
        border_activity.append({
            "border_point_id": bp_id,
            "name": bp.name if bp else f"BP-{bp_id}",
            "count": count,
        })

    crop_result = await db.execute(
        select(CropProduct.name, func.sum(Consignment.standard_quantity).label("volume"))
        .join(Consignment, Consignment.crop_product_id == CropProduct.id)
        .group_by(CropProduct.name)
        .order_by(func.sum(Consignment.standard_quantity).desc())
        .limit(5)
    )
    top_crops = [{"name": row[0], "volume": float(row[1] or 0)} for row in crop_result.all()]

    return {
        "totalTransactions": total,
        "totalVolume": float(total_volume_q),
        "imports": float(imports_q),
        "exports": float(exports_q),
        "borderActivity": border_activity,
        "topCrops": top_crops,
    }
