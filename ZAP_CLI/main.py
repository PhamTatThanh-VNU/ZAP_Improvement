import typer
import os
import json
from dotenv import load_dotenv
from zap_cli.logger import setup_logger
from zap_cli.runner import ZapRunner
from zap_cli.vuln_researcher import VulnResearcher

load_dotenv()

app = typer.Typer(help="ZAP CLI with AI-powered script auto-fix")
logger = setup_logger()

DEFAULT_CONFIG = {
    "apikey": "",
    "zap_address": "localhost", 
    "zap_port": "8081",
    "gemini_api_key": os.getenv("GEMINI_API_KEY", ""),
    "astra_token": os.getenv("ASTRA_DB_TOKEN", ""),
    "astra_endpoint": os.getenv("ASTRA_DB_ENDPOINT", ""),
    "nvidia_api_key": os.getenv("NVIDIA_API_KEY", ""),
    "wstg_collection": os.getenv("WSTG_COLLECTION", "wstg")
}

def research_vulnerability(config: dict) -> None:
    """Research vulnerability and generate ZAP script"""
    required = ["gemini_api_key", "astra_token", "astra_endpoint", "nvidia_api_key"]
    missing = [k for k in required if not config.get(k, "").strip()]
    
    if missing:
        typer.secho(f"Missing config: {', '.join(missing)}", fg=typer.colors.RED)
        typer.secho("Set environment variables: GEMINI_API_KEY, ASTRA_DB_TOKEN, ASTRA_DB_ENDPOINT, NVIDIA_API_KEY", fg=typer.colors.BLUE)
        return
    
    typer.secho("\nVulnerability Research & Script Generator", fg=typer.colors.CYAN, bold=True)
    typer.secho("="*50, fg=typer.colors.CYAN)
    
    # Step 1: Research vulnerability
    vuln_query = typer.prompt("Enter vulnerability type (e.g., SQL Injection, LDAP Injection)")
    
    try:
        researcher = VulnResearcher(
            gemini_api_key=config["gemini_api_key"],
            astra_token=config["astra_token"],
            astra_endpoint=config["astra_endpoint"],
            collection_name=config["wstg_collection"],
            prompts_path="./zap_cli/prompts",
            logger=logger
        )
        
        typer.secho("\nSearching WSTG database...", fg=typer.colors.YELLOW)
        result = researcher.full_research(vuln_query)
        
        typer.secho(f"\n{'='*80}", fg=typer.colors.CYAN)
        typer.secho("VULNERABILITY RESEARCH RESULTS", fg=typer.colors.GREEN, bold=True)
        typer.secho(f"{'='*80}", fg=typer.colors.CYAN)
        
        formatted = researcher.format_vuln(result["vulnerability"])
        typer.echo(formatted)
        
        typer.secho(f"\n{'='*80}", fg=typer.colors.CYAN)
                    
    except Exception as e:
        typer.secho(f"Error: {e}", fg=typer.colors.RED)
        logger.error(f"Error: {e}")

def scan_with_script(config: dict) -> None:
    """Run ZAP scan with script and optional AI auto-fix"""
    url = typer.prompt("Target URL")
    script_file = typer.prompt("Script file path")
    base_name = os.path.basename(script_file)
    if not base_name:
        typer.secho("Please enter a valid script file name (e.g., name.js)", fg=typer.colors.RED)
        return
    script_path = os.path.abspath(os.path.join("zap_scripts_by_llm", os.path.basename(script_file)))

    if not os.path.exists(script_path):
        typer.secho("Script file not found", fg=typer.colors.RED)
        return
    
    has_gemini_key = bool(config.get("gemini_api_key", "").strip())
    
    if not has_gemini_key:
        typer.secho("GEMINI_API_KEY not configured", fg=typer.colors.YELLOW)
        use_ai = False
    else:
        use_ai = typer.confirm("Enable AI auto-fix?", default=True)
    
    if use_ai:
        try:
            from zap_cli.feedback_loop import FeedbackLoop
            loop = FeedbackLoop(config["gemini_api_key"], config, logger)
            success = loop.run_with_auto_fix(script_file, url)
            
            if success:
                typer.secho(f"Script fixed successfully: {script_file}", fg=typer.colors.GREEN)
            else:
                typer.secho("AI auto-fix failed", fg=typer.colors.RED)
        except Exception as e:
            typer.secho(f"AI Feedback Loop error: {e}", fg=typer.colors.RED)
    else:
        runner = ZapRunner(config["apikey"], config["zap_address"], config["zap_port"], logger)
        runner.disable_all_active_scanners()
        runner.load_active_script(script_file)
        errors = runner.run_active_scan(url)
        
        if errors:
            typer.secho(f"Script error: {errors[0]}", fg=typer.colors.RED)
            if not has_gemini_key:
                typer.secho("Set GEMINI_API_KEY for AI auto-fix", fg=typer.colors.BLUE)
        else:
            typer.secho("Scan completed", fg=typer.colors.GREEN)

def configure_zap(config: dict) -> None:
    """Configure ZAP connection parameters"""
    config["apikey"] = typer.prompt("ZAP API key", default=config["apikey"])
    config["zap_address"] = typer.prompt("ZAP address", default=config["zap_address"])
    config["zap_port"] = typer.prompt("ZAP port", default=config["zap_port"])
    
    if config.get("gemini_api_key"):
        typer.secho("Gemini API: Configured", fg=typer.colors.GREEN)
    else:
        typer.secho("Gemini API: Not configured", fg=typer.colors.YELLOW)
        typer.secho("Export GEMINI_API_KEY=your_key", fg=typer.colors.BLUE)
    
    typer.secho("ZAP configuration updated", fg=typer.colors.GREEN)

def launch_web_ui(config: dict) -> None:
    """Launch web UI interface"""
    import subprocess
    import sys
    
    try:
        typer.secho("Starting web UI...", fg=typer.colors.CYAN)
        typer.secho("UI will be available at: http://localhost:8501", fg=typer.colors.BLUE)
        
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", 
            "ui/app.py", "--server.port", "8501"
        ])
    except KeyboardInterrupt:
        typer.secho("\nWeb UI stopped", fg=typer.colors.YELLOW)
    except Exception as e:
        typer.secho(f"Error starting UI: {e}", fg=typer.colors.RED)

def cleanup_and_exit(config: dict) -> None:
    """Reset ZAP to default state and exit"""
    try:
        runner = ZapRunner(config["apikey"], config["zap_address"], config["zap_port"], logger)
        runner.zap.ascan.enable_all_scanners()
        typer.secho("ZAP reset to default", fg=typer.colors.GREEN)
    except Exception as e:
        typer.secho(f"ZAP reset failed: {e}", fg=typer.colors.RED)

@app.command()
def cli():
    """Interactive CLI menu"""
    config = DEFAULT_CONFIG.copy()
    
    actions = {
        "1": ("Vulnerability Research", research_vulnerability),
        "2": ("Run Scan with Script", scan_with_script),
        "3": ("Configure ZAP", configure_zap),
        "4": ("Exit & Reset ZAP", cleanup_and_exit)
    }
    
    while True:
        typer.secho("\n=== ZAP Security Testing ===", fg=typer.colors.CYAN, bold=True)
        
        for key, (desc, _) in actions.items():
            typer.echo(f"{key}. {desc}")
        
        choice = typer.prompt("Select option (1-4)")
        
        if choice in actions:
            _, action = actions[choice]
            action(config)
            
            if choice == "5":
                raise typer.Exit()
        else:
            typer.secho("Invalid choice", fg=typer.colors.RED)

if __name__ == "__main__":
    app()