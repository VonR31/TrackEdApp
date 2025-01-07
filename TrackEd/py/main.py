from fastapi import FastAPI, HTTPException, Depends, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import date, datetime, timedelta
from pydantic import BaseModel
from typing import Annotated
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import model
from passlib.context import CryptContext
from jose import JWTError, jwt
from enum import Enum
import qrcode
import io
import uuid
import base64
import uvicorn



app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model.Base.metadata.create_all(bind=engine)

class student(BaseModel):
    student_name: str
    student_class: str
    registered: bool

class class_course(BaseModel):
    class_name: str
    class_code: str
    class_status: bool

class subject(BaseModel):
    subject_name: str
    subject_code: str
    subject_status: bool

class attendance(BaseModel):
    # course_id: int
    # subject_id: int
    # student_id: int
    qr_png: bytes = None
    qr_name: str = None
    status: bool = True
    time_end: datetime

def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    finally:
        if db is not None:
            db.close()


db_dependency = Annotated[Session, Depends(get_db)]

#START
#Generate QR
@app.post("/qr/", status_code=status.HTTP_201_CREATED)
async def create_qr(attendance:attendance,db: db_dependency): 
    attendance_id = str(uuid.uuid4())
    qr_id = str(uuid.uuid4())
    qr_name = attendance.qr_name or str(uuid.uuid4())
    qr_status = attendance.status
    qr_png = attendance.qr_png or None

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_name)
    qr.make(fit=True)

    # Create the QR image in memory
    img = qr.make_image(fill_color="black", back_color="white")
    img_io = io.BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)
    buffer = base64.b64encode(img_io.read()).decode('utf-8')
    qr_png = f'data:image/png;base64,{buffer}'

    current_time = datetime.now()

    db_qr = model.Qrcode(qr_png=qr_png, qr_name=qr_name, qr_status=qr_status, qr_id=qr_id,)
    db_attendance = model.Attendance(
            attendance_id=attendance_id,
            qr_id=qr_id, 
            time_start= current_time, 
            time_end= attendance.time_end,
        )
    db.add(db_qr)
    db.commit()
    db.add(db_attendance) 
    db.commit()

    return {
        'qr_id': qr_id,
        'qr_png': qr_png,
        'qr_name': qr_name,
        'status': qr_status,
        'time_start': current_time,
        'time_end': current_time
    }

#Getting QR
@app.get('/get_qr/{qr_id}', status_code=status.HTTP_200_OK)
async def fetch_qr(qr_id:str, db:db_dependency):
    get_qr = db.query(model.Qrcode).filter(model.Qrcode.qr_id == qr_id).first()
    if get_qr == None:
        raise HTTPException(status_code=404, detail="QR code not found")
    return get_qr
#END

#START
#AUTHENTICATION

SECRET_KEY = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
ALGORITHM = 'HS256'

bcrpyt_context = CryptContext(schemes=['bcrypt'], deprecated="auto")
oath2_bearer = OAuth2PasswordBearer(tokenUrl='/auth/token')

class RoleType(str, Enum):
    admin = 'admin'
    teacher = 'teacher'
    student = 'student'

class CreateUserRequest(BaseModel):
    first_name: str
    last_name: str
    role: RoleType
    username: str #email for the username
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str


#Create User
@app.post("/auth", status_code=status.HTTP_201_CREATED)
async def create_user(create_user_request: CreateUserRequest, db: Session = Depends(get_db)):
    
    user_id = str(uuid.uuid4())

    # Create common user record
    create_user_model = model.User(
        user_id=user_id,
        firstname=create_user_request.first_name,
        lastname=create_user_request.last_name,
        role=create_user_request.role,
        username=create_user_request.username,
        password=bcrpyt_context.hash(create_user_request.password)
    )

    # Add the common user to the User table
    db.add(create_user_model)
    db.commit()

    def get_last_id():
        qry = db.query(model.Student).order_by(model.Student.student_id.desc()).first()
        
        if qry is None:
            # If no students are present, start with the current year/month followed by "001"
            ym = datetime.now().strftime("%y%m")
            q_custom_id = ym + "001"
            return q_custom_id
        else:
            # Extract the year/month part and increment the numerical part
            last_student_id = qry.student_id
            ym = datetime.now().strftime("%y%m")
            
            # Ensure the student_id starts with the correct year/month prefix
            if last_student_id[:4] == ym:
                # Increment the numerical part
                numerical_part = int(last_student_id[4:]) + 1
            else:
                # If the year/month changed, reset the numerical part to 1
                numerical_part = 1
            
            # Format the new ID with leading zeros for the numerical part
            q_custom_id = ym + str(numerical_part).zfill(3)
            return q_custom_id
    
    # Add user to corresponding role-based table
    if create_user_request.role == RoleType.student:
        student = model.Student(
            student_id= get_last_id(), #Output example: 2501001++
            user_id=user_id,
            student_name=f"{create_user_request.first_name} {create_user_request.last_name}",
            student_class="N/A",  # Default values, adjust based on business logic
            gpa=0.0,
            gpax=0.0,
            grade_id=None,
            attendance_id=None,
            course_id=None,
            department_id=None,
            level=None,
            credits=0,
            student_status="active"  # Default status
        )
        db.add(student)
        db.commit()

    elif create_user_request.role == RoleType.teacher:
        teacher = model.Teacher(
            teacher_id=user_id,
            user_id=user_id,
            title="N/A",  # Default title
            num_course_owned=0,
            course_id=None,
            department_id=None
        )
        db.add(teacher)
        db.commit()

    elif create_user_request.role == RoleType.admin:
        admin = model.Admin(
            admin_id=user_id,
            user_id=user_id
            # You can add more fields if necessary
        )
        db.add(admin)
        db.commit()

    else:
        raise HTTPException(status_code=400, detail="Invalid role")

#Authentication
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db:db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could Not Validate User')
    
    token = create_access_token(user.username, user.user_id, user.role, timedelta(minutes=20))
    return{"access_token": token, "token_type": "bearer"}

#Authenticate User
def authenticate_user(username: str, password: str, db):
    user = db.query(model.User).filter(model.User.username == username).first()

    if not user: 
        return False
    if not bcrpyt_context.verify(password, user.password):
        return False
    return user

#Create Access Token
def create_access_token(username: str, user_id: int, role: RoleType,expires_delta: timedelta):
    encode = {'sub': username, 'id': user_id, 'roleType': role}
    expires = datetime.now() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

#END



# async def create_student(student: student, db: db_dependency):
#     db_student = model.Student(student_name=student.student_name, student_class=student.student_class, registered=student.registered)
#     db.add(db_student)
#     db.commit()

# async def create_class_course(class_course: class_course, db: db_dependency):
#     db_class_course = model.Course(class_name=class_course.class_name, class_code=class_course.class_code, class_status=class_course.class_status)
#     db.add(db_class_course)
#     db.commit()

# async def create_subject(subject: subject, db: db_dependency):
#     db_subject = model.Subject(subject_name=subject.subject_name, subject_code=subject.subject_code, subject_status=subject.subject_status)
#     db.add(db_subject)
#     db.commit()

# async def create_attendance(attendance: attendance, db: db_dependency):
#     db_attendance = model.Attendance(class_id=attendance.class_id, subject_id=attendance.subject_id, student_id=attendance.student_id, qr_id=attendance.qr_id, qr_png=attendance.qr_png, time_start=attendance.time_start, time_end=attendance.time_end)
#     db.add(db_attendance)
#     db.commit()


if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)