"""Simple AI service for vulnerability research"""
import json
from typing import Dict, Optional, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from zap_cli.vuln_researcher import VulnResearcher
from zap_cli.logger import setup_logger
from ui.config import DEFAULT_CONFIG

class VulnerabilityAI:
    def __init__(self):
        self.config = DEFAULT_CONFIG
        
        if self.config.get("gemini_api_key"):
            self.gemini = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash",
                google_api_key=self.config["gemini_api_key"],
                temperature=0.1
            )
        else:
            self.gemini = None
    
    def process(self, message: str, session_id: int, context: Optional[Dict[str, Any]] = None) -> str:
        """Process message: detect intent and route to research or chat"""
        if self._is_vulnerability_question(message):
            return self._research(message, session_id, context or {})
        return self._chat(message)
    
    def _is_vulnerability_question(self, message: str) -> bool:
        """Detect if message is about vulnerability research using Gemini"""
        if not self.gemini:
            return True
        
        try:
            prompt = f"Is this question about cybersecurity vulnerabilities, security testing, or penetration testing? Answer only YES or NO.\n\nQuestion: {message}\n\nAnswer:"
            response = self.gemini.invoke(prompt)
            answer = response.content if hasattr(response, 'content') else str(response)
            return str(answer).strip().upper().startswith("YES")
        except:
            return True
    
    def _chat(self, message: str) -> str:
        """General chat using Gemini"""
        if not self.gemini:
            return "Please configure Gemini API key"
        
        try:
            response = self.gemini.invoke(message)
            return str(response.content if hasattr(response, 'content') else response)
        except Exception as e:
            return f"Error: {e}"
    
    def _research(self, message: str, session_id: int, context: Dict) -> str:
        """Research vulnerability using VulnResearcher"""
        vuln = message.strip()
        if not vuln:
            return "Please enter a vulnerability type (e.g., SQL Injection)"
        
        try:
            researcher = VulnResearcher(
                gemini_api_key=self.config["gemini_api_key"],
                astra_token=self.config["astra_token"],
                astra_endpoint=self.config["astra_endpoint"],
                collection_name=self.config["wstg_collection"],
                prompts_path="./zap_cli/prompts",
                logger=setup_logger()
            )
            
            result = researcher.full_research(vuln)
            formatted = researcher.format_vuln(result["vulnerability"])
            
            # Save to database with config_info
            if context.get('db'):
                config_json = json.dumps(result.get("config_info", {}))
                context['db'].save_research(session_id, vuln, formatted, config_json)
            
            return f"**Research Complete: {vuln}**\n\n{formatted}"
            
        except Exception as e:
            return f"Research failed: {e}"
