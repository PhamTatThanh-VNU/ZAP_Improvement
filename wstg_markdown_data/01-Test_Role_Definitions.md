# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [03-Identity Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/)
# Test Role Definitions
ID  
---  
WSTG-IDNT-01  
## Summary
Applications have several types of functionalities and services, and those require access permissions based on the needs of the user. That user could be:
  * an administrator, where they manage the application functionalities.
  * an auditor, where they review the application transactions and provide a detailed report.
  * a support engineer, where they help customers debug and fix issues on their accounts.
  * a customer, where they interact with the application and benefit from its services.


In order to handle these uses and any other use case for that application, role definitions are setup (more commonly known as [RBAC](https://en.wikipedia.org/wiki/Role-based_access_control)). Based on these roles, the user is capable of accomplishing the required task.
## Test Objectives
  * Identify and document roles used by the application.
  * Attempt to switch, change, or access another role.
  * Review the granularity of the roles and the needs behind the permissions given.


## How to Test
### Roles Identification
The tester should start by identifying the application roles being tested through any of the following methods:
  * Application documentation.
  * Guidance by the developers or administrators of the application.
  * Application comments.
  * Fuzz possible roles: 
    * cookie variable (_e.g._ `role=admin`, `isAdmin=True`)
    * account variable (_e.g._ `Role: manager`)
    * hidden directories or files (_e.g._ `/admin`, `/mod`, `/backups`)
    * switching to well known users (_e.g._ `admin`, `backups`, etc.)


### Switching to Available Roles
After identifying possible attack vectors, the tester needs to test and validate that they can access the available roles.
> Some applications define the roles of the user on creation, through rigorous checks and policies, or by ensuring that the user’s role is properly protected through a signature created by the backend. Finding that roles exist doesn’t mean that they’re a vulnerability.
### Review Roles Permissions
After gaining access to the roles on the system, the tester must understand the permissions provided to each role.
A support engineer shouldn’t be able to conduct administrative functionalities, manage the backups, or conduct any transactions in the place of a user.
An administrator shouldn’t have full powers on the system. Sensitive admin functionality should leverage a maker-checker principle, or use MFA to ensure that the administrator is conducting the transaction. A clear example on this was the [Twitter incident in 2020](https://blog.twitter.com/en_us/topics/company/2020/an-update-on-our-security-incident.html).
## Tools
The above mentioned tests can be conducted without the use of any tool, except the one being used to access the system.
To make things easier and more documented, one can use:
  * [Burp’s Autorize extension](https://github.com/Quitten/Autorize)
  * [ZAP’s Access Control Testing add-on](https://www.zaproxy.org/docs/desktop/addons/access-control-testing/)


## Spotlight: Checkmarx
[![image](https://owasp.org/assets/images/corp-member-logo/Checkmarxn-NewLogo2024.jpg)](http://checkmarx.com)
Checkmarx is the enterprise application security leader and the provider of Checkmarx One™, the industry-leading cloud-native AppSec platform that helps enterprises build
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)[![image](https://owasp.org/assets/images/corp-member-logo/salesforce.png)](https://www.salesforce.com/)[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)[![image](https://owasp.org/assets/images/corp-member-logo/ua_logo_stack_rgb_r.png)](https://www.united.com/)[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)[![image](https://owasp.org/assets/images/corp-member-logo/ZenLogo.png)](http://www.zengroup.co.in)
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
