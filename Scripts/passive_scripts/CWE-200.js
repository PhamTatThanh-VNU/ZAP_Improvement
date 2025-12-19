// Passive Scan Rule Script for ZAP (GraalJS)
// Detect CWE-200 (Information Exposure) using regex patterns from external file

const PluginPassiveScanner = Java.type("org.zaproxy.zap.extension.pscan.PluginPassiveScanner");
const ScanRuleMetadata = Java.type("org.zaproxy.addon.commonlib.scanrules.ScanRuleMetadata");
const File = Java.type("java.io.File");
const Files = Java.type("java.nio.file.Files");
const StandardCharsets = Java.type("java.nio.charset.StandardCharsets");
const Pattern = Java.type("java.util.regex.Pattern");

let regexPatterns = [];

// === Load regex patterns from file ===
(function loadPatterns() {
    try {
        let path = new File("/home/ptthanh/NCKH/Data/regex_patterns.txt").toPath(); 
        let lines = Files.readAllLines(path, StandardCharsets.UTF_8);

        lines = Java.from(lines);

        let tmp = [];
        for (let i = 0; i < lines.length; i++) {
            let line = String(lines[i]).trim();
            if (line.length === 0 || line.startsWith("#")) continue;

            try {
                let regex = Pattern.compile(line);
                tmp.push(regex);
            } catch (e) {
                print("[CWE-200 Script] Invalid regex skipped: " + line + " (" + e + ")");
            }
        }
        regexPatterns = tmp;

        print("[CWE-200 Script] Loaded " + regexPatterns.length + " regex patterns.");
    } catch (e) {
        print("[CWE-200 Script] Error loading patterns file: " + e);
    }
})();

function isStaticResource(url) {
    return url.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|json)$/i);
}

function getMetadata() {
    return ScanRuleMetadata.fromYaml(`
id: 2000001
name: CWE-200 Information Exposure Detector
description: Detects sensitive information exposure in HTTP responses using regex patterns.
solution: Remove or mask sensitive information from responses.
references:
  - https://cwe.mitre.org/data/definitions/200.html
risk: MEDIUM
confidence: MEDIUM
cweId: 200
wascId: 13
alertTags:
  OWASP_2021_A01: Broken Access Control
  CWE-200: Information Exposure
otherInfo: Matches regex patterns loaded from external file.
status: alpha
`);
}

function scan(ps, msg, src) {
    let url = msg.getRequestHeader().getURI().toString();
    if (isStaticResource(url)) {
       return;
    }
    if (regexPatterns.length === 0) return;

    let body = msg.getResponseBody().toString();

    for (let i = 0; i < regexPatterns.length; i++) {
        let pattern = regexPatterns[i];
        if (pattern == null) continue;


        let matcher = pattern.matcher(body);
        if (matcher.find()) {
            let evidence = matcher.group();
            ps.newAlert()
                .setRisk(2) 
                .setConfidence(2)
                .setName("CWE-200 Information Exposure")
                .setDescription("Sensitive information exposure detected in response.")
                .setParam("HTTP Response Body")
                .setEvidence(evidence)
                .raise();

            ps.addHistoryTag("CWE-200");
            break;
        }
    }
}

function appliesToHistoryType(historyType) {
    return PluginPassiveScanner.getDefaultHistoryTypes().contains(historyType);
}
