from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.directorate import Department, Directorate

router = APIRouter(prefix="/departments")

@router.get("/")
async def get_departments(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Department, Directorate).join(Directorate))
    rows = result.all()
    return [
        {"id": d.id, "name": d.name, "directorate_id": d.directorate_id, "directorate_name": dir.name}
        for d, dir in rows
    ]

@router.post("/")
async def create_department(data: dict, db: AsyncSession = Depends(get_db)):
    department = Department(name=data["name"], directorate_id=data["directorate_id"])
    db.add(department)
    await db.commit()
    await db.refresh(department)
    return {"id": department.id, "name": department.name, "directorate_id": department.directorate_id}
