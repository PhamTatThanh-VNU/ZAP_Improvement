"""Run Scan page"""
import sys
import os
import streamlit as st
from pathlib import Path

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from ui.config import DEFAULT_CONFIG

SCRIPTS_DIR = Path("zap_scripts_by_llm")

def get_script_files():
    if not SCRIPTS_DIR.exists():
        return []
    return [f.name for f in SCRIPTS_DIR.glob("*.js")]

def render():
    st.title("Security Scan")
    st.markdown("Execute security testing scripts with automated analysis")
    
    scripts = get_script_files()
    if not scripts:
        st.warning("**No Scripts Available:** Generate scripts first using the Script Generator")
        return
    
    # Scan configuration
    with st.container(border=True):
        st.markdown("**Scan Configuration**")
        col1, col2 = st.columns(2)
        
        with col1:
            selected_script = st.selectbox("Select Script", scripts)
            target_url = st.text_input("Target URL", placeholder="https://example.com")
        
        with col2:
            use_ai = st.checkbox("Enable AI Analysis", value=True)
            if not DEFAULT_CONFIG["gemini_api_key"] and use_ai:
                st.caption(":red[GEMINI_API_KEY required for AI analysis]")
                use_ai = False
    
    # Start scan
    if st.button("Start Security Scan", type="primary", use_container_width=True):
        if not target_url:
            st.error("Please provide a target URL")
            return
        _run_scan(selected_script, target_url, use_ai)

def _run_scan(script_name, target_url, use_ai):
    from zap_cli.logger import setup_logger
    
    logger = setup_logger()
    script_path = str(SCRIPTS_DIR / script_name)
    
    progress = st.progress(0, text="Initializing...")
    
    try:
        if use_ai:
            from zap_cli.feedback_loop import FeedbackLoop
            
            progress.progress(30, text="Running with AI auto-fix...")
            loop = FeedbackLoop(DEFAULT_CONFIG["gemini_api_key"], DEFAULT_CONFIG, logger)
            success = loop.run_with_auto_fix(script_path, target_url)
            
            progress.progress(100, text="Complete")
            
            if success:
                st.success("Scan completed with AI optimization!")
            else:
                st.warning("Scan completed but AI optimization failed")
        else:
            from zap_cli.runner import ZapRunner
            
            progress.progress(30, text="Connecting to ZAP...")
            runner = ZapRunner(
                DEFAULT_CONFIG["apikey"],
                DEFAULT_CONFIG["zap_address"],
                DEFAULT_CONFIG["zap_port"],
                logger
            )
            
            progress.progress(50, text="Loading script...")
            runner.disable_all_active_scanners()
            runner.load_active_script(script_path)
            
            progress.progress(70, text="Scanning...")
            errors = runner.run_active_scan(target_url)
            
            progress.progress(100, text="Complete")
            
            if errors:
                st.error(f"Script error: {errors[0]}")
            else:
                st.success("Scan completed!")
                
    except Exception as e:
        progress.progress(100, text="Failed")
        st.error(f"Scan error: {e}")
