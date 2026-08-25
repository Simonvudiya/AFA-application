from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
from sqlalchemy import func
import enum

class InspectionStatus(str, enum.Enum):
    PENDING = "pending"
    PASSED = "passed"
    FAILED = "failed"

class Inspection(Base):
    __tablename__ = "inspections"
    id = Column(Integer, primary_key=True, index=True)
    consignment_id = Column(Integer, ForeignKey("consignments.id"), nullable=False)
    officer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(InspectionStatus), nullable=False, default=InspectionStatus.PENDING)
    findings = Column(Text)
    quantity_checked = Column(Float)
    unit = Column(String(20))
    created_at = Column(DateTime, default=func.now())
