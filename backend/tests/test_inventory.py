import pytest
from .test_vehicles import get_admin_token, get_customer_token

def test_purchase_vehicle_success(client):
    admin_token = get_admin_token(client)
    customer_token = get_customer_token(client)
    
    # Add a vehicle to buy
    res = client.post(
        "/api/vehicles",
        json={"make": "Subaru", "model": "Outback", "category": "SUV", "price": 30000, "quantity": 1},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    vehicle_id = res.json()["id"]
    
    # Buy it as a customer
    purchase_res = client.post(
        f"/api/vehicles/{vehicle_id}/purchase",
        headers={"Authorization": f"Bearer {customer_token}"}
    )
    assert purchase_res.status_code == 200
    assert purchase_res.json()["quantity"] == 0

def test_purchase_vehicle_out_of_stock(client):
    admin_token = get_admin_token(client)
    customer_token = get_customer_token(client)
    
    res = client.post(
        "/api/vehicles",
        json={"make": "Subaru", "model": "Crosstrek", "category": "SUV", "price": 28000, "quantity": 0},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    vehicle_id = res.json()["id"]
    
    # Try to buy it
    purchase_res = client.post(
        f"/api/vehicles/{vehicle_id}/purchase",
        headers={"Authorization": f"Bearer {customer_token}"}
    )
    assert purchase_res.status_code == 400
    assert purchase_res.json()["detail"] == "Vehicle is out of stock"

def test_purchase_nonexistent_vehicle(client):
    customer_token = get_customer_token(client)
    purchase_res = client.post(
        "/api/vehicles/non-existent-id/purchase",
        headers={"Authorization": f"Bearer {customer_token}"}
    )
    assert purchase_res.status_code == 404

def test_restock_vehicle_as_admin(client):
    admin_token = get_admin_token(client)
    
    res = client.post(
        "/api/vehicles",
        json={"make": "Nissan", "model": "Altima", "category": "Sedan", "price": 24000, "quantity": 2},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    vehicle_id = res.json()["id"]
    
    restock_res = client.post(
        f"/api/vehicles/{vehicle_id}/restock?amount=3",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert restock_res.status_code == 200
    assert restock_res.json()["quantity"] == 5

def test_restock_vehicle_as_customer(client):
    admin_token = get_admin_token(client)
    customer_token = get_customer_token(client)
    
    res = client.post(
        "/api/vehicles",
        json={"make": "Nissan", "model": "Rogue", "category": "SUV", "price": 28000, "quantity": 2},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    vehicle_id = res.json()["id"]
    
    restock_res = client.post(
        f"/api/vehicles/{vehicle_id}/restock?amount=3",
        headers={"Authorization": f"Bearer {customer_token}"}
    )
    assert restock_res.status_code == 403
