# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [10-Business Logic Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/10-Business_Logic_Testing/)
# Test Ability to Forge Requests
ID  
---  
WSTG-BUSL-02  
## Summary
Forging requests is a method that attackers use to circumvent the frontend GUI application to directly submit information for backend processing. The goal of the attacker is to send HTTP POST/GET requests through an intercepting proxy with data values that are not supported, guarded against, or expected by the application’s business logic. Some examples of forged requests include exploiting guessable or predictable parameters or exposing “hidden” features and functionality such as enabling debugging or presenting special screens or windows that are very useful during development but may leak information or bypass the business logic.
Vulnerabilities related to the ability to forge requests are unique to each application and different from business logic data validation in that its focus is on breaking the business logic workflow.
Applications should have logic checks in place to prevent the system from accepting forged requests that may allow attackers the opportunity to exploit the business logic, process, or flow of the application. Request forgery is nothing new; the attacker uses an intercepting proxy to send HTTP POST/GET requests to the application. Through request forgeries attackers may be able to circumvent the business logic or process by finding, predicting and manipulating parameters to make the application think a process or task has or has not taken place.
Also, forged requests may allow subversion of programmatic or business logic flow by invoking “hidden” features or functionality such as debugging initially used by developers and testers sometimes referred to as an [“Easter egg”](https://en.wikipedia.org/wiki/Easter_egg_\(media\)). “An Easter egg is an intentional inside joke, hidden message, or feature in a work such as a computer program, movie, book, or crossword. According to game designer Warren Robinett, the term was coined at Atari by personnel who were alerted to the presence of a secret message which had been hidden by Robinett in his already widely distributed game, Adventure. The name has been said to evoke the idea of a traditional Easter egg hunt.”
### Example 1
Suppose an e-commerce theater site allows users to select their ticket, apply a onetime 10% Senior discount on the entire sale, view the subtotal and tender the sale. If an attacker is able to see through a proxy that the application has a hidden field (of 1 or 0) used by the business logic to determine if a discount has been taken already or not. The attacker is then able to submit the 1 or “no discount has been taken” value multiple times to take advantage of the same discount multiple times.
### Example 2
Suppose an online video game pays out tokens for points scored for finding pirate’s treasure, pirates, and for each level completed. These tokens can later be exchanged for prizes. Additionally each level’s points have a multiplier value equal to the level. If an attacker was able to see through a proxy that the application has a hidden field used during development and testing to quickly get to the highest levels of the game they could quickly get to the highest levels and accumulate unearned points quickly.
Also, if an attacker was able to see through a proxy that the application has a hidden field used during development and testing to enable a log that indicated where other online players, or hidden treasures were in relation to the attacker, they would then be able to quickly go to these locations and score points.
## Test Objectives
  * Review the project documentation looking for guessable, predictable, or hidden functionality of fields.
  * Insert logically valid data in order to bypass normal business logic workflow.


## How to Test
### Through Identifying Guessable Values
  * Using an intercepting proxy observe the HTTP POST/GET looking for some indication that values are incrementing at a regular interval or are easily guessable.
  * If it is found that some value is guessable this value may be changed and one may gain unexpected visibility.


### Through Identifying Hidden Options
  * Using an intercepting proxy observe the HTTP POST/GET looking for some indication of hidden features such as debug that can be switched on or activated.
  * If any are found try to guess and change these values to get a different application response or behavior.


## Related Test Cases
  * [Testing for Exposed Session Variables](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/04-Testing_for_Exposed_Session_Variables)
  * [Testing for Cross Site Request Forgery (CSRF)](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/05-Testing_for_Cross_Site_Request_Forgery)
  * [Testing for Account Enumeration and Guessable User Account](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account)


## Remediation
The application must be smart enough and designed with business logic that will prevent attackers from predicting and manipulating parameters to subvert programmatic or business logic flow, or exploiting hidden/undocumented functionality such as debugging.
## Tools
  * [Zed Attack Proxy (ZAP)](https://www.zaproxy.org)
  * [Burp Suite](https://portswigger.net/burp)


## Spotlight: Invicti Security
[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)
Invicti Security is transforming the way web applications are secured. An AppSec leader for more than 15 years, Invicti enables organizations in every industry to continuously scan and secure all of their web applications and APIs at the speed of innovation. Through industry-leading Asset Discovery, Dynamic Application Security Testing (DAST), Interactive Application Security Testing (IAST), and Software Composition Analysis (SCA), Invicti provides a comprehensive view of an organization’s entire web application portfolio. Invicti’s proprietary Proof-Based Scanning technology is the first to deliver automatic verification of vulnerabilities and proof of exploit with 99.98% accuracy.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/GuardSquare.png)](https://www.guardsquare.com/)[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/SKUDONET.png)](https://www.skudonet.com)[![image](https://owasp.org/assets/images/corp-member-logo/BDO.png)](https://www.bdo.global/en-gb/services/advisory/cybersecurity)[![image](https://owasp.org/assets/images/corp-member-logo/Backslash-logo.png)](https://www.backslash.security/?utm_campaign=Launch&utm_source=owasp-sponsorship&utm_medium=banner&utm_content=homepage)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/salesforce.png)](https://www.salesforce.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Equixly.png)](https://equixly.com)[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)
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
