from pydantic import BaseModel

class StartLogin(BaseModel):
    api_id: int
    api_hash: str
    phone: str

class ConfirmCode(BaseModel):
    session_name: str
    phone: str
    code: str
    password: str