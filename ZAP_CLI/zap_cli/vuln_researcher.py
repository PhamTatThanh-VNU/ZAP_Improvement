"""Vulnerability Researcher - WSTG + LLM for ZAP script generation"""
import json
import re
import random
from typing import Dict, List
from pathlib import Path
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_astradb import AstraDBVectorStore
from langchain_core.messages import SystemMessage, HumanMessage


class VulnResearcher:
    """Research vulnerabilities using WSTG + LLM"""

    def __init__(self, gemini_api_key: str, astra_token: str, astra_endpoint: str,
                 collection_name: str = "rag_nvidia", prompts_path: str = "./zap_cli/prompts",
                 payload_data_path: str = "./payload_data_markdown",
                 logger=None):
        self.logger = logger
        self.prompts_path = Path(prompts_path)
        self.payload_data_path = Path(payload_data_path)
        
        self.system_prompt = self._load("system_message.txt")
        self.research_template = self._load("research_prompt.md")
        self.few_shot_examples = self._load("few_shot_research_prompt.md")
        self.intent_mapping = self._load_json("intent_mapping.json")

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-pro",
            google_api_key=gemini_api_key,
            temperature=0.1
        )

        self.vector_store = AstraDBVectorStore(
            collection_name=collection_name,
            api_endpoint=astra_endpoint,
            token=astra_token,
            autodetect_collection=True,
        )
        self._log(f"Initialized: {collection_name}")

    def _load(self, filename: str) -> str:
        path = self.prompts_path / filename
        return path.read_text(encoding="utf-8") if path.exists() else ""

    def _load_json(self, filename: str) -> Dict:
        path = Path(filename) if Path(filename).is_absolute() else Path(".") / filename
        try:
            return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
        except json.JSONDecodeError:
            self._log(f"Invalid JSON: {filename}", "error")
            return {}

    def _detect_intent(self, query: str) -> List[str]:
        """Match query against intent_mapping keywords, return relevant markdown filenames."""
        query_lower = query.lower()
        matched_files = []

        for section in ("vulnerability_mapping", "technology_specific", "methodology_and_tools"):
            for entry in self.intent_mapping.get(section, {}).values():
                keywords = entry.get("primary_keywords", entry.get("keywords", []))
                if any(kw in query_lower for kw in keywords):
                    matched_files.extend(entry.get("files", []))
        
        seen = set()
        result = [f for f in matched_files if not (f in seen or seen.add(f))]
        print(f"[DEBUG] Matched markdown files: {result}")
        return result

    def _load_payload_context(self, query: str) -> str:
        """Load PayloadAllTheThings markdown files matching query intent."""
        files = self._detect_intent(query)
        if not files:
            self._log("No payload context matched")
            return ""

        self._log(f"Payload context files: {files}")
        sections = []
        for fname in files:
            path = self.payload_data_path / fname
            if path.exists():
                sections.append(path.read_text(encoding="utf-8"))
        return "\n\n---\n\n".join(sections) if sections else ""

    def _log(self, msg: str, level: str = "info"):
        if self.logger:
            getattr(self.logger, level)(msg)

    def search_wstg(self, query: str, k: int = 8) -> str:
        self._log(f"Searching: {query}")
        docs = self.vector_store.similarity_search(query, k=k)
        if not docs:
            return ""
        self._log(f"Found {len(docs)} docs")
        return "\n\n---\n\n".join([d.page_content for d in docs])

    def research(self, query: str) -> Dict:
        """Research vulnerability, return {vulnerability, config_info}"""
        self._log(f"Researching: {query}")
        context = self.search_wstg(query)
        payload_context = self._load_payload_context(query)

        prompt = (self.research_template
                  .replace("{query}", query)
                  .replace("{context}", context)
                  .replace("{payload_context}", payload_context)
                  .replace("{few_shot_examples}", self.few_shot_examples))

        try:
            response = self.llm.invoke([
                SystemMessage(content=self.system_prompt),
                HumanMessage(content=prompt)
            ])
            text = str(response.content if hasattr(response, 'content') else response)
            # Just for debugging
            # with open('response.txt', "w", encoding="utf-8") as f:
            #     f.write(text)
            # self._log(f"Text Response: {text}")
            return self._parse(text, query)
        except Exception as e:
            self._log(f"Error: {e}", "error")
            return self._fallback(query, str(e))

    def _parse(self, text: str, fallback_name: str) -> Dict:
        """Minimal JSON parser: expects valid JSON, strips markdown code blocks, falls back on error."""
        try:
            text = text.strip()

            if text.startswith('```'):
                lines = text.split('\n')
                lines = lines[1:]
                while lines and lines[-1].strip() in ('```', ''):
                    lines.pop()
                text = '\n'.join(lines).strip()
            text = self._fix_json_escapes(text)
            data = json.loads(text)
            return {
                "vulnerability": data.get("vulnerability", self._default_vuln(fallback_name)),
                "config_info": data.get("config_info", self._default_config_info(fallback_name))
            }
        except Exception as e:
            self._log(f"Parse error: {str(e)}", "error")
            return self._fallback(fallback_name, "Parse failed")

    def _fix_json_escapes(self, text: str) -> str:
        """Fix invalid JSON backslash escapes from LLM output (e.g., \\. \\( \\d → \\\\. \\\\( \\\\d)."""        
        return re.sub(r'(?<!\\)\\(?![\\"/bfnrtu])', r'\\\\', text)

    def _fallback(self, name: str, error: str = "") -> Dict:
        return {
            "vulnerability": self._default_vuln(name, error),
            "config_info": self._default_config_info(name)
        }

    def _default_vuln(self, name: str, error: str = "") -> Dict:
        return {
            "name": name, "cwe_id": "", "wstg_id": "",
            "description": error or "Vulnerability detection",
            "impact": "", "detection_methods": "", "payloads": "", "indicators": ""
        }

    def _default_config_info(self, name: str) -> Dict:
        return {
            "metadata": {
                "id": random.randint(10000, 99999),
                "name": f"{name} Detection",
                "description": "Vulnerability detection",
                "solution": "Apply security controls",
                "category": "INJECTION",
                "risk": "HIGH",
                "confidence": "MEDIUM",
                "cweId": 0,
                "wascId": 19
            },
            "config": {
                "error": {"payloads": ["'", '"'], "signals": ["error", "exception"]},
                "boolean": {"truePayload": "", "falsePayload": ""},
                "time": {"payloads": [], "delayMs": 0},
                "oast": {"payloads": []},
                "enabled": {"error": True, "boolean": False, "time": False, "oast": False}
            }
        }

    def full_research(self, query: str) -> Dict:
        """Complete research pipeline"""
        self._log(f"Starting: {query}")
        result = self.research(query)
        self._log(f"Complete: {result['vulnerability']['name']}")
        return result

    def format_vuln(self, v: Dict) -> str:
        """Format vulnerability for display - just return markdown from LLM"""
        return f"""## 🔍 {v.get('name', 'Unknown')}

---

### 📋 Classification
- **CWE:** {v.get('cwe_id', 'N/A')}
- **WSTG:** {v.get('wstg_id', 'N/A')}

---

### 📝 Description
{v.get('description', 'N/A')}

---

### ⚠️ Impact
{v.get('impact', 'N/A')}

---

### 🎯 Detection Methods
{v.get('detection_methods', 'N/A')}

---

### 💉 Attack Payloads
{v.get('payloads', 'N/A')}

---

### 🔍 Response Indicators
{v.get('indicators', 'N/A')}"""