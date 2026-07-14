"""Data-access layer: all direct ORM/session interactions live here so that
routers stay thin and focused on HTTP concerns."""
from datetime import date, timedelta
from typing import Optional

from sqlalchemy import select, func, or_, case
from sqlalchemy.orm import Session

from app import models, schemas

COMPLETED = schemas.Status.COMPLETED.value
IN_PROGRESS = schemas.Status.IN_PROGRESS.value

SORT_MAP = {
    "newest": models.Task.created_at.desc(),
    "oldest": models.Task.created_at.asc(),
    "due_date": models.Task.due_date.asc(),
    "priority": case(
        (models.Task.priority == "High", 0),
        (models.Task.priority == "Medium", 1),
        (models.Task.priority == "Low", 2),
        else_=3,
    ).asc(),
}


def _log(db: Session, task_id: int, action: str) -> None:
    db.add(models.ActivityLog(task_id=task_id, action=action))


# ---------------------------------------------------------------------------
# Task CRUD
# ---------------------------------------------------------------------------

def get_tasks(
    db: Session,
    search: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: Optional[str] = None,
) -> list[models.Task]:
    stmt = select(models.Task)

    if search:
        like = f"%{search}%"
        stmt = stmt.where(
            or_(models.Task.title.ilike(like), models.Task.description.ilike(like))
        )
    if status:
        stmt = stmt.where(models.Task.status == status)
    if priority:
        stmt = stmt.where(models.Task.priority == priority)
    if category:
        stmt = stmt.where(models.Task.category == category)

    order_clause = SORT_MAP.get((sort_by or "newest").lower(), SORT_MAP["newest"])
    stmt = stmt.order_by(order_clause)

    return list(db.execute(stmt).scalars().all())


def get_task(db: Session, task_id: int) -> Optional[models.Task]:
    return db.get(models.Task, task_id)


def create_task(db: Session, payload: schemas.TaskCreate) -> models.Task:
    data = payload.model_dump()
    data["priority"] = data["priority"].value if hasattr(data["priority"], "value") else data["priority"]
    data["status"] = data["status"].value if hasattr(data["status"], "value") else data["status"]

    if data["status"] == COMPLETED:
        data["progress"] = 100

    task = models.Task(**data)
    db.add(task)
    db.flush()
    _log(db, task.id, "Task Created")
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task: models.Task, payload: schemas.TaskUpdate) -> models.Task:
    data = payload.model_dump()
    data["priority"] = data["priority"].value if hasattr(data["priority"], "value") else data["priority"]
    data["status"] = data["status"].value if hasattr(data["status"], "value") else data["status"]

    old_status, old_priority, old_progress = task.status, task.priority, task.progress

    new_status = data["status"]
    new_progress = data["progress"]

    # Business rule: completing a task forces progress to 100%.
    if new_status == COMPLETED:
        new_progress = 100
    # Business rule: moving off "Completed" rolls back a stale 100% progress
    # value so it is reopened for manual adjustment.
    elif old_status == COMPLETED and new_status != COMPLETED and new_progress == 100:
        new_progress = 90

    for field, value in data.items():
        setattr(task, field, value)
    task.progress = new_progress

    if old_status != new_status:
        _log(db, task.id, f"Changed Status to {new_status}")
    if old_priority != data["priority"]:
        _log(db, task.id, f"Changed Priority to {data['priority']}")
    if old_progress != new_progress:
        _log(db, task.id, f"Updated Progress to {new_progress}%")
    if old_status == new_status and old_priority == data["priority"] and old_progress == new_progress:
        _log(db, task.id, "Task Details Updated")

    db.commit()
    db.refresh(task)
    return task


def update_task_status(db: Session, task: models.Task, new_status: str) -> models.Task:
    old_status = task.status
    task.status = new_status

    if new_status == COMPLETED:
        task.progress = 100
    elif old_status == COMPLETED and task.progress == 100:
        task.progress = 90

    if old_status != new_status:
        _log(db, task.id, f"Changed Status to {new_status}")

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: models.Task) -> None:
    db.delete(task)
    db.commit()


def get_logs(db: Session, task_id: int) -> list[models.ActivityLog]:
    stmt = (
        select(models.ActivityLog)
        .where(models.ActivityLog.task_id == task_id)
        .order_by(models.ActivityLog.timestamp.desc())
    )
    return list(db.execute(stmt).scalars().all())


# ---------------------------------------------------------------------------
# Dashboard aggregation
# ---------------------------------------------------------------------------

def get_dashboard_stats(db: Session) -> dict:
    tasks = list(db.execute(select(models.Task)).scalars().all())
    today = date.today()

    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status == COMPLETED)
    in_progress_tasks = sum(1 for t in tasks if t.status == IN_PROGRESS)
    overdue_tasks = sum(1 for t in tasks if t.due_date < today and t.status != COMPLETED)
    pending_tasks = sum(
        1 for t in tasks if t.status not in (COMPLETED, IN_PROGRESS)
    )

    overall_progress = (
        round(sum(t.progress for t in tasks) / total_tasks, 2) if total_tasks else 0.0
    )

    status_distribution: dict[str, int] = {}
    for t in tasks:
        status_distribution[t.status] = status_distribution.get(t.status, 0) + 1

    recent_activity = list(
        db.execute(
            select(models.ActivityLog).order_by(models.ActivityLog.timestamp.desc()).limit(5)
        )
        .scalars()
        .all()
    )

    week_from_now = today + timedelta(days=7)
    urgent_deadlines = sorted(
        (t for t in tasks if today <= t.due_date <= week_from_now and t.status != COMPLETED),
        key=lambda t: t.due_date,
    )

    weekly_completions = []
    for i in range(5, -1, -1):
        week_start = today - timedelta(days=today.weekday() + 7 * i)
        week_end = week_start + timedelta(days=6)
        count = sum(
            1
            for t in tasks
            if t.status == COMPLETED and week_start <= t.updated_at.date() <= week_end
        )
        weekly_completions.append(
            {"week": week_start.strftime("%b %d"), "completed": count}
        )

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "in_progress_tasks": in_progress_tasks,
        "pending_tasks": pending_tasks,
        "overdue_tasks": overdue_tasks,
        "overall_progress": overall_progress,
        "recent_activity": recent_activity,
        "urgent_deadlines": urgent_deadlines,
        "status_distribution": status_distribution,
        "weekly_completions": weekly_completions,
    }
