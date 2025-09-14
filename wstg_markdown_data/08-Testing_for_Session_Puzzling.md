# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [06-Session Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/)
# Testing for Session Puzzling
ID  
---  
WSTG-SESS-08  
## Summary
Session Variable Overloading (also known as Session Puzzling) is an application level vulnerability which can enable an attacker to perform a variety of malicious actions, including but not limited to:
  * Bypass efficient authentication enforcement mechanisms, and impersonate legitimate users.
  * Elevate the privileges of a malicious user account, in an environment that would otherwise be considered foolproof.
  * Skip over qualifying phases in multi-phase processes, even if the process includes all the commonly recommended code level restrictions.
  * Manipulate server-side values in indirect methods that cannot be predicted or detected.
  * Execute traditional attacks in locations that were previously unreachable, or even considered secure.


This vulnerability occurs when an application uses the same session variable for more than one purpose. An attacker can potentially access pages in an order unanticipated by the developers so that the session variable is set in one context and then used in another.
For example, an attacker could use session variable overloading to bypass authentication enforcement mechanisms of applications that enforce authentication by validating the existence of session variables that contain identity–related values, which are usually stored in the session after a successful authentication process. This means an attacker first accesses a location in the application that sets session context and then accesses privileged locations that examine this context.
For example - an authentication bypass attack vector could be executed by accessing a publicly accessible entry point (e.g. a password recovery page) that populates the session with an identical session variable, based on fixed values or on user originating input.
## Test Objectives
  * Identify all session variables.
  * Break the logical flow of session generation.


## How to Test
### Black-Box Testing
This vulnerability can be detected and exploited by enumerating all of the session variables used by the application and in which context they are valid. In particular this is possible by accessing a sequence of entry points and then examining exit points. In case of black-box testing this procedure is difficult and requires some luck since every different sequence could lead to a different result.
#### Examples
A very simple example could be the password reset functionality that, in the entry point, could request the user to provide some identifying information such as the username or the email address. This page might then populate the session with these identifying values, which are received directly from the client-side, or obtained from queries or calculations based on the received input. At this point there may be some pages in the application that show private data based on this session object. In this manner the attacker could bypass the authentication process.
### Gray-Box Testing
The most effective way to detect these vulnerabilities is via a source code review.
## Remediation
Session variables should only be used for a single consistent purpose.
## Spotlight: Equixly
[![image](https://owasp.org/assets/images/corp-member-logo/Equixly.png)](https://equixly.com)
Equixly helps developers and organizations create more secure applications, increase their security posture, and spread knowledge of new vulnerabilities. Equixly offers a SaaS platform that allows integrating API security testing within the software development lifecycle (SLDC) to detect flaws, reduce bug-fixing costs, and exponentially scale penetration testing upon every new functionality released. The platform can automatically perform API attacks leveraging a novel machine learning (ML) algorithm trained over thousands of security tests. Then, Equixly returns near-real-time results and a predictive remediation plan that developers can use to fix their application issues autonomously.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/salesforce.png)](https://www.salesforce.com/)[![image](https://owasp.org/assets/images/corp-member-logo/BlackDuck.png)](https://www.blackduck.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Root.png)](https://www.root.io/)[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/sq1_logo_dark_version.png)](https://www.sq1.security)[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)[![image](https://owasp.org/assets/images/corp-member-logo/Heeler.jpg)](https://heeler.com)[![image](https://owasp.org/assets/images/corp-member-logo/OccamSec.png)](https://osec.com)[![image](https://owasp.org/assets/images/corp-member-logo/Impart.png)](https://www.impart.security/)
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
