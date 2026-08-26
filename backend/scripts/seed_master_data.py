import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.core.config import settings
from app.core.database import Base
from app.models.crop import CropCategory, Crop, CropProduct
from app.models.directorate import Directorate, Department
from app.models.border_point import BorderPoint, border_point_directorates
from app.models.user import User
from app.core.security import hash_password

engine = create_async_engine(settings.DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

SEED_CATEGORIES = [
    {"name": "Cereals"},
    {"name": "Legumes"},
    {"name": "Horticulture"},
    {"name": "Industrial Crops"},
    {"name": "Nuts & Oil Crops"},
]

SEED_CROPS = [
    {"name": "Maize", "category": "Cereals", "directorate_code": "FDC", "department_name": "Crop Development Department"},
    {"name": "Wheat", "category": "Cereals", "directorate_code": "FDC", "department_name": "Crop Development Department"},
    {"name": "Beans", "category": "Legumes", "directorate_code": "FDC", "department_name": "Crop Development Department"},
    {"name": "Coffee", "category": "Industrial Crops", "directorate_code": "COF", "department_name": "Crop Development Department"},
    {"name": "Tea", "category": "Industrial Crops", "directorate_code": "OTH", "department_name": "Crop Development Department"},
    {"name": "Sugarcane", "category": "Industrial Crops", "directorate_code": "SUG", "department_name": "Crop Development Department"},
    {"name": "Cotton", "category": "Industrial Crops", "directorate_code": "FBR", "department_name": "Crop Development Department"},
    {"name": "Sisal", "category": "Industrial Crops", "directorate_code": "FBR", "department_name": "Crop Development Department"},
    {"name": "Pyrethrum", "category": "Industrial Crops", "directorate_code": "OTH", "department_name": "Crop Development Department"},
    {"name": "Miraa", "category": "Industrial Crops", "directorate_code": "OTH", "department_name": "Crop Development Department"},
    {"name": "Horticultural crops", "category": "Horticulture", "directorate_code": "HOR", "department_name": "Crop Development Department"},
    {"name": "Food crops", "category": "Cereals", "directorate_code": "FDC", "department_name": "Crop Development Department"},
    {"name": "Nuts and oil crops", "category": "Nuts & Oil Crops", "directorate_code": "NOC", "department_name": "Crop Development Department"},
    {"name": "Coconut", "category": "Nuts & Oil Crops", "directorate_code": "NOC", "department_name": "Crop Development Department"},
    {"name": "Macadamia", "category": "Nuts & Oil Crops", "directorate_code": "NOC", "department_name": "Crop Development Department"},
    {"name": "Cashew nuts", "category": "Nuts & Oil Crops", "directorate_code": "NOC", "department_name": "Crop Development Department"},
    {"name": "Avocado", "category": "Horticulture", "directorate_code": "HOR", "department_name": "Crop Development Department"},
    {"name": "Mango", "category": "Horticulture", "directorate_code": "HOR", "department_name": "Crop Development Department"},
    {"name": "Banana", "category": "Horticulture", "directorate_code": "HOR", "department_name": "Crop Development Department"},
    {"name": "Passion fruit", "category": "Horticulture", "directorate_code": "HOR", "department_name": "Crop Development Department"},
    {"name": "French beans", "category": "Horticulture", "directorate_code": "HOR", "department_name": "Crop Development Department"},
    {"name": "Peas", "category": "Horticulture", "directorate_code": "HOR", "department_name": "Crop Development Department"},
    {"name": "Onions", "category": "Horticulture", "directorate_code": "HOR", "department_name": "Crop Development Department"},
    {"name": "Potatoes", "category": "Horticulture", "directorate_code": "HOR", "department_name": "Crop Development Department"},
    {"name": "Rice", "category": "Cereals", "directorate_code": "FDC", "department_name": "Crop Development Department"},
    {"name": "Sorghum", "category": "Cereals", "directorate_code": "FDC", "department_name": "Crop Development Department"},
    {"name": "Millets", "category": "Cereals", "directorate_code": "FDC", "department_name": "Crop Development Department"},
    {"name": "Beans and other pulses", "category": "Legumes", "directorate_code": "FDC", "department_name": "Crop Development Department"},
]

SEED_PRODUCTS = [
    {"crop": "Maize", "name": "Yellow Maize", "unit": "bags"},
    {"crop": "Maize", "name": "White Maize", "unit": "bags"},
    {"crop": "Coffee", "name": "Arabica", "unit": "kg"},
]

SEED_DIRECTORATES = [
    {"name": "Sugar Directorate", "code": "SUG"},
    {"name": "Coffee Directorate", "code": "COF"},
    {"name": "Fibre Crops Directorate", "code": "FBR"},
    {"name": "Food Crops Directorate", "code": "FDC"},
    {"name": "Nuts & Oil Crops Directorate", "code": "NOC"},
    {"name": "Horticultural Crops Directorate", "code": "HOR"},
    {"name": "Miraa, Pyrethrum & Other Industrial Crops Directorate", "code": "OTH"},
]

SEED_DEPARTMENTS = [
    {"name": "Crop Development Department"},
    {"name": "Licensing and Compliance Department"},
    {"name": "Quality Assurance Department"},
    {"name": "Marketing and Trade Development Department"},
    {"name": "Research, Innovation and Extension Department"},
    {"name": "Planning, Monitoring, Evaluation and Information Management Department"},
]

SEED_BORDER_POINTS = [
    {"name": "Busia OSBP", "code": "BUS", "county": "Busia", "country": "Kenya", "latitude": 0.46, "longitude": 34.11},
    {"name": "Isebania OSBP", "code": "ISB", "county": "Migori", "country": "Kenya", "latitude": -1.25, "longitude": 34.78},
    {"name": "Lungalunga OSBP", "code": "LUN", "county": "Kwale", "country": "Kenya", "latitude": -4.55, "longitude": 39.28},
    {"name": "Loitoktok OSBP", "code": "LOI", "county": "Kajiado", "country": "Kenya", "latitude": -2.73, "longitude": 37.52},
    {"name": "Malaba OSBP", "code": "MAL", "county": "Busia", "country": "Kenya", "latitude": 0.63, "longitude": 34.26},
    {"name": "Namanga OSBP", "code": "NAM", "county": "Kajiado", "country": "Kenya", "latitude": -2.55, "longitude": 36.78},
    {"name": "Taveta OSBP", "code": "TAV", "county": "Taita-Taveta", "country": "Kenya", "latitude": -3.40, "longitude": 37.68},
]

SEED_BORDER_POINT_DIRECTORATES = {
    "BUS": ["Horticultural Crops Directorate", "Fibre Crops Directorate"],
    "ISB": ["Food Crops Directorate"],
    "LUN": ["Food Crops Directorate"],
    "LOI": ["Food Crops Directorate"],
    "MAL": ["Horticultural Crops Directorate"],
    "NAM": ["Food Crops Directorate"],
    "TAV": ["Horticultural Crops Directorate"],
}

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        for d in SEED_DIRECTORATES:
            existing = await session.execute(select(Directorate).where(Directorate.code == d["code"]))
            if not existing.scalar_one_or_none():
                session.add(Directorate(**d))
        
        directorate_map = {}
        for d in SEED_DIRECTORATES:
            result = await session.execute(select(Directorate).where(Directorate.code == d["code"]))
            dir = result.scalar_one_or_none()
            if dir:
                directorate_map[d["code"]] = dir.id
        
        for dept_data in SEED_DEPARTMENTS:
            for directorate_code, directorate_id in directorate_map.items():
                existing = await session.execute(select(Department).where(Department.name == dept_data["name"], Department.directorate_id == directorate_id))
                if not existing.scalar_one_or_none():
                    session.add(Department(name=dept_data["name"], directorate_id=directorate_id))
        
        for b in SEED_BORDER_POINTS:
            existing = await session.execute(select(BorderPoint).where(BorderPoint.code == b["code"]))
            point = existing.scalar_one_or_none()
            if not point:
                session.add(BorderPoint(**b))
            else:
                point.name = b["name"]
                point.county = b["county"]
                point.country = b["country"]
                point.latitude = b["latitude"]
                point.longitude = b["longitude"]
                session.add(point)
        
        directorate_name_map = {}
        for d in SEED_DIRECTORATES:
            result = await session.execute(select(Directorate).where(Directorate.code == d["code"]))
            dir = result.scalar_one_or_none()
            if dir:
                directorate_name_map[dir.name] = dir.id
        
        for code, dept_names in SEED_BORDER_POINT_DIRECTORATES.items():
            result = await session.execute(select(BorderPoint).where(BorderPoint.code == code))
            point = result.scalar_one_or_none()
            if not point:
                continue
            for dept_name in dept_names:
                dir_id = directorate_name_map.get(dept_name)
                if not dir_id:
                    continue
                exists = await session.execute(select(border_point_directorates).where(
                    border_point_directorates.c.border_point_id == point.id,
                    border_point_directorates.c.directorate_id == dir_id,
                ))
                if not exists.scalar_one_or_none():
                    await session.execute(border_point_directorates.insert().values(
                        border_point_id=point.id,
                        directorate_id=dir_id,
                    ))
        
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
                    directorate_id=directorate_map.get(crop_data.get("directorate_code")),
                    department_id=None,
                )
                session.add(crop)
                await session.flush()
            crop_map[crop.name] = crop.id
        
        if "departments" in [t.name for t in Base.metadata.tables.values()]:
            for crop_data in SEED_CROPS:
                if not crop_data.get("directorate_code") or not crop_data.get("department_name"):
                    continue
                existing_crop = await session.execute(select(Crop).where(Crop.name == crop_data["name"]))
                crop = existing_crop.scalar_one_or_none()
                if not crop:
                    continue
                dir_id = directorate_map.get(crop_data["directorate_code"])
                if not dir_id:
                    continue
                dept_result = await session.execute(select(Department).where(Department.name == crop_data["department_name"], Department.directorate_id == dir_id))
                dept = dept_result.scalar_one_or_none()
                if dept:
                    crop.directorate_id = dept.directorate_id
                    crop.department_id = dept.id
                    session.add(crop)
        
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
