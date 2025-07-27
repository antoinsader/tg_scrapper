from turtle import title
from telethon import TelegramClient
from telethon.tl.types import Channel, Chat
from telethon.errors import SessionPasswordNeededError
import asyncio
import os

class TgScrapper():
    def __init__(self,api_id, api_hash, session_name="Session_1"):
        if not api_id or not api_hash:
            raise ValueError("API id and hash must be set")
        os.makedirs("sessions", exist_ok=True)
        self.api_id = api_id
        self.api_hash = api_hash
        self.session_name = session_name
        self.session_path = os.path.join("sessions", session_name)
        self.client = TelegramClient(self.session_path, api_id, api_hash)

    async def send_code(self,phone):
        await self.client.connect()
        if not await self.client.is_user_authorized():
            return await self.client.send_code_request(phone)
        return "Already authorized"
    async def sign_in(self, phone, code, password=None):
        await self.client.connect()
        try:
            await self.client.sign_in(phone=phone,code=code)
        except SessionPasswordNeededError:
            if password:
                await self.client.sign_in(password=password)
            else:
                raise Exception("Password required")
        return True

    async def start(self):
        await self.client.start()
        print("Client started successfully")

    async def get_group_channel_names(self):
        await self.start()
        dialogs =await self.client.get_dialogs()
        groups= []
        for dialog in dialogs:
            entity = dialog.entity
            if isinstance(entity , (Channel, Chat)):
                groups.append(entity.title)
        return groups

    def run(self):
        with self.client:
            self.client.loop.run_until_complete(self.get_group_channel_names())