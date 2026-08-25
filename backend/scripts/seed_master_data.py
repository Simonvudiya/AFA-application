import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.core.config import settings
from app.core.database import Base
from app.models.crop import CropCategory, Crop, CropProduct
from app.models.directorate import Directorate, Department
from app.models.border_point import BorderPoint
from app.models.user import User
from app.core.security import hash_password

engine = create_async_engine(settings.DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

SEED_CATEGORIES = [
    {"name": "Cereals"},
    {"name": "Legumes"},
    {"name": "Horticulture"},
    {"name": "Industrial Crops"},
]

SEED_CROPS = [
    {"name": "Maize", "category": "Cereals"},
    {"name": "Wheat", "category": "Cereals"},
    {"name": "Beans", "category": "Legumes"},
    {"name": "Coffee", "category": "Industrial Crops"},
]

SEED_PRODUCTS = [
    {"crop": "Maize", "name": "Yellow Maize", "unit": "bags"},
    {"crop": "Maize", "name": "White Maize", "unit": "bags"},
    {"crop": "Coffee", "name": "Arabica", "unit": "kg"},
]

SEED_DIRECTORATES = [
    {"name": "Crop Management", "code": "CM"},
    {"name": "Border Control", "code": "BC"},
]

SEED_BORDER_POINTS = [
    {"name": "Namanga", "code": "NAM", "county": "Kajiado", "country": "Tanzania", "latitude": -2.55, "longitude": 36.78},
    {"name": "Malaba", "code": "MAL", "county": "Busia", "country": "Uganda", "latitude": 0.63, "longitude": 34.26},
]

async def seed():
    async with AsyncSessionLocal() as session:
        for d in SEED_DIRECTORATES:
            existing = await session.execute(select(Directorate).where(Directorate.code == d["code"]))
            if not existing.scalar_one_or_none():
                session.add(Directorate(**d))
        
        for b in SEED_BORDER_POINTS:
            existing = await session.execute(select(BorderPoint).where(BorderPoint.code == b["code"]))
            if not existing.scalar_one_or_none():
                session.add(BorderPoint(**b))
        
        category_map = {}
        for cat_data in SEED_CATEGORIES:
            existing_cat = await session.execute(select(CropCategory).where(CropCategory.name == cat_data["name"]))
            cat = existing_cat.scalar_one_or_none()
            if not cat:
                cat = CropCategory(**cat_data)
                session.add(cat)
                await session.flush()
            category_map[cat.name] = cat.id
        
        crop_map = {}
        for crop_data in SEED_CROPS:
            existing_crop = await session.execute(select(Crop).where(Crop.name == crop_data["name"]))
            crop = existing_crop.scalar_one_or_none()
            if not crop:
                crop = Crop(
                    name=crop_data["name"],
                    category_id=category_map[crop_data["category"]],
                    scientific_name=crop_data.get("scientific_name"),
                )
                session.add(crop)
                await session.flush()
            crop_map[crop.name] = crop.id
        
        for prod_data in SEED_PRODUCTS:
            existing_prod = await session.execute(select(CropProduct).where(CropProduct.name == prod_data["name"]))
            if not existing_prod.scalar_one_or_none():
                product = CropProduct(
                    name=prod_data["name"],
                    crop_id=crop_map[prod_data["crop"]],
                    unit=prod_data["unit"],
                )
                session.add(product)
        
        existing_user = await session.execute(select(User).where(User.email == "admin@afa.go.ke"))
        if not existing_user.scalar_one_or_none():
            session.add(User(email="admin@afa.go.ke", hashed_password=hash_password("admin123"), full_name="System Admin", role="super_admin"))
        
        await session.commit()
    print("Seed complete")

if __name__ == "__main__":
    asyncio.run(seed())
