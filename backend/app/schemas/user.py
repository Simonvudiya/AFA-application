from pydantic import BaseModel

class UserBase(BaseModel):
    email: str
    full_name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True

class TokenPayload(BaseModel):
    sub: int | None = None
    exp: int | None = None
