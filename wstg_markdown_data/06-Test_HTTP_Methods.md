# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [02-Configuration and Deployment Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/)
# Test HTTP Methods
ID  
---  
WSTG-CONF-06  
## Summary
HTTP offers a number of methods (or verbs) that can be used to perform actions on the web server. While GET and POST are by far the most common methods that are used to access information provided by a web server, there are a variety of other methods that may also be supported, and can sometimes be exploited by attackers.
[RFC 7231](https://datatracker.ietf.org/doc/html/rfc7231) defines the main valid HTTP request methods (or verbs), although additional methods have been added in other RFCs, such as [RFC 5789](https://datatracker.ietf.org/doc/html/rfc5789). Several of these verbs have been re-used for different purposes in [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) applications, listed in the table below.
Method | Original Purpose | RESTful Purpose  
---|---|---  
[`GET`](https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.1) | Request a file. | Request an object.  
[`HEAD`](https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.2) | Request a file, but only return the HTTP headers. |   
[`POST`](https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.3) | Submit data. |   
[`PUT`](https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.4) | Upload a file. | Create an object.  
[`DELETE`](https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.5) | Delete a file | Delete an object.  
[`CONNECT`](https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.6) | Establish a connection to another system. |   
[`OPTIONS`](https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.7) | List supported HTTP methods. | Perform a [CORS Preflight](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request) request.  
[`TRACE`](https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.8) | Echo the HTTP request for debug purposes. |   
[`PATCH`](https://datatracker.ietf.org/doc/html/rfc5789#section-2) |  | Modify an object.  
## Test Objectives
  * Enumerate supported HTTP methods.
  * Test for access control bypass.
  * Test HTTP method overriding techniques.


## How to Test
### Discover the Supported Methods
To perform this test, the tester needs a way to identify which HTTP methods are supported by the web server that is being examined. The simplest way to do this is to make an `OPTIONS` request to the server:
```
OPTIONS / HTTP/1.1
Host: example.org

```

The server should then respond with a list of supported methods:
```
HTTP/1.1 200 OK
Allow: OPTIONS, GET, HEAD, POST

```

However, not all servers may respond to OPTIONS requests, and some may even return inaccurate information. It’s also worth noting that servers may support different methods for different paths. This means that even if a method is not supported for the root / directory, it does not necessarily indicate that the same method won’t be supported elsewhere.
A more reliable way to test for supported methods is to simply make a request with that method type, and examine the server response. If the method is not permitted, the server should return a `405 Method Not Allowed` status.
Note that some servers treat unknown methods as equivalent to `GET`, so they may respond to arbitrary methods, such as the request shown below. This can occasionally be useful to evade a web application firewall, or any other filtering that blocks specific methods.
```
FOO / HTTP/1.1
Host: example.org

```

Requests with arbitrary methods can also be made using curl with the `-X` option:
```
curl -X FOO https://example.org

```

There are also a variety of automated tools that can attempt to determine supported methods, such as the [`http-methods`](https://nmap.org/nsedoc/scripts/http-methods.html) Nmap script. However, these tools may not test for dangerous methods (i.e., methods that may cause changes such as `PUT` or `DELETE`), or may unintentionally cause changes to the web server if these methods are supported. As such, they should be used with care.
### PUT and DELETE
The `PUT` and `DELETE` methods can have different effects, depending on whether they are being interpreted by the web server or by the application running on it.
#### Legacy Web Servers
Some legacy web servers allowed the use of the `PUT` method to create files on the server. For example, if the server is configured to allow this, the request below would create a file on the server called `test.html` with the contents `<script>alert(1)</script>`.
```
PUT /test.html HTTP/1.1
Host: example.org
Content-Length: 25

<script>alert(1)</script>

```

Similar requests can also be made with cURL:
```
curl https://example.org --upload-file test.html

```

This allows an attacker to upload arbitrary files to the webserver, which could potentially result in a full system compromise if they are allowed to upload executable code such as PHP files. However, this configuration is extremely rare, and is unlikely to be seen on modern systems.
Similarly, the `DELETE` method can be used to delete files from the webserver. Please note that this is a **destructive action** ; therefore, extreme care should be exercised when testing this method.
```
DELETE /test.html HTTP/1.1
Host: example.org

```

Or with cURL:
```
curl https://example.org/test.html -X DELETE

```

#### RESTful APIs
By contrast, the `PUT` and `DELETE` methods are commonly used by modern RESTful applications to create and delete objects. For example, the API request below could be used to create a user called “foo” with a role of “user”:
```
PUT /api/users/foo HTTP/1.1
Host: example.org
Content-Length: 34

{
    "role": "user"
}

```

A similar request with the DELETE method could be used to delete an object.
```
DELETE /api/users/foo HTTP/1.1
Host: example.org

```

Although it may be reported by automated scanning tools, the presence of these methods on a RESTful API **is not a security issue**. However, this functionality may have other vulnerabilities (such as weak access control), and should be thoroughly tested.
### TRACE
The `TRACE` method (or Microsoft’s equivalent `TRACK` method) causes the server to echo back the contents of the request. This led to a vulnerability called Cross-Site Tracing (XST) to be published in [2003](https://www.cgisecurity.com/whitehat-mirror/WH-WhitePaper_XST_ebook.pdf) (PDF), which could be used to access cookies that had the `HttpOnly` flag set. The `TRACE` method has been blocked in all browsers and plugins for many years; as such, this issue is no longer exploitable. However, it may still be flagged by automated scanning tools, and the `TRACE` method being enabled on a web server suggests that is has not been properly hardened.
### CONNECT
The `CONNECT` method causes the web server to open a TCP connection to another system, and then pass traffic from the client to that system. This could allow an attacker to proxy traffic through the server, in order to hide their source address, access internal systems or access services that are bound to localhost. An example of a `CONNECT` request is shown below:
```
CONNECT 192.168.0.1:443 HTTP/1.1
Host: example.org

```

### PATCH
The `PATCH` method is defined in [RFC 5789](https://datatracker.ietf.org/doc/html/rfc5789), and is used to provide instructions on how an object should be modified. The RFC itself does not define what format these instructions should be in, but various methods are defined in other standards, such as the [RFC 6902 - JavaScript Object Notation (JSON) Patch](https://datatracker.ietf.org/doc/html/rfc6902).
For example, if we have a user called “foo” with the following properties:
```
{"role":"user","email":"foo@example.org"}
```

The following JSON PATCH request could be used to change the role of this user to “admin”, without modifying the email address:
```
PATCH /api/users/foo HTTP/1.1
Host: example.org

{ "op": "replace", "path": "/role", "value": "admin" }

```

Although the RFC states that it should include instructions for how the object should be modified, the `PATCH` method is commonly (mis)used to include the changed content instead, as shown below. Much like the previous request, this would change the “role” value to “admin” without modifying the rest of the object. This is in contrast to the `PUT` method, which would overwrite the entire object, and thus result in an object with no “email” attribute.
```
PATCH /api/users/foo HTTP/1.1
Host: example.org

{
    "role": "admin"
}

```

As with the `PUT` method, this functionality may have access control weaknesses or other vulnerabilities. Additionally, applications may not perform the same level of input validation when modifying an object as they do when creating one. This could potentially allow malicious values to be injected (such as in a stored cross-site scripting attack), or could allow broken or invalid objects that may result in business logic related issues.
### Testing for Access Control Bypass
If a page on the application redirects users to a login page with a 302 code when they attempt to access it directly, it may be possible to bypass this by making a request with a different HTTP method, such as `HEAD`, `POST` or even a made up method such as `FOO`. If the web application responds with a `HTTP/1.1 200 OK` rather than the expected `HTTP/1.1 302 Found`, it may then be possible to bypass the authentication or authorization. The example below shows how a `HEAD` request may result in a page setting administrative cookies, rather than redirecting the user to a login page:
```
HEAD /admin/ HTTP/1.1
Host: example.org

```

```
HTTP/1.1 200 OK
[...]
Set-Cookie: adminSessionCookie=[...];

```

Alternatively, it may be possible to make direct requests to pages that cause actions, such as:
```
HEAD /admin/createUser.php?username=foo&password=bar&role=admin HTTP/1.1
Host: example.org

```

Or:
```
FOO /admin/createUser.php
Host: example.org
Content-Length: 36

username=foo&password=bar&role=admin

```

### Testing for HTTP Method Overriding
Some web frameworks provide a way to override the actual HTTP method in the request. They achieve this by emulating the missing HTTP verbs and passing some custom headers in the requests. The main purpose of this is to circumvent a middleware application (such as a proxy or web application firewall) which blocks specific methods. The following alternative HTTP headers could potentially be used:
  * `X-HTTP-Method`
  * `X-HTTP-Method-Override`
  * `X-Method-Override`


To test this, consider scenarios where restricted verbs like `PUT` or `DELETE` return a `405 Method not allowed`. In such cases, replay the same request, but add the alternative headers for HTTP method overriding. Then, observe the system’s response. The application should respond with a different status code (_e.g._ `200 OK`) in cases where method overriding is supported.
The web server in the following example does not allow the `DELETE` method and blocks it:
```
DELETE /resource.html HTTP/1.1
Host: example.org

```

```
HTTP/1.1 405 Method Not Allowed
[...]

```

After adding the `X-HTTP-Method` header, the server responds to the request with a 200:
```
GET /resource.html HTTP/1.1
Host: example.org
X-HTTP-Method: DELETE

```

```
HTTP/1.1 200 OK
[...]

```

## Remediation
  * Ensure that only the required methods are allowed and that these methods are properly configured.
  * Ensure that no workarounds are implemented to bypass security measures implemented by user-agents, frameworks, or web servers.


## Tools
  * [Ncat](https://nmap.org/ncat/)
  * [cURL](https://curl.haxx.se/)
  * [Nmap http-methods NSE script](https://nmap.org/nsedoc/scripts/http-methods.html)


## Spotlight: Backslash
[![image](https://owasp.org/assets/images/corp-member-logo/Backslash-logo.png)](https://www.backslash.security/?utm_campaign=Launch&utm_source=owasp-sponsorship&utm_medium=banner&utm_content=homepage)
Backslash is the first Cloud-Native Application Security solution for enterprise AppSec teams to provide unified security and business context to cloud-native code risk, coupled with automated threat modeling, code risk prioritization, and simplified remediation across applications and teams. With Backslash, AppSec teams can see and easily act upon the critical toxic code flows in their cloud-native applications; quickly prioritize code risks based on the relevant cloud context; and significantly cut MTTR (mean time to recovery) by enabling developers with the evidence they need to take ownership of the process.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)[![image](https://owasp.org/assets/images/corp-member-logo/BDO.png)](https://www.bdo.global/en-gb/services/advisory/cybersecurity)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/Rakuten2022.png)](https://global.rakuten.com/corp/)[![image](https://owasp.org/assets/images/corp-member-logo/Adobe.png)](http://trust.adobe.com)[![image](https://owasp.org/assets/images/corp-member-logo/ub-secure.png)](https://www.ubsecure.jp/en/)[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)[![image](https://owasp.org/assets/images/corp-member-logo/SecureCodeWarrior.png)](https://www.securecodewarrior.com/)
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
