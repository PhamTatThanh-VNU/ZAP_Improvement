# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [02-Configuration and Deployment Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/)
# Test Path Confusion
ID  
---  
WSTG-CONF-13  
## Summary
Proper configuration of application paths is important because, if paths are not configured correctly, they allow an attacker to exploit other vulnerabilities at a later stage using this misconfiguration.
For example, if the routes are not configured correctly and the target also uses a CDN, the attacker can use this misconfiguration to execute web cache deception attacks.
As a result, to prevent other attacks, this configuration should be evaluated by the tester.
## Test Objectives
  * Make sure application paths are configured correctly.


## How To Test
### Black-Box Testing
In a black-box testing scenario, the tester should replace all the existing paths with paths that do not exist, and then examine the behavior and status code of the target.
For example, there is a path in the application that is a dashboard and shows the amount of the user’s account balance (money, game credits, etc).
Assume the path is `https://example.com/user/dashboard`, the tester should test the different modes that the developer may have considered for this path. For Web Cache Deception vulnerabilities the analyst should consider a path such as `https:// example.com/user/dashboard/non.js` if dashboard information is visible, and the target uses a CDN (or other web cache), then Web Cache Deception attacks are likely applicable.
### White-Box Testing
Examine the application routing configuration, Most of the time, developers use regular expressions in application routing.
In this example, in the `urls.py` file of a Django framework application, we see an example of Path Confusion. The developer did not use the correct regular expression resulting in a vulnerability:
```
    from django.urls import re_path
    from . import views

    urlpatterns = [

        re_path(r'.*^dashboard', views.path_confusion ,name = 'index'),

    ]

```

If the path `https://example.com/dashboard/none.js` is also opened by the user in the browser, the user dashboard information can be displayed, and if the target uses a CDN or web cache, a Web Cache Deception attack can be implemented.
## Tools
  * [Zed Attack Proxy](https://www.zaproxy.org)
  * [Burp Suite](https://portswigger.net/burp)


## Remediation
  * Refrain from classify/handling cached based on file extension or path (leverage content-type).
  * Ensure the caching mechanism(s) adhere to cache-control headers specified by your application.
  * Implement RFC compliant File Not Found handling and redirects.


## Spotlight: Tenable, Inc
[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)
Tenable® is the Exposure Management company. Approximately 40,000 organizations around the globe rely on Tenable to understand and reduce cyber risk. As the creator of Nessus®, Tenable extended its expertise in vulnerabilities to deliver the world’s first platform to see and secure any digital asset on any computing platform. Tenable customers include approximately 60 percent of the Fortune 500, approximately 40 percent of the Global 2000, and large government agencies. Learn more at tenable.com
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)[![image](https://owasp.org/assets/images/corp-member-logo/GuardSquare.png)](https://www.guardsquare.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Equixly.png)](https://equixly.com)[![image](https://owasp.org/assets/images/corp-member-logo/Checkmarxn-NewLogo2024.jpg)](http://checkmarx.com)[![image](https://owasp.org/assets/images/corp-member-logo/SDS.png)](https://www.specialistdata.com)[![image](https://owasp.org/assets/images/corp-member-logo/BDO.png)](https://www.bdo.global/en-gb/services/advisory/cybersecurity)[![image](https://owasp.org/assets/images/corp-member-logo/Beagle.png)](https://beaglesecurity.com)
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
