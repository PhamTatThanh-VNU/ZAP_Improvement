# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [11-Client-side Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/)
# Testing for Clickjacking
ID  
---  
WSTG-CLNT-09  
## Summary
Clickjacking, a subset of UI redressing, is a malicious technique whereby a web user is deceived into interacting (in most cases by clicking) with something other than what the user believes they are interacting with. This type of attack, either alone or in conjunction with other attacks, could potentially send unauthorized commands or reveal confidential information while the victim is interacting with seemingly-harmless web pages. The term clickjacking was coined by Jeremiah Grossman and Robert Hansen in 2008.
A clickjacking attack uses seemingly-harmless features of HTML and JavaScript to force the victim to perform undesired actions, such as clicking an invisible button that performs an unintended operation. This is a client-side security issue that affects a variety of browsers and platforms.
To carry out this attack, an attacker creates a seemingly-harmless web page that loads the target application through the use of an inline frame (concealed with CSS code). Once this is done, an attacker may induce the victim to interact with the web page by other means (through, for example, social engineering). Like other attacks, a common prerequisite is that the victim is authenticated against the attacker’s target application.
![Clickjacking illustration](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/images/Clickjacking_description.png)  
_Figure 4.11.9-1: Clickjacking inline frame illustration_
The victim surfs the attacker’s web page with the intention of interacting with the visible user interface, but is inadvertently performing actions on the hidden web page. Using the hidden page, an attacker can deceive users into performing actions they never intended to perform through the positioning of the hidden elements in the web page.
![Masked inline frame illustration](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/images/Masked_iframe.png)  
_Figure 4.11.9-2: Masked inline frame illustration_
The power of this method is that the actions performed by the victim are originated from the hidden but authentic target web page. Consequently, some of the anti-CSRF protections deployed by the developers to protect the web page from CSRF attacks could be bypassed.
## Test Objectives
  * Assess application vulnerability to clickjacking attacks.


## How to Test
As mentioned above, this type of attack is often designed to allow an attacker to induce users’ actions on the target site, even if anti-CSRF tokens are being used.
### Load Target Web Page on a HTML Interpreter Using HTML iframe Tag
Sites that do not protected against frame busting are vulnerable to clickjacking attack. If the `https://www.target.site` web page is successfully loaded into a frame, then the site is vulnerable to Clickjacking. An example of HTML code to create this testing web page is displayed in the following snippet:
```
    <html>
        <head>
            <title>Clickjack test web page</title>
        </head>
        <body>
            <iframe src="https://www.target.site" width="400" height="400"></iframe>
        </body>
    </html>

```

### Test Application against Disabled JavaScript
Since these types of client-side protections relies on JavaScript frame busting code, if the victim has JavaScript disabled or it is possible for an attacker to disable JavaScript code, the web page will not have any protection mechanism against clickjacking.
There are few deactivation techniques that can be used with frames. More in depth techniques can be found on the [Clickjacking Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html).
### Sandbox Attribute
With HTML5 a new attribute called “sandbox” is available. It enables a set of restrictions on content loaded into the iframe.
Example:
```
<iframe src="https://example.org" sandbox></iframe>

```

### Test Application on Compatibility and Accessibility Mode
Mobile versions of the web page are usually smaller and faster than the desktop ones, and they have to be less complex than the main application. Mobile variants often have less protection. However, an attacker can fake the real origin given by a web browser, and a non-mobile victim may be able to visit an application made for mobile users. This scenario could allow the attacker to exploit a mobile version of the web page. Applications running on acessibility mode should also be tested against clickjacking, because site framming could be affected.
### Server-Side Protection: Using Frame-Ancestors Directive of Content Security Policy
The HTTP Content-Security-Policy (CSP) response header allows web page administrators to control resources the user agent is allowed to load for a given web page. The `frame-ancestors` directive in the HTTP CSP specifies the acceptable parents that may embed a web page using the `<frame>`, `<iframe>`, `<object>`, `<embed>`, or `<applet>` tags.
#### Testing Content Security Policy Response Header
  * Using a browser, open developer tools and access the target web page. Navigate to the Network tab.
  * Look for the request that loads the web page. It should have the same domain as the web page - usually be the first item on the Network tab.
  * Once you click on the file, more information will come up. Look for a 200 OK response code.
  * Scroll down to the Response Header Section. Content-Security-Policy section indicates level of protecting adopted.


Alternatively view the web page source to find Content-Security-Policy in a meta tag. WSTG has a detailed information on [Test for Content Security Policy](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/12-Test_for_Content_Security_Policy).
##### Proxies
Web proxies are known for adding and stripping headers. In the case in which a web proxy strips the `X-FRAME-OPTIONS` header then the site loses its framing protection.
##### Mobile Version of the Application
In this case, because the `X-FRAME-OPTIONS` HTTP header has to be implemented in every page of the application, developers may have not protected every single page on the mobile version.
### Remediation
  * For measures to prevent Clickjacking, see the [Clickjacking Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html).
  * For interactive labs on Clickjacking visit [Port Swigger Web Page](https://portswigger.net/web-security/clickjacking)
  * For additional resources on ClickJacking visit the [OWASP community](https://owasp.org/www-community/attacks/Clickjacking)


## Spotlight: Appdome
[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)
The Appdome mission is to protect every mobile app in the world at work and play, with billions of users protected today. Appdome delivers the only full lifecycle Unified Mobile App Defense platform with 300+ defenses spanning security, anti-malware, anti-fraud, anti-social engineering, mobile anti-bot, anti-cheat, geo compliance, MiTM attack prevention, code obfuscation, social engineering, and other protections. Automatically build security and privacy in your mobile CI/CD pipelines with Zero Code and No SDKs. Get OWASP MASVS Compliant in less than 5 minutes!
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Zelvin.jpg)](https://zelvin.com)[![image](https://owasp.org/assets/images/corp-member-logo/SecureCodeWarrior.png)](https://www.securecodewarrior.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Zimperiumlogo_300x90px.jpeg)](https://www.zimperium.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)[![image](https://owasp.org/assets/images/corp-member-logo/Adobe.png)](http://trust.adobe.com)[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/Root.png)](https://www.root.io/)[![image](https://owasp.org/assets/images/corp-member-logo/Corgea.png)](http://corgea.com)[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)
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
