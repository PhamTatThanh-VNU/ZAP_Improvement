# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [02-Configuration and Deployment Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/)
# Enumerate Infrastructure and Application Admin Interfaces
ID  
---  
WSTG-CONF-05  
## Summary
Administrator interfaces may be present in the application or on the application server to allow certain users to perform privileged activities on the site. Tests should be undertaken to reveal if and how this privileged functionality can be accessed by an unauthorized or standard user.
An application may require an administrator interface to enable a privileged user to access functionality that may make changes to how the site functions. Such changes may include:
  * user account provisioning
  * site design and layout
  * data manipulation
  * configuration changes


In many instances, such interfaces do not have sufficient controls to protect them from unauthorized access. Testing is aimed at discovering these administrator interfaces and accessing functionality intended for the privileged users.
## Test Objectives
  * Identify hidden administrator interfaces and functionality.


## How to Test
### Black Box Testing
The following section describes vectors that may be used to test for the presence of administrative interfaces. These techniques may also be used to test for related issues including privilege escalation, and are described elsewhere in this guide (for example, [Testing for bypassing authorization schema](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/02-Testing_for_Bypassing_Authorization_Schema) and [Testing for Insecure Direct Object References](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References)) in greater detail.
  * Directory and file enumeration: An administrative interface may be present but not visibly available to the tester. The path of the administrative interface may be guessed by simple requests such as /admin or /administrator. In some scenarios, these paths can be revealed within seconds using advanced Google search techniques - [Google dorks](https://www.exploit-db.com/google-hacking-database). There are many tools available to perform brute forcing of server contents, see the tools section below for more information. A tester may have to also identify the filename of the administration page. Forcibly browsing to the identified page may provide access to the interface.
  * Comments and links in source code: Many sites use common code that is loaded for all site users. By examining all source sent to the client, links to administrator functionality may be discovered and should be investigated.
  * Reviewing server and application documentation: If the application server or application is deployed in its default configuration it may be possible to access the administration interface using information described in configuration or help documentation. Default password lists should be consulted if an administrative interface is found and credentials are required.
  * Publicly available information: Many applications, such as WordPress, have administrative interfaces that are available by default.
  * Alternative server port: Administration interfaces may be seen on a different port on the host than the main application. For example, Apache Tomcat’s Administration interface can often be seen on port 8080.
  * Parameter tampering: A GET or POST parameter, or a cookie may be required to enable the administrator functionality. Clues to this include the presence of hidden fields such as:


```
<input type="hidden" name="admin" value="no">

```

or in a cookie:
`Cookie: session_cookie; useradmin=0`
Once an administrative interface has been discovered, a combination of the above techniques may be used to attempt to bypass authentication. If this fails, the tester may wish to attempt a brute force attack. In such an instance, the tester should be aware of the potential for administrative account lockout if such functionality is present.
### Gray Box Testing
A more detailed examination of the server and application components should be undertaken to ensure hardening (i.e. administrator pages are not accessible to everyone through the use of IP filtering or other controls), and where applicable, verification that all components do not use default credentials or configurations. Source code should be reviewed to ensure that the authorization and authentication model ensures clear separation of duties between normal users and site administrators. User interface functions shared between normal and administrator users should be reviewed to ensure clear separation between the rendering of such components and the information leakage from such shared functionality.
Each web framework may have its own default admin pages or paths, as in the following examples:
PHP:
```
/phpinfo
/phpmyadmin/
/phpMyAdmin/
/mysqladmin/
/MySQLadmin
/MySQLAdmin
/login.php
/logon.php
/xmlrpc.php
/dbadmin

```

WordPress:
```
wp-admin/
wp-admin/about.php
wp-admin/admin-ajax.php
wp-admin/admin-db.php
wp-admin/admin-footer.php
wp-admin/admin-functions.php
wp-admin/admin-header.php

```

Joomla:
```
/administrator/index.php
/administrator/index.php?option=com_login
/administrator/index.php?option=com_content
/administrator/index.php?option=com_users
/administrator/index.php?option=com_menus
/administrator/index.php?option=com_installer
/administrator/index.php?option=com_config

```

Tomcat:
```
/manager/html
/host-manager/html
/manager/text
/tomcat-users.xml

```

Apache:
```
/index.html
/httpd.conf
/apache2.conf
/server-status

```

Nginx:
```
/index.html
/index.htm
/index.php
/nginx_status
/index.php
/nginx.conf
/html/error

```

## Tools
Several tools can assist in identifying hidden administrator interfaces and functionality, including:
  * [ZAP - Forced Browse](https://www.zaproxy.org/docs/desktop/addons/forced-browse/) is a currently maintained use of OWASP’s previous DirBuster project.
  * [THC-HYDRA](https://github.com/vanhauser-thc/thc-hydra) is a tool that allows brute-forcing of many interfaces, including form-based HTTP authentication.
  * A brute forcer is much more effective when it uses a good dictionary, such as the [Netsparker](https://www.netsparker.com/blog/web-security/svn-digger-better-lists-for-forced-browsing/) dictionary.


## Spotlight: Atlassian, Inc.
[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)
Tools for teams, from startup to enterprise - Atlassian provides tools to help every team unleash their full potential
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Heeler.jpg)](https://heeler.com)[![image](https://owasp.org/assets/images/corp-member-logo/approach_logo.png)](http://www.approach-cyber.com)[![image](https://owasp.org/assets/images/corp-member-logo/Beagle.png)](https://beaglesecurity.com)[![image](https://owasp.org/assets/images/corp-member-logo/FujitsuLimited.png)](https://global.fujitsu/en-global)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/Cobalt.png)](https://www.cobalt.io/)[![image](https://owasp.org/assets/images/corp-member-logo/blended_logoowasp.png)](http://blend-ed.com)[![image](https://owasp.org/assets/images/corp-member-logo/ThreatSpikeLabsLogo.png)](https://www.threatspike.com)
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
