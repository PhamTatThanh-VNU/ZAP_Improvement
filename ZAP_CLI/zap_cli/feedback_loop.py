import time
import os
from .llm_agent_langchain import ZapScriptFixerLangChain
from .runner import ZapRunner


class FeedbackLoop:
    """AI-powered feedback loop for automatic ZAP script error fixing"""
    
    def __init__(self, gemini_api_key: str, zap_config: dict, logger, max_iterations: int = 10):
        self.fixer = ZapScriptFixerLangChain(gemini_api_key, logger)
        self.zap_config = zap_config
        self.logger = logger
        self.max_iterations = max_iterations
        
    def run_with_auto_fix(self, script_path: str, url: str) -> bool:
        """
        Execute script with automatic error fixing
        Modifies the original script file directly
        """
        fixed_script_path = os.path.abspath(os.path.join("zap_scripts_by_llm", os.path.basename(script_path)))

        runner = ZapRunner(
            self.zap_config["apikey"], 
            self.zap_config["zap_address"], 
            self.zap_config["zap_port"], 
            self.logger
        )

        for iteration in range(1, self.max_iterations + 1):
            self.logger.info(f"Iteration {iteration}/{self.max_iterations}")
            
            try:
                # Test current script
                runner.disable_all_active_scanners()
                runner.load_active_script(script_path)
                errors = runner.run_active_scan(url)
                
                # Success - no errors
                if not errors:
                    self.logger.info(f"✅ Script fixed successfully after {iteration} iterations")
                    return True
                
                # Log error and attempt fix 
                error_msg = errors[0]
                self.logger.warning(f"Iteration {iteration} error: {error_msg}")
                
                # Read current script
                with open(fixed_script_path, 'r', encoding='utf-8') as f:
                    script_content = f.read()
                
                # Apply AI fix
                self.logger.info("Applying AI fix...")
                fixed_script = self.fixer.fix_script_error(script_content, error_msg)
                
                # Check if changes were made
                if fixed_script == script_content:
                    self.logger.warning("AI returned unchanged script")
                    break
                
                # Write fixed script                
                with open(fixed_script_path, 'w', encoding='utf-8') as f:
                    f.write(fixed_script)
                
                self.logger.info(f"Script updated: {fixed_script_path}")
                time.sleep(1)
                
            except Exception as e:
                self.logger.error(f"Iteration {iteration} failed: {e}")
                break
        
        self.logger.error(f"Failed to fix script after {self.max_iterations} attempts")
        return False