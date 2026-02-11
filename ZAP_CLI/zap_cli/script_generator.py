import json
import re
from pathlib import Path
from typing import Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

from .logger import setup_logger
from .feedback_loop import FeedbackLoop


class ZapScriptGenerator:
    """Generate ZAP active scan scripts from vulnerability research config"""
    
    def __init__(self, gemini_api_key: str, zap_config: dict, 
                 prompts_path: str = "./zap_cli/prompts",
                 output_dir: str = "./zap_scripts_by_llm", logger=None):
        self.prompts_path = Path(prompts_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.template = self._load("injection_scan_template.txt")
        self.generate_prompt = self._load("generate_script_prompt.md")
        self.logger = logger or setup_logger()
        self.feedback_loop = FeedbackLoop(gemini_api_key, zap_config, logger)
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-pro",
            google_api_key=gemini_api_key,
            temperature=0.1
        )
    
    def _load(self, filename: str) -> str:
        path = self.prompts_path / filename
        if not path.exists():
            raise FileNotFoundError(f"Not found: {path}")
        return path.read_text(encoding="utf-8")
    
    def _sanitize_filename(self, name: str) -> str:
        """Convert vulnerability name to valid filename"""
        name = re.sub(r'[^\w\s-]', '', name)
        name = re.sub(r'[-\s]+', '_', name)
        return name.strip('_') + '.js'

    def _extract_code(self, text: str) -> str:
        """Extract JS code from LLM response, strip markdown fences."""
        text = text.strip()
        if text.startswith('```'):
            lines = text.split('\n')
            lines = lines[1:]
            while lines and lines[-1].strip() in ('```', ''):
                lines.pop()
            text = '\n'.join(lines).strip()
        return text
    
    def generate(self, config_info: Dict, filename: str | None = None) -> Dict[str, Any]:
        """Generate script using LLM to fill template with config_info"""
        try:
            metadata = config_info.get("metadata", {})
            if not filename:
                filename = self._sanitize_filename(metadata.get("name", "unnamed_scan"))
            output_path = self.output_dir / filename

            prompt = (self.generate_prompt
                      .replace("{template}", self.template)
                      .replace("{config_info}", json.dumps(config_info, indent=2)))

            response = self.llm.invoke([HumanMessage(content=prompt)])
            script = self._extract_code(
                str(response.content if hasattr(response, 'content') else response)
            )

            output_path.write_text(script, encoding="utf-8")
            self.logger.info(f"Generated: {output_path}")
            return {"success": True, "path": str(output_path), "error": None}

        except Exception as e:
            self.logger.error(f"Generation failed: {e}")
            return {"success": False, "path": "", "error": str(e)}
    
    def generate_and_validate(self, config_info: Dict, test_url: str,
                            filename: str | None = None) -> Dict[str, Any]:
        """Generate script and validate with feedback loop"""
        result = self.generate(config_info, filename)
        if not result["success"]:
            return result
        
        self.logger.info("Validating script with feedback loop...")
        success = self.feedback_loop.run_with_auto_fix(result["path"], test_url)
        
        return {
            "success": success,
            "path": result["path"],
            "validated": success,
            "error": None if success else "Validation failed"
        }
