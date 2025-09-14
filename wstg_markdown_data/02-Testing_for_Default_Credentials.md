# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [04-Authentication Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/)
# Testing for Default Credentials
ID  
---  
WSTG-ATHN-02  
## Summary
Many web applications and hardware devices have default passwords for the built-in administrative account. Although in some cases these can be randomly generated, they are often static, meaning that they can be easily guessed or obtained by an attacker.
Additionally, when new users are created on the applications, these may have predefined passwords set. These could either be generated automatically by the application, or manually created by staff. In both cases, if they are not generated in a secure manner, the passwords may be possible for an attacker to guess.
## Test Objectives
  * Determine whether the application has any user accounts with default passwords.
  * Review whether new user accounts are created with weak or predictable passwords.


## How to Test
### Testing for Vendor Default Credentials
The first step to identifying default passwords is to identify the software that is in use. This is covered in detail in the [Information Gathering](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/README) section of the guide.
Once the software has been identified, try to find whether it uses default passwords, and if so, what they are. This should include:
  * Searching for “[SOFTWARE] default password”.
  * Reviewing the manual or vendor documentation.
  * Checking common default password databases, such as [CIRT.net](https://cirt.net/passwords), [SecLists Default Passwords](https://github.com/danielmiessler/SecLists/tree/master/Passwords/Default-Credentials) or [DefaultCreds-cheat-sheet](https://github.com/ihebski/DefaultCreds-cheat-sheet/blob/main/DefaultCreds-Cheat-Sheet.csv).
  * Inspecting the application source code (if available).
  * Installing the application on a virtual machine and inspecting it.
  * Inspecting the physical hardware for stickers (often present on network devices).


If a default password can’t be found, try common options such as:
  * “admin”, “password”, “12345”, or other [common default passwords](https://github.com/nixawk/fuzzdb/blob/master/bruteforce/passwds/default_devices_users%2Bpasswords.txt).
  * An empty or blank password.
  * The serial number or MAC address of the device.


If the username is unknown, there are various options for enumerating users, discussed in the [Testing for Account Enumeration](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account) guide. Alternatively, try common options such as “admin”, “root”, or “system”.
### Testing for Organization Default Passwords
When staff within an organization manually create passwords for new accounts, they may do so in a predictable way. This can often be:
  * A single common password such as “Password1”.
  * Organization specific details, such as the organization name or address.
  * Passwords that follow a simple pattern, such as “Monday123” if account is created on a Monday.


These types of passwords are often difficult to identify from a black-box perspective, unless they can successfully be guessed or brute-forced. However, they are easy to identify when performing grey-box or white-box testing.
### Testing for Application Generated Default Passwords
If the application automatically generates passwords for new user accounts, these may also be predictable. In order to test these, create multiple accounts on the application with similar details at the same time, and compare the passwords that are given for them.
The passwords may be based on:
  * A single static string shared between accounts.
  * A hashed or obfuscated part of the account details, such as `md5($username)`.
  * A time-based algorithm.
  * A weak pseudo-random number generator (PRNG).


This type of issue of often difficult to identify from a black-box perspective.
## Tools
  * [Burp Intruder](https://portswigger.net/burp/documentation/desktop/tools/intruder)
  * [THC Hydra](https://github.com/vanhauser-thc/thc-hydra)
  * [Nikto 2](https://www.cirt.net/nikto2)
  * [Nuclei](https://github.com/projectdiscovery/nuclei)
    * [Default Login - Nuclei Templates](https://github.com/projectdiscovery/nuclei-templates/tree/6b26c63d8f63b2a812a478f14c4c098b485d54b4/http/default-logins)


## Spotlight: Tenable, Inc
[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)
Tenable® is the Exposure Management company. Approximately 40,000 organizations around the globe rely on Tenable to understand and reduce cyber risk. As the creator of Nessus®, Tenable extended its expertise in vulnerabilities to deliver the world’s first platform to see and secure any digital asset on any computing platform. Tenable customers include approximately 60 percent of the Fortune 500, approximately 40 percent of the Global 2000, and large government agencies. Learn more at tenable.com
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/sq1_logo_dark_version.png)](https://www.sq1.security)[![image](https://owasp.org/assets/images/corp-member-logo/GuidePoint.png)](https://www.guidepointsecurity.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Equixly.png)](https://equixly.com)[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/Automattic.png)](https://automattic.com/)[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/Arnica.png)](https://www.arnica.io)[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)
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
