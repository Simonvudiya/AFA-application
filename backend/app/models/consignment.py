from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
from sqlalchemy import func
import enum

class DirectionEnum(str, enum.Enum):
    IMPORT = "Import into Kenya"
    EXPORT = "Export from Kenya"
    TRANSIT = "Transit"
    RE_EXPORT = "Re-export"

class Consignment(Base):
    __tablename__ = "consignments"
    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(20), unique=True)
    date = Column(DateTime, default=func.now())
    border_point_id = Column(Integer, ForeignKey("border_points.id"), nullable=False)
    officer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_product_id = Column(Integer, ForeignKey("crop_products.id"), nullable=False)
    direction = Column(Enum(DirectionEnum), nullable=False)
    country_origin = Column(String(120))
    country_destination = Column(String(120))
    
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)
    
    standard_quantity = Column(Float)
    standard_unit = Column(String(20), default="tonnes")
    
    vehicle_reg = Column(String(20))
    consignment_doc = Column(String(50))
    trader_company = Column(String(100))
    inspection_status = Column(String(50))
    remarks = Column(Text)
    gps_coordinates = Column(String(100))
    time_of_entry = Column(DateTime)
    
    status = Column(String(20), default="draft")
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    attachments = relationship("Attachment", backref="consignment", cascade="all, delete-orphan")
    approvals = relationship("Approval", backref="consignment", cascade="all, delete-orphan")
