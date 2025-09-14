# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [07-Input Validation Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/)
# Testing for HTTP Parameter Pollution
ID  
---  
WSTG-INPV-04  
## Summary
HTTP Parameter Pollution tests the applications response to receiving multiple HTTP parameters with the same name; for example, if the parameter `username` is included in the GET or POST parameters twice.
Supplying multiple HTTP parameters with the same name may cause an application to interpret values in unanticipated ways. By exploiting these effects, an attacker may be able to bypass input validation, trigger application errors or modify internal variables values. As HTTP Parameter Pollution (in short _HPP_) affects a building block of all web technologies, server and client-side attacks exist.
Current HTTP standards do not include guidance on how to interpret multiple input parameters with the same name. For instance, [RFC 3986](https://www.ietf.org/rfc/rfc3986.txt) simply defines the term _Query String_ as a series of field-value pairs and [RFC 2396](https://www.ietf.org/rfc/rfc2396.txt) defines classes of reversed and unreserved query string characters. Without a standard in place, web application components handle this edge case in a variety of ways (see the table below for details).
By itself, this is not necessarily an indication of vulnerability. However, if the developer is not aware of the problem, the presence of duplicated parameters may produce an anomalous behavior in the application that can be potentially exploited by an attacker. As often in security, unexpected behaviors are a usual source of weaknesses that could lead to HTTP Parameter Pollution attacks in this case. To better introduce this class of vulnerabilities and the outcome of HPP attacks, it is interesting to analyze some real-life examples that have been discovered in the past.
### Input Validation and Filters Bypass
In 2009, immediately after the publication of the first research on HTTP Parameter Pollution, the technique received attention from the security community as a possible way to bypass web application firewalls.
One of these flaws, affecting _ModSecurity SQL Injection Core Rules_ , represents a perfect example of the impedance mismatch between applications and filters. The ModSecurity filter would correctly apply a deny list for the following string: `select 1,2,3 from table`, thus blocking this example URL from being processed by the web server: `/index.aspx?page=select 1,2,3 from table`. However, by exploiting the concatenation of multiple HTTP parameters, an attacker could cause the application server to concatenate the string after the ModSecurity filter already accepted the input. As an example, the URL `/index.aspx?page=select 1&page=2,3` from table would not trigger the ModSecurity filter, yet the application layer would concatenate the input back into the full malicious string.
Another HPP vulnerability turned out to affect _Apple Cups_ , the well-known printing system used by many Unix systems. Exploiting HPP, an attacker could easily trigger a Cross-Site Scripting vulnerability using the following URL: `https://127.0.0.1:631/admin/?kerberos=onmouseover=alert(1)&kerberos`. The application validation checkpoint could be bypassed by adding an extra `kerberos` argument having a valid string (e.g. empty string). As the validation checkpoint would only consider the second occurrence, the first `kerberos` parameter was not properly sanitized before being used to generate dynamic HTML content. Successful exploitation would result in JavaScript code execution under the context of the hosting site.
### Authentication Bypass
An even more critical HPP vulnerability was discovered in _Blogger_ , the popular blogging platform. The bug allowed malicious users to take ownership of the victim’s blog by using the following HTTP request (`https://www.blogger.com/add-authors.do`):
```
POST /add-authors.do HTTP/1.1
[...]

security_token=attackertoken&blogID=attackerblogidvalue&blogID=victimblogidvalue&authorsList=goldshlager19test%40gmail.com(attacker email)&ok=Invite

```

The flaw resided in the authentication mechanism used by the web application, as the security check was performed on the first `blogID` parameter, whereas the actual operation used the second occurrence.
### Expected Behavior by Application Server
The following table illustrates how different web technologies behave in presence of multiple occurrences of the same HTTP parameter.
Given the URL and querystring: `https://example.com/?color=red&color=blue`
Web Application Server Backend | Parsing Result | Example  
---|---|---  
ASP.NET / IIS | All occurrences concatenated with a comma | color=red,blue  
ASP / IIS | All occurrences concatenated with a comma | color=red,blue  
.NET Core 3.1 / Kestrel | All occurrences concatenated with a comma | color=red,blue  
.NET 5 / Kestrel | All occurrences concatenated with a comma | color=red,blue  
PHP / Apache | Last occurrence only | color=blue  
PHP / Zeus | Last occurrence only | color=blue  
JSP, Servlet / Apache Tomcat | First occurrence only | color=red  
JSP, Servlet / Oracle Application Server 10g | First occurrence only | color=red  
JSP, Servlet / Jetty | First occurrence only | color=red  
IBM Lotus Domino | Last occurrence only | color=blue  
IBM HTTP Server | First occurrence only | color=red  
Node.js / express | First occurrence only | color=red  
mod_perl, libapreq2 / Apache | First occurrence only | color=red  
Perl CGI / Apache | First occurrence only | color=red  
mod_wsgi (Python) / Apache | First occurrence only | color=red  
Python / Zope | All occurrences in List data type | color=[‘red’,’blue’]  
(Source: Appsec EU 2009 Carettoni & Paola)
## Test Objectives
  * Identify the backend and the parsing method used.
  * Assess injection points and try bypassing input filters using HPP.


## How to Test
Luckily, because the assignment of HTTP parameters is typically handled via the web application server, and not the application code itself, testing the response to parameter pollution should be standard across all pages and actions. However, as in-depth business logic knowledge is necessary, testing HPP requires manual testing. Automatic tools can only partially assist auditors as they tend to generate too many false positives. In addition, HPP can manifest itself in client-side and server-side components.
### Server-Side HPP
To test for HPP vulnerabilities, identify any form or action that allows user-supplied input. Query string parameters in HTTP GET requests are easy to tweak in the navigation bar of the browser. If the form action submits data via POST, the tester will need to use an intercepting proxy to tamper with the POST data as it is sent to the server. Having identified a particular input parameter to test, one can edit the GET or POST data by intercepting the request, or change the query string after the response page loads. To test for HPP vulnerabilities simply append the same parameter to the GET or POST data but with a different value assigned.
For example: if testing the `search_string` parameter in the query string, the request URL would include that parameter name and value:
```
https://example.com/?search_string=kittens

```

The particular parameter might be hidden among several other parameters, but the approach is the same; leave the other parameters in place and append the duplicate:
```
https://example.com/?mode=guest&search_string=kittens&num_results=100

```

Append the same parameter with a different value:
```
https://example.com/?mode=guest&search_string=kittens&num_results=100&search_string=puppies

```

and submit the new request.
Analyze the response page to determine which value(s) were parsed. In the above example, the search results may show `kittens`, `puppies`, some combination of both (`kittens,puppies` or `kittens~puppies` or `['kittens','puppies']`), may give an empty result, or error page.
This behavior, whether using the first, last, or combination of input parameters with the same name, is very likely to be consistent across the entire application. Whether or not this default behavior reveals a potential vulnerability depends on the specific input validation and filtering specific to a particular application. As a general rule: if existing input validation and other security mechanisms are sufficient on single inputs, and if the server assigns only the first or last polluted parameters, then parameter pollution does not reveal a vulnerability. If the duplicate parameters are concatenated, different web application components use different occurrences or testing generates an error, there is an increased likelihood of being able to use parameter pollution to trigger security vulnerabilities.
A more in-depth analysis would require three HTTP requests for each HTTP parameter:
  1. Submit an HTTP request containing the standard parameter name and value, and record the HTTP response. E.g. `page?par1=val1`
  2. Replace the parameter value with a tampered value, submit and record the HTTP response. E.g. `page?par1=HPP_TEST1`
  3. Send a new request combining step (1) and (2). Again, save the HTTP response. E.g. `page?par1=val1&par1=HPP_TEST1`
  4. Compare the responses obtained during all previous steps. If the response from (3) is different from (1) and the response from (3) is also different from (2), there is an impedance mismatch that may be eventually abused to trigger HPP vulnerabilities.


Crafting a full exploit from a parameter pollution weakness is beyond the scope of this text. See the references for examples and details.
### Client-Side HPP
Similarly to server-side HPP, manual testing is the only reliable technique to audit web applications in order to detect parameter pollution vulnerabilities affecting client-side components. While in the server-side variant the attacker leverages a vulnerable web application to access protected data or to perform actions that are either not permitted or not supposed to be executed, client-side attacks aim at subverting client-side components and technologies.
To test for HPP client-side vulnerabilities, identify any form or action that allows user input and shows a result of that input back to the user. A search page is ideal, but a login box might not work (as it might not show an invalid username back to the user).
Similarly to server-side HPP, pollute each HTTP parameter with `%26HPP_TEST` and look for _url-decoded_ occurrences of the user-supplied payload:
  * `&HPP_TEST`
  * `&amp;HPP_TEST`
  * etc.


In particular, pay attention to responses having HPP vectors within `data`, `src`, `href` attributes or forms actions. Again, whether or not this default behavior reveals a potential vulnerability depends on the specific input validation, filtering and application business logic. In addition, it is important to notice that this vulnerability can also affect query string parameters used in XMLHttpRequest (XHR), runtime attribute creation and other plugin technologies (e.g. Adobe Flash’s flashvars variables).
## Tools
  * [ZAP Passive/Active Scanners](https://www.zaproxy.org)


## Spotlight: Invicti Security
[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)
Invicti Security is transforming the way web applications are secured. An AppSec leader for more than 15 years, Invicti enables organizations in every industry to continuously scan and secure all of their web applications and APIs at the speed of innovation. Through industry-leading Asset Discovery, Dynamic Application Security Testing (DAST), Interactive Application Security Testing (IAST), and Software Composition Analysis (SCA), Invicti provides a comprehensive view of an organization’s entire web application portfolio. Invicti’s proprietary Proof-Based Scanning technology is the first to deliver automatic verification of vulnerabilities and proof of exploit with 99.98% accuracy.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Arnica.png)](https://www.arnica.io)[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)[![image](https://owasp.org/assets/images/corp-member-logo/Red_Hat.svg)](http://www.redhat.com)[![image](https://owasp.org/assets/images/corp-member-logo/Automattic.png)](https://automattic.com/)[![image](https://owasp.org/assets/images/corp-member-logo/noma_security_logo.png)](https://noma.security)[![image](https://owasp.org/assets/images/corp-member-logo/Rakuten2022.png)](https://global.rakuten.com/corp/)[![image](https://owasp.org/assets/images/corp-member-logo/OccamSec.png)](https://osec.com)
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
