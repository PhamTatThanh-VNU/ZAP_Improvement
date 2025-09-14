// Note that new active scripts will initially be disabled
// Right click the script in the Scripts tree and select "enable"

const ScanRuleMetadata = Java.type("org.zaproxy.addon.commonlib.scanrules.ScanRuleMetadata");
const HttpHeader = Java.type("org.parosproxy.paros.network.HttpHeader");
const HttpMessage = Java.type("org.parosproxy.paros.network.HttpMessage");
const URI = Java.type("org.apache.commons.httpclient.URI");

function getMetadata() {
    return ScanRuleMetadata.fromYaml(`
id: 40001
name: LDAP Injection Custom
description: >
  LDAP injection is an attack technique used to exploit web applications that construct LDAP statements
  from user-supplied input. When an application fails to properly sanitize user input, it's possible
  to modify LDAP statements, leading to unauthorized data access, modification, or other security
  breaches. This rule attempts to inject various LDAP metacharacters and filter constructs to
  identify such vulnerabilities by observing application error responses.
solution: >
  Sanitize all user-supplied input before using it in LDAP queries. Use a framework-provided
  function for escaping LDAP metacharacters. Implement least-privilege access for the LDAP
  binding account to limit the impact of a successful injection.
references:
  - https://owasp.org/www-community/attacks/LDAP_Injection
  - https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
category: INJECTION
risk: HIGH
confidence: MEDIUM
cweId: 90
wascId: 29
alertTags:
  CWE-90: Improper Neutralization of Special Elements used in an LDAP Query
  WSTG-V42-INPV-06: Testing for LDAP Injection
  OWASP_TOP10_2021_A03: Injection
status: alpha
`);
}

/**
 * Scans a "node", i.e. an individual entry in the Sites Tree.
 * The scanNode function will typically be called once for every page.
 *
 * @param as - the ActiveScan parent object that will do all the core interface tasks
 *     (i.e.: sending and receiving messages, providing access to Strength and Threshold settings,
 *     raising alerts, etc.). This is an ActiveScriptHelper object.
 * @param msg - the HTTP Message being scanned. This is an HttpMessage object.
 */
function scanNode(as, msg) {
    // The scan() function is used for parameter-based attacks, so this function is not needed.
}

/**
 * Scans a specific parameter in an HTTP message.
 * The scan function will typically be called for every parameter in every URL and Form for every page.
 *
 * @param as - the ActiveScan parent object that will do all the core interface tasks
 *     (i.e.: sending and receiving messages, providing access to Strength and Threshold settings,
 *     raising alerts, etc.). This is an ActiveScriptHelper object.
 * @param msg - the HTTP Message being scanned. This is an HttpMessage object.
 * @param {string} param - the name of the parameter being manipulated for this test/scan.
 * @param {string} value - the original parameter value.
 */
function scan(as, msg, param, value) {
    // Define LDAP injection payloads.
    // These include basic wildcards, filter manipulation, and special characters to trigger errors.
    const payloads = [
        '*',
        ')(uid=*))',
        '*()&%|',
        '(objectClass=*)',
        '|(|(cn=*)(sn=*)(gn=*))',
        '\\2A', // Hex-encoded wildcard '*'
        '()',
        '(&(objectClass=*)(uid=admin))'
    ];

    // Define regular expressions to detect evidence of LDAP errors in the response body.
    const evidencePatterns = [
        /LDAPException|Invalid LDAP syntax|SearchRequest|Filter pattern/i,
        /javax\.naming\.directory|javax\.naming\.NamingException/i,
        /LDAP search failed|Protocol error|LDAP error/i,
        /Unbalanced Parentheses|Invalid filter/i,
        /supplied argument is not a valid ldap filter/i,
        /objectclass violation/i,
        /invalid attribute syntax/i
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
        const responseHeader = newMsg.getResponseHeader().toString();

        for (let j = 0; j < evidencePatterns.length; j++) {
            const pattern = evidencePatterns[j];
            const match = pattern.exec(responseBody);
            if (match) {
                as.newAlert()
                    .setParam(param)
                    .setAttack(attack)
                    .setEvidence(match[0]) // The matched error string
                    .setOtherInfo("The server responded with an error message indicative of an LDAP injection vulnerability.")
                    .setMessage(newMsg)
                    .raise();
                return;
            }
        }

        if (newMsg.getResponseHeader().getStatusCode() == 500) {
            as.newAlert()
                .setParam(param)
                .setAttack(attack)
                .setEvidence("Status code 500")
                .setOtherInfo("The server returned a 500 Internal Server Error, which could indicate an unhandled exception caused by the LDAP injection payload.")
                .setMessage(newMsg)
                .raise();
            return;
        }
    }
}