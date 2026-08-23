from pydantic import BaseModel, EmailStr
from typing import Optional, List
from .models import RoleEnum

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    mobile: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: RoleEnum

    class Config:
        from_attributes = True

# Vehicle Schemas
class VehicleBase(BaseModel):
    make: str
    model: str
    category: str
    price: int
    quantity: int

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None
    price: Optional[int] = None
    quantity: Optional[int] = None

class VehicleResponse(VehicleBase):
    id: str

    class Config:
        from_attributes = True
