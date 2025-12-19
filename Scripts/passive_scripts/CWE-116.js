const PluginPassiveScanner = Java.type("org.zaproxy.zap.extension.pscan.PluginPassiveScanner");
const ScanRuleMetadata = Java.type("org.zaproxy.addon.commonlib.scanrules.ScanRuleMetadata");

function getMetadata() {
    return ScanRuleMetadata.fromYaml(`
id: 900116
name: Improper Output Encoding (CWE-116)
description: Detects potential unescaped user-controlled output in HTML/JSON/JS contexts.
solution: Properly escape and encode all output according to its HTML/JS/JSON context.
references:
  - https://cwe.mitre.org/data/definitions/116.html
risk: MEDIUM
confidence: LOW
cweId: 116
wascId: 0
alertTags:
  OWASP_2021_A03: "Injection"
otherInfo: Detects suspicious unescaped output patterns in HTML, attributes, script blocks, and JSON.
status: beta
`);
}


function getLineAndColumn(text, index) {
    const before = text.substring(0, index);
    const lines = before.split("\n");
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    return { line, col };
}

function buildEvidence(body, start, end) {
    const snippetStart = Math.max(0, start - 40);
    const snippetEnd = Math.min(body.length, end + 40);
    const snippet = body.substring(snippetStart, snippetEnd);

    const pointer = " ".repeat(start - snippetStart) +
                    "^".repeat(Math.max(1, end - start));

    const pos = getLineAndColumn(body, start);
    return `Found unescaped HTML at line ${pos.line}, column ${pos.col}:\n` +
           snippet + "\n" +
           pointer + "\n";
}

function scan(ps, msg, src) {
    const body = msg.getResponseBody().toString();
    if (!body || body.length === 0) return;

    let findings = [];

    const htmlTagPattern = /<\/?\w+[^>]*>/g;  
    let m;
    while ((m = htmlTagPattern.exec(body)) !== null) {
        const tag = m[0];
        const start = m.index;
        const end = start + tag.length;
        
        findings.push(buildEvidence(body, start, end));
    }

    const jsEventPattern = /\bon\w+=["'][^"']*["']/gi;
    while ((m = jsEventPattern.exec(body)) !== null) {
        findings.push(buildEvidence(body, m.index, m.index + m[0].length));
    }
    
    const jsUriPattern = /javascript:[^"'\s<>]*/gi;
    while ((m = jsUriPattern.exec(body)) !== null) {
        findings.push(buildEvidence(body, m.index, m.index + m[0].length));
    }

    const ct = msg.getResponseHeader().getHeader("Content-Type") || "";
    if (ct.includes("application/json")) {
        const rawHtmlPattern = /<\/?\w+[^>]*>/g;
        let j;
        while ((j = rawHtmlPattern.exec(body)) !== null) {
            findings.push(buildEvidence(body, j.index, j.index + j[0].length));
        }
    }
    
    if (findings.length > 0) {
        ps.newAlert("900116-2")
            .setParam("Detected improper output encoding inside response.")
            .setEvidence(findings.join("\n---\n"))
            .raise();
    }
}

function appliesToHistoryType(historyType) {
    return PluginPassiveScanner.getDefaultHistoryTypes().contains(historyType);
}
