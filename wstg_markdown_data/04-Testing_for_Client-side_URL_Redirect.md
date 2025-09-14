# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [11-Client-side Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/)
# Testing for Client-side URL Redirect
ID  
---  
WSTG-CLNT-04  
## Summary
This section describes how to check for client-side URL redirection, also known as open redirection. It is an input validation flaw that exists when an application accepts user-controlled input that specifies a link which leads to an external URL that could be malicious. This kind of vulnerability could be used to accomplish a phishing attack or redirect a victim to an infection page.
This vulnerability occurs when an application accepts untrusted input that contains a URL value and does not sanitize it. This URL value could cause the web application to redirect the user to another page, such as a malicious page controlled by the attacker.
This vulnerability may enable an attacker to successfully launch a phishing scam and steal user credentials. Since the redirection is originated by the real application, the phishing attempts may have a more trustworthy appearance.
Here is an example of a phishing attack URL.
```
https://www.target.site?#redirect=www.fake-target.site

```

The victim that visits this URL will be automatically redirected to `fake-target.site`, where an attacker could place a fake page that resembles the intended site, in order to steal the victim’s credentials.
Open redirection could also be used to craft a URL that would bypass the application’s access control checks and forward the attacker to privileged functions that they would normally not be able to access.
## Test Objectives
  * Identify injection points that handle URLs or paths.
  * Assess the locations that the system could redirect to.


## How to Test
When testers manually check for this type of vulnerability, they first identify if there are client-side redirections implemented in the client-side code. These redirections may be implemented, to give a JavaScript example, using the `window.location` object. This can be used to direct the browser to another page by simply assigning a string to it. This is demonstrated in the following snippet:
```
var redir = location.hash.substring(1);
if (redir) {
    window.location='https://'+decodeURIComponent(redir);
}

```

In this example, the script does not perform any validation of the variable `redir` which contains the user-supplied input via the query string. Since no form of encoding is applied, this unvalidated input is passed to the `windows.location` object, creating a URL redirection vulnerability.
This implies that an attacker could redirect the victim to a malicious site simply by submitting the following query string:
```
https://www.victim.site/?#www.malicious.site

```

With a slight modification, the above example snippet can be vulnerable to JavaScript injection.
```
var redir = location.hash.substring(1);
if (redir) {
    window.location=decodeURIComponent(redir);
}

```

This can be exploited by submitting the following query string:
```
https://www.victim.site/?#javascript:alert(document.cookie)

```

When testing for this vulnerability, consider that some characters are treated differently by different browsers. For reference, see [DOM-based XSS](https://owasp.org/www-community/attacks/DOM_Based_XSS).
* * *
[Edit on GitHub](https://github.com/OWASP/www-project-web-security-testing-guide/blob/master/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/04-Testing_for_Client-side_URL_Redirect.md)
**The OWASP ® Foundation** works to improve the security of software through its community-led open source software projects, hundreds of chapters worldwide, tens of thousands of members, and by hosting local and global conferences. 
## Spotlight: Arnica
[![image](https://owasp.org/assets/images/corp-member-logo/Arnica.png)](https://www.arnica.io)
Arnica integrates across your software supply chain and provides the necessary context, prioritization, ownership, and actionability to proactively mitigate risks. In addition to providing complete reports around code risk, excessive permissions, vulnerable dependencies, code repository misconfigurations, anomalous developer behavior, and more, Arnica’s pipelineless approach eliminates these risks in a blameless and shameless way by interacting directly with the developers in real-time to stop any new risks from entering your source code while also helping resolve your risks backlog.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)[![image](https://owasp.org/assets/images/corp-member-logo/Rakuten2022.png)](https://global.rakuten.com/corp/)[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Root.png)](https://www.root.io/)[![image](https://owasp.org/assets/images/corp-member-logo/SecureCodeWarrior.png)](https://www.securecodewarrior.com/)[![image](https://owasp.org/assets/images/corp-member-logo/blended_logoowasp.png)](http://blend-ed.com)[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)[![image](https://owasp.org/assets/images/corp-member-logo/promon_logo_dark.png)](http://promon.co)[![image](https://owasp.org/assets/images/corp-member-logo/Checkmarxn-NewLogo2024.jpg)](http://checkmarx.com)
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
