from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from models import ProductDB, SaleDB

from auth import get_current_user
from datetime import timedelta
router = APIRouter()


class Product(BaseModel):
    name: str
    quantity: int


class UpdateProduct(BaseModel):
    quantity: int


class Sale(BaseModel):
    product_id: int
    quantity_sold: int


# Create product
@router.post("/products")
def add_product(
    product: Product,
    current_user: str = Depends(get_current_user)
):

    db: Session = SessionLocal()

    try:

        if product.quantity <= 0:
            return {
                "message": "Quantity must be greater than 0"
            }

        existing_product = db.query(ProductDB).filter(
            ProductDB.name == product.name
        ).first()

        if existing_product:

            existing_product.quantity += product.quantity

            db.commit()

            return {
                "message": "Product quantity updated"
            }

        new_product = ProductDB(
            name=product.name,
            quantity=product.quantity
        )

        db.add(new_product)

        db.commit()

        return {
            "message": "Product added successfully"
        }

    finally:
        db.close()

# Record sale
@router.post("/sales")
def add_sale(sale: Sale):

    db: Session = SessionLocal()

    try:

        product = db.query(ProductDB).filter(
            ProductDB.id == sale.product_id
        ).first()

        if not product:
            return {
                "message": "Product not found"
            }

        if sale.quantity_sold <= 0:
            return {
                "message": "Quantity sold must be greater than 0"
            }

        if sale.quantity_sold > product.quantity:
            return {
                "message": "Insufficient stock"
            }

        new_sale = SaleDB(
            product_id=sale.product_id,
            quantity_sold=sale.quantity_sold
        )

        db.add(new_sale)

        product.quantity = (
            product.quantity
            - sale.quantity_sold
        )

        db.commit()

        return {
            "message": "Sale added successfully"
        }

    finally:
        db.close()

# Get all products
@router.get("/products")
def get_products():

    db: Session = SessionLocal()

    try:

        products = db.query(ProductDB).all()

        result = []

        for product in products:
            result.append({
                "id": product.id,
                "name": product.name,
                "quantity": product.quantity
            })

        return {"products": result}

    finally:
        db.close()

# Get product by ID
@router.get("/products/{product_id}")
def get_product_by_id(product_id: int):

    db: Session = SessionLocal()

    try:

        if product_id <= 0:
            return {
                "message": "Invalid product ID"
            }

        product = db.query(ProductDB).filter(
            ProductDB.id == product_id
        ).first()

        if not product:
            return {
                "message": "Product not found"
            }

        return {
            "id": product.id,
            "name": product.name,
            "quantity": product.quantity
        }

    finally:
        db.close()


# Search product by name
@router.get("/search")
def search_product(name: str):

    db: Session = SessionLocal()

    try:

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

    finally:
        db.close()

# Update product
@router.put("/products/{product_id}")
def update_product(
    product_id: int,
    updated_product: UpdateProduct,
    current_user: str = Depends(get_current_user)
):

    db: Session = SessionLocal()

    try:

        if product_id <= 0:
            return {
                "message": "Invalid product ID"
            }

        if updated_product.quantity <= 0:
            return {
                "message": "Quantity must be greater than 0"
            }

        product = db.query(ProductDB).filter(
            ProductDB.id == product_id
        ).first()

        if not product:
            return {
                "message": "Product not found"
            }

        product.quantity = updated_product.quantity

        db.commit()

        return {
            "message": "Product updated successfully"
        }

    finally:
        db.close()

# Delete product
@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    current_user: str = Depends(get_current_user)
):

    db: Session = SessionLocal()

    try:

        if product_id <= 0:
            return {
                "message": "Invalid product ID"
            }

        product = db.query(ProductDB).filter(
            ProductDB.id == product_id
        ).first()

        if not product:
            return {
                "message": "Product not found"
            }

        existing_sales = db.query(SaleDB).filter(
            SaleDB.product_id == product_id
        ).first()

        if existing_sales:
            return {
                "message": "Cannot delete product with sales history"
            }

        db.delete(product)

        db.commit()

        return {
            "message": "Product deleted successfully"
        }

    finally:
        db.close()

from datetime import timedelta

@router.get("/sales")
def get_sales():

    db: Session = SessionLocal()

    try:

        sales = db.query(SaleDB).all()

        result = []

        for sale in sales:

            ist_time = (
                sale.sale_date
                + timedelta(hours=5, minutes=30)
            )

            result.append({
                "id": sale.id,
                "product_name": sale.product.name if sale.product else "Deleted Product",
                "quantity_sold": sale.quantity_sold,
                "sale_date": ist_time.strftime("%d %b %Y, %I:%M %p")
            })

        return {
            "sales": result
        }

    finally:
        db.close()