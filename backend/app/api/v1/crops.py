from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.crop import CropCategory, Crop, CropProduct
from app.models.directorate import Directorate, Department

router = APIRouter(prefix="/crops")

@router.get("/categories")
async def get_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CropCategory))
    categories = result.scalars().all()
    return [
        {"id": c.id, "name": c.name, "description": c.description}
        for c in categories
    ]

@router.get("/")
async def get_crops(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Crop))
    crops = result.scalars().all()
    return [
        {
            "id": crop.id,
            "name": crop.name,
            "category_id": crop.category_id,
            "scientific_name": crop.scientific_name,
            "directorate_name": None,
            "department_name": None,
        }
        for crop in crops
    ]

@router.post("/")
async def create_crop(data: dict, db: AsyncSession = Depends(get_db)):
    crop = Crop(name=data["name"], category_id=data["category_id"], scientific_name=data.get("scientific_name"))
    db.add(crop)
    await db.commit()
    await db.refresh(crop)
    return {"id": crop.id, "name": crop.name, "category_id": crop.category_id}

@router.get("/products")
async def get_products(cropId: int = None, db: AsyncSession = Depends(get_db)):
    query = select(CropProduct)
    if cropId:
        query = query.where(CropProduct.crop_id == cropId)
    result = await db.execute(query)
    products = result.scalars().all()
    return [
        {"id": p.id, "name": p.name, "crop_id": p.crop_id, "unit": p.unit}
        for p in products
    ]

@router.get("/directorates")
async def get_directorates_with_crops(db: AsyncSession = Depends(get_db)):
    cat_result = await db.execute(select(CropCategory))
    categories = cat_result.scalars().all()
    data = []
    for cat in categories:
        crop_result = await db.execute(select(Crop).where(Crop.category_id == cat.id))
        crops = crop_result.scalars().all()
        data.append({
            "id": cat.id,
            "name": cat.name,
            "crops": [
                {"id": crop.id, "name": crop.name}
                for crop in crops
            ]
        })
    return data
