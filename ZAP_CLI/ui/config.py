"""UI Configuration"""
import os
from dotenv import load_dotenv

load_dotenv()

DEFAULT_CONFIG = {
    "apikey": os.getenv("ZAP_API_KEY", ""),
    "zap_address": os.getenv("ZAP_ADDRESS", "localhost"),
    "zap_port": os.getenv("ZAP_PORT", "8081"),
    "gemini_api_key": os.getenv("GEMINI_API_KEY", ""),
    "astra_token": os.getenv("ASTRA_DB_TOKEN", ""),
    "astra_endpoint": os.getenv("ASTRA_DB_ENDPOINT", ""),
    "nvidia_api_key": os.getenv("NVIDIA_API_KEY", ""),
    "wstg_collection": os.getenv("WSTG_COLLECTION", "wstg")
}

PAGE_CONFIG = {
    "page_title": "ZAP CLI with AI",
    "page_icon": "🛡️",
    "layout": "wide",
    "initial_sidebar_state": "expanded"
}

