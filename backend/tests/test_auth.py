import pytest

def test_register_user_success(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "testuser@example.com",
            "mobile": "1234567890",
            "password": "password123"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "testuser@example.com"
    assert data["name"] == "Test User"
    assert "id" in data
    assert "hashed_password" not in data
    
    # First user is made admin automatically based on our auth router logic
    assert data["role"] == "admin"

def test_register_user_duplicate(client):
    # Register first user
    client.post(
        "/api/auth/register",
        json={
            "name": "First User",
            "email": "duplicate@example.com",
            "mobile": "1234567890",
            "password": "password123"
        }
    )
    
    # Try to register same email again
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Second User",
            "email": "duplicate@example.com",
            "mobile": "0987654321",
            "password": "password123"
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "The user with this email already exists in the system."

def test_register_invalid_email(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "invalid-email-format",
            "mobile": "1234567890",
            "password": "password123"
        }
    )
    # Pydantic should catch this and return a 422 Unprocessable Entity
    assert response.status_code == 422

def test_login_success(client):
    # Register user first
    client.post(
        "/api/auth/register",
        json={
            "name": "Login User",
            "email": "login@example.com",
            "mobile": "1234567890",
            "password": "password123"
        }
    )
    
    # Login
    response = client.post(
        "/api/auth/login",
        json={
            "email": "login@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client):
    # Register user first
    client.post(
        "/api/auth/register",
        json={
            "name": "Login User",
            "email": "login2@example.com",
            "mobile": "1234567890",
            "password": "password123"
        }
    )
    
    # Login with wrong password
    response = client.post(
        "/api/auth/login",
        json={
            "email": "login2@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401

def test_protected_route_invalid_token(client):
    # Try to access a protected route without token
    response = client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": 5
        },
        headers={"Authorization": "Bearer invalid.token.here"}
    )
    assert response.status_code == 401
