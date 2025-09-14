# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [02-Configuration and Deployment Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/)
# Testing for Content Security Policy
ID  
---  
WSTG-CONF-12  
## Summary
Content Security Policy (CSP) is a declarative allow-list policy enforced through `Content-Security-Policy` response header or equivalent `<meta>` element. It allows developers to restrict the sources from which resources such as JavaScript, CSS, images, files etc. are loaded. CSP is an effective defense in depth technique to mitigate the risk of vulnerabilities such as Cross Site Scripting (XSS) and Clickjacking.
Content Security Policy supports directives which allow granular control to the flow of policies. (See [References](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/12-Test_for_Content_Security_Policy#references) for further details.)
## Test Objectives
  * Review the Content-Security-Policy header or meta element to identify misconfigurations.


## How to Test
To test for misconfigurations in CSPs, look for insecure configurations by examining the `Content-Security-Policy` HTTP response header or CSP `meta` element in a proxy tool:
  * `unsafe-inline` directive enables inline scripts or styles, making the applications susceptible to [XSS](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/01-Testing_for_Reflected_Cross_Site_Scripting) attacks.
  * `unsafe-eval` directive allows `eval()` to be used in the application and is susceptible to common bypass techniques such as data URL injection.
  * `unsafe-hashes` directive allows use of inline scripts/styles, assuming they match the specified hashes.
  * Resources such as scripts can be allowed to be loaded from any origin by the use wildcard (`*`) source. 
    * Also consider wildcards based on partial matches, such as: `https://*` or `*.cdn.com`.
    * Consider whether allow listed sources provide JSONP endpoints which might be used to bypass CSP or same-origin-policy.
  * Framing can be enabled for all origins by the use of the wildcard (`*`) source for the `frame-ancestors` directive. If the `frame-ancestors` directive is not defined in the Content-Security-Policy header it may make applications vulnerable to [clickjacking](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/09-Testing_for_Clickjacking) attacks.
  * Business critical applications should require to use a strict policy.


## Remediation
Configure a strong content security policy which reduces the attack surface of the application. Developers can verify the strength of content security policy using online tools such as [Google CSP Evaluator](https://csp-evaluator.withgoogle.com/).
### Strict Policy
A strict policy is a policy which provides protection against classical stored, reflected, and some of the DOM XSS attacks and should be the optimal goal of any team trying to implement CSP.
Google went ahead and set up a guide to adopt a strict CSP based on nonces. Based on a presentation at [LocoMocoSec](https://speakerdeck.com/lweichselbaum/csp-a-successful-mess-between-hardening-and-mitigation?slide=55), the following two policies can be used to apply a strict policy:
Moderate Strict Policy:
```
script-src 'nonce-r4nd0m' 'strict-dynamic';
object-src 'none'; base-uri 'none';

```

Locked down Strict Policy:
```
script-src 'nonce-r4nd0m';
object-src 'none'; base-uri 'none';

```

  * `script-src` directive is used to restrict the sources from which scripts can be loaded and executed.
  * `object-src` directive is used to restrict the sources from which objects can be loaded and executed.
  * `base-uri` directive specifies the base URL for resolving relative URLs in the page. Without this directive, the page becomes vulnerable to HTML base tag injection attacks.


## Tools
  * [Google CSP Evaluator](https://csp-evaluator.withgoogle.com/)
  * [CSP Auditor - Burp Suite Extension](https://portswigger.net/bappstore/35237408a06043e9945a11016fcbac18)
  * [CSP Generator Chrome](https://chrome.google.com/webstore/detail/content-security-policy-c/ahlnecfloencbkpfnpljbojmjkfgnmdc) / [Firefox](https://addons.mozilla.org/en-US/firefox/addon/csp-generator/)


## Spotlight: Adobe
[![image](https://owasp.org/assets/images/corp-member-logo/Adobe.png)](http://trust.adobe.com)
Changing the world through personalized digital experiences. Adobe empowers everyone, everywhere to imagine, create, and bring any digital experience to life. From creators and students to small businesses, global enterprises, and nonprofit organizations — customers choose Adobe products to ideate, collaborate, be more productive, drive business growth, and build remarkable experiences.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)[![image](https://owasp.org/assets/images/corp-member-logo/ZINAD.png)](http://www.zinad.net)[![image](https://owasp.org/assets/images/corp-member-logo/Checkmarxn-NewLogo2024.jpg)](http://checkmarx.com)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/DefectDojo.png)](https://www.defectdojo.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)[![image](https://owasp.org/assets/images/corp-member-logo/Root.png)](https://www.root.io/)
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
