# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [02-Configuration and Deployment Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/)
# Test File Permission
ID  
---  
WSTG-CONF-09  
## Summary
When a resource is given a permissions setting that provides access to a wider range of actors than required, it could lead to the exposure of sensitive information, or the modification of that resource by unintended parties. This is especially dangerous when the resource is related to program configuration, execution, or sensitive user data.
A clear example would be an executable file that can be run by unauthorized users. For another example, consider account information or a token value used to access an API. These are increasingly seen in modern web services and microservices, and may be stored in a configuration file that has world-readable permissions by default upon installation. Such sensitive data could be exposed either by malicious internal actors within the host system or by remote attackers. The latter may have compromised the service through other vulnerabilities, while gaining only normal user privileges.
## Test Objectives
  * Review and identify any rogue file permissions.


## How to Test
In Linux, use `ls` command to check the file permissions. Alternatively, `namei` can also be used to recursively list file permissions.
`$ namei -l /PathToCheck/`
The files and directories that require file permission testing can include, but are not limited to, the following:
  * Web files/directory
  * Configuration files/directory
  * Sensitive files(encrypted data, password, key)/directory
  * Log files(security logs, operation logs, admin logs)/directory
  * Executables(scripts, EXE, JAR, class, PHP, ASP)/directory
  * Database files/directory
  * Temp files/directory
  * Upload files/directory


## Remediation
Set the permissions of the files and directories properly so that unauthorized users cannot access critical resources.
## Tools
  * [Windows AccessEnum](https://technet.microsoft.com/en-us/sysinternals/accessenum)
  * [Windows AccessChk](https://technet.microsoft.com/en-us/sysinternals/accesschk)
  * [Linux namei](https://linux.die.net/man/1/namei)


## Spotlight: OpenText
[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)
Fortify Application Security provides your team with solutions to promote DevSecOps best practices, enable cloud transformation, and secure your software supply chain. As the sole code security solution with over two decades of expertise and acknowledged as a market leader by all major analysts, Fortify delivers the most adaptable, precise, and scalable AppSec platform available, supporting the breadth of tech you use while integrating into your preferred toolchain. With Fortify, go beyond check the box security because your great code demands great security.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)[![image](https://owasp.org/assets/images/corp-member-logo/Equixly.png)](https://equixly.com)[![image](https://owasp.org/assets/images/corp-member-logo/Zimperiumlogo_300x90px.jpeg)](https://www.zimperium.com/)[![image](https://owasp.org/assets/images/corp-member-logo/FujitsuLimited.png)](https://global.fujitsu/en-global)[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)[![image](https://owasp.org/assets/images/corp-member-logo/UnboundSecurity.png)](https://unboundsecurity.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/SecureCodeWarrior.png)](https://www.securecodewarrior.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Zelvin.jpg)](https://zelvin.com)[![image](https://owasp.org/assets/images/corp-member-logo/Root.png)](https://www.root.io/)
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
