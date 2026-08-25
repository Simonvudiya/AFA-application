from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.directorate import Directorate

router = APIRouter(prefix="/directorates")

@router.get("/")
async def get_directorates(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Directorate))
    directorates = result.scalars().all()
    return [
        {"id": d.id, "name": d.name, "code": d.code}
        for d in directorates
    ]

@router.post("/")
async def create_directorate(data: dict, db: AsyncSession = Depends(get_db)):
    directorate = Directorate(name=data["name"], code=data.get("code"))
    db.add(directorate)
    await db.commit()
    await db.refresh(directorate)
    return {"id": directorate.id, "name": directorate.name, "code": directorate.code}
