from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.border_point import BorderPoint

router = APIRouter(prefix="/border-points")

@router.get("/")
async def get_border_points(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BorderPoint))
    points = result.scalars().all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "code": p.code,
            "county": p.county,
            "country": p.country,
            "latitude": p.latitude,
            "longitude": p.longitude,
        }
        for p in points
    ]

@router.get("/{point_id}")
async def get_border_point(point_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BorderPoint).where(BorderPoint.id == point_id))
    point = result.scalar_one_or_none()
    if not point:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Border point not found")
    return {
        "id": point.id,
        "name": point.name,
        "code": point.code,
        "county": point.county,
        "country": point.country,
        "latitude": point.latitude,
        "longitude": point.longitude,
    }
