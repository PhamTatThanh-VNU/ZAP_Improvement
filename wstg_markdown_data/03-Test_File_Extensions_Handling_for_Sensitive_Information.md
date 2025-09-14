# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [02-Configuration and Deployment Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/)
# Test File Extensions Handling for Sensitive Information
ID  
---  
WSTG-CONF-03  
## Summary
Web servers commonly use file extensions to determine which technologies, languages, and plugins must be used to fulfill web requests. While this behavior is consistent with RFCs and Web Standards, using standard file extensions provides the penetration tester useful information about the underlying technologies used in a web appliance and greatly simplifies the task of determining the attack scenario to be used on particular technologies. In addition, mis-configuration of web servers could easily reveal confidential information about access credentials.
File extension checks are often done to validate files before uploading them to the server. Unrestricted file uploads can lead to unforeseen results because the content may not be what is expected, or due to unexpected OS filename handling.
Understanding how web servers handle requests for files with different extensions can clarify server behavior based on the types of files accessed. For example, it can help to understand which file extensions are returned as text or plain versus those that cause server-side execution. The latter are indicative of technologies, languages, or plugins used by web servers or application servers. This information may provide additional insight into how the web application is engineered. For example, while a “.pl” extension is typically associated with server-side Perl support, the file extension alone can be misleading and not entirely indicative of the underlying technology. Take, for instance, server-side resources written in Perl, which might be renamed to disguise the usage of Perl. See the next section on “web server components” for more on identifying server-side technologies and components.
## Test Objectives
  * Brute force sensitive file extensions that might contain raw data such as scripts, credentials, etc.
  * Validate that no system framework bypasses exist for the rules that have been set


## How to Test
### Forced Browsing
Submit requests with different file extensions and verify how they are handled. The verification should be on a per web directory basis. Verify directories that allow script execution. Web server directories can be identified by scanning tools which look for the presence of well-known directories. Additionally, mirroring the site structure helps testers reconstruct the directory tree served by the application.
If the web application architecture is load-balanced, it is important to assess all of the web servers. The ease of this task depends on the configuration of the balancing infrastructure. In an infrastructure with redundant components, there may be slight variations in the configuration of individual web or application servers. This may happen if the web architecture employs heterogeneous technologies (think of a set of IIS and Apache web servers in a load-balancing configuration, which may introduce slight asymmetric behavior between them, and possibly different vulnerabilities).
#### Example
The tester has identified the existence of a file named `connection.inc`. Trying to access it directly gives back its contents, which are:
```
<?
    mysql_connect("127.0.0.1", "root", "password")
        or die("Could not connect");
?>

```

The tester determines the existence of a MySQL DBMS backend and the weak credentials used by the web application to access it.
The following file extensions should never be returned by a web server, as they pertain to files that could contain sensitive information or files that have no valid reason to be served.
  * `.asa`
  * `.inc`
  * `.config`


The following file extensions are related to files which, when accessed, are either displayed or downloaded by the browser. Therefore, files with these extensions must be checked to verify that they are indeed supposed to be served (and are not leftovers), and that they do not contain sensitive information.
  * `.zip`, `.tar`, `.gz`, `.tgz`, `.rar`, etc.: (Compressed) archive files
  * `.java`: No reason to provide access to Java source files
  * `.txt`: Text files
  * `.pdf`: PDF documents
  * `.docx`, `.rtf`, `.xlsx`, `.pptx`, etc.: Office documents
  * `.bak`, `.old` and other extensions indicative of backup files (for example: `~` for Emacs backup files)


The list given above details only a few examples, since file extensions are too many to be comprehensively treated here. Refer to [FILExt](https://filext.com/) for a more thorough database of extensions.
To identify files with a given extension, a mix of techniques can be employed. These techniques can include using vulnerability scanners, spidering and mirroring tools, and querying search engines (see [Testing: Spidering and googling](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/01-Conduct_Search_Engine_Discovery_Reconnaissance_for_Information_Leakage)). Manual inspection of the application can also be beneficial, as it overcomes limitations in automatic spidering. See also [Testing for Old, Backup and Unreferenced Files](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/04-Review_Old_Backup_and_Unreferenced_Files_for_Sensitive_Information) which deals with the security issues related to “forgotten” files.
### File Upload
Windows 8.3 legacy file handling can sometimes be used to defeat file upload filters.
Usage examples:
  1. `file.phtml` gets processed as PHP code.
  2. `FILE~1.PHT` is served, but not processed by the PHP ISAPI handler.
  3. `shell.phPWND` can be uploaded.
  4. `SHELL~1.PHP` will be expanded and returned by the OS shell, then processed by the PHP ISAPI handler.


### Gray-Box Testing
White-box testing of file extension handling involves checking the server configurations in the web application architecture and verifying the rules for serving different file extensions.
If the web application relies on a load-balanced, heterogeneous infrastructure, determine whether this may introduce different behavior.
## Tools
Vulnerability scanners, such as Nessus and Nikto, check for the existence of well-known web directories. They may allow the tester to download the site structure, which is helpful when trying to determine the configuration of web directories and how individual file extensions are served. Other tools that can be used for this purpose include:
  * [wget](https://www.gnu.org/software/wget)
  * [curl](https://curl.haxx.se)
  * Perform a Google search for “web mirroring tools”


* * *
[Edit on GitHub](https://github.com/OWASP/www-project-web-security-testing-guide/blob/master/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/03-Test_File_Extensions_Handling_for_Sensitive_Information.md)
**The OWASP ® Foundation** works to improve the security of software through its community-led open source software projects, hundreds of chapters worldwide, tens of thousands of members, and by hosting local and global conferences. 
## Spotlight: SecureFlag
[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)
SecureFlag empowers organizations in 30 plus countries to implement secure coding training. The platform offers thousands of hands-on labs in over 45 programming languages, hosted in virtualized environments. Developers gain skills to identify and remediate vulnerabilities, building secure software from the start. Through plugins, we integrate with the Software Development Life Cycle, embedding secure practices into workflows. Our customer success team designs bespoke training programs tailored to organizational needs. SecureFlag also offers ThreatCanvas, an automated threat modeling solution enabling developers to assess and mitigate design risks independently, reducing reliance on security teams.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/BrightSecurity.png)](https://brightsec.com/)[![image](https://owasp.org/assets/images/corp-member-logo/BDO.png)](https://www.bdo.global/en-gb/services/advisory/cybersecurity)[![image](https://owasp.org/assets/images/corp-member-logo/Checkmarxn-NewLogo2024.jpg)](http://checkmarx.com)[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)[![image](https://owasp.org/assets/images/corp-member-logo/eShard_Logo.png)](https://eshard.com/eschecker)[![image](https://owasp.org/assets/images/corp-member-logo/GuardSquare.png)](https://www.guardsquare.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Xeol.jpeg)](https://www.xeol.io/)[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)[![image](https://owasp.org/assets/images/corp-member-logo/Cobalt.png)](https://www.cobalt.io/)
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
