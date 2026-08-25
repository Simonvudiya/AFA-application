# Deployment

## Docker Compose
```bash
docker compose up --build
```

## Backend only
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Frontend only
```bash
cd frontend
npm install
npm run dev
```
