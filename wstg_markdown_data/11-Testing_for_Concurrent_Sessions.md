# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [06-Session Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/)
# Testing for Concurrent Sessions
ID  
---  
WSTG-SESS-11  
## Summary
Concurrent sessions are a common aspect of web applications that enable multiple simultaneous user interactions. This test case aims to evaluate the application’s ability to handle multiple active sessions for a single user. This functionality is essential for effectively managing concurrent user sessions, particularly in sensitive areas such as admin panels containing Personally Identifiable Information (PII), personal user accounts, or APIs reliant on third-party services to enrich user-provided data. The primary objective is to ensure that concurrent sessions align with the application’s security requirements.
Understanding the security needs in an application is key to assessing whether enabling concurrent sessions corresponds with the intended features. Allowing concurrent sessions isn’t inherently detrimental and is intentionally permitted in many applications. However, it is crucial to ensure that the application’s functionality is effectively aligned with its security measures concerning concurrent sessions. If concurrent sessions are intended, it is vital to ensure additional security controls, such as managing active sessions, terminating sessions, and potential new session notifications. Conversely, if concurrent sessions are not intended or planned within the application, it is crucial to validate existing checks for session management vulnerabilities.
To recognize that concurrent sessions are essential, you should consider the following factors:
  * Understanding the application’s nature, particularly situations where users might require simultaneous access from different locations or devices.
  * Identifying critical operations, such as financial transactions that require secure access.
  * Handling sensitive data like Personally Identifiable Information (PII), indicating the necessity for secure interactions.
  * Distinguishing between a management panel and a standard user dashboard for normal user access.


## Test Objectives
  * Evaluate the application’s session management by assessing the handling of multiple active sessions for a single user account.


## How to Test
  1. **Generate Valid Session:**
     * Submit valid credentials (username and password) to create a session.
     * Example HTTP Request:
```
POST /login HTTP/1.1
Host: www.example.com
Content-Length: 32

username=admin&password=admin123

```

     * Example Response:
```
HTTP/1.1 200 OK
Set-Cookie: SESSIONID=0add0d8eyYq3HIUy09hhus; Path=/; Secure

```

     * Store the generated authentication cookie. In some cases, the generated authentication cookie is replaced by tokens such as JSON Web Tokens (JWT).
  2. **Test for Generating Active Sessions:**
     * Attempt to create multiple authentication cookies by submitting login requests (e.g., one hundred times).
Note: Utilizing private browsing mode or multi-account containers might be beneficial for conducting these tests, as they can provide separate environments for testing session management without interference from existing sessions or cookies stored in the browser.
  3. **Test for Validating Active Sessions:**
     * Try accessing the application using the initial session token (e.g., `SESSIONID=0add0d8eyYq3HIUy09hhus`).
     * If successful authentication occurs with the first generated token, consider it a potential issue indicating inadequate session management.


Also, there are additional test cases that extend the scope of the testing methodology to include scenarios involving multiple sessions originating from various IPs and locations. These test cases aid in identifying potential vulnerabilities or irregularities in session handling related to geographical or network-based factors:
  * Test Multiple sessions from the same IP.
  * Test Multiple sessions from different IPs.
  * Test Multiple sessions from locations that are unlikely or impossible to be visited by the same user in a short period of time (e.g., one session created in a specific country, followed by another session generated five minutes later from a different country).


## Remediation
The application should monitor and limit the number of active sessions per user account. If the maximum allowed sessions are surpassed, the system must invalidate previous sessions to maintain security. Implementing additional solutions can further mitigate this vulnerability:
  1. **User Notification:** Notify users after each successful login to raise awareness of active sessions.
  2. **Session Management Page:** Create a dedicated page to display and allow termination of active sessions for enhanced user control.
  3. **IP Address Tracking:** Track the IP addresses of users who log in to an account and flag any suspicious activity, such as multiple logins from different locations.
  4. **IP Address Restrictions:** Allow users to specify trusted IP addresses or ranges from which they can access their accounts, enhancing security by restricting sessions to known and approved locations.


## Recommended Tools
### Intercepting Proxy Tools
  * [Zed Attack Proxy](https://www.zaproxy.org)
  * [Burp Suite Web Proxy](https://portswigger.net)


* * *
[Edit on GitHub](https://github.com/OWASP/www-project-web-security-testing-guide/blob/master/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/11-Testing_for_Concurrent_Sessions.md)
**The OWASP ® Foundation** works to improve the security of software through its community-led open source software projects, hundreds of chapters worldwide, tens of thousands of members, and by hosting local and global conferences. 
## Spotlight: Appdome
[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)
The Appdome mission is to protect every mobile app in the world at work and play, with billions of users protected today. Appdome delivers the only full lifecycle Unified Mobile App Defense platform with 300+ defenses spanning security, anti-malware, anti-fraud, anti-social engineering, mobile anti-bot, anti-cheat, geo compliance, MiTM attack prevention, code obfuscation, social engineering, and other protections. Automatically build security and privacy in your mobile CI/CD pipelines with Zero Code and No SDKs. Get OWASP MASVS Compliant in less than 5 minutes!
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)[![image](https://owasp.org/assets/images/corp-member-logo/Zelvin.jpg)](https://zelvin.com)[![image](https://owasp.org/assets/images/corp-member-logo/Arnica.png)](https://www.arnica.io)[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Corgea.png)](http://corgea.com)[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)[![image](https://owasp.org/assets/images/corp-member-logo/securityjourney_300x90.png)](http://www.SecurityJourney.com)[![image](https://owasp.org/assets/images/corp-member-logo/FujitsuLimited.png)](https://global.fujitsu/en-global)
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
