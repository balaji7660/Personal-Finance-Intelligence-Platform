from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import notification_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("", response_model=dict)
def get_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = notification_service.get_notifications(db, current_user.id)
    return {
        "success": True,
        "message": "Notifications fetched successfully",
        "data": items
    }

@router.put("/{id}/read", response_model=dict)
def mark_as_read(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = notification_service.mark_as_read(db, current_user.id, id)
    return {
        "success": True,
        "message": "Notification marked as read",
        "data": item
    }

@router.put("/read-all", response_model=dict)
def mark_all_as_read(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = notification_service.mark_all_as_read(db, current_user.id)
    return {
        "success": True,
        "message": "All notifications marked as read",
        "data": items
    }

@router.delete("/{id}", response_model=dict)
def delete_notification(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notification_service.delete_notification(db, current_user.id, id)
    return {
        "success": True,
        "message": "Notification deleted successfully",
        "data": None
    }
