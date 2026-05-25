from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from models import UserDB

from auth import (
    hash_password,
    verify_password,
    create_access_token
)

from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()


class User(BaseModel):
    username: str
    password: str


@router.post("/signup")
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


@router.post("/login")
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