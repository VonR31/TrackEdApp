from datetime import datetime, timedelta
from typing import Annotated
import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal
from model import User
from starlette import status
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from enum import Enum

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
ALGORITHM = 'HS256'

bcrpyt_context = CryptContext(schemes=['bcrypt'])
oath2_bearer = OAuth2PasswordBearer(tokenUrl='/auth/token')

class RoleType(str, Enum):
    admin = 'admin'
    teacher = 'teacher'
    student = 'student'

class CreateUserRequest(BaseModel):
    first_name: str
    last_name: str
    role: RoleType
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def get_db():
    db = SessionLocal
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.post("/auth", status_code=status.HTTP_201_CREATED)
async def create_user(create_user_request: CreateUserRequest, db: db_dependency):
    create_user_model = User(
        user_id = str(uuid.uuid4()),
        firstname = create_user_request.username,
        lastname = create_user_request.username,
        role = create_user_request.role,
        username = create_user_request.username,
        password = bcrpyt_context.hash(create_user_request.password)
    )

    db.add(create_user_model)
    db.commit()

@router.post("/token", response_model=Token)
async def login_for_access_token(db: db_dependency, form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(db, form_data.username, form_data.password)

def authenticate_user(db: db_dependency, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status=status.HTTP_401_UNAUTHORIZED,
                            detail="Could Not Validate User")
    token = create_access_token(user.username, user.user_id, timedelta(minutes=20))

    if not user: 
        return False
    if not bcrpyt_context.verify(password, user.password):
        return False
    return user

def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {'sub': username, 'id': user_id}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)
    