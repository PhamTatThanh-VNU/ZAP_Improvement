# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [02-Configuration and Deployment Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/)
# Test Application Platform Configuration
ID  
---  
WSTG-CONF-02  
## Summary
Proper configuration of the single elements that make up an application architecture is important in order to prevent mistakes that might compromise the security of the whole architecture.
Reviewing and testing configurations are critical tasks in creating and maintaining an architecture. This is because various systems often come with generic configurations, which may not align well with the tasks they’re supposed to perform on the specific sites where they’re installed.
While the typical web and application server installation will contain a lot of functionality (like application examples, documentation, test pages), what is not essential should be removed before deployment to avoid post-install exploitation.
## Test Objectives
  * Ensure that default and known files have been removed.
  * Validate that no debugging code or extensions are left in the production environments.
  * Review the logging mechanisms set in place for the application.


## How to Test
### Black-Box Testing
#### Sample and Known Files and Directories
In a default installation, many web servers and application servers provide sample applications and files for the benefit of the developer, in order to test if the server is working properly right after installation. However, many default web server applications have later been known to be vulnerable. This was the case, for example, for CVE-1999-0449 (Denial of Service in IIS when the Exair sample site had been installed), CAN-2002-1744 (Directory traversal vulnerability in CodeBrws.asp in Microsoft IIS 5.0), CAN-2002-1630 (Use of sendmail.jsp in Oracle 9iAS), or CAN-2003-1172 (Directory traversal in the view-source sample in Apache’s Cocoon).
CGI scanners, which include a detailed list of known files and directory samples provided by different web or application servers, might be a fast way to determine if these files are present. However, the only way to be really sure is to do a full review of the contents of the web server or application server, and determine whether they are related to the application itself or not.
#### Comment Review
It is very common for programmers to add comments when developing large web-based applications. However, comments included inline in HTML code might reveal internal information that should not be available to an attacker. Sometimes, a part of the source code is commented out when a functionality is no longer required, but this comment is unintentionally leaked out to the HTML pages returned to the users.
Comment review should be done in order to determine if any information is being leaked through comments. This review can only be thoroughly done through an analysis of the web server’s static and dynamic content, and through file searches. It can be useful to browse the site in an automatic or guided fashion, and store all the retrieved content. This retrieved content can then be searched in order to analyse any HTML comments available in the code.
#### System Configuration
Various tools, documents, or checklists can be used to give IT and security professionals a detailed assessment of the target systems’ conformance to various configuration baselines or benchmarks. Such tools include, but are not limited to, the following:
  * [CIS-CAT Lite](https://www.cisecurity.org/blog/introducing-cis-cat-lite/)
  * [Microsoft’s Attack Surface Analyzer](https://github.com/microsoft/AttackSurfaceAnalyzer)
  * [NIST’s National Checklist Program](https://nvd.nist.gov/ncp/repository)


### Gray-Box Testing
#### Configuration Review
The web server or application server configuration takes an important role in protecting the contents of the site and it must be carefully reviewed in order to spot common configuration mistakes. Obviously, the recommended configuration varies depending on the site policy, and the functionality that should be provided by the server software. In most cases, however, configuration guidelines (either provided by the software vendor or external parties) should be followed to determine if the server has been properly secured.
It is impossible to generically say how a server should be configured, however, some common guidelines should be taken into account:
  * Only enable server modules (ISAPI extensions in the case of IIS) that are needed for the application. This reduces the attack surface since the server is reduced in size and complexity as software modules are disabled. It also prevents vulnerabilities that might appear in the vendor software from affecting the site if they are only present in modules that have been already disabled.
  * Handle server errors (40x or 50x) with custom-made pages instead of with the default web server pages. Specifically make sure that any application errors will not be returned to the end user and that no code is leaked through these errors since it will help an attacker. It is actually very common to forget this point since developers do need this information in pre-production environments.
  * Make sure that the server software runs with minimized privileges in the operating system. This prevents an error in the server software from directly compromising the whole system, although an attacker could elevate privileges once running code as the web server.
  * Make sure the server software properly logs both legitimate access and errors.
  * Make sure that the server is configured to properly handle overloads and prevent Denial of Service attacks. Ensure that the server has been performance-tuned properly.
  * Never grant non-administrative identities (with the exception of `NT SERVICE\WMSvc`) access to applicationHost.config, redirection.config, and administration.config (either Read or Write access). This includes `Network Service`, `IIS_IUSRS`, `IUSR`, or any custom identity used by IIS application pools. IIS worker processes are not meant to access any of these files directly.
  * Never share out applicationHost.config, redirection.config, and administration.config on the network. When using Shared Configuration, prefer to export applicationHost.config to another location (see the section titled “Setting Permissions for Shared Configuration).
  * Keep in mind that all users can read .NET Framework `machine.config` and root `web.config` files by default. Do not store sensitive information in these files if it should be for administrator eyes only.
  * Encrypt sensitive information that should be read by the IIS worker processes only and not by other users on the machine.
  * Do not grant Write access to the identity that the Web server uses to access the shared `applicationHost.config`. This identity should have only Read access.
  * Use a separate identity to publish applicationHost.config to the share. Do not use this identity for configuring access to the shared configuration on the Web servers.
  * Use a strong password when exporting the encryption keys for use with shared -configuration.
  * Maintain restricted access to the share containing the shared configuration and encryption keys. If this share is compromised, an attacker will be able to read and write any IIS configuration for your Web servers, redirect traffic from your site to malicious sources, and in some cases gain control of all web servers by loading arbitrary code into IIS worker processes.
  * Consider protecting this share with firewall rules and IPsec policies to allow only the member web servers to connect.


#### Logging
Logging is an important asset of the security of an application architecture, since it can be used to detect flaws in applications (users constantly trying to retrieve a file that does not really exist) as well as sustained attacks from rogue users. Logs are typically properly generated by web and other server software. It is not common to find applications that properly log their actions to a log and, when they do, the main intention of the application logs is to produce debugging output that could be used by the programmer to analyze a particular error.
In both cases (server and application logs) several issues should be tested and analyzed based on the log contents:
  1. Do the logs contain sensitive information?
  2. Are the logs stored in a dedicated server?
  3. Can log usage generate a Denial of Service condition?
  4. How are they rotated? Are logs kept for the sufficient time?
  5. How are logs reviewed? Can administrators use these reviews to detect targeted attacks?
  6. How are log backups preserved?
  7. Is the data being logged data validated (min/max length, chars etc) prior to being logged?


##### Sensitive Information in Logs
Some applications might, for example, use GET requests to forward form data which can be seen in the server logs. This means that server logs might contain sensitive information (such as usernames and passwords, or bank account details). This sensitive information can be misused by an attacker if they obtained the logs, for example, through administrative interfaces or known web server vulnerabilities or misconfiguration (like the well-known `server-status` misconfiguration in Apache-based HTTP servers).
Event logs will often contain data that is useful to an attacker (information leakage) or can be used directly in exploits:
  * Debug information
  * Stack traces
  * Usernames
  * System component names
  * Internal IP addresses
  * Less sensitive personal data (e.g. email addresses, postal addresses and telephone numbers associated with named individuals)
  * Business data


Also, in some jurisdictions, storing some sensitive information in log files, such as personal data, might oblige the enterprise to apply the data protection laws that they would apply to their backend databases to log files too. And failure to do so, even unknowingly, might carry penalties under the data protection laws that apply.
A wider list of sensitive information is:
  * Application source code
  * Session identification values
  * Access tokens
  * Sensitive personal data and some forms of personally identifiable information (PII)
  * Authentication passwords
  * Database connection strings
  * Encryption keys
  * Bank account or payment card holder data
  * Data of a higher security classification than the logging system is allowed to store
  * Commercially-sensitive information
  * Information it is illegal to collect in the relevant jurisdiction
  * Information a user has opted out of collection, or not consented to e.g. use of do not track, or where consent to collect has expired


#### Log Location
Typically servers will generate local logs of their actions and errors, consuming the disk of the system the server is running on. However, if the server is compromised, its logs can be wiped out by the intruder to clean up all the traces of its attack and methods. If this were to happen the system administrator would have no knowledge of how the attack occurred or where the attack source was located. Actually, most attacker tool kits include a “log zapper” that is capable of cleaning up any logs that hold given information (like the IP address of the attacker) and are routinely used in attacker’s system-level root kits.
Therefore, it is wise to keep logs in a separate location and not on the web server itself. This also makes it easier to aggregate logs from different sources that refer to the same application (such as those of a web server farm) and it also makes it easier to do log analysis (which can be CPU intensive) without affecting the server itself.
#### Log Storage
Improper storage of logs can introduce a Denial of Service condition. Any attacker with sufficient resources might be able to produce a sufficient number of requests that would fill up the allocated space to log files, if they are not specifically prevented from doing so. However, if the server is not properly configured, the log files will be stored in the same disk partition as the one used for the operating system software or the application itself. This means that if the disk becomes filled, the operating system or the application might fail due to the inability to write on the disk.
Typically in UNIX systems logs will be located in /var (although some server installations might reside in /opt or /usr/local) and it is important to make sure that the directories in which logs are stored are in a separate partition. In some cases, and in order to prevent the system logs from being affected, the log directory of the server software itself (such as /var/log/apache in the Apache web server) should be stored in a dedicated partition.
This is not to say that logs should be allowed to grow to fill up the file system they reside in. Growth of server logs should be monitored in order to detect this condition since it may be indicative of an attack.
Testing this condition, which can be risky in production environments, can be done by firing off a sufficient and sustained number of requests to see if these requests are logged and if there’s a possibility to fill up the log partition through these requests. In some environments where QUERY_STRING parameters are also logged regardless of whether they are produced through GET or POST requests, big queries can be simulated that will fill up the logs faster since, typically, a single request will cause only a small amount of data to be logged, such as date and time, source IP address, URI request, and server result.
#### Log Rotation
Most servers (but few custom applications) will rotate logs in order to prevent them from filling up the file system they reside on. The assumption during log rotation is that the information within them is only necessary for a limited duration.
This feature should be tested in order to ensure that:
  * Logs are kept for the time defined in the security policy, not more and not less.
  * Logs are compressed once rotated (this is a convenience, since it will mean that more logs will be stored for the same available disk space).
  * File system permissions for rotated log files should be the same as (or stricter than) those for the log files themselves. For example, web servers will need to write to the logs they use but they don’t actually need to write to rotated logs, which means that the permissions of the files can be changed upon rotation to prevent the web server process from modifying these.


Some servers might rotate logs when they reach a given size. If this happens, it must be ensured that an attacker cannot force logs to rotate in order to hide his tracks.
#### Log Access Control
Event log information should never be visible to end users. Even web administrators should not have access to such logs as it breaches separation of duty controls. Ensure that any access control schema that is used to protect access to raw logs, and any application providing capabilities to view or search the logs are not linked with access control schemas for other application user roles. Neither should any log data be visible to unauthenticated users.
#### Log Review
Reviewing logs can be used not only for extracting usage statistics of files in web servers (which is typically what most log-based applications focus on) but also for determining if attacks are occurring on the web server.
In order to analyze web server attacks, the error log files of the server need to be analyzed. Review should concentrate on:
  * 40x (not found) error messages. A large amount of these from the same source might be indicative of a CGI scanner tool being used against the web server
  * 50x (server error) messages. These can be an indication of an attacker abusing parts of the application which fail unexpectedly. For example, the first phases of a SQL injection attack will produce these error message when the SQL query is not properly constructed and its execution fails on the backend database.


Log statistics or analysis should not be generated or stored in the same server that produces the logs. Otherwise, an attacker might, through a web server vulnerability or improper configuration, gain access to them and retrieve similar information as would be disclosed by log files themselves.
## Spotlight: Atlassian, Inc.
[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)
Tools for teams, from startup to enterprise - Atlassian provides tools to help every team unleash their full potential
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Arnica.png)](https://www.arnica.io)[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Cybozu.png)](https://cybozu.co.jp/en/company/)[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)[![image](https://owasp.org/assets/images/corp-member-logo/BDO.png)](https://www.bdo.global/en-gb/services/advisory/cybersecurity)[![image](https://owasp.org/assets/images/corp-member-logo/Raxis.png)](https://raxis.com/penetration-testing/)[![image](https://owasp.org/assets/images/corp-member-logo/sq1_logo_dark_version.png)](https://www.sq1.security)[![image](https://owasp.org/assets/images/corp-member-logo/SecureCodeWarrior.png)](https://www.securecodewarrior.com/)
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
