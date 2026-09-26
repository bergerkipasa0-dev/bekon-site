import asyncio
import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

from lib.db import client, db, ensure_indexes
from lib.auth import hash_password, verify_password
from lib.storage import init_storage
from routers import auth as auth_router
from routers import content as content_router
from routers import files as files_router
from routers import requests as requests_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

SEED_SERVICES = [
    {
        "key": "custom", "name": "BEKON Custom", "tagline": "Ton PC. Ton identité.",
        "summary": "Customisation d'ordinateurs, tours gaming, laptops, consoles et matériel esport. Vinyles haute résistance, découpe laser et finitions premium.",
        "items": ["Customisation de PC", "Customisation de laptops", "Customisation de consoles", "Skins & vinyles", "Habillage complet", "Designs gaming"],
        "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxnYW1pbmclMjBwYyUyMGN1c3RvbSUyMG1vZCUyMGJ1aWxkJTIwc2V0dXB8ZW58MHx8fHwxNzg5MzgzMTY4fDA&ixlib=rb-4.1.0&q=85",
        "order": 1,
    },
    {
        "key": "brand", "name": "BEKON Brand", "tagline": "Donner une âme à votre marque.",
        "summary": "Création de logos distinctifs, identités visuelles complètes, chartes graphiques et systèmes de marque sur-mesure.",
        "items": ["Création de logo", "Identité visuelle", "Charte graphique", "Branding", "Cartes de visite", "Packaging"],
        "image_url": "https://images.unsplash.com/photo-1781643916032-c3486975e579?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwyfHxicmFuZCUyMGlkZW50aXR5JTIwdmlzdWFsJTIwZGVzaWduJTIwdHlwb2dyYXBoeSUyMG1vY2t1cHxlbnwwfHx8fDE3ODkzODMxNjh8MA&ixlib=rb-4.1.0&q=85",
        "order": 2,
    },
    {
        "key": "design", "name": "BEKON Design", "tagline": "L'art de l'impact visuel.",
        "summary": "Affiches événementielles, flyers, bannières publicitaires, roll-ups et supports imprimés à forte densité créative.",
        "items": ["Affiches & posters", "Flyers", "Bannières", "Roll-up", "Menus & invitations", "Supports événementiels"],
        "image_url": "https://images.unsplash.com/photo-1762365189058-7be5b07e038b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGlkZW50aXR5JTIwdmlzdWFsJTIwZGVzaWduJTIwdHlwb2dyYXBoeSUyMG1vY2t1cHxlbnwwfHx8fDE3ODkzODMxNjh8MA&ixlib=rb-4.1.0&q=85",
        "order": 3,
    },
    {
        "key": "digital", "name": "BEKON Digital", "tagline": "Expériences numériques immersives.",
        "summary": "UI/UX design, maquettes Figma pixel-perfect, prototypes interactifs, sites web, applications et landing pages.",
        "items": ["UI Design", "UX Design", "Figma & wireframes", "Prototypes interactifs", "Sites web & landing pages", "Applications mobiles"],
        "image_url": "https://images.unsplash.com/photo-1634084462412-b54873c0a56d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjB3ZWIlMjBkZXZlbG9wbWVudCUyMGFwcGxpY2F0aW9uJTIwVUklMjBkZXNpZ24lMjBkYXJrJTIwbW9kZXxlbnwwfHx8fDE3ODg2NzEyNDF8MA&ixlib=rb-4.1.0&q=85",
        "order": 4,
    },
]


async def seed_admin():
    from datetime import datetime, timezone
    import uuid
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@bekon.studio").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Bekon@2026")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "BEKON Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc),
        })
        logger.info(f"Admin seeded: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated from env")


async def seed_services():
    for s in SEED_SERVICES:
        exists = await db.services.find_one({"key": s["key"]})
        if not exists:
            import uuid
            await db.services.insert_one({"id": str(uuid.uuid4()), "active": True, **s})
    logger.info("Services seeded")


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.index_task = asyncio.create_task(ensure_indexes())
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await seed_admin()
    await seed_services()
    try:
        await asyncio.to_thread(init_storage)
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
    yield
    client.close()


app = FastAPI(lifespan=lifespan)

api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"message": "BEKON API"}


api_router.include_router(auth_router.router)
api_router.include_router(content_router.router)
api_router.include_router(files_router.router)
api_router.include_router(requests_router.router)
app.include_router(api_router)

origins = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip() and o.strip() != "*"]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins or ["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
