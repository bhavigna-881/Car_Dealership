from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, vehicles, inventory

# Create database tables (For production we will use Alembic, but this is good for SQLite tests and simple setups)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Car Dealership API",
    description="API for managing a car dealership inventory system.",
    version="1.0.0"
)

# CORS Configuration - allowing our frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(inventory.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Car Dealership API"}
