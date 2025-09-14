// This script is a passive scan rule for OWASP ZAP.
// It checks for the presence of common metrics-related paths in the URL.
// Author: ZAP Script Bot

// Import necessary ZAP classes.
const PluginPassiveScanner = Java.type("org.zaproxy.zap.extension.pscan.PluginPassiveScanner");
const ScanRuleMetadata = Java.type("org.zaproxy.addon.commonlib.scanrules.ScanRuleMetadata");
const HttpHeader = Java.type("org.parosproxy.paros.network.HttpHeader");
const HistoryReference = Java.type("org.parosproxy.paros.model.HistoryReference");

/**
 * Returns metadata for this scan rule.
 * This information is used to define the alert that will be raised.
 */
function getMetadata() {
  return ScanRuleMetadata.fromYaml(`
id: 10106 
name: Exposed Metrics Endpoint
description: >
  The application may be exposing a metrics endpoint (e.g., Prometheus, Spring Boot Actuator). 
  These endpoints can leak sensitive information about the application's internal state, 
  infrastructure, software versions, and business data, which could be leveraged by an attacker for reconnaissance.
solution: >
  Restrict access to metrics endpoints. They should not be publicly accessible. 
  Use authentication and authorization controls, or limit access to trusted IP addresses 
  at the network level (e.g., via firewall rules).
references:
  - https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Information_Gathering/05-Review_Webpage_Content_for_Information_Leakage
  - https://prometheus.io/docs/instrumenting/exposition_formats/
risk: Medium
confidence: High
cweId: 200  # Exposure of Sensitive Information to an Unauthorized Actor
wascId: 13  # Information Leakage
alertTags:
  WSTG-v42-INFO-05: Review Webpage Content for Information Leakage
  Technology: Metrics
  Technology: Prometheus
  Technology: SpringBoot
status: release
`);
}

/**
 * Passively scans an HTTP message. This function is called for each request/response
 * that passes through ZAP.
 *
 * @param ps - The PassiveScriptHelper object for raising alerts and interacting with ZAP.
 * @param msg - The HttpMessage object being scanned.
 * @param src - The source of the message.
 */
function scan(ps, msg, src) {
  // A list of common paths used for exposing metrics.
  const metricsPaths = [
    "/metrics",
    "/prometheus",
    "/actuator/prometheus",
    "/actuator/metrics",
    "/actuator/export/prometheus",
    "/q/metrics" // Quarkus metrics path
  ];

  // Get the URL from the request header.
  const url = msg.getRequestHeader().getURI().toString();
  const urlLowerCase = url.toLowerCase();

  // Check if the URL contains any of the known metrics paths.
  // We use indexOf() instead of includes() for compatibility with ZAP's GraalJS engine.
  for (let i = 0; i < metricsPaths.length; i++) {
    const path = metricsPaths[i];
    if (urlLowerCase.indexOf(path) !== -1) {
      // If a match is found, raise an alert.
      ps.newAlert()
        .setParam(url) // The parameter is the full URL.
        .setEvidence(path) // The evidence is the specific path that was matched.
        .raise();
      
      // We found a match, so we can stop checking and exit the function.
      return; 
    }
  }
}

/**
 * Specifies which history types this scanner should apply to.
 * The default setting is usually sufficient.
 *
 * @param {Number} historyType - The ID of the history type.
 * @return {boolean} - True if the scanner should run on this history type.
 */
function appliesToHistoryType(historyType) {
  return PluginPassiveScanner.getDefaultHistoryTypes().contains(historyType);
}