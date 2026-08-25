from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Table
from sqlalchemy.orm import relationship
from app.core.database import Base
from sqlalchemy import func

border_point_directorates = Table(
    "border_point_directorates",
    Base.metadata,
    Column("border_point_id", Integer, ForeignKey("border_points.id"), primary_key=True),
    Column("directorate_id", Integer, ForeignKey("directorates.id"), primary_key=True),
)

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
    directorates = relationship("Directorate", secondary=border_point_directorates, backref="border_points")
