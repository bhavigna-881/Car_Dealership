from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any
from .. import models, schemas
from ..database import get_db
from ..utils.deps import get_current_user, get_current_admin_user

router = APIRouter(
    prefix="/api/vehicles",
    tags=["inventory"]
)

@router.post("/{id}/purchase", response_model=schemas.VehicleResponse)
def purchase_vehicle(
    id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """
    Purchase a vehicle, decreasing its quantity (Protected).
    """
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    if vehicle.quantity <= 0:
        raise HTTPException(status_code=400, detail="Vehicle is out of stock")
        
    vehicle.quantity -= 1
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.post("/{id}/restock", response_model=schemas.VehicleResponse)
def restock_vehicle(
    id: str,
    amount: int = 1, # Default restock amount is 1
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
) -> Any:
    """
    Restock a vehicle, increasing its quantity (Admin only).
    """
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    vehicle.quantity += amount
    db.commit()
    db.refresh(vehicle)
    return vehicle
