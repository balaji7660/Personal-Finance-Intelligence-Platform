from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)
    investedAmount = Column(Numeric(12, 2), nullable=False)
    currentValue = Column(Numeric(12, 2), nullable=True)
    purchaseDate = Column(Date, nullable=False)
    quantity = Column(Numeric(10, 4), nullable=True)
    riskLevel = Column(String(50), default="Moderate")
    notes = Column(String(500), nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="investments")
