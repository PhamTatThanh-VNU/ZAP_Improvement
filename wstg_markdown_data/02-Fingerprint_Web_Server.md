# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [01-Information Gathering](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/)
# Fingerprint Web Server
ID  
---  
WSTG-INFO-02  
## Summary
Web server fingerprinting is the task of identifying the type and version of web server that a target is running on. While web server fingerprinting is often encapsulated in automated testing tools, it is important for researchers to understand the fundamentals of how these tools attempt to identify software, and why this is useful.
Accurately discovering the type of web server that an application runs on can enable security testers to determine if the application is vulnerable to attack. In particular, servers running older versions of software without up-to-date security patches can be susceptible to known version-specific exploits.
## Test Objectives
  * Determine the version and type of a running web server to enable further discovery of any known vulnerabilities.


## How to Test
Techniques used for web server fingerprinting include [banner grabbing](https://en.wikipedia.org/wiki/Banner_grabbing), eliciting responses to malformed requests, and using automated tools to perform more robust scans that use a combination of tactics. The fundamental premise on which all these techniques operate is the same. They all strive to elicit some response from the web server which can then be compared to a database of known responses and behaviors, and thus matched to a known server type.
### Banner Grabbing
A banner grab is performed by sending an HTTP request to the web server and examining its [response header](https://developer.mozilla.org/en-US/docs/Glossary/Response_header). This can be accomplished using a variety of tools, including `telnet` for HTTP requests, or `openssl` for requests over TLS/SSL.
For example, here is the response to a request sent to an Apache server.
```
HTTP/1.1 200 OK
Date: Thu, 05 Sep 2019 17:42:39 GMT
Server: Apache/2.4.41 (Unix)
Last-Modified: Thu, 05 Sep 2019 17:40:42 GMT
ETag: "75-591d1d21b6167"
Accept-Ranges: bytes
Content-Length: 117
Connection: close
Content-Type: text/html
...

```

Here is another response, this time sent by nginx.
```
HTTP/1.1 200 OK
Server: nginx/1.17.3
Date: Thu, 05 Sep 2019 17:50:24 GMT
Content-Type: text/html
Content-Length: 117
Last-Modified: Thu, 05 Sep 2019 17:40:42 GMT
Connection: close
ETag: "5d71489a-75"
Accept-Ranges: bytes
...

```

Here’s what a response sent by lighttpd looks like.
```
HTTP/1.0 200 OK
Content-Type: text/html
Accept-Ranges: bytes
ETag: "4192788355"
Last-Modified: Thu, 05 Sep 2019 17:40:42 GMT
Content-Length: 117
Connection: close
Date: Thu, 05 Sep 2019 17:57:57 GMT
Server: lighttpd/1.4.54

```

In these examples, the server type and version is clearly exposed. However, security-conscious applications may obfuscate their server information by modifying the header. For example, here is an excerpt from the response to a request for a site with a modified header:
```
HTTP/1.1 200 OK
Server: Website.com
Date: Thu, 05 Sep 2019 17:57:06 GMT
Content-Type: text/html; charset=utf-8
Status: 200 OK
...

```

In cases where the server information is obscured, testers may guess the type of server based on the ordering of the header fields. Note that in the Apache example above, the fields follow this order:
  * Date
  * Server
  * Last-Modified
  * ETag
  * Accept-Ranges
  * Content-Length
  * Connection
  * Content-Type


However, in both the nginx and obscured server examples, the fields in common follow this order:
  * Server
  * Date
  * Content-Type


Testers can use this information to guess that the obscured server is nginx. However, considering that a number of different web servers may share the same field ordering and fields can be modified or removed, this method is not definite.
### Sending Malformed Requests
Web servers may be identified by examining their error responses, and in the cases where they have not been customized, their default error pages. One way to compel a server to present these is by sending intentionally incorrect or malformed requests.
For example, here is the response to a request for the non-existent method `SANTA CLAUS` from an Apache server.
```
GET / SANTA CLAUS/1.1


HTTP/1.1 400 Bad Request
Date: Fri, 06 Sep 2019 19:21:01 GMT
Server: Apache/2.4.41 (Unix)
Content-Length: 226
Connection: close
Content-Type: text/html; charset=iso-8859-1

<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>400 Bad Request</title>
</head><body>
<h1>Bad Request</h1>
<p>Your browser sent a request that this server could not understand.<br />
</p>
</body></html>

```

Here is the response to the same request from nginx.
```
GET / SANTA CLAUS/1.1


<html>
<head><title>404 Not Found</title></head>
<body>
<center><h1>404 Not Found</h1></center>
<hr><center>nginx/1.17.3</center>
</body>
</html>

```

Here is the response to the same request from lighttpd.
```
GET / SANTA CLAUS/1.1


HTTP/1.0 400 Bad Request
Content-Type: text/html
Content-Length: 345
Connection: close
Date: Sun, 08 Sep 2019 21:56:17 GMT
Server: lighttpd/1.4.54

<?xml version="1.0" encoding="iso-8859-1"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
         "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="en" lang="en">
 <head>
  <title>400 Bad Request</title>
 </head>
 <body>
  <h1>400 Bad Request</h1>
 </body>
</html>

```

As default error pages offer many differentiating factors between types of web servers, their examination can be an effective method for fingerprinting even when server header fields are obscured.
### Using Automated Scanning Tools
As stated earlier, web server fingerprinting is often included as a functionality of automated scanning tools. These tools are able to make requests similar to those demonstrated above, as well as send other more server-specific probes. Automated tools can compare responses from web servers much faster than manual testing, and utilize large databases of known responses to attempt server identification. For these reasons, automated tools are more likely to produce accurate results.
Here are some commonly-used scan tools that include web server fingerprinting functionality.
  * [Netcraft](https://toolbar.netcraft.com/site_report), an online tool that scans sites for information, including web server details.
  * [Nikto](https://github.com/sullo/nikto), an Open Source command-line scanning tool.
  * [Nmap](https://nmap.org/), an Open Source command-line tool that also has a GUI, [Zenmap](https://nmap.org/zenmap/).


## Remediation
While exposed server information is not necessarily in itself a vulnerability, it is information that can assist attackers in exploiting other vulnerabilities that may exist. Exposed server information can also lead attackers to find version-specific server vulnerabilities that can be used to exploit unpatched servers. For this reason it is recommended that some precautions be taken. These actions include:
  * Obscuring web server information in headers, such as with Apache’s [mod_headers module](https://httpd.apache.org/docs/current/mod/mod_headers.html).
  * Using a hardened [reverse proxy server](https://en.wikipedia.org/wiki/Proxy_server#Reverse_proxies) to create an additional layer of security between the web server and the internet.
  * Ensuring that web servers are kept up-to-date with the latest software and security patches.


* * *
[Edit on GitHub](https://github.com/OWASP/www-project-web-security-testing-guide/blob/master/latest/4-Web_Application_Security_Testing/01-Information_Gathering/02-Fingerprint_Web_Server.md)
**The OWASP ® Foundation** works to improve the security of software through its community-led open source software projects, hundreds of chapters worldwide, tens of thousands of members, and by hosting local and global conferences. 
## Spotlight: Zen Exim Pvt. Ltd.
[![image](https://owasp.org/assets/images/corp-member-logo/ZenLogo.png)](http://www.zengroup.co.in)
Zen Exim is India’s leading value-added distributor since 2000, providing IT infrastructure solutions like Wireless, Network, and Data Centre Switches, SD-WAN, Data Centre Security, Cloud-Based applications, and more. Zen has 4,000+ channel partners across India and SAARC, supporting key sectors such as Hospitality, Healthcare, Corporate, Education, BFSI, Telecom, and Government. With a presence of sales and technical teams in major Indian cities, Zen Exim partners with global OEMs like F5, CommScope, Arista, and other networking products. Quantum Networks, a brand under Zen Exim, manufactures advanced networking solutions in India, driving connectivity innovation for businesses in the digital era.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Arnica.png)](https://www.arnica.io)[![image](https://owasp.org/assets/images/corp-member-logo/ub-secure.png)](https://www.ubsecure.jp/en/)[![image](https://owasp.org/assets/images/corp-member-logo/Xeol.jpeg)](https://www.xeol.io/)[![image](https://owasp.org/assets/images/corp-member-logo/Adobe.png)](http://trust.adobe.com)[![image](https://owasp.org/assets/images/corp-member-logo/Zimperiumlogo_300x90px.jpeg)](https://www.zimperium.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Checkmarxn-NewLogo2024.jpg)](http://checkmarx.com)[![image](https://owasp.org/assets/images/corp-member-logo/Equixly.png)](https://equixly.com)[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)
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
