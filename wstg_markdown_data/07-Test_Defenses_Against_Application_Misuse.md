# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [10-Business Logic Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/10-Business_Logic_Testing/)
# Test Defenses Against Application Misuse
ID  
---  
WSTG-BUSL-07  
## Summary
The misuse and invalid use of valid functionality can identify attacks attempting to enumerate the web application, identify weaknesses, and exploit vulnerabilities. Tests should be undertaken to determine whether there are application-layer defensive mechanisms in place to protect the application.
The lack of active defenses allows an attacker to hunt for vulnerabilities without any recourse. The application’s owner will thus not know their application is under attack.
### Example
An authenticated user undertakes the following (unlikely) sequence of actions:
  1. Attempt to access a file ID their roles is not permitted to download
  2. Substitutes a single tick `'` instead of the file ID number
  3. Alters a GET request to a POST
  4. Adds an extra parameter
  5. Duplicates a parameter name/value pair


The application is monitoring for misuse and responds after the 5th event with extremely high confidence the user is an attacker. For example the application:
  * Disables critical functionality
  * Enables additional authentication steps to the remaining functionality
  * Adds time-delays into every request-response cycle
  * Begins to record additional data about the user’s interactions (e.g. sanitized HTTP request headers, bodies and response bodies)


If the application does not respond in any way and the attacker can continue to abuse functionality and submit clearly malicious content at the application, the application has failed this test case. In practice the discrete example actions in the example above are unlikely to occur like that. It is much more probable that a fuzzing tool is used to identify weaknesses in each parameter in turn. This is what a security tester will have undertaken too.
## Test Objectives
  * Generate notes from all tests conducted against the system.
  * Review which tests had a different functionality based on aggressive input.
  * Understand the defenses in place and verify if they are enough to protect the system against bypassing techniques.


## How to Test
This test is unusual in that the result can be drawn from all the other tests performed against the web application. While performing all the other tests, take note of measures that might indicate the application has in-built self-defense:
  * Changed responses
  * Blocked requests
  * Actions that log a user out or lock their account


These may only be localized. Common localized (per function) defenses are:
  * Rejecting input containing certain characters
  * Locking out an account temporarily after a number of authentication failures


Localized security controls are not sufficient. There are often no defenses against general mis-use such as:
  * Forced browsing
  * Bypassing presentation layer input validation
  * Multiple access control errors
  * Additional, duplicated or missing parameter names
  * Multiple input validation or business logic verification failures with values that cannot be the result of user mistakes or typos
  * Structured data (e.g. JSON, XML) of an invalid format is received
  * Blatant cross-site scripting or SQL injection payloads are received
  * Utilizing the application faster than would be possible without automation tools
  * Change in continental geo-location of a user
  * Change of user agent
  * Accessing a multi-stage business process in the wrong order
  * Large number of, or high rate of use of, application-specific functionality (e.g. voucher code submission, failed credit card payments, file uploads, file downloads, log outs, etc).


These defenses work best in authenticated parts of the application, although rate of creation of new accounts or accessing content (e.g. to scrape information) can be of use in public areas.
Not all the above need to be monitored by the application, but there is a problem if none of them are. By testing the web application, doing the above type of actions, was any response taken against the tester? If not, the tester should report that the application appears to have no application-wide active defenses against misuse. Note it is sometimes possible that all responses to attack detection are silent to the user (e.g. logging changes, increased monitoring, alerts to administrators and and request proxying), so confidence in this finding cannot be guaranteed. In practice, very few applications (or related infrastructure such as a web application firewall) are detecting these types of misuse.
## Related Test Cases
All other test cases are relevant.
## Remediation
Applications should implement active defenses to fend off attackers and abusers.
## Spotlight: Atlassian, Inc.
[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)
Tools for teams, from startup to enterprise - Atlassian provides tools to help every team unleash their full potential
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Backslash-logo.png)](https://www.backslash.security/?utm_campaign=Launch&utm_source=owasp-sponsorship&utm_medium=banner&utm_content=homepage)[![image](https://owasp.org/assets/images/corp-member-logo/GuidePoint.png)](https://www.guidepointsecurity.com/)[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)[![image](https://owasp.org/assets/images/corp-member-logo/SecureCodeWarrior.png)](https://www.securecodewarrior.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Red_Hat.svg)](http://www.redhat.com)[![image](https://owasp.org/assets/images/corp-member-logo/Root.png)](https://www.root.io/)[![image](https://owasp.org/assets/images/corp-member-logo/BDO.png)](https://www.bdo.global/en-gb/services/advisory/cybersecurity)[![image](https://owasp.org/assets/images/corp-member-logo/Digital.png)](http://digital.ai)[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)
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
