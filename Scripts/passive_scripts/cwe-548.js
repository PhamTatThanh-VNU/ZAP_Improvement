const PluginPassiveScanner = Java.type("org.zaproxy.zap.extension.pscan.PluginPassiveScanner");
const ScanRuleMetadata = Java.type("org.zaproxy.addon.commonlib.scanrules.ScanRuleMetadata");

function getMetadata() {
    return ScanRuleMetadata.fromYaml(`
id: 54801
name: Sensitive Directory Exposure
description: Detects access to sensitive directories (/backup/, /logs/, /ftp/) that are publicly accessible. This can expose sensitive files or enable directory listing (CWE-548).
solution: Disable public access and directory listing for sensitive folders. Place backups/logs outside of the web root and restrict access via server config.
references:
  - https://cwe.mitre.org/data/definitions/548.html
risk: MEDIUM
confidence: MEDIUM
cweId: 548
wascId: 48
alertTags:
  "CWE-548": "https://cwe.mitre.org/data/definitions/548.html"
status: alpha
`);
}

function scan(ps, msg, src) {
    var resHeader = msg.getResponseHeader();
    if (!resHeader || resHeader.getStatusCode() !== 200) return;

    var reqHeader = msg.getRequestHeader();
    if (!reqHeader) return;
    var path = String(reqHeader.getURI().getPath() || "/");

    var sensitiveDirs = ["backup", "logs", "ftp"];
    var dirRegex = new RegExp("(?:^|\\/)(?:" + sensitiveDirs.join("|") + ")(?:\\/|$)", "i");

    if (dirRegex.test(path)) {
        ps.newAlert()
            .setRisk(2)        // Medium
            .setConfidence(2)  // Medium
            .setParam(path)
            .setEvidence("Exposed sensitive directory: " + path)
            .raise();

        ps.addHistoryTag("cwe-548");
        ps.addHistoryTag("sensitive-dir");
    }
}

function appliesToHistoryType(historyType) {
    return PluginPassiveScanner.getDefaultHistoryTypes().contains(historyType);
}