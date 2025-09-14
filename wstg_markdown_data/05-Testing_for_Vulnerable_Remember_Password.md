# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [04-Authentication Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/)
# Testing for Vulnerable Remember Password
ID  
---  
WSTG-ATHN-05  
## Summary
Credentials are the most widely used authentication technology. Due to such a wide usage of username-password pairs, users are no longer able to properly handle their credentials across the multitude of used applications.
In order to assist users with their credentials, multiple technologies surfaced:
  * Applications provide a _remember me_ functionality that allows the user to stay authenticated for long periods of time, without asking the user again for their credentials.
  * Password Managers - including browser password managers - that allow the user to store their credentials in a secure manner and later on inject them in user-forms without any user intervention.


## Test Objectives
  * Validate that the generated session is managed securely and do not put the user’s credentials in danger.


## How to Test
As these methods provide a better user experience and allow the user to forget all about their credentials, they increase the attack surface area. Some applications:
  * Store the credentials in an encoded fashion in the browser’s storage mechanisms, which can be verified by following the [web storage testing scenario](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/12-Testing_Browser_Storage) and going through the [session analysis](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/01-Testing_for_Session_Management_Schema#session-analysis) scenarios. Credentials shouldn’t be stored in any way in the client-side application, and should be substituted by tokens generated server-side.
  * Automatically inject the user’s credentials that can be abused by: 
    * [ClickJacking](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/09-Testing_for_Clickjacking) attacks.
    * [CSRF](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/05-Testing_for_Cross_Site_Request_Forgery) attacks.
  * Tokens should be analyzed in terms of token-lifetime, where some tokens never expire and put the users in danger if those tokens ever get stolen. Make sure to follow the [session timeout](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/07-Testing_Session_Timeout) testing scenario.


## Remediation
  * Follow [session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) good practices.
  * Ensure that no credentials are stored in clear text or are easily retrievable in encoded or encrypted forms in browser storage mechanisms; they should be stored server-side and follow good [password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) practices.


* * *
[Edit on GitHub](https://github.com/OWASP/www-project-web-security-testing-guide/blob/master/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/05-Testing_for_Vulnerable_Remember_Password.md)
**The OWASP ® Foundation** works to improve the security of software through its community-led open source software projects, hundreds of chapters worldwide, tens of thousands of members, and by hosting local and global conferences. 
## Spotlight: SecureFlag
[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)
SecureFlag empowers organizations in 30 plus countries to implement secure coding training. The platform offers thousands of hands-on labs in over 45 programming languages, hosted in virtualized environments. Developers gain skills to identify and remediate vulnerabilities, building secure software from the start. Through plugins, we integrate with the Software Development Life Cycle, embedding secure practices into workflows. Our customer success team designs bespoke training programs tailored to organizational needs. SecureFlag also offers ThreatCanvas, an automated threat modeling solution enabling developers to assess and mitigate design risks independently, reducing reliance on security teams.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)[![image](https://owasp.org/assets/images/corp-member-logo/Zimperiumlogo_300x90px.jpeg)](https://www.zimperium.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Adobe.png)](http://trust.adobe.com)[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)[![image](https://owasp.org/assets/images/corp-member-logo/FujitsuLimited.png)](https://global.fujitsu/en-global)[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)[![image](https://owasp.org/assets/images/corp-member-logo/sq1_logo_dark_version.png)](https://www.sq1.security)[![image](https://owasp.org/assets/images/corp-member-logo/ZINAD.png)](http://www.zinad.net)[![image](https://owasp.org/assets/images/corp-member-logo/JitLogo.png)](https://jit.io)
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
