import unicodedata

def safe_text(text):
    try:
        return unicodedata.normalize("NFKD", text)
    except Exception:
        return "Unknown Title"