# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [01-Information Gathering](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/)
# Map Execution Paths Through Application
ID  
---  
WSTG-INFO-07  
## Summary
Before commencing security testing, understanding the structure of the application is paramount. Without a thorough understanding of the application’s layout, a comprehensive test is unlikely.
## Test Objectives
  * Map the target application and understand the principal workflows.


## How to Test
In black-box testing, it is extremely difficult to test the entire codebase. This is not just because the tester cannot see the code paths through the application, but also because testing all the code paths would be extremely time-consuming. One way to reconcile this is to document the code paths that were discovered and tested.
There are several ways to approach the testing and measurement of code coverage:
  * **Path** - test each of the paths through an application that includes combinatorial and boundary value analysis testing for each decision path. While this approach offers thoroughness, the number of testable paths grows exponentially with each decision branch.
  * **Data Flow (or Taint Analysis)** - tests the assignment of variables via external interaction (normally users). Focuses on mapping the flow, transformation and use of data throughout an application.
  * **Race** - tests multiple concurrent instances of the application manipulating the same data.


The choice of method and the extent to which each method is used should be negotiated with the application owner. Additionally, simpler approaches could be adopted. For example, the tester could ask the application owner about specific functions or code sections that they are particularly concerned about, and discuss how those code segments can be reached.
To demonstrate code coverage to the application owner, the tester can start by documenting all the links discovered from spidering the application (either manually or automatically) in a spreadsheet. The tester can then look more closely at decision points in the application and investigate how many significant code paths are discovered. These should then be documented in the spreadsheet with URLs, prose and screenshot descriptions of the paths discovered.
### Automatic Spidering
An automatic spider is a tool that is used to discover new resources (URLs) on a specific site automatically. It begins with a list of URLs to visit, called the seeds, which depends on how the Spider is started. While there are a lot of Spidering tools, the following example uses the [Zed Attack Proxy (ZAP)](https://github.com/zaproxy/zaproxy):
![Zed Attack Proxy Screen](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/images/OWASPZAPSP.png)  
_Figure 4.1.7-1: Zed Attack Proxy Screen_
[ZAP](https://github.com/zaproxy/zaproxy) offers various automatic spidering options, which can be leveraged based on the tester’s needs:
  * [Spider](https://www.zaproxy.org/docs/desktop/start/features/spider/)
  * [Ajax Spider](https://www.zaproxy.org/docs/desktop/addons/ajax-spider/)
  * [OpenAPI Support](https://www.zaproxy.org/docs/desktop/addons/openapi-support/)


## Tools
  * [Zed Attack Proxy (ZAP)](https://github.com/zaproxy/zaproxy)
  * [List of spreadsheet software](https://en.wikipedia.org/wiki/List_of_spreadsheet_software)
  * [Diagramming software](https://en.wikipedia.org/wiki/List_of_concept-_and_mind-mapping_software)


## Spotlight: SQ1 Security Infotech, Inc.
[![image](https://owasp.org/assets/images/corp-member-logo/sq1_logo_dark_version.png)](https://www.sq1.security)
SQ1, formerly SecqureOne, is a global cybersecurity leader offering end-to-end cybersecurity and compliance solution. Our AI-powered security platforms are designed to protect endpoints & cloud assets from advanced cyber-attacks and threats, including APTs, malware, and ransomware. SQ1 offers a comprehensive range of managed cybersecurity services that identify & assess, protect and prevent, detect, analyse & respond to cyber threats and risks. SQ1 has been a trusted security partner for several thousands of businesses globally of various sizes across verticals from Healthcare, Pharma, Financial Services, Govt, Manufacturing, Technology, Oil and Energy.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Tirreno.png)](https://www.tirreno.com)[![image](https://owasp.org/assets/images/corp-member-logo/Adobe.png)](http://trust.adobe.com)[![image](https://owasp.org/assets/images/corp-member-logo/Arnica.png)](https://www.arnica.io)[![image](https://owasp.org/assets/images/corp-member-logo/ZINAD.png)](http://www.zinad.net)[![image](https://owasp.org/assets/images/corp-member-logo/BrightSecurity.png)](https://brightsec.com/)[![image](https://owasp.org/assets/images/corp-member-logo/ZenLogo.png)](http://www.zengroup.co.in)[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)
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
