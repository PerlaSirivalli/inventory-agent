from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, SessionLocal
from models import ProductDB, Base
from fastapi import Depends
from auth import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from auth import (
    hash_password,
    verify_password,
    create_access_token
)

from models import UserDB

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)


# Product model for creating product
class Product(BaseModel):
    name: str
    quantity: int


# Product model for updating product
class UpdateProduct(BaseModel):
    name: str
    quantity: int

class User(BaseModel):
    username: str
    password: str

# Home route
@app.get("/")
def home():
    return {"message": "Inventory Agent Backend"}

@app.post("/signup")
def signup(user: User):

    db: Session = SessionLocal()

    existing_user = db.query(UserDB).filter(
        UserDB.username == user.username
    ).first()

    if existing_user:
        return {
            "message": "Username already exists"
        }

    hashed_password = hash_password(
        user.password
    )

    new_user = UserDB(
        username=user.username,
        password=hashed_password
    )

    db.add(new_user)

    db.commit()

    return {
        "message": "User created successfully"
    }

@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    db: Session = SessionLocal()

    existing_user = db.query(UserDB).filter(
        UserDB.username == form_data.username
    ).first()

    if not existing_user:
        return {
            "message": "Invalid username"
        }

    valid_password = verify_password(
        form_data.password,
        existing_user.password
    )

    if not valid_password:
        return {
            "message": "Invalid password"
        }

    access_token = create_access_token(
        data={"sub": form_data.username}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
# Create product
@app.post("/products")
def add_product(
    product: Product,
    current_user: str = Depends(get_current_user)
):

    db: Session = SessionLocal()

    new_product = ProductDB(
        name=product.name,
        quantity=product.quantity
    )

    db.add(new_product)
    db.commit()

    return {
        "message": "Product added successfully"
    }


# Get all products
@app.get("/products")
def get_products():

    db: Session = SessionLocal()

    products = db.query(ProductDB).all()

    result = []

    for product in products:
        result.append({
            "id": product.id,
            "name": product.name,
            "quantity": product.quantity
        })

    return {"products": result}


# Get product by ID
@app.get("/products/{product_id}")
def get_product_by_id(product_id: int):

    db: Session = SessionLocal()

    product = db.query(ProductDB).filter(
        ProductDB.id == product_id
    ).first()

    if not product:
        return {"message": "Product not found"}

    return {
        "id": product.id,
        "name": product.name,
        "quantity": product.quantity
    }


# Search product by name
@app.get("/search")
def search_product(name: str):

    db: Session = SessionLocal()

    products = db.query(ProductDB).filter(
        ProductDB.name == name
    ).all()

    result = []

    for product in products:
        result.append({
            "id": product.id,
            "name": product.name,
            "quantity": product.quantity
        })

    return {"products": result}


# Update product
@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    updated_product: UpdateProduct,
    current_user: str = Depends(get_current_user)
):

    db: Session = SessionLocal()

    product = db.query(ProductDB).filter(
        ProductDB.id == product_id
    ).first()

    if not product:
        return {"message": "Product not found"}

    product.name = updated_product.name
    product.quantity = updated_product.quantity

    db.commit()

    return {
        "message": "Product updated successfully"
    }


# Delete product
@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    current_user: str = Depends(get_current_user)
):

    db: Session = SessionLocal()

    product = db.query(ProductDB).filter(
        ProductDB.id == product_id
    ).first()

    if not product:
        return {"message": "Product not found"}

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }