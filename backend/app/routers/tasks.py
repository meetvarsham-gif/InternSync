"""Task CRUD and activity-log endpoints."""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status as http_status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("", response_model=schemas.TaskListResponse)
def list_tasks(
    search: Optional[str] = Query(default=None, description="Matches title or description"),
    status: Optional[schemas.Status] = Query(default=None),
    priority: Optional[schemas.Priority] = Query(default=None),
    category: Optional[str] = Query(default=None),
    sort_by: Optional[str] = Query(
        default="newest", description="newest | oldest | due_date | priority"
    ),
    db: Session = Depends(get_db),
):
    tasks = crud.get_tasks(
        db,
        search=search,
        status=status.value if status else None,
        priority=priority.value if priority else None,
        category=category,
        sort_by=sort_by,
    )
    return {"total": len(tasks), "items": tasks}


@router.get("/{task_id}", response_model=schemas.TaskOut)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.post("", response_model=schemas.TaskOut, status_code=http_status.HTTP_201_CREATED)
def create_task(payload: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db, payload)


@router.put("/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: int, payload: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Task not found")
    return crud.update_task(db, task, payload)


@router.patch("/{task_id}/status", response_model=schemas.TaskOut)
def patch_task_status(task_id: int, payload: schemas.TaskStatusUpdate, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Task not found")
    return crud.update_task_status(db, task, payload.status.value)


@router.delete("/{task_id}", status_code=http_status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Task not found")
    crud.delete_task(db, task)
    return None


@router.get("/{task_id}/logs", response_model=list[schemas.ActivityLogOut])
def get_task_logs(task_id: int, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Task not found")
    return crud.get_logs(db, task_id)
