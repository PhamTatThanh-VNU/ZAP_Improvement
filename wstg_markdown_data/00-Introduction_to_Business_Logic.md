# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [10-Business Logic Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/10-Business_Logic_Testing/)
# Introduction to Business Logic
Testing for business logic flaws in a multi-functional dynamic web application requires thinking in unconventional methods. If an application’s authentication mechanism is developed with the intention of performing steps 1, 2, 3 in that specific order to authenticate a user. What happens if the user goes from step 1 straight to step 3? In this simplistic example, does the application provide access by failing open; deny access, or just error out with a 500 message?
There are many examples that can be made, but the one constant lesson is “think outside of conventional wisdom”. This type of vulnerability cannot be detected by a vulnerability scanner and relies upon the skills and creativity of the penetration tester. In addition, this type of vulnerability is usually one of the hardest to detect, and usually application specific but, at the same time, usually one of the most detrimental to the application, if exploited.
The classification of business logic flaws has been under-studied; although exploitation of business flaws frequently happens in real-world systems, and many applied vulnerability researchers investigate them. The greatest focus is in web applications. There is debate within the community about whether these problems represent particularly new concepts, or if they are variations of well-known principles.
Testing of business logic flaws is similar to the test types used by functional testers that focus on logical or finite state testing. These types of tests require that security professionals think a bit differently, develop abuse and misuse cases and use many of the testing techniques embraced by functional testers. Automation of business logic abuse cases is not possible and remains a manual art relying on the skills of the tester and their knowledge of the complete business process and its rules.
## Business Limits and Restrictions
Consider the rules for the business function being provided by the application. Are there any limits or restrictions on people’s behavior? Then consider whether the application enforces those rules. It’s generally pretty easy to identify the test and analysis cases to verify the application if you’re familiar with the business. If you are a third-party tester, then you’re going to have to use your common sense or ask the business if different operations should be allowed by the application.
Sometimes, in very complex applications, the tester will not have a full understanding of every aspect of the application initially. In these situations, it is best to have the client walk the tester through the application, so that they may gain a better understanding of the limits and intended functionality of the application before the actual test begins. Additionally, having a direct line to the developers (if possible) during testing will help out greatly, if any questions arise regarding the application’s functionality.
## Challenges of Logic Testing
Automated tools find it hard to understand context, hence it’s up to a person to perform these kinds of tests. The following two examples will illustrate how understanding the functionality of the application, the developer’s intentions, and some creative “out-of-the-box” thinking can break the application’s logic. The first example starts with a simplistic parameter manipulation, whereas the second is a real world example of a multi-step process leading to completely subverting the application.
**Example 1** :
Suppose an e-commerce site allows users to select items to purchase, view a summary page and then tender the sale. What if an attacker was able to go back to the summary page, maintaining their same valid session and inject a lower cost for an item and complete the transaction, and then check out?
**Example 2** :
Holding/locking resources and keeping others from purchasing these items online may result in attackers purchasing items at a lower price. The countermeasure to this problem is to implement timeouts and mechanisms to ensure that only the correct price can be charged.
**Example 3** :
What if a user was able to start a transaction linked to their club/loyalty account and then after points have been added to their account cancel out of the transaction? Will the points/credits still be applied to their account?
## Tools
While there are tools for testing and verifying that business processes are functioning correctly in valid situations these tools are incapable of detecting logical vulnerabilities. For example, tools have no means of detecting if a user is able to circumvent the business process flow through editing parameters, predicting resource names or escalating privileges to access restricted resources nor do they have any mechanism to help the human testers to suspect this state of affairs.
The following are some common tool types that can be useful in identifying business logic issues.
When installing addons you should always be diligent in considering the permissions they request and your browser usage habits.
### Intercepting Proxy
To Observe the Request and Response Blocks of HTTP Traffic
  * [Zed Attack Proxy (ZAP)](https://www.zaproxy.org)
  * [Burp Proxy](https://portswigger.net/burp)


### Web Browser Plug-ins
To view and modify HTTP/HTTPS headers, post parameters, and observe the DOM of the Browser
  * [Tamper Data for FF Quantum](https://addons.mozilla.org/en-US/firefox/addon/tamper-data-for-ff-quantum)
  * [Tamper Chrome (for Google Chrome)](https://chrome.google.com/webstore/detail/tamper-chrome-extension/hifhgpdkfodlpnlmlnmhchnkepplebkb)


## Miscellaneous Test Tools
  * [Web Developer toolbar](https://chrome.google.com/webstore/detail/bfbameneiokkgbdmiekhjnmfkcnldhhm)
    * The Web Developer extension adds a toolbar button to the browser with various web developer tools. This is the official port of the Web Developer extension for Firefox.
  * [HTTP Request Maker for Chrome](https://chrome.google.com/webstore/detail/kajfghlhfkcocafkcjlajldicbikpgnp)
  * [HTTP Request Maker for Firefox](https://addons.mozilla.org/en-US/firefox/addon/http-request-maker)
    * Request Maker is a tool for penetration testing. With it you can easily capture requests made by web pages, tamper with the URL, headers and POST data and, of course, make new requests
  * [Cookie Editor for Chrome](https://chrome.google.com/webstore/detail/fngmhnnpilhplaeedifhccceomclgfbg)
  * [Cookie Editor for Firefox](https://addons.mozilla.org/en-US/firefox/addon/cookie-editor)
    * Cookie Editor is a cookie manager. You can add, delete, edit, search, protect, and block cookies


## Spotlight: Traefik Labs
[![image](https://owasp.org/assets/images/corp-member-logo/Traefik.png)](https://traefik.io/)
Traefik Labs helps organizations adopt and scale cloud-native architectures by providing a modern, intuitive, and open platform that reimagines application connectivity and API management, paving the way for seamless operations and enhanced productivity. Traefik’s flagship open source project, Traefik Proxy, is used by the world’s largest enterprises and is one of Docker Hub’s top 10 projects, with over 3 billion downloads. Founded in 2016, Traefik Labs is backed by investors including Balderton Capital, Elaia, 360 Capital Partner, and Kima Ventures. For more information, visit traefik.io and follow @traefik on X.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/BDO.png)](https://www.bdo.global/en-gb/services/advisory/cybersecurity)[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)[![image](https://owasp.org/assets/images/corp-member-logo/Beagle.png)](https://beaglesecurity.com)[![image](https://owasp.org/assets/images/corp-member-logo/mindsetters_logo_transparent_web_owasp.png)](http://www.mindsetters.com)[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)
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
