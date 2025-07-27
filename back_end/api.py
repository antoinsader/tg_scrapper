# python -m uvicorn api:app --reload

from genericpath import exists
import uuid
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from req_body import ConfirmCode, StartLogin
from tscrapper import TgScrapper


sessions = {}
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"message": "Antoin Sader API for telegram scrap"}

@app.post("/startLogin")
async def start_login(data:StartLogin):
    session_name = f"session_{uuid.uuid4().hex[:8]}"
    tg = TgScrapper(data.api_id, data.api_hash, session_name)
    sessions[session_name] = tg
    try:
        await tg.send_code(data.phone)
        return {"message": "Code sent to phone (Telegram chats not SMS)", "session_name": session_name}
    except Exception as ex:
        raise HTTPException(status_code=500, detail=str(ex))


@app.post("/confirmCode")
async def confirm_code(data:ConfirmCode):
    tg = sessions.get(data.session_name)
    if not tg:
        raise HTTPException(status_code=401,detail="Session not registered, you have to login")
    try:
        await tg.sign_in(data.phone, data.code, data.password)
        return {"logged_in": True, "message": "Logged in!", "session_name":data.session_name}
    except Exception as ex:
        raise HTTPException(status_code=500, detail=str(ex))


@app.post("/groups")
async def get_groups(body: dict):
    session_name = body.get("session_name")
    print(sessions)
    tg = sessions.get(session_name)
    if not tg:
        load_dotenv()
        tg = TgScrapper(os.getenv("TG_API_ID"), os.getenv("TG_API_HASH"), session_name='session_5b04e59c')
        # raise HTTPException(status_code=401,detail="Session not registered, you have to login")
    try:
        groups = await tg.get_group_channel_names()
        return {"groups": groups}
    except Exception as ex:
        raise HTTPException(status_code=500, detail=str(ex))
