# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [07-Input Validation Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/)
# Testing for SSI Injection
ID  
---  
WSTG-INPV-08  
## Summary
Web servers usually give developers the ability to add small pieces of dynamic code inside static HTML pages, without having to deal with full-fledged server-side or client-side languages. This feature is provided by [Server-Side Includes](https://owasp.org/www-community/attacks/Server-Side_Includes_%28SSI%29_Injection)(SSI).
Server-Side Includes are directives that the web server parses before serving the page to the user. They represent an alternative to writing CGI programs or embedding code using server-side scripting languages, when there’s only need to perform very simple tasks. Common SSI implementations provide directives (commands) to include external files, to set and print web server CGI environment variables, or to execute external CGI scripts or system commands.
SSI can lead to a Remote Command Execution (RCE), however most webservers have the `exec` directive disabled by default.
This is a vulnerability very similar to a classical scripting language injection vulnerability. One mitigation is that the web server needs to be configured to allow SSI. On the other hand, SSI injection vulnerabilities are often simpler to exploit, since SSI directives are easy to understand and, at the same time, quite powerful, e.g., they can output the content of files and execute system commands.
## Test Objectives
  * Identify SSI injection points.
  * Assess the severity of the injection.


## How to Test
To test for exploitable SSI, inject SSI directives as user input. If SSI are enabled and user input validation has not been properly implemented, the server will execute the directive. This is very similar to a classical scripting language injection vulnerability in that it occurs when user input is not properly validated and sanitized.
First determine if the web server supports SSI directives. Often, the answer is yes, as SSI support is quite common. To determine if SSI directives are supported, discover the type of web server that the target is running using information gathering techniques (see [Fingerprint Web Server](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/02-Fingerprint_Web_Server)). If you have access to the code, determine if SSI directives are used by searching through the webserver configuration files for specific keywords.
Another way of verifying that SSI directives are enabled is by checking for pages with the `.shtml` extension, which is associated with SSI directives. The use of the `.shtml` extension is not mandatory, so not having found any `.shtml` files doesn’t necessarily mean that the target is not vulnerable to SSI injection attacks.
The next step is determining all the possible user input vectors and testing to see if the SSI injection is exploitable.
First find all the pages where user input is allowed. Possible input vectors may also include headers and cookies. Determine how the input is stored and used, i.e if the input is returned as an error message or page element and if it was modified in some way. Access to the source code can help you to more easily determine where the input vectors are and how input is handled.
Once you have a list of potential injection points, you may determine if the input is correctly validated. Ensure it is possible to inject characters used in SSI directives such as `<!#=/."->` and `[a-zA-Z0-9]`
The below example returns the value of the variable. The [references](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/08-Testing_for_SSI_Injection#references) section has helpful links with server-specific documentation to help you better assess a particular system.
```
<!--#echo var="VAR" -->

```

When using the `include` directive, if the supplied file is a CGI script, this directive will include the output of the CGI script. This directive may also be used to include the content of a file or list files in a directory:
```
<!--#include virtual="FILENAME" -->

```

To return the output of a system command:
```
<!--#exec cmd="OS_COMMAND" -->

```

If the application is vulnerable, the directive is injected and it would be interpreted by the server the next time the page is served.
The SSI directives can also be injected in the HTTP headers, if the web application is using that data to build a dynamically generated page:
```
GET / HTTP/1.1
Host: www.example.com
Referer: <!--#exec cmd="/bin/ps ax"-->
User-Agent: <!--#include virtual="/proc/version"-->

```

## Tools
  * [Web Proxy Burp Suite](https://portswigger.net/burp/communitydownload)
  * [ZAP](https://www.zaproxy.org/)
  * [String searcher: grep](https://www.gnu.org/software/grep)


## Spotlight: Bionic
[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)
Bionic helps customers manage the security posture of their applications in production, providing continuous visibility of risk across all application services, dependencies, and data flows in real-time. Current application security tools are looking at data privacy and application security from a vulnerability lens. Bionic looks at the problem from an architectural lens.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/OccamSec.png)](https://osec.com)[![image](https://owasp.org/assets/images/corp-member-logo/Equixly.png)](https://equixly.com)[![image](https://owasp.org/assets/images/corp-member-logo/blended_logoowasp.png)](http://blend-ed.com)[![image](https://owasp.org/assets/images/corp-member-logo/FujitsuLimited.png)](https://global.fujitsu/en-global)[![image](https://owasp.org/assets/images/corp-member-logo/Traefik.png)](https://traefik.io/)[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)
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
