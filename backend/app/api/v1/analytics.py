from fastapi import APIRouter

router = APIRouter(prefix="/analytics")

@router.get("/directorate-volumes")
async def directorate_volumes():
    return []
