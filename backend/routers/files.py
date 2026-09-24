import asyncio
import uuid
from datetime import datetime, timezone

import jwt
from fastapi import APIRouter, Depends, File, HTTPException, Query, Request, Response, UploadFile

from lib.auth import decode_token, get_current_user
from lib.db import db
from lib.storage import APP_NAME, MIME_TYPES, get_object, put_object

router = APIRouter(tags=["files"])

MAX_FILE_SIZE = 25 * 1024 * 1024
IMAGE_EXT = {"jpg", "jpeg", "png", "webp", "gif", "svg"}
QUOTE_EXT = {"jpg", "jpeg", "png", "pdf", "svg", "ai", "psd", "zip"}


async def store_file(file: UploadFile, folder: str, kind: str, allowed: set[str]) -> dict:
    ext = (file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else "")
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"Format .{ext} non autorisé")
    data = await file.read()
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Fichier trop volumineux (25 Mo max)")
    content_type = file.content_type or MIME_TYPES.get(ext, "application/octet-stream")
    path = f"{APP_NAME}/{folder}/{uuid.uuid4()}.{ext}"
    result = await asyncio.to_thread(put_object, path, data, content_type)
    record = {
        "id": str(uuid.uuid4()),
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result["size"],
        "kind": kind,
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc),
    }
    await db.files.insert_one(record)
    return {"path": result["path"], "filename": file.filename, "size": result["size"], "content_type": content_type}


@router.post("/admin/upload")
async def admin_upload(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    stored = await store_file(file, "images", "public", IMAGE_EXT)
    return {"path": stored["path"], "url": f"/api/files/{stored['path']}"}


@router.get("/files/{path:path}")
async def download_file(path: str, request: Request, auth: str | None = Query(None)):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Fichier introuvable")
    if record.get("kind") != "public":
        token = request.cookies.get("access_token") or auth
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
        try:
            decode_token(token)
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")
    data, content_type = await asyncio.to_thread(get_object, path)
    return Response(content=data, media_type=record.get("content_type", content_type))
