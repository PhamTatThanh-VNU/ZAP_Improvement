"""Status display components"""
import sys
import os
import streamlit as st

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from ui.config import DEFAULT_CONFIG

def render_config_status():
    config = DEFAULT_CONFIG
    
    cols = st.columns(4)
    
    items = [
        ("AI Engine", bool(config["gemini_api_key"])),
        ("Vector DB", bool(config["astra_token"] and config["astra_endpoint"])),
        ("ML Service", bool(config["nvidia_api_key"])),
        ("ZAP Proxy", bool(config["apikey"]))
    ]
    
    for col, (name, configured) in zip(cols, items):
        status = "Connected" if configured else "Not Configured"
        color = "green" if configured else "red"
        col.metric(name, status)
        if not configured:
            col.caption(":red[Configuration needed]")
        else:
            col.caption(":green[Ready]")
