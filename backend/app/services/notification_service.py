from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
from app.models.notification import Notification
from app.schemas.notification import NotificationResponse

def get_notifications(db: Session, user_id: int) -> List[NotificationResponse]:
    items = db.query(Notification).filter(Notification.userId == user_id).order_by(Notification.timestamp.desc()).all()
    return [NotificationResponse.model_validate(item) for item in items]

def mark_as_read(db: Session, user_id: int, notif_id: int) -> NotificationResponse:
    item = db.query(Notification).filter(Notification.id == notif_id, Notification.userId == user_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    item.read = True
    db.commit()
    db.refresh(item)
    return NotificationResponse.model_validate(item)

def mark_all_as_read(db: Session, user_id: int) -> List[NotificationResponse]:
    items = db.query(Notification).filter(Notification.userId == user_id).all()
    for item in items:
        item.read = True
    db.commit()
    return [NotificationResponse.model_validate(item) for item in items]

def delete_notification(db: Session, user_id: int, notif_id: int):
    item = db.query(Notification).filter(Notification.id == notif_id, Notification.userId == user_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    db.delete(item)
    db.commit()
