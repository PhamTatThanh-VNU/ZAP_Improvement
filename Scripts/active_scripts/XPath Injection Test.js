// Note that new active scripts will initially be disabled
// Right click the script in the Scripts tree and select "enable"

const ScanRuleMetadata = Java.type("org.zaproxy.addon.commonlib.scanrules.ScanRuleMetadata");
const HttpHeader = Java.type("org.parosproxy.paros.network.HttpHeader");
const HttpMessage = Java.type("org.parosproxy.paros.network.HttpMessage");
const URI = Java.type("org.apache.commons.httpclient.URI");

function getMetadata() {
    return ScanRuleMetadata.fromYaml(`
id: 4009232
name: XPath Injection
description: >
  XPath Injection is an attack technique used to manipulate XML data queries.
  It occurs when user input is unsafely embedded in XPath expressions,
  allowing attackers to bypass authentication, extract data, or modify logic.
solution: >
  Use parameterized XPath APIs. Avoid direct string concatenation with user input.
  Always validate and sanitize input to remove XPath syntax characters.
references:
  - https://owasp.org/www-community/attacks/XPATH_Injection
  - https://portswigger.net/web-security/xpath-injection
category: INJECTION
risk: HIGH
confidence: MEDIUM
cweId: 643
wascId: 39
alertTags:
  CWE-643: Improper Neutralization of Data within XPath Expressions
  WSTG-V42-INPV-09: Testing for XPath Injection
  OWASP_TOP10_2021_A03: Injection
status: alpha
`);
}

function scanNode(as, msg) {
    // Not used for node-level scanning
}

function scan(as, msg, param, value) {
    const payloads = [
        `' or '1'='1`,
        `" or "1"="1"`,
        `admin' or '1'='1`,
        `' or count(//user)=1 or ''='`,
        `' or name()='user' or ''='`,
        `admin' and substring(password,1,1)='a`,
        `admin' and 1=1 or '1'='2`,
        `') or ('1'='1`,
        `' or starts-with(name(/*), "a") or ''='`,
        `' or 1=1 or 'a'='a`
    ];

    const evidencePatterns = [
        /XPathException|Invalid XPath|XPath syntax error/i,
        /A node-set cannot be used in this context/i,
        /Unclosed literal|Expected node/i,
        /System\.Xml\.XPath/i,
        /org\.w3c\.dom\.xpath/i,
        /XPath query error|Invalid expression/i
    ];

    for (let i = 0; i < payloads.length; i++) {
        const attack = payloads[i];

        if (as.isStop()) {
            return;
        }

        const newMsg = msg.cloneRequest();
        as.setParam(newMsg, param, attack);
        as.sendAndReceive(newMsg, false, false);

        const responseBody = newMsg.getResponseBody().toString();

        for (let j = 0; j < evidencePatterns.length; j++) {
            const pattern = evidencePatterns[j];
            const match = pattern.exec(responseBody);
            if (match) {
                as.newAlert()
                    .setParam(param)
                    .setAttack(attack)
                    .setEvidence(match[0])
                    .setOtherInfo("The server responded with an error indicating a potential XPath injection vulnerability.")
                    .setMessage(newMsg)
                    .raise();
                return;
            }
        }

        if (newMsg.getResponseHeader().getStatusCode() === 500) {
            as.newAlert()
                .setParam(param)
                .setAttack(attack)
                .setEvidence("Status code 500")
                .setOtherInfo("Server responded with 500 Internal Server Error, which could be caused by an unhandled XPath exception.")
                .setMessage(newMsg)
                .raise();
            return;
        }
    }
}