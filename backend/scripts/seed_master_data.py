import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
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
            session.add(Directorate(**d))
        for b in SEED_BORDER_POINTS:
            session.add(BorderPoint(**b))
        session.add(User(email="admin@afa.go.ke", hashed_password=hash_password("admin123"), full_name="System Admin", role="super_admin"))
        await session.commit()
    print("Seed complete")

if __name__ == "__main__":
    asyncio.run(seed())
