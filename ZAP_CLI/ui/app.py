"""Main Streamlit Application"""
import sys
import os
import streamlit as st

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set page config first (must be first Streamlit command)
st.set_page_config(
    page_title="ZAP Security Testing",
    layout="wide",
    initial_sidebar_state="collapsed"
)

from ui.pages import home, vulnerability, scan, settings

# Navigation pages
pages = st.navigation([
    st.Page(home.render, title="Dashboard", url_path="home"),
    st.Page(vulnerability.render, title="Vulnerability & Scripts", url_path="vulnerability"),
    st.Page(scan.render, title="Security Scan", url_path="scan"),
    st.Page(settings.render, title="Configuration", url_path="settings"),
])

if __name__ == "__main__":
    pages.run()
