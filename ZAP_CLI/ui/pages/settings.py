"""Settings page"""
import sys
import os
import streamlit as st

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from ui.config import DEFAULT_CONFIG

def render():
    st.title("Configuration")
    st.markdown("System configuration and API key management")
    
    # ZAP Configuration
    with st.container(border=True):
        st.markdown("**ZAP Proxy Configuration**")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.text_input("API Key", value="●" * 8 if DEFAULT_CONFIG["apikey"] else "Not Set", disabled=True)
        with col2:
            st.text_input("Address", value=DEFAULT_CONFIG["zap_address"], disabled=True)
        with col3:
            st.text_input("Port", value=str(DEFAULT_CONFIG["zap_port"]), disabled=True)
    
    # API Keys Status
    with st.container(border=True):
        st.markdown("**External Service Configuration**")
        
        services = [
            ("AI Engine (Gemini)", DEFAULT_CONFIG["gemini_api_key"], "Required for script generation and analysis"),
            ("Vector Database (AstraDB)", DEFAULT_CONFIG["astra_token"], "Required for vulnerability research"),
            ("Database Endpoint", DEFAULT_CONFIG["astra_endpoint"], "AstraDB connection endpoint"),
            ("ML Service (NVIDIA)", DEFAULT_CONFIG["nvidia_api_key"], "Required for text embeddings"),
        ]
        
        for service, configured, description in services:
            col1, col2, col3 = st.columns([2, 1, 3])
            
            with col1:
                st.markdown(f"**{service}**")
            
            with col2:
                if configured:
                    st.success("Configured")
                else:
                    st.error("Missing")
            
            with col3:
                st.caption(description)
    
    # Configuration Instructions
    with st.expander("Configuration Instructions", expanded=False):
        st.markdown("""
        **Environment Variables Configuration:**
        
        Set the following environment variables before running the application:
        
        ```bash
        export GEMINI_API_KEY="your_gemini_api_key"
        export ASTRA_DB_TOKEN="your_astra_token"
        export ASTRA_DB_ENDPOINT="your_astra_endpoint"
        export NVIDIA_API_KEY="your_nvidia_api_key"
        export ZAP_API_KEY="your_zap_api_key"
        ```
        
        **Service Setup:**
        - **Gemini API**: Get your API key from Google AI Studio
        - **AstraDB**: Create a database at astra.datastax.com
        - **NVIDIA**: Register at build.nvidia.com for embeddings API
        - **ZAP**: Configure your local ZAP proxy instance
        """)
