from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

class ZapScriptFixerLangChain:
    """LangChain-based ZAP JavaScript script error fixer using Gemini"""
    
    def __init__(self, api_key: str, logger):
        self.logger = logger
        
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=api_key,
            temperature=0.1,             
        )
                
        self.prompt = PromptTemplate(
            input_variables=["script_content", "error_message"],
            template="""Fix this ZAP Active Scanner JavaScript error:

ERROR: {error_message}

SCRIPT:
{script_content}

COMMON FIXES:
- Missing imports → Add Java.type() declarations
- Syntax errors → Fix JavaScript syntax
- API errors → Use correct ZAP methods

Return ONLY the corrected JavaScript code, no explanations."""
        )
        
        # Create LangChain chain
        self.chain = self.prompt | self.llm | StrOutputParser()
        
    def fix_script_error(self, script_content: str, error_message: str) -> str:
        """
        Fix ZAP JavaScript error using LangChain
        Returns corrected script or original if fix fails
        """
        try:
            self.logger.info("LangChain: Sending fix request...")
            
            # Invoke chain
            fixed_script = self.chain.invoke({
                "script_content": script_content,
                "error_message": error_message
            })
            
            if not fixed_script or not fixed_script.strip():
                self.logger.warning("LangChain returned empty response")
                return script_content
                        
            fixed_script = self._extract_code(fixed_script)
            
            self.logger.info("LangChain fix applied successfully")
            return fixed_script
            
        except Exception as e:
            self.logger.error(f"LangChain fix failed: {e}")
            return script_content
    
    def _extract_code(self, response_text: str) -> str:
        """Extract code from LLM response, removing markdown formatting"""
        text = response_text.strip()
        
        # Remove markdown code blocks if present
        if text.startswith("```"):
            lines = text.split('\n')
            if len(lines) > 2:                
                text = '\n'.join(lines[1:-1])
        
        return text.strip()
