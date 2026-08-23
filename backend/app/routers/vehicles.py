from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy.orm import Session
from typing import List, Optional, Any
from .. import models, schemas
from ..database import get_db
from ..utils.deps import get_current_admin_user

router = APIRouter(
    prefix="/api/vehicles",
    tags=["vehicles"]
)

@router.get("", response_model=List[schemas.VehicleResponse])
def get_vehicles(db: Session = Depends(get_db)) -> Any:
    """
    Get all vehicles.
    """
    return db.query(models.Vehicle).all()

@router.get("/search", response_model=List[schemas.VehicleResponse])
def search_vehicles(
    make: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[int] = Query(None, alias="minPrice"),
    max_price: Optional[int] = Query(None, alias="maxPrice"),
    db: Session = Depends(get_db)
) -> Any:
    """
    Search vehicles by make, model, category, or price range.
    """
    query = db.query(models.Vehicle)
    
    if make:
        query = query.filter(models.Vehicle.make.ilike(f"%{make}%"))
    if model:
        query = query.filter(models.Vehicle.model.ilike(f"%{model}%"))
    if category:
        query = query.filter(models.Vehicle.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(models.Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Vehicle.price <= max_price)
        
    return query.all()

@router.post("", response_model=schemas.VehicleResponse, status_code=status.HTTP_201_CREATED)
def add_vehicle(
    vehicle_in: schemas.VehicleCreate, 
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
) -> Any:
    """
    Add a new vehicle (Admin only).
    """
    new_vehicle = models.Vehicle(
        make=vehicle_in.make,
        model=vehicle_in.model,
        category=vehicle_in.category,
        price=vehicle_in.price,
        quantity=vehicle_in.quantity
    )
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    return new_vehicle

@router.put("/{id}", response_model=schemas.VehicleResponse)
def update_vehicle(
    id: str, 
    vehicle_in: schemas.VehicleUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
) -> Any:
    """
    Update a vehicle's details (Admin only).
    """
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    update_data = vehicle_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(vehicle, key, value)
        
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def delete_vehicle(
    id: str,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    """
    Delete a vehicle (Admin only).
    """
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    db.delete(vehicle)
    db.commit()
    return None
