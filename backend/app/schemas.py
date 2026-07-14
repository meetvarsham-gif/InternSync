"""Pydantic v2 schemas for request validation and response serialization."""
from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class Priority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class Status(str, Enum):
    BACKLOG = "Backlog"
    TODO = "To Do"
    IN_PROGRESS = "In Progress"
    REVIEW = "Review"
    COMPLETED = "Completed"


# ---------------------------------------------------------------------------
# Task schemas
# ---------------------------------------------------------------------------

class TaskBase(BaseModel):
    title: str = Field(..., max_length=100, min_length=1)
    description: str = Field(..., min_length=10)
    category: str = Field(..., max_length=50, min_length=1)
    priority: Priority
    status: Status = Status.BACKLOG
    progress: int = Field(default=0, ge=0, le=100)
    due_date: date
    estimated_hours: Optional[float] = Field(default=None, ge=0)
    tags: Optional[str] = None

    @field_validator("due_date")
    @classmethod
    def due_date_not_in_past(cls, value: date) -> date:
        if value < date.today():
            raise ValueError("due_date must be greater than or equal to the current date")
        return value


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    """Full-record update payload. All fields are required, matching PUT semantics,
    except progress which may be recomputed server-side based on status."""

    title: str = Field(..., max_length=100, min_length=1)
    description: str = Field(..., min_length=10)
    category: str = Field(..., max_length=50, min_length=1)
    priority: Priority
    status: Status
    progress: int = Field(default=0, ge=0, le=100)
    due_date: date
    estimated_hours: Optional[float] = Field(default=None, ge=0)
    tags: Optional[str] = None


class TaskStatusUpdate(BaseModel):
    status: Status


class TaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    category: str
    priority: Priority
    status: Status
    progress: int
    due_date: date
    estimated_hours: Optional[float]
    tags: Optional[str]
    created_at: datetime
    updated_at: datetime


class TaskListResponse(BaseModel):
    total: int
    items: list[TaskOut]


# ---------------------------------------------------------------------------
# Activity log schemas
# ---------------------------------------------------------------------------

class ActivityLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    task_id: int
    action: str
    timestamp: datetime


# ---------------------------------------------------------------------------
# Dashboard schemas
# ---------------------------------------------------------------------------

class DashboardStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    pending_tasks: int
    overdue_tasks: int
    overall_progress: float
    recent_activity: list[ActivityLogOut]
    urgent_deadlines: list[TaskOut]
    status_distribution: dict[str, int]
    weekly_completions: list[dict]
