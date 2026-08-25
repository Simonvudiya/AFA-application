from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
from sqlalchemy import func

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(120))
    role = Column(String(50), nullable=False)
    directorate_id = Column(Integer, nullable=True)
    department_id = Column(Integer, nullable=True)
    border_point_id = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    consignments = relationship("Consignment", backref="officer")
    inspections = relationship("Inspection", backref="officer")
    audit_logs = relationship("AuditLog", backref="actor")
