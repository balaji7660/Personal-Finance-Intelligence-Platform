from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse
from app.services import goal_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/goals", tags=["Financial Goals"])

@router.get("", response_model=dict)
def get_goals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = goal_service.get_goals(db, current_user.id)
    return {
        "success": True,
        "message": "Financial goals fetched successfully",
        "data": items
    }

@router.get("/{id}", response_model=dict)
def get_goal_by_id(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = goal_service.get_goal_by_id(db, current_user.id, id)
    return {
        "success": True,
        "message": "Goal fetched successfully",
        "data": item
    }

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_goal(dto: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = goal_service.create_goal(db, current_user.id, dto)
    return {
        "success": True,
        "message": "Financial goal created successfully",
        "data": item
    }

@router.put("/{id}", response_model=dict)
def update_goal(id: int, dto: GoalUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = goal_service.update_goal(db, current_user.id, id, dto)
    return {
        "success": True,
        "message": "Goal updated successfully",
        "data": item
    }

@router.delete("/{id}", response_model=dict)
def delete_goal(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    goal_service.delete_goal(db, current_user.id, id)
    return {
        "success": True,
        "message": "Goal deleted successfully",
        "data": None
    }
