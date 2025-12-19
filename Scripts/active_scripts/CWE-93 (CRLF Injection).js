// Note that new active scripts will initially be disabled
// Right click the script in the Scripts tree and select "enable"  

const ScanRuleMetadata = Java.type("org.zaproxy.addon.commonlib.scanrules.ScanRuleMetadata");

function getMetadata() {
    return ScanRuleMetadata.fromYaml(`
id: 12345
name: "Email/CRLF Injection (Active)"
description: >
  Injects URL-encoded newline (%0a, %0d%0a) and header-like content (e.g., "Cc:") 
  into email-related parameters to detect potential Email Header Injection or CRLF Injection vulnerabilities.
solution: >
  Strip or encode CR/LF characters from header fields. 
  Validate recipient addresses strictly, and use structured mail APIs instead of concatenating headers manually.
references:
  - "https://cwe.mitre.org/data/definitions/93.html"
  - "https://owasp.org/www-community/attacks/CRLF_Injection"
category: "INJECTION"
risk: "MEDIUM"
confidence: "MEDIUM"
cweId: 93
wascId: 20
alertTags:
  crlf: "true"
  email_injection: "true"
status: "alpha"
alertRefOverrides:
  12345-1: {}
`);
}

/**
 * Lightweight node scan (keeps baseline small)
 */
function scanNode(as, msg) {
    print('scanNode: ' + msg.getRequestHeader().getURI().toString());
    if (as.isStop()) return;
    try {
        var base = msg.cloneRequest();
        as.sendAndReceive(base, false, false);
    } catch (e) {
        // ignore baseline errors
        print('scanNode baseline failed: ' + e);
    }
}

/**
 * Per-parameter scan
 */
function scan(as, msg, param, value) {
    print('scan param: ' + param + ' value: ' + value + ' url=' + msg.getRequestHeader().getURI().toString());

    if (as.isStop()) return;
    
    if (!looksLikeEmailParam(param, value)) return;

    // baseline
    var baseMsg = msg.cloneRequest();
    try { as.sendAndReceive(baseMsg, false, false); } catch (e) { /* ignore */ }
    var baseBody = tryGetBody(baseMsg);
    var baseStatus = tryGetStatus(baseMsg);
    
    var markerEmail = "zap-crlf-test@example.invalid";
    var payloads = [
        "%0aCc%3A%20" + markerEmail,    // \nCC: marker"
        "%0d%0aCc%3A%20" + markerEmail  // \r\n "Cc: marker"
    ];

    for (var i = 0; i < payloads.length; i++) {
        if (as.isStop()) return;
        var payload = payloads[i];

        // clone and set param
        var attackMsg = msg.cloneRequest();
        var newVal = (value === null || value === undefined) ? payload : (value + payload);
        var setOk = true;
        try {
            as.setParam(attackMsg, param, newVal);
        } catch (e) {            
            setOk = tryManualSetParam(attackMsg, param, value, newVal);
            if (!setOk) {
                print('Cannot set param ' + param + ' for payload: ' + payload);
                continue;
            }
        }

        // send
        try {
            as.sendAndReceive(attackMsg, false, false);
        } catch (e) {
            print('send failed: ' + e);
            continue;
        }

        var attackBody = tryGetBody(attackMsg);
        var attackHeaders = tryGetHeadersText(attackMsg);
        var attackStatus = tryGetStatus(attackMsg);

        var evidence = null;
        if (attackHeaders && attackHeaders.indexOf(markerEmail) !== -1) evidence = "marker-in-headers";
        else if (attackBody && attackBody.indexOf(markerEmail) !== -1) evidence = "marker-in-body";

        // var lengthDiff = (baseBody !== null && attackBody !== null) ? Math.abs(attackBody.length - baseBody.length) : 0;
        // var heuristic = (attackStatus === 200 && lengthDiff > 100);

        if (evidence && attackStatus === 200) {
            var attackInfo = "Injected payload: " + payload + "\nMarker email: " + markerEmail;
            // raise alert using template override id "12345-1"
            try {
                as.newAlert("12345-1")
                    .setName("Email Header / CRLF Injection")
                    .setRisk(2) // medium
                    .setConfidence(evidence ? 2 : 1)
                    .setDescription("Parameter '" + param + "' may be vulnerable to Email/CRLF header injection. Evidence: " + (evidence))
                    .setParam(param)
                    .setAttack(newVal)
                    .setEvidence(evidence ? markerEmail : (attackBody ? snippet(attackBody) : attackHeaders))
                    .setOtherInfo(attackInfo + "\nBaseline status: " + baseStatus + " Attack status: " + attackStatus)
                    .setSolution("Strip or encode CR/LF characters from header fields; validate recipient addresses; use structured mail APIs instead of concatenating headers.")
                    .setMessage(attackMsg)
                    .raise();
            } catch (err) {
                
                try {
                    as.newAlert()
                        .setName("Email Header / CRLF Injection")
                        .setRisk(2)
                        .setConfidence(evidence ? 2 : 1)
                        .setDescription("Parameter '" + param + "' may be vulnerable to Email/CRLF header injection. Evidence: " + (evidence))
                        .setParam(param)
                        .setAttack(newVal)
                        .setEvidence(evidence ? markerEmail : (attackBody ? snippet(attackBody) : attackHeaders))
                        .setMessage(attackMsg)
                        .raise();
                } catch (e2) {
                    print('Failed to raise alert: ' + e2);
                }
            }            
            return;
        }
    }
}

function looksLikeEmailParam(param, value) {
    if (!param && !value) return false;
    var p = (param || "").toLowerCase();
    if (p.indexOf("email") !== -1 || p.indexOf("to") !== -1 || p.indexOf("from") !== -1 || p.indexOf("cc") !== -1 || p.indexOf("bcc") !== -1 || p.indexOf("recipient") !== -1 || p.indexOf("subject") !== -1) return true;
    if (value && value.indexOf("@") !== -1) return true;
    return false;
}

function tryGetBody(msg) {
    try { return msg.getResponseBody().toString(); } catch (e) { return null; }
}

function tryGetStatus(msg) {
    try { return msg.getResponseHeader().getStatusCode(); } catch (e) { return -1; }
}

function tryGetHeadersText(msg) {
    try { return msg.getResponseHeader().toString(); } catch (e) { return null; }
}

function tryManualSetParam(msg, param, oldValue, newValue) {
    try {
        var body = msg.getRequestBody().toString();
        // Body param
        var target = param + "=" + oldValue;
        if (body.indexOf(target) !== -1) {
            body = body.replace(target, param + "=" + newValue);
            msg.setRequestBody(body);
            msg.getRequestHeader().setContentLength(msg.getRequestBody().length());
            return true;
        }        
        //  Body Json
        var idx = body.indexOf(oldValue);
        if (idx !== -1) {
            body = body.substring(0, idx) + newValue + body.substring(idx + oldValue.length);
            msg.setRequestBody(body);
            msg.getRequestHeader().setContentLength(msg.getRequestBody().length());
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

function snippet(s) {
    if (!s) return "";
    return s.length > 300 ? s.substring(0,300) + "..." : s;
}
