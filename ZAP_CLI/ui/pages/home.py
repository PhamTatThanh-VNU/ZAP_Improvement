"""Home page"""
import sys
import os
import streamlit as st

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from ui.components.status import render_config_status

def render():
    st.title("ZAP Security Testing Platform")
    
    # System status in a clean container
    with st.container(border=True):
        st.markdown("**System Configuration**")
        render_config_status()
    
    st.markdown("---")
    
    # Workflow guide
    st.markdown("**Getting Started**")
    
    col1, col2, col3 = st.columns(3, gap="large")
    
    with col1:
        with st.container(border=True):
            st.markdown("**Step 1: Research**")
            st.markdown("Explore vulnerability databases and security testing guidelines")
            
    with col2:
        with st.container(border=True):
            st.markdown("**Step 2: Generate**")
            st.markdown("Create custom security testing scripts from templates")
            
    with col3:
        with st.container(border=True):
            st.markdown("**Step 3: Execute**")
            st.markdown("Run comprehensive security scans with automated analysis")
