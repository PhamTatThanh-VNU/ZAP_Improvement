# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [11-Client-side Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/)
# Testing for Reverse Tabnabbing
ID  
---  
WSTG-CLNT-14  
## Summary
[Reverse Tabnabbing](https://owasp.org/www-community/attacks/Reverse_Tabnabbing) is an attack which can be used to redirect users to phishing pages. This usually becomes possible due to the `target` attribute of the `<a>` tag being set to `_blank` which causes the link to be opened in a new tab. When the attribute `rel='noopener noreferrer'` is not used in the same `<a>` tag, the newly opened page can influence the original page and redirect it to a domain controlled by the attacker.
Since the user was on the original domain when the new tab opened, they are less likely to notice that the page has changed, especially if the phishing page is identical to the original domain. Any credentials entered on the attacker-controlled domain will thus end up in the attacker’s possession.
Links opened via the `window.open` JavaScript function are also vulnerable to this attack.
_NOTE: This is a legacy issue that does not affect[modern browsers](https://caniuse.com/mdn-html_elements_a_implicit_noopener). Older versions of popular browsers (For example, versions prior to Google Chrome 88) as well as Internet Explorer are vulnerable to this attack._
### Example
Imagine a web application where users are allowed to insert a URL in their profile. If the application is vulnerable to reverse tabnabbing, a malicious user will be able to provide a link to a page that has the following code:
```
<html>
 <body>
  <script>
    window.opener.location = "https://example.org";
  </script>
<b>Error loading...</b>
 </body>
</html>

```

Clicking on the link will open up a new tab while the original tab will redirect to “example.org”. Suppose “example.org” looks similar to the vulnerable web application, the user is less likely to notice the change and is more likely to enter sensitive information on the page.
## How to Test
  * Check the HTML source of the application to see if links with `target="_blank"` are using the `noopener` and `noreferrer` keywords in the `rel` attribute. If not, it is likely that the application is vulnerable to reverse tabnabbing. Such a link becomes exploitable if it either points to a third-party site that has been compromised by the attacker, or if it is user-controlled.
  * Check for areas where an attacker can insert links, i.e. control the `href` argument of an `<a>` tag. Try to insert a link to a page which has the source code given in the above example, and see if the original domain redirects. This test can be done in IE if other browsers don’t work.


## Remediation
It is recommended to make sure that the `rel` HTML attribute is set with the `noreferrer` and `noopener` keywords for all links.
## Spotlight: Automattic
[![image](https://owasp.org/assets/images/corp-member-logo/Automattic.png)](https://automattic.com/)
We are the people behind WordPress.com, Woo, Jetpack, WordPress VIP, Simplenote, Longreads, The Atavist, WPScan, Akismet, Gravatar, Crowdsignal, Cloudup, Tumblr, Day One, Pocket Casts, Newspack, Beeper, and more. We’re a distributed company with 1,914 Automatticians in 93 countries speaking 117 different languages. We’re committed to diversity, equity, and inclusion, and our common goal is to democratize publishing and commerce so that anyone with a story can tell it, and anyone with a product can sell it, regardless of income, gender, politics, language, or where they live in the world.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Equixly.png)](https://equixly.com)[![image](https://owasp.org/assets/images/corp-member-logo/Traefik.png)](https://traefik.io/)[![image](https://owasp.org/assets/images/corp-member-logo/serpapi_300x90.png)](https://serpapi.com)[![image](https://owasp.org/assets/images/corp-member-logo/Tirreno.png)](https://www.tirreno.com)[![image](https://owasp.org/assets/images/corp-member-logo/PhoenixSecurity.svg)](https://phoenix.security/)[![image](https://owasp.org/assets/images/corp-member-logo/Vijil.png)](https://vijil.ai)[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/approach_logo.png)](http://www.approach-cyber.com)[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)
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
