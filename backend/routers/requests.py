import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, EmailStr, Field

from lib.auth import get_current_user
from lib.db import db
from lib.emailer import notify_quote
from routers.files import QUOTE_EXT, store_file

router = APIRouter(tags=["requests"])

QUOTE_STATUSES = ("new", "discussion", "quote_sent", "accepted", "in_progress", "done", "cancelled")


class Quote(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    service: str
    description: str
    budget: str = ""
    deadline: str = ""
    name: str
    email: str
    phone: str = ""
    whatsapp: str = ""
    city: str = ""
    files: list[dict] = Field(default_factory=list)
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MessageIn(BaseModel):
    name: str
    email: EmailStr
    phone: str = ""
    message: str


class Message(MessageIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusBody(BaseModel):
    status: str


class ReadBody(BaseModel):
    read: bool


# ---------- Public ----------

@router.post("/quotes", response_model=Quote)
async def create_quote(
    service: str = Form(...),
    description: str = Form(...),
    budget: str = Form(""),
    deadline: str = Form(""),
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(""),
    whatsapp: str = Form(""),
    city: str = Form(""),
    files: list[UploadFile] = File(default=[]),
):
    stored_files = []
    for f in files[:5]:
        if f.filename:
            stored_files.append(await store_file(f, "quotes", "private", QUOTE_EXT))
    quote = Quote(
        service=service, description=description, budget=budget, deadline=deadline,
        name=name, email=email.lower(), phone=phone, whatsapp=whatsapp, city=city,
        files=stored_files,
    )
    await db.quotes.insert_one(quote.model_dump())
    await notify_quote(quote.model_dump())
    return quote


@router.post("/messages", response_model=Message)
async def create_message(body: MessageIn):
    message = Message(**body.model_dump())
    await db.messages.insert_one(message.model_dump())
    return message


# ---------- Admin ----------

@router.get("/admin/stats")
async def admin_stats(user: dict = Depends(get_current_user)):
    projects = await db.projects.count_documents({})
    published = await db.projects.count_documents({"status": "published"})
    quotes = await db.quotes.count_documents({})
    new_quotes = await db.quotes.count_documents({"status": "new"})
    services = await db.services.count_documents({})
    messages = await db.messages.count_documents({})
    latest_quotes = await db.quotes.find({}, {"_id": 0}).sort("created_at", -1).to_list(5)
    latest_projects = await db.projects.find({}, {"_id": 0}).sort("created_at", -1).to_list(5)
    return {
        "projects": projects, "published": published, "quotes": quotes,
        "new_quotes": new_quotes, "services": services, "messages": messages,
        "latest_quotes": latest_quotes, "latest_projects": latest_projects,
    }


@router.get("/admin/quotes", response_model=list[Quote])
async def admin_list_quotes(user: dict = Depends(get_current_user)):
    docs = await db.quotes.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Quote(**d) for d in docs]


@router.patch("/admin/quotes/{quote_id}", response_model=Quote)
async def admin_update_quote(quote_id: str, body: StatusBody, user: dict = Depends(get_current_user)):
    if body.status not in QUOTE_STATUSES:
        raise HTTPException(status_code=400, detail="Statut invalide")
    result = await db.quotes.update_one({"id": quote_id}, {"$set": {"status": body.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    doc = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
    return Quote(**doc)


@router.get("/admin/messages", response_model=list[Message])
async def admin_list_messages(user: dict = Depends(get_current_user)):
    docs = await db.messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Message(**d) for d in docs]


@router.patch("/admin/messages/{message_id}", response_model=Message)
async def admin_update_message(message_id: str, body: ReadBody, user: dict = Depends(get_current_user)):
    result = await db.messages.update_one({"id": message_id}, {"$set": {"read": body.read}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message introuvable")
    doc = await db.messages.find_one({"id": message_id}, {"_id": 0})
    return Message(**doc)
