# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [03-Identity Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/)
# Test Account Provisioning Process
ID  
---  
WSTG-IDNT-03  
## Summary
The provisioning of accounts presents an opportunity for an attacker to create a valid account without application of the proper identification and authorization process.
## Test Objectives
  * Verify which accounts may provision other accounts and of what type.


## How to Test
Determine which roles are able to provision users and what sort of accounts they can provision.
  * Is there any verification, vetting and authorization of provisioning requests?
  * Is there any verification, vetting and authorization of de-provisioning requests?
  * Can an administrator provision other administrators or just users?
  * Can an administrator or other user provision accounts with privileges greater than their own?
  * Can an administrator or user de-provision themselves?
  * How are the files or resources owned by the de-provisioned user managed? Are they deleted? Is access transferred?


### Example
In WordPress, only a user’s name and email address are required to provision the user, as shown below:
![WordPress User Add](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/images/Wordpress_useradd.png)  
_Figure 4.3.3-1: WordPress User Add_
De-provisioning of users requires the administrator to select the users to be de-provisioned, select Delete from the dropdown menu (circled) and then applying this action. The administrator is then presented with a dialog box asking what to do with the user’s posts (delete or transfer them).
![WordPress Auth and Users](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/images/Wordpress_authandusers.png)  
_Figure 4.3.3-2: WordPress Auth and Users_
## Tools
While the most thorough and accurate approach to completing this test is to conduct it manually, HTTP proxy tools could be also useful.
* * *
[Edit on GitHub](https://github.com/OWASP/www-project-web-security-testing-guide/blob/master/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/03-Test_Account_Provisioning_Process.md)
**The OWASP ® Foundation** works to improve the security of software through its community-led open source software projects, hundreds of chapters worldwide, tens of thousands of members, and by hosting local and global conferences. 
## Spotlight: Promon
[![image](https://owasp.org/assets/images/corp-member-logo/promon_logo_dark.png)](http://promon.co)
Promon is the leader in proactive mobile app security. We exist to make the world a little bit safer, one app at a time. Since 2006, some of the world’s most impactful companies have trusted Promon to secure their mobile apps. Today, more than 2 billion people use a Promon-protected app. Promon is headquartered in Oslo, Norway with offices throughout the globe. Learn more at Promon.co.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)[![image](https://owasp.org/assets/images/corp-member-logo/PhoenixSecurity.svg)](https://phoenix.security/)[![image](https://owasp.org/assets/images/corp-member-logo/Red_Hat.svg)](http://www.redhat.com)[![image](https://owasp.org/assets/images/corp-member-logo/BlackDuck.png)](https://www.blackduck.com/)[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)[![image](https://owasp.org/assets/images/corp-member-logo/ub-secure.png)](https://www.ubsecure.jp/en/)[![image](https://owasp.org/assets/images/corp-member-logo/GuardSquare.png)](https://www.guardsquare.com/)
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
