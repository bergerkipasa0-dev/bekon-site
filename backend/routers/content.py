import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from lib.auth import get_current_user
from lib.db import db

router = APIRouter(tags=["content"])

CATEGORIES = ("custom", "brand", "design", "digital")


class ProjectIn(BaseModel):
    title: str
    category: str
    description: str = ""
    client: str | None = None
    year: str | None = None
    software: list[str] = Field(default_factory=list)
    services: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    status: str = "published"
    featured: bool = False
    image_path: str | None = None
    gallery: list[str] = Field(default_factory=list)
    figma_url: str | None = None


class Project(ProjectIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ServiceIn(BaseModel):
    key: str
    name: str
    tagline: str = ""
    summary: str = ""
    items: list[str] = Field(default_factory=list)
    image_url: str | None = None
    active: bool = True
    order: int = 0


class Service(ServiceIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))


# ---------- Public ----------

@router.get("/projects", response_model=list[Project])
async def list_projects(category: str | None = None, featured: bool = False):
    query: dict = {"status": "published"}
    if category in CATEGORIES:
        query["category"] = category
    if featured:
        query["featured"] = True
    docs = await db.projects.find(query, {"_id": 0}).sort([("featured", -1), ("created_at", -1)]).to_list(500)
    return [Project(**d) for d in docs]


@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    doc = await db.projects.find_one({"id": project_id, "status": "published"}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Projet introuvable")
    return Project(**doc)


@router.get("/services", response_model=list[Service])
async def list_services():
    docs = await db.services.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(50)
    return [Service(**d) for d in docs]


# ---------- Admin ----------

@router.get("/admin/projects", response_model=list[Project])
async def admin_list_projects(user: dict = Depends(get_current_user)):
    docs = await db.projects.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Project(**d) for d in docs]


@router.post("/admin/projects", response_model=Project)
async def admin_create_project(body: ProjectIn, user: dict = Depends(get_current_user)):
    if body.category not in CATEGORIES:
        raise HTTPException(status_code=400, detail="Catégorie invalide")
    project = Project(**body.model_dump())
    await db.projects.insert_one(project.model_dump())
    return project


@router.put("/admin/projects/{project_id}", response_model=Project)
async def admin_update_project(project_id: str, body: ProjectIn, user: dict = Depends(get_current_user)):
    result = await db.projects.update_one({"id": project_id}, {"$set": body.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Projet introuvable")
    doc = await db.projects.find_one({"id": project_id}, {"_id": 0})
    return Project(**doc)


@router.delete("/admin/projects/{project_id}")
async def admin_delete_project(project_id: str, user: dict = Depends(get_current_user)):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Projet introuvable")
    return {"status": "deleted"}


@router.get("/admin/services", response_model=list[Service])
async def admin_list_services(user: dict = Depends(get_current_user)):
    docs = await db.services.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return [Service(**d) for d in docs]


@router.post("/admin/services", response_model=Service)
async def admin_create_service(body: ServiceIn, user: dict = Depends(get_current_user)):
    service = Service(**body.model_dump())
    await db.services.insert_one(service.model_dump())
    return service


@router.put("/admin/services/{service_id}", response_model=Service)
async def admin_update_service(service_id: str, body: ServiceIn, user: dict = Depends(get_current_user)):
    result = await db.services.update_one({"id": service_id}, {"$set": body.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service introuvable")
    doc = await db.services.find_one({"id": service_id}, {"_id": 0})
    return Service(**doc)


@router.delete("/admin/services/{service_id}")
async def admin_delete_service(service_id: str, user: dict = Depends(get_current_user)):
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service introuvable")
    return {"status": "deleted"}
