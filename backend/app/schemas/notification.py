from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
    title: str
    message: str
    type: Optional[str] = "info"
    read: Optional[bool] = False

class NotificationResponse(NotificationBase):
    id: int
    userId: int
    timestamp: datetime

    class Config:
        from_attributes = True
