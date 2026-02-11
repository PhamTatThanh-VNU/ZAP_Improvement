# ZAP LLM — AI-Powered ZAP Active Scan Script Generator

## Requirements

- Python 3.10+
- [OWASP ZAP](https://www.zaproxy.org/)

## Setup

### 1. Install dependencies

```bash
git clone https://github.com/<your-username>/zap-llm.git
cd zap-llm
pip install -r requirements.txt
```

### 2. Configure ZAP

**Start OWASP ZAP**, then configure:

**a) Set Port to 8081:**
1. Go to: `Tools` → `Options` → `Network` → `Local Servers/Proxies`
2. Change port to `8081`
3. Click `OK` and restart ZAP

**b) Configure OAST:**
1. Go to: `Tools` → `Options` → `OAST`
2. Select `BOAST`
3. **Disable** `Use Random Port`
4. Click `OK`

### 3. Configure API keys

```bash
cp .env.example .env
```

Edit `.env`:

```
GEMINI_API_KEY=your_key        # Google Gemini — required
ZAP_API_KEY=your_key           # ZAP API key — optional
NVIDIA_API_KEY=your_key        # NVIDIA embeddings — required
ASTRA_DB_TOKEN=your_token      # AstraDB — required
ASTRA_DB_ENDPOINT=your_url     # AstraDB — required
WSTG_COLLECTION=rag_nvidia     # AstraDB collection name
```

## Run

```bash
python start_ui.py
```

Open browser at `http://localhost:8501`.

### Usage

**1. Vulnerability Research (Tab "Vulnerability"):**
- Enter vulnerability type (e.g., `SQL Injection`, `XSS`, `LDAP Injection`)
- Tool automatically searches WSTG knowledge base + PayloadAllTheThings
- LLM analyzes and returns: description, impact, CWE/WSTG ID, payloads, testing methods, detection techniques
- Auto-generates ZAP active scan script (`.js`) in `zap_scripts_by_llm/` folder

**2. Run Scan (Tab "Scan"):**
- Enter target URL (e.g., `http://localhost:3000`)
- Select script from dropdown (files in `zap_scripts_by_llm/`)
- Click "Start Scan"
- If script fails, AI auto-fixes and reruns
