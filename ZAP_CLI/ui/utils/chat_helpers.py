"""Helper utilities"""

def check_config(config: dict) -> list:
    required = ["gemini_api_key", "astra_token", "astra_endpoint"]
    return [k for k in required if not config.get(k)]
