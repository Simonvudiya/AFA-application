from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.consignment import Consignment
from app.models.consignment import DirectionEnum

router = APIRouter(prefix="/reports")

@router.get("/national/summary")
async def national_summary(db: AsyncSession = Depends(get_db)):
    total = (await db.execute(select(func.count()).select_from(Consignment))).scalar() or 0
    total_volume_q = (await db.execute(select(func.coalesce(func.sum(Consignment.standard_quantity), 0)))).scalar() or 0
    imports_q = (await db.execute(select(func.coalesce(func.sum(Consignment.standard_quantity), 0)).where(Consignment.direction == DirectionEnum.IMPORT))).scalar() or 0
    exports_q = (await db.execute(select(func.coalesce(func.sum(Consignment.standard_quantity), 0)).where(Consignment.direction == DirectionEnum.EXPORT))).scalar() or 0
    return {
        "totalTransactions": total,
        "totalVolume": float(total_volume_q),
        "imports": float(imports_q),
        "exports": float(exports_q),
        "borderActivity": [],
        "topCrops": [],
    }
