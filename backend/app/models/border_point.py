from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from sqlalchemy import func

class BorderPoint(Base):
    __tablename__ = "border_points"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    county = Column(String(120))
    country = Column(String(120))
    latitude = Column(Float)
    longitude = Column(Float)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=func.now())

    consignments = relationship("Consignment", backref="border_point")
