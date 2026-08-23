import pytest

def get_admin_token(client):
    # First user registered is an admin
    client.post(
        "/api/auth/register",
        json={
            "name": "Admin User",
            "email": "admin@example.com",
            "mobile": "1234567890",
            "password": "password123"
        }
    )
    res = client.post(
        "/api/auth/login",
        json={
            "name": "Admin User",
            "email": "admin@example.com",
            "mobile": "1234567890",
            "password": "password123"
        }
    )
    return res.json()["access_token"]

def get_customer_token(client):
    # Ensure there's a first user so this one is a customer
    get_admin_token(client)
    
    client.post(
        "/api/auth/register",
        json={
            "name": "Customer User",
            "email": "customer@example.com",
            "mobile": "1234567890",
            "password": "password123"
        }
    )
    res = client.post(
        "/api/auth/login",
        json={
            "name": "Customer User",
            "email": "customer@example.com",
            "mobile": "1234567890",
            "password": "password123"
        }
    )
    return res.json()["access_token"]

def test_add_vehicle_as_admin(client):
    token = get_admin_token(client)
    response = client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": 5
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Toyota"
    assert "id" in data

def test_add_vehicle_as_customer(client):
    token = get_customer_token(client)
    response = client.post(
        "/api/vehicles",
        json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": 22000,
            "quantity": 5
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "The user doesn't have enough privileges"

def test_add_vehicle_missing_fields(client):
    token = get_admin_token(client)
    response = client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            # missing model, category, etc.
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 422

def test_get_all_vehicles(client):
    # Add a vehicle first
    token = get_admin_token(client)
    client.post(
        "/api/vehicles",
        json={
            "make": "Ford",
            "model": "Mustang",
            "category": "Coupe",
            "price": 35000,
            "quantity": 2
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    
    response = client.get("/api/vehicles")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["make"] == "Ford"

def test_search_vehicles(client):
    token = get_admin_token(client)
    client.post("/api/vehicles", json={"make": "Tesla", "model": "Model 3", "category": "Sedan", "price": 45000, "quantity": 10}, headers={"Authorization": f"Bearer {token}"})
    client.post("/api/vehicles", json={"make": "Tesla", "model": "Model S", "category": "Sedan", "price": 80000, "quantity": 5}, headers={"Authorization": f"Bearer {token}"})
    
    # Search by make
    res_make = client.get("/api/vehicles/search?make=tesla")
    assert len(res_make.json()) == 2
    
    # Search by price
    res_price = client.get("/api/vehicles/search?maxPrice=50000")
    assert len(res_price.json()) == 1
    assert res_price.json()[0]["model"] == "Model 3"

def test_update_vehicle_as_admin(client):
    token = get_admin_token(client)
    res = client.post(
        "/api/vehicles",
        json={"make": "Jeep", "model": "Wrangler", "category": "SUV", "price": 30000, "quantity": 1},
        headers={"Authorization": f"Bearer {token}"}
    )
    vehicle_id = res.json()["id"]
    
    update_res = client.put(
        f"/api/vehicles/{vehicle_id}",
        json={"price": 32000},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert update_res.status_code == 200
    assert update_res.json()["price"] == 32000

def test_update_nonexistent_vehicle(client):
    token = get_admin_token(client)
    update_res = client.put(
        "/api/vehicles/non-existent-id",
        json={"price": 32000},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert update_res.status_code == 404

def test_delete_vehicle_as_admin(client):
    token = get_admin_token(client)
    res = client.post(
        "/api/vehicles",
        json={"make": "Mazda", "model": "CX-5", "category": "SUV", "price": 28000, "quantity": 1},
        headers={"Authorization": f"Bearer {token}"}
    )
    vehicle_id = res.json()["id"]
    
    del_res = client.delete(
        f"/api/vehicles/{vehicle_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert del_res.status_code == 204
    
    get_res = client.get("/api/vehicles")
    assert len([v for v in get_res.json() if v["id"] == vehicle_id]) == 0
