const PluginPassiveScanner =
    Java.type("org.zaproxy.zap.extension.pscan.PluginPassiveScanner");
const ScanRuleMetadata =
    Java.type("org.zaproxy.addon.commonlib.scanrules.ScanRuleMetadata");

function getMetadata() {
    return ScanRuleMetadata.fromYaml(`
id: 900116
name: Improper Output Encoding in JSON (CWE-116)
description: Detects unescaped or dangerous characters inside JSON string values.
solution: Properly escape user-controlled data before embedding into JSON responses.
references:
  - https://cwe.mitre.org/data/definitions/116.html
risk: MEDIUM
confidence: LOW
cweId: 116
wascId: 0
alertTags:
  OWASP_2021_A03: "Injection"
status: beta
`);
}

/* ===================== UTILS ===================== */

function getLineAndColumn(text, index) {
    const before = text.substring(0, index);
    const lines = before.split("\n");
    return {
        line: lines.length,
        col: lines[lines.length - 1].length + 1
    };
}

function buildEvidence(body, value) {
    const idx = body.indexOf(value);
    if (idx === -1) return value;

    const pos = getLineAndColumn(body, idx);
    return `Suspicious JSON string at line ${pos.line}, column ${pos.col}:\n${value}`;
}

/* ===================== CORE SCAN ===================== */

function scan(ps, msg, src) {
    const ct = msg.getResponseHeader().getHeader("Content-Type") || "";

    // ✅ Chỉ xét JSON
    if (!ct.toLowerCase().includes("json")) {
        return;
    }

    const body = msg.getResponseBody().toString();
    if (!body) return;

    let json;
    try {
        json = JSON.parse(body);
    } catch (e) {
        ps.newAlert("900116-JSON-PARSE")
            .setParam("Invalid JSON output – possible improper escaping.")
            .setEvidence(e.message)
            .raise();
        return;
    }

    let findings = [];

    function walk(value) {
        if (typeof value === "string") {

            // Các pattern nguy hiểm trong JSON string
            const dangerousPatterns = [
                /<script[\s>]/i,
                /<\/\w+>/i,
                /\bon\w+=/i,
                /javascript:/i
            ];

            for (let p of dangerousPatterns) {
                if (p.test(value)) {
                    findings.push(buildEvidence(body, value));
                    break;
                }
            }
        } else if (Array.isArray(value)) {
            value.forEach(walk);
        } else if (value && typeof value === "object") {
            Object.keys(value).forEach(k => walk(value[k]));
        }
    }

    walk(json);

    if (findings.length > 0) {
        ps.newAlert("900116-JSON-ENCODE")
            .setParam("Improper output encoding in JSON response.")
            .setEvidence(findings.join("\n---\n"))
            .raise();
    }
}

function appliesToHistoryType(historyType) {
    return PluginPassiveScanner
        .getDefaultHistoryTypes()
        .contains(historyType);
}