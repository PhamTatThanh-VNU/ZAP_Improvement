#!/usr/bin/env python3
"""UI Entry Point - Run from project root"""
import sys
import os
import subprocess

# Ensure we're in the right directory
project_root = os.path.dirname(os.path.abspath(__file__))
os.chdir(project_root)

# Add project root to Python path
sys.path.insert(0, project_root)

def main():
    """Launch Streamlit UI"""
    try:
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", 
            "ui/app.py", "--server.port", "8501"
        ])
    except KeyboardInterrupt:
        print("\n🛡️ ZAP CLI UI stopped")
    except Exception as e:
        print(f"❌ Error starting UI: {e}")

if __name__ == "__main__":
    main()