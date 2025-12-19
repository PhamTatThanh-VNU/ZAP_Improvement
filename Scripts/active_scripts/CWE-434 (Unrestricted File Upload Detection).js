const ScanRuleMetadata = Java.type("org.zaproxy.addon.commonlib.scanrules.ScanRuleMetadata");
const HttpRequestHeader = Java.type("org.parosproxy.paros.network.HttpRequestHeader");
const HttpMessage = Java.type("org.parosproxy.paros.network.HttpMessage");

function getMetadata() {
    return ScanRuleMetadata.fromYaml(`
id: 7654321
name: Unrestricted File Upload Detection (CWE‑434)
description: Detects endpoints that accept file uploads without validation.
solution: Validate file type, use allowlist, store files outside webroot, and sanitize filenames.
references:
  - https://cwe.mitre.org/data/definitions/434.html
category: server
risk: HIGH
confidence: MEDIUM
cweId: 434
wascId: 0
alertTags:
  OWASP_2021_A5: Insecure Design
otherInfo: Attempts uploading harmless test file.
status: alpha
`);
}

function scanNode(as, msg) {
    const uri = msg.getRequestHeader().getURI().toString();
    const method = msg.getRequestHeader().getMethod();

    // Chỉ scan POST/PUT/PATCH
    if (!(method.equalsIgnoreCase("POST") || method.equalsIgnoreCase("PUT") || method.equalsIgnoreCase("PATCH"))) {
        return;
    }

    const contentType = msg.getRequestHeader().getHeader("Content-Type");
    if (contentType == null) return;

    const looksLikeUpload =
        contentType.contains("multipart/form-data") ||
        contentType.contains("octet-stream");

    if (!looksLikeUpload) return;

    print("[CWE434] Upload-like endpoint detected: " + uri);

    if (as.isStop()) return;

    // Clone request
    let uploadMsg = msg.cloneRequest();

    // ---- Payload ----
    const boundary = "----ZAPBOUNDARY" + Math.random().toString().substring(2);
    const filename = "zap_test_" + Date.now() + ".php";
    const payload = "<?php echo 'ZAPTEST434'; ?>";

    const body =
        "--" + boundary + "\r\n" +
        'Content-Disposition: form-data; name="file"; filename="' + filename + "\"\r\n" +
        "Content-Type: application/x-php\r\n\r\n" +
        payload + "\r\n" +
        "--" + boundary + "--";

    uploadMsg.getRequestHeader().setHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
    uploadMsg.setRequestBody(body);
    uploadMsg.getRequestHeader().setContentLength(uploadMsg.getRequestBody().length());    
    // ---- SEND UPLOAD ----
    as.sendAndReceive(uploadMsg, true, false);

    const status = uploadMsg.getResponseHeader().getStatusCode();
    const resp = uploadMsg.getResponseBody().toString();

    print("[CWE434] Upload status: " + status);    
    
    if (status < 200 || status >= 300) {
        print("[CWE434] Upload failed, stopping.");
        return;
    }  

    // ---- Extract file URL từ response ----
    let possibleUrl = null;

    // Case API trả URL
    let match = resp.match(/https?:\/\/[^\s"']+/);
    if (match && match.length > 0) {
        print('match case 0')
        possibleUrl = match[0];
    }

    // Fallback nếu API không trả URL
    if (!possibleUrl) {               
        possibleUrl = msg.getRequestHeader().getURI();        
    }

    // ---- VERIFY FILE ----
    let getReqHeader = new HttpRequestHeader(msg.getRequestHeader().toString());
    getReqHeader.setMethod("GET");
    print('Debug getReqHeader ', getReqHeader);    
    getReqHeader.setHeader("Content-Length", null);
    getReqHeader.setHeader("Content-Type", null);    
    
    let getMsg = new HttpMessage(getReqHeader);

    as.sendAndReceive(getMsg, false, false);

    let verifyBody = getMsg.getResponseBody().toString();    
    
    if (verifyBody.contains("ZAPTEST434")) {
        print("[CWE434] VULNERABILITY FOUND!");

        as.newAlert("7654321-1")
            .setName("Unrestricted File Upload (CWE‑434)")
            .setDescription("The server allowed uploading and accessing a harmful PHP file.")
            .setEvidence(verifyBody)
            .setMessage(uploadMsg)
            .raise();
        return;
    }
    as.newAlert("7654321-2")
        .setName("Possible Unrestricted File Upload (CWE-434)")
        .setDescription(
            "The endpoint accepted an uploaded file (HTTP 200), but the uploaded file " +
            "could not be accessed or executed. This is weak evidence of a potential CWE-434."
        )
        .setOtherInfo(
            "Upload succeeded but did not return a retrievable file. " +
            "Confidence: LOW\n" +
            "Checked URL: " + possibleUrl
        )
        .setEvidence("Upload response code: 200")
        .setMessage(uploadMsg)
        .raise();

}
