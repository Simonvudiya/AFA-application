from fastapi import APIRouter

router = APIRouter()

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.directorates import router as directorates_router
from app.api.v1.departments import router as departments_router
from app.api.v1.crops import router as crops_router
from app.api.v1.border_points import router as border_points_router
from app.api.v1.consignments import router as consignments_router
from app.api.v1.inspections import router as inspections_router
from app.api.v1.reports import router as reports_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.sync import router as sync_router

router.include_router(auth_router)
router.include_router(users_router)
router.include_router(directorates_router)
router.include_router(departments_router)
router.include_router(crops_router)
router.include_router(border_points_router)
router.include_router(consignments_router)
router.include_router(inspections_router)
router.include_router(reports_router)
router.include_router(analytics_router)
router.include_router(sync_router)
