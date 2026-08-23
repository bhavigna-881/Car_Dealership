import uuid
from sqlalchemy import Column, String, Integer, Enum
from .database import Base
import enum

class RoleEnum(str, enum.Enum):
    customer = "customer"
    admin = "admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    mobile = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.customer, nullable=False)

class Vehicle(Base):
    __tablename__ = "vehicles"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    make = Column(String, index=True, nullable=False)
    model = Column(String, index=True, nullable=False)
    category = Column(String, index=True, nullable=False)
    price = Column(Integer, nullable=False)
    quantity = Column(Integer, default=0, nullable=False)
