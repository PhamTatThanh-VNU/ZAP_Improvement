# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [03-Identity Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/)
# Test User Registration Process
ID  
---  
WSTG-IDNT-02  
## Summary
Some websites offer a user registration process that automates (or semi-automates) the provisioning of system access to users. The identity requirements for access vary from positive identification to none at all, depending on the security requirements of the system. Many public applications completely automate the registration and provisioning process because the size of the user base makes it impossible to manage manually. However, many corporate applications will provision users manually, so this test case may not apply.
## Test Objectives
  * Verify that the identity requirements for user registration are aligned with business and security requirements.
  * Validate the registration process.


## How to Test
Verify that the identity requirements for user registration are aligned with business and security requirements:
  1. Can anyone register for access?
  2. Are registrations vetted by a human prior to provisioning, or are they automatically granted if the criteria are met?
  3. Can the same person or identity register multiple times?
  4. Can users register for different roles or permissions?
  5. What proof of identity is required for a registration to be successful?
  6. Are registered identities verified?


Validate the registration process:
  1. Can identity information be easily forged or faked?
  2. Can the exchange of identity information be manipulated during registration?


### Example
In the WordPress example below, the only identification requirement is an email address that is accessible to the registrant.
![WordPress Registration Page](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/images/Wordpress_registration_page.jpg)  
_Figure 4.3.2-1: WordPress Registration Page_
In contrast, in the Google example below the identification requirements include name, date of birth, country, mobile phone number, email address and CAPTCHA response. While only two of these can be verified (email address and mobile number), the identification requirements are stricter than WordPress.
![Google Registration Page](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/images/Google_registration_page.jpg)  
_Figure 4.3.2-2: Google Registration Page_
## Remediation
Implement identification and verification requirements that correspond to the security requirements of the information the credentials protect.
## Tools
A HTTP proxy can be a useful tool to test this control.
## Spotlight: Blend-ed
[![image](https://owasp.org/assets/images/corp-member-logo/blended_logoowasp.png)](http://blend-ed.com)
Blend-ed helps businesses create and deliver high-impact training programs at scale. Harnessing the power of Open edX—Learning Software Technology built by Harvard and MIT and trusted by top-tier organisations like Microsoft, IBM, Xuetang and Redis—Blend-ed's Learning Cloud offers a science-backed, user-friendly learning management system designed to drive engagement, improve retention, and maximize product adoption. Blend-ed Learning Cloud supports a diverse range of content formats, including interactive videos, simulations, AI-enhanced mentoring, gamified modules, virtual labs, and dynamic discussion boards. The platform is available across web, Android, and iOS applications, ensuring seamless access for all users.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/SecureCodeWarrior.png)](https://www.securecodewarrior.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Arnica.png)](https://www.arnica.io)[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)[![image](https://owasp.org/assets/images/corp-member-logo/promon_logo_dark.png)](http://promon.co)[![image](https://owasp.org/assets/images/corp-member-logo/ZINAD.png)](http://www.zinad.net)[![image](https://owasp.org/assets/images/corp-member-logo/Checkmarxn-NewLogo2024.jpg)](http://checkmarx.com)[![image](https://owasp.org/assets/images/corp-member-logo/BDO.png)](https://www.bdo.global/en-gb/services/advisory/cybersecurity)[![image](https://owasp.org/assets/images/corp-member-logo/Aikido.png)](https://www.aikido.dev/)[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)
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
