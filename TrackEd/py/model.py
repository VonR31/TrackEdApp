from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, BLOB, Float, Enum, TEXT
from database import Base

# Table qr_code
class Qrcode(Base):
    __tablename__ = 'qr_code'
    qr_id = Column(String(255), primary_key=True)
    qr_name = Column(String(255))
    qr_png = Column(TEXT)  
    qr_status = Column(Boolean)

# Table student
class Student(Base):
    __tablename__ = 'student'
    student_id = Column(String(255), primary_key=True)
    user_id = Column(String(255), ForeignKey('user.user_id'))  
    course_id = Column(String(255), ForeignKey('class_course.course_id'))
    department_id = Column(String(255), ForeignKey('department.department_id'))  # Fixed typo
    grade_id = Column(String(255), ForeignKey('grade.grade_id'))
    attendance_id = Column(String(255), ForeignKey('attendance.attendance_id'))
    gpa = Column(Float)
    gpax = Column(Float)
    student_name = Column(String(255))
    student_class = Column(String(255))
    credits = Column(Integer)
    level = Column(Integer)
    student_status = Column(Enum("Active", "Inactive", "Graduated","Suspended","Expelled", name="student_status_enum"))  # Enum added

# Table class_course
class Course(Base):
    __tablename__ = 'class_course'
    course_id = Column(String(255), primary_key=True)
    teacher_id = Column(String(255), ForeignKey('teacher.teacher_id'))  # Corrected type
    student_id = Column(String(255), ForeignKey('student.student_id'))  # Corrected type
    course_detail = Column(String(255))
    class_status = Column(Boolean)

# Table attendance
class Attendance(Base):
    __tablename__ = 'attendance'
    attendance_id = Column(String(255), primary_key=True)
    qr_id = Column(String(255), ForeignKey('qr_code.qr_id'))
    course_id = Column(String(255), ForeignKey('class_course.course_id'))
    student_id = Column(String(255), ForeignKey('student.student_id'))
    time_start = Column(DateTime)
    time_end = Column(DateTime)
    attendance_status = Column(Boolean)

# Table user
class User(Base):
    __tablename__ = 'user'
    user_id = Column(String(255), primary_key=True)
    firstname = Column(String(255))
    lastname = Column(String(255))
    role = Column(Enum("student", "teacher", "admin", name="role_enum"))
    username = Column(String(255))
    password = Column(String(255))

# Table admin
class Admin(Base):
    __tablename__ = 'admin'
    admin_id = Column(String(255), primary_key=True)
    user_id = Column(String(255), ForeignKey('user.user_id'))

# Table teacher
class Teacher(Base):
    __tablename__ = 'teacher'
    teacher_id = Column(String(255), primary_key=True)
    user_id = Column(String(255), ForeignKey('user.user_id'))
    course_id = Column(String(255), ForeignKey('class_course.course_id'))
    department_id = Column(String(255), ForeignKey('department.department_id'))
    num_course_owned = Column(Integer)
    title = Column(String(255))

# Table department
class Department(Base):
    __tablename__ = 'department'
    department_id = Column(String(255), primary_key=True)
    department_name = Column(String(255))
    department_details = Column(String(255))

# Table grades
class Grade(Base):
    __tablename__ = 'grade'
    grade_id = Column(String(255), primary_key=True)
    student_id = Column(String(255), ForeignKey('student.student_id'))
    course_id = Column(String(255), ForeignKey('class_course.course_id'))
    midterm_grade = Column(Integer)
    final_grade = Column(Integer)
    total_grade = Column(Integer)
    gpa = Column(Float)
