from dotenv import load_dotenv
import os

from tscrapper import TgScrapper



if __name__ == "__main__":
    load_dotenv()
    tg_api_id = os.getenv("TG_API_ID")
    tg_api_hash = os.getenv("TG_API_HASH")
    print(tg_api_hash)

    tg = TgScrapper(tg_api_id, tg_api_hash)
    tg.run()