# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [07-Input Validation Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/)
# Testing for Host Header Injection
ID  
---  
WSTG-INPV-17  
## Summary
A web server commonly hosts several web applications on the same IP address, referring to each application via the virtual host. In an incoming HTTP request, web servers often dispatch the request to the target virtual host based on the value supplied in the Host header. Without proper validation of the header value, the attacker can supply invalid input to cause the web server to:
  * Dispatch requests to the first virtual host on the list.
  * Perform a redirect to an attacker-controlled domain.
  * Perform web cache poisoning.
  * Manipulate password reset functionality.
  * Allow access to virtual hosts that were not intended to be externally accessible.


## Test Objectives
  * Assess if the Host header is being parsed dynamically in the application.
  * Bypass security controls that rely on the header.


## How to Test
Initial testing is as simple as supplying another domain (i.e. `attacker.com`) into the Host header field. It is how the web server processes the header value that dictates the impact. The attack is valid when the web server processes the input to send the request to an attacker-controlled host that resides at the supplied domain, and not to an internal virtual host that resides on the web server.
```
GET / HTTP/1.1
Host: www.attacker.com
[...]

```

In the simplest case, this may cause a 302 redirect to the supplied domain.
```
HTTP/1.1 302 Found
[...]
Location: https://www.attacker.com/login.php


```

Alternatively, the web server may send the request to the first virtual host on the list.
### X-Forwarded Host Header Bypass
In the event that Host header injection is mitigated by checking for invalid input injected via the Host header, you can supply the value to the `X-Forwarded-Host` header.
```
GET / HTTP/1.1
Host: www.example.com
X-Forwarded-Host: www.attacker.com
[...]

```

Potentially producing client-side output such as:
```
[...]
<link src="https://www.attacker.com/link" />
[...]

```

Once again, this depends on how the web server processes the header value.
### Web Cache Poisoning
Using this technique, an attacker can manipulate a web-cache to serve poisoned content to anyone who requests it. This relies on the ability to poison the caching proxy run by the application itself, CDNs, or other downstream providers. As a result, the victim will have no control over receiving the malicious content when requesting the vulnerable application.
```
GET / HTTP/1.1
Host: www.attacker.com
[...]

```

The following will be served from the web cache, when a victim visits the vulnerable application.
```
[...]
<link src="https://www.attacker.com/link" />
[...]

```

### Password Reset Poisoning
It is common for password reset functionality to include the Host header value when creating password reset links that use a generated secret token. If the application processes an attacker-controlled domain to create a password reset link, the victim may click on the link in the email and allow the attacker to obtain the reset token, thus resetting the victim’s password.
The example below shows a password reset link that is generated in PHP using the value of `$_SERVER['HTTP_HOST']`, which is set based on the contents of the HTTP Host header:
```
$reset_url = "https://" . $_SERVER['HTTP_HOST'] . "/reset.php?token=" .$token;
send_reset_email($email,$rset_url);

```

By making a HTTP request to the password reset page with a tampered Host header, we can modify where the URL points:
```
POST /request_password_reset.php HTTP/1.1
Host: www.attacker.com
[...]

email=user@example.org

```

The specified domain (`www.attacker.com`) will then be used in the reset link, which is emailed to the user. When the user clicks this link, the attacker can steal the token and compromise their account.
```
... Email snippet ...

Click on the following link to reset your password:

https://www.attacker.com/reset.php?token=12345

... Email snippet ...

```

### Accessing Private Virtual Hosts
In some cases a server may have virtual hosts that are not intended to be externally accessible. This is most common with a [split-horizon](https://en.wikipedia.org/wiki/Split-horizon_DNS) DNS setup (where internal and external DNS servers return different records for the same domain).
For example, an organization may have a single webserver on their internal network, which hosts both their public website (on `www.example.org`) and their internal Intranet (on `intranet.example.org`, but that record only exists on the internal DNS server). Although it would not be possible to browse directly to `intranet.example.org` from outside the network (as the domain would not resolve), it may be possible to access to Intranet by making a request from outside with the following `Host` header:
```
Host: intranet.example.org

```

This could also be achieved by adding an entry for `intranet.example.org` to your hosts file with the public IP address of `www.example.org`, or by overriding DNS resolution in your testing tool.
## Spotlight: UBsecure
[![image](https://owasp.org/assets/images/corp-member-logo/ub-secure.png)](https://www.ubsecure.jp/en/)
UBsecure is a leading web application security company based in Japan since 2007. We offer various security solutions for web application and smartphone application by utilizing in-house developed application security testing tool, Vex. Vex built by a tremendous amount of experience in professional security scanning and by its continuous feedback. The unique characteristic of the tool is that it used as a stand-alone security testing tool as well as the seamless security testing component within the SDLC. Therefore, Vex is not only for professional security auditors but also for software developers who need secure development cycles.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)[![image](https://owasp.org/assets/images/corp-member-logo/sq1_logo_dark_version.png)](https://www.sq1.security)[![image](https://owasp.org/assets/images/corp-member-logo/salesforce.png)](https://www.salesforce.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Root.png)](https://www.root.io/)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/promon_logo_dark.png)](http://promon.co)[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/Backslash-logo.png)](https://www.backslash.security/?utm_campaign=Launch&utm_source=owasp-sponsorship&utm_medium=banner&utm_content=homepage)[![image](https://owasp.org/assets/images/corp-member-logo/Akto.png)](http://Akto.io)
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
