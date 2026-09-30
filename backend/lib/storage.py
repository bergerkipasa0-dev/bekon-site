import logging

from motor.motor_asyncio import AsyncIOMotorGridFSBucket

from lib.db import db

logger = logging.getLogger(__name__)

APP_NAME = "bekon"

MIME_TYPES = {
    "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
    "gif": "image/gif", "webp": "image/webp", "svg": "image/svg+xml",
    "pdf": "application/pdf", "ai": "application/postscript",
    "psd": "image/vnd.adobe.photoshop", "zip": "application/zip",
}

_bucket = None


def get_bucket() -> AsyncIOMotorGridFSBucket:
    global _bucket
    if _bucket is None:
        _bucket = AsyncIOMotorGridFSBucket(db)
    return _bucket


async def put_object(path: str, data: bytes, content_type: str) -> dict:
    bucket = get_bucket()
    await bucket.upload_from_stream(path, data, metadata={"content_type": content_type})
    return {"path": path, "size": len(data)}


async def get_object(path: str) -> tuple[bytes, str]:
    bucket = get_bucket()
    cursor = bucket.find({"filename": path}).sort("uploadDate", -1).limit(1)
    docs = await cursor.to_list(length=1)
    if not docs:
        raise FileNotFoundError(path)
    file_id = docs[0]["_id"]
    stream = await bucket.open_download_stream(file_id)
    data = await stream.read()
    content_type = (docs[0].get("metadata") or {}).get("content_type", "application/octet-stream")
    return data, content_type
