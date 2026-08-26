from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from sqlalchemy import func

class CropCategory(Base):
    __tablename__ = "crop_categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), unique=True, nullable=False)
    description = Column(Text)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=func.now())

    crops = relationship("Crop", backref="category")

class Crop(Base):
    __tablename__ = "crops"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    category_id = Column(Integer, ForeignKey("crop_categories.id"), nullable=False)
    scientific_name = Column(String(120))
    hs_code = Column(String(20))
    default_bag_weight_kg = Column(Float, nullable=True)
    directorate_id = Column(Integer, ForeignKey("directorates.id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=func.now())

    products = relationship("CropProduct", backref="crop")

class CropProduct(Base):
    __tablename__ = "crop_products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    crop_id = Column(Integer, ForeignKey("crops.id"), nullable=False)
    unit = Column(String(50), nullable=False)
    default_bag_weight_kg = Column(Float, nullable=True)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=func.now())
