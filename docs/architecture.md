# Architecture

## Overview
AFA CBIRS is a FastAPI + React PWA for crop border intelligence and reporting.

## Backend
- FastAPI (async)
- SQLAlchemy 2.0 async
- PostGIS via geoalchemy2
- JWT auth
- Alembic migrations

## Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand state
- React Router
- PWA / offline-first with IndexedDB

## Data Flow
1. Officer creates consignment at border
2. If offline, saved to IndexedDB
3. When online, synced to backend
4. HQ views national dashboard with maps and analytics
