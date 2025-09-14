# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [02-Configuration and Deployment Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/)
# Test HTTP Strict Transport Security
ID  
---  
WSTG-CONF-07  
## Summary
The HTTP Strict Transport Security (HSTS) feature enables a web server to inform the user’s browser, via a special response header, that it should never establish an unencrypted HTTP connection to the specified domain servers. Instead, it should automatically establish all connection requests to access the site through HTTPS. This also prevents users from overriding certificate errors.
Considering the importance of this security measure, it is prudent to verify that the site is using this HTTP header in order to ensure that all the data travels encrypted between the web browser and the server.
The HTTP strict transport security header uses three specific directives:
  * `max-age`: to indicate the number of seconds that the browser should automatically convert all HTTP requests to HTTPS.
  * `includeSubDomains`: to indicate that all related sub-domains must use HTTPS.
  * `preload` Unofficial: to indicate that the domain(s) are on the preload list(s) and that browsers should never connect without HTTPS. 
    * While this is supported by all the major browsers, it is not an official part of the specification. (See [hstspreload.org](https://hstspreload.org/) for more information.)


Here’s an example of the HSTS header implementation:
`Strict-Transport-Security: max-age=31536000; includeSubDomains`
The presence of this header must be checked, as its absence could lead to security issues such as:
  * Attackers intercepting and accessing the information transferred over an unencrypted network channel.
  * Attackers carrying out manipulator-in-the-middle (MITM) attacks by taking advantage of users who accept untrusted certificates.
  * Users who mistakenly enter an address in the browser using HTTP instead of HTTPS, or users who click on a link in a web application that incorrectly uses the HTTP protocol.


## Test Objectives
  * Review the HSTS header and its validity.


## How to Test
  * Confirm the presence of the HSTS header by examining the server’s response through an intercepting proxy.
  * Use curl as follows:


```
$ curl -s -D- https://owasp.org | grep -i strict-transport-security:
Strict-Transport-Security: max-age=31536000

```

## Spotlight: Root
[![image](https://owasp.org/assets/images/corp-member-logo/Root.png)](https://www.root.io/)
Root.io delivers Autonomous Container Security through Automated Vulnerability Remediation (AVR), eliminating CVEs without disrupting developer workflows. Powered by agentic AI, our platform applies targeted, in-place patches—no rebasing, no re-architecting, and no vendor lock-in—while preserving base images and ensuring SLA-backed compliance and alignment with emerging regulatory standards. Root integrates with CI/CD and developer tools, complements your existing scanners by fixing what they flag, and backports patches even when no upstream fix exists. Trusted by security-conscious enterprises in defense, AI, and regulated industries, Root pairs SBOM + VEX automation with audit-readiness. Remediation that’s automatic, auditable, and already done.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/sq1_logo_dark_version.png)](https://www.sq1.security)[![image](https://owasp.org/assets/images/corp-member-logo/FujitsuLimited.png)](https://global.fujitsu/en-global)[![image](https://owasp.org/assets/images/corp-member-logo/Automattic.png)](https://automattic.com/)[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/Adobe.png)](http://trust.adobe.com)[![image](https://owasp.org/assets/images/corp-member-logo/GuardSquare.png)](https://www.guardsquare.com/)[![image](https://owasp.org/assets/images/corp-member-logo/cydrill_logo_300x90-01.png)](https://cydrill.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Rakuten2022.png)](https://global.rakuten.com/corp/)
[Become a corporate supporter](https://owasp.org/supporters)
[](https://github.com/OWASP/) [](https://owasp.org/slack/invite) [](https://www.facebook.com/OWASPFoundation) [](https://infosec.exchange/@owasp) [](https://twitter.com/owasp) [](https://www.linkedin.com/company/owasp/) [](https://www.youtube.com/user/OWASPGLOBAL)
  * [HOME](https://owasp.org/)
  * [PROJECTS](https://owasp.org/projects/)
  * [CHAPTERS](https://owasp.org/chapters/)
  * [EVENTS](https://owasp.org/events/)
  * [ABOUT](https://owasp.org/about/)
  * [PRIVACY](https://owasp.org/www-policy/operational/privacy)
  * [SITEMAP](https://owasp.org/sitemap/)
  * [CONTACT](https://owasp.org/contact/)


OWASP, the OWASP logo, and Global AppSec are registered trademarks and AppSec Days, AppSec California, AppSec Cali, SnowFROC, OWASP Boston Application Security Conference, and LASCON are trademarks of the OWASP Foundation, Inc. Unless otherwise specified, all content on the site is Creative Commons Attribution-ShareAlike v4.0 and provided without warranty of service or accuracy. For more information, please refer to our [General Disclaimer](https://owasp.org/www-policy/operational/general-disclaimer.html). OWASP does not endorse or recommend commercial products or services, allowing our community to remain vendor neutral with the collective wisdom of the best minds in software security worldwide. Copyright 2025, OWASP Foundation, Inc. 
