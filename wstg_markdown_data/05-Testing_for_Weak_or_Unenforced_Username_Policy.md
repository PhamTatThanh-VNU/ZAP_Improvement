# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [03-Identity Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/)
# Testing for Weak or Unenforced Username Policy
ID  
---  
WSTG-IDNT-05  
## Summary
User account names are often highly structured (e.g. Joe Bloggs account name is jbloggs and Fred Nurks account name is fnurks) and valid account names can easily be guessed.
## Test Objectives
  * Determine whether a consistent account name structure renders the application vulnerable to account enumeration.
  * Determine whether the application’s error messages permit account enumeration.


## How to Test
  * Determine the structure of account names.
  * Evaluate the application’s response to valid and invalid account names.
  * Use different responses to valid and invalid account names to enumerate valid account names.
  * Use account name dictionaries to enumerate valid account names.


## Remediation
Ensure the application returns consistent generic error messages in response to invalid account name, password or other user credentials entered during the log in process.
* * *
[Edit on GitHub](https://github.com/OWASP/www-project-web-security-testing-guide/blob/master/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/05-Testing_for_Weak_or_Unenforced_Username_Policy.md)
**The OWASP ® Foundation** works to improve the security of software through its community-led open source software projects, hundreds of chapters worldwide, tens of thousands of members, and by hosting local and global conferences. 
## Spotlight: Bright Security
[![image](https://owasp.org/assets/images/corp-member-logo/BrightSecurity.png)](https://brightsec.com/)
Bright Security delivers an enterprise-grade, developer-centric Dynamic Application Security Testing (DAST) platform, enabling organizations to identify and remediate vulnerabilities early and seamlessly throughout the Software Development Life Cycle (SDLC). Trusted by leading organizations across the globe, Bright excels in securing web applications, APIs, business logic, and LLMs. By integrating directly into development workflows, Bright empowers teams to accelerate vulnerability resolution by up to 10X, ensuring robust security without compromising speed or innovation.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/sq1_logo_dark_version.png)](https://www.sq1.security)[![image](https://owasp.org/assets/images/corp-member-logo/Equixly.png)](https://equixly.com)[![image](https://owasp.org/assets/images/corp-member-logo/securityjourney_300x90.png)](http://www.SecurityJourney.com)[![image](https://owasp.org/assets/images/corp-member-logo/salesforce.png)](https://www.salesforce.com/)[![image](https://owasp.org/assets/images/corp-member-logo/blended_logoowasp.png)](http://blend-ed.com)[![image](https://owasp.org/assets/images/corp-member-logo/DefectDojo.png)](https://www.defectdojo.com/)[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)[![image](https://owasp.org/assets/images/corp-member-logo/FujitsuLimited.png)](https://global.fujitsu/en-global)[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)
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
