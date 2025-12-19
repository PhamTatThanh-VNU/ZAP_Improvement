// Passive CSRF (CWE-352) detector - GraalJS for ZAP Passive Scan

const PluginPassiveScanner = Java.type("org.zaproxy.zap.extension.pscan.PluginPassiveScanner");
const ScanRuleMetadata = Java.type("org.zaproxy.addon.commonlib.scanrules.ScanRuleMetadata");
const Control = Java.type('org.parosproxy.paros.control.Control');
const ExtClass = Java.type('org.zaproxy.zap.extension.anticsrf.ExtensionAntiCSRF');
const loader = Control.getSingleton().getExtensionLoader();
const extAntiCsrf = loader.getExtension(ExtClass);

function getMetadata() {
    return ScanRuleMetadata.fromYaml(`
id: 20001
name: "CWE-352: Potential Cross-Site Request Forgery (CSRF) indicators"
description: "Detects likely CSRF-prone endpoints by combining signs: cookie-based session, state-changing HTTP method, and absence of visible CSRF tokens. This is heuristic and may produce false positives."
solution: "Implement server-side anti-CSRF protections: synchronizer token or double-submit token, set SameSite cookie attribute, validate Origin/Referer for state-changing requests, and avoid state changes on GET."
references:
  - "https://cwe.mitre.org/data/definitions/352.html"
  - "https://owasp.org/www-community/attacks/csrf"
risk: MEDIUM
confidence: MEDIUM
cweId: 352
wascId: 8
status: beta
`);
}


//  Get CSRF Token from ZAP Extension
var CSRF_TOKEN_NAMES = [];
try {
    if (extAntiCsrf) {
        var names = extAntiCsrf.getAntiCsrfTokenNames();

        if (names && !names.isEmpty()) {
            var it = names.iterator();
            while (it.hasNext()) {
                var tokenName = it.next();
                CSRF_TOKEN_NAMES.push(tokenName.toLowerCase());
            }
        }
    }
} catch (e) {
    print("[Error] loading Anti-CSRF tokens: " + e);
}



var SESSION_COOKIE_KEYS = [
    "session", "sess", "connect.sid", "jsessionid", "phpsessid", "auth", "sid", "sessionid"
];


function containsCsrfTokenInHeaders(msg) {
    try {
        var rh = msg.getRequestHeader();
        var headerNames = rh.getHeaderNames();
        for each (var hn in headerNames) {
            var lname = hn.toLowerCase();
            for each (var t in CSRF_TOKEN_NAMES) {
                if (lname.indexOf(t) !== -1) {
                    return { found: true, where: "header: " + hn };
                }
            }
        }
    } catch (e) {}
    return { found: false };
}

function containsCsrfTokenInBodyOrQuery(msg) {
    try {
        var reqHeader = msg.getRequestHeader();
        var query = reqHeader.getURI().getQuery();
        var body = msg.getRequestBody() ? msg.getRequestBody().toString() : "";
        var combined = ((query ? query + "&" : "") + body).toLowerCase();
        for each (var t in CSRF_TOKEN_NAMES) {
            if (combined.indexOf(t) !== -1) {
                return { found: true, where: "query/body contains: " + t };
            }
        }

        var cookieHeader = reqHeader.getHeader("Cookie");
        if (cookieHeader) {
            var low = cookieHeader.toLowerCase();
            for each (var sck in CSRF_TOKEN_NAMES) {
                if (low.indexOf(sck) !== -1) {
                    return { found: true, where: "cookie: " + sck };
                }
            }
        }
    } catch (e) {}
    return { found: false };
}

function hasSessionCookie(msg) {
    try {
        var reqHeader = msg.getRequestHeader();
        var cookie = reqHeader.getHeader("Cookie");
        if (cookie) {
            var low = cookie.toLowerCase();
            for each (var k in SESSION_COOKIE_KEYS) {
                if (low.indexOf(k.toLowerCase()) !== -1) {
                    return { found: true, where: "request Cookie header" };
                }
            }
        }
    } catch (e) {}
    // also check response Set-Cookie
    try {
        var respHdr = msg.getResponseHeader();
        if (respHdr) {
            var setCookies = respHdr.getHeaders("Set-Cookie");
            if (setCookies) {
                for each (var sc in setCookies) {
                    var lowsc = sc.toLowerCase();
                    for each (var k2 in SESSION_COOKIE_KEYS) {
                        if (lowsc.indexOf(k2.toLowerCase()) !== -1) {
                            return { found: true, where: "response Set-Cookie: " + k2 };
                        }
                    }
                }
            }
        }
    } catch (e) {}
    return { found: false };
}

function responseSameSiteInfo(msg) {
    try {
        var respHdr = msg.getResponseHeader();
        if (!respHdr) return { present: false, details: "no response header" };
        var setCookies = respHdr.getHeaders("Set-Cookie");
        if (!setCookies) return { present: false, details: "no Set-Cookie" };
        for each (var sc in setCookies) {
            var lowsc = sc.toLowerCase();
            if (lowsc.indexOf("samesite") !== -1) {
                // could be SameSite=Lax/Strict/None
                var m = /samesite\s*=\s*([^;\\s]+)/i.exec(sc);
                if (m && m[1]) {
                    return { present: true, value: m[1] };
                }
            }
        }
        return { present: false, details: "Set-Cookie present but SameSite not set" };
    } catch (e) {
        return { present: false, details: "error reading Set-Cookie" };
    }
}

function isStateChangingMethod(method) {
    if (!method) return false;
    var m = method.toUpperCase();
    return (m === "POST" || m === "PUT" || m === "DELETE" || m === "PATCH");
}

function isStaticResource(url) {
    return url.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|json)$/i);
}

function makeDescription(url, method, evidenceDetails) {
    return "The request to " + url + " (" + method + ") appears to be state-changing and the traffic " +
           "shows evidence of cookie-based session authentication but no obvious anti-CSRF token. " +
           "This combination can indicate vulnerability to Cross-Site Request Forgery (CWE-352).\n\n" +
           "Evidence: " + evidenceDetails + "\n\n" +
           "Note: This is a heuristic passive check and may produce false positives if the application uses " +
           "a non-standard token name or token is validated in another way. Confirm with active/non-destructive " +
           "tests or by checking server-side validation.";
}

function makeSolution() {
    return "Remediation options include:\n" +
           "- Implement a synchronizer (per-session) CSRF token and validate it server-side for state-changing requests.\n" +
           "- Or implement double-submit cookie pattern with token verification.\n" +
           "- Enforce SameSite (Lax or Strict) on session cookies.\n" +
           "- Validate the Origin or Referer header for state-changing requests.\n" +
           "- Avoid state changes via GET or via only query-string parameters.";
}

function scan(ps, msg, src) {
    try {
        var reqHdr = msg.getRequestHeader();
        if (!reqHdr) return;
        var url = reqHdr.getURI().toString();
        if (isStaticResource(url)) return;
        var method = reqHdr.getMethod();
        if (!isStateChangingMethod(method)) {
            return; // only care about state-changing methods
        }

        // 1) session cookie?
        var sess = hasSessionCookie(msg);

        // 2) token present?
        var t1 = containsCsrfTokenInHeaders(msg);
        var t2 = containsCsrfTokenInBodyOrQuery(msg);
        var tokenFound = (t1.found || t2.found);

        // 3) SameSite info (from response if available)
        var samesite = responseSameSiteInfo(msg);

        // 4) content-type hint (if application/json only)
        var contentType = reqHdr.getHeader("Content-Type");
        var isJsonOnly = contentType && contentType.toLowerCase().indexOf("application/json") !== -1;

        if (sess.found && !tokenFound) {
            var url = reqHdr.getURI().toString();
            var evidence = "Session cookie detected via: " + sess.where;
            if (t1.found) evidence += " | token in header: " + t1.where;
            if (t2.found) evidence += " | token in body/query: " + t2.where;
            evidence += " | Content-Type: " + (contentType ? contentType : "none");

            var risk = 2; 
            var confidence = 2; 
            if (!samesite.present) {
                confidence = 3; // HIGH
            }
            if (isJsonOnly && samesite.present && (samesite.value === "lax" || samesite.value === "strict")) {
                confidence = 1; // LOW
            }

            var description = makeDescription(url, method, evidence);
            var solution = makeSolution();

            var alert = ps.newAlert()
                .setName("CWE-352: Potential CSRF - state-changing request without visible CSRF token")
                .setRisk(risk)
                .setConfidence(confidence)
                .setDescription(description)
                .setEvidence(evidence)
                .setSolution(solution)
                .setCweId(352)
                .setWascId(8)
                .setMessage(msg);

            alert.raise();

            ps.addHistoryTag("possible-csrf");
        } else {            
            if (!sess.found && !samesite.present) {
                // informational alert: missing SameSite on cookies
                var infoAlert = ps.newAlert()
                    .setName("Cookie SameSite missing (informational)")
                    .setRisk(0) // INFO
                    .setConfidence(1) // LOW
                    .setDescription("A response observed for " + reqHdr.getURI().toString() + " contains Set-Cookie header(s) but no SameSite attribute. " +
                                    "Missing SameSite increases CSRF risk when cookie-based sessions are used.")
                    .setEvidence("Set-Cookie present but SameSite not set")
                    .setSolution("Set SameSite=Lax or Strict on session cookies where appropriate.")
                    .setMessage(msg);
                infoAlert.raise();
            }
        }

    } catch (e) {
        print("Passive CSRF script error: " + e);
    }
}

function appliesToHistoryType(historyType) {
    return PluginPassiveScanner.getDefaultHistoryTypes().contains(historyType);
}
