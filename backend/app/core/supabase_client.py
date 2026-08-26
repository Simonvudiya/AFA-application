from supabase import create_client, Client
from app.core.config import settings

supabase: Client | None = None

def get_supabase() -> Client | None:
    global supabase
    if supabase is None:
        if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
            supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
    return supabase
