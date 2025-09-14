# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [07-Input Validation Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/)
# Testing for LDAP Injection
ID  
---  
WSTG-INPV-06  
## Summary
The Lightweight Directory Access Protocol (LDAP) is used to store information about users, hosts, and many other objects. [LDAP injection](https://wiki.owasp.org/index.php/LDAP_injection) is a server-side attack, which could allow sensitive information about users and hosts represented in an LDAP structure to be disclosed, modified, or inserted. This is done by manipulating input parameters afterwards passed to internal search, add, and modify functions.
A web application could use LDAP in order to let users authenticate or search other users’ information inside a corporate structure. The goal of LDAP injection attacks is to inject LDAP search filters metacharacters in a query which will be executed by the application.
[Rfc2254](https://www.ietf.org/rfc/rfc2254.txt) defines a grammar on how to build a search filter on LDAPv3 and extends [Rfc1960](https://www.ietf.org/rfc/rfc1960.txt) (LDAPv2).
An LDAP search filter is constructed in Polish notation, also known as [Polish notation prefix notation](https://en.wikipedia.org/wiki/Polish_notation).
This means that a pseudo code condition on a search filter like this:
`find("cn=John & userPassword=mypass")`
will be represented as:
`find("(&(cn=John)(userPassword=mypass))")`
Boolean conditions and group aggregations on an LDAP search filter could be applied by using the following metacharacters:
Metachar | Meaning  
---|---  
& | Boolean AND  
| | Boolean OR  
! | Boolean NOT  
= | Equals  
~= | Approx  
>= | Greater than  
<= | Less than  
* | Any character  
() | Grouping parenthesis  
More complete examples on how to build a search filter can be found in the related RFC.
A successful exploitation of an LDAP injection vulnerability could allow the tester to:
  * Access unauthorized content
  * Evade application restrictions
  * Gather unauthorized information
  * Add or modify Objects inside LDAP tree structure


## Test Objectives
  * Identify LDAP injection points.
  * Assess the severity of the injection.


## How to Test
### Example 1: Search Filters
Let’s suppose we have a web application using a search filter like the following one:
`searchfilter="(cn="+user+")"`
which is instantiated by an HTTP request like this:
`https://www.example.com/ldapsearch?user=John`
If the value `John` is replaced with a `*`, by sending the request:
`https://www.example.com/ldapsearch?user=*`
the filter will look like:
`searchfilter="(cn=*)"`
which matches every object with a ‘cn’ attribute equals to anything.
If the application is vulnerable to LDAP injection, it will display some or all of the user’s attributes, depending on the application’s execution flow and the permissions of the LDAP connected user.
A tester could use a trial-and-error approach, by inserting in the parameter `(`, `|`, `&`, `*` and the other characters, in order to check the application for errors.
### Example 2: Login
If a web application uses LDAP to check user credentials during the login process and it is vulnerable to LDAP injection, it is possible to bypass the authentication check by injecting an always true LDAP query (in a similar way to SQL and XPATH injection ).
Let’s suppose a web application uses a filter to match LDAP user/password pair.
`searchlogin= "(&(uid="+user+")(userPassword={MD5}"+base64(pack("H*",md5(pass)))+"))";`
By using the following values:
```
user=*)(uid=*))(|(uid=*
pass=password

```

the search filter will results in:
`searchlogin="(&(uid=*)(uid=*))(|(uid=*)(userPassword={MD5}X03MO1qnZdYdgyfeuILPmQ==))";`
which is correct and always true. This way, the tester will gain logged-in status as the first user in LDAP tree.
## Tools
  * [Softerra LDAP Browser](https://www.ldapadministrator.com)


## Spotlight: Automattic
[![image](https://owasp.org/assets/images/corp-member-logo/Automattic.png)](https://automattic.com/)
We are the people behind WordPress.com, Woo, Jetpack, WordPress VIP, Simplenote, Longreads, The Atavist, WPScan, Akismet, Gravatar, Crowdsignal, Cloudup, Tumblr, Day One, Pocket Casts, Newspack, Beeper, and more. We’re a distributed company with 1,914 Automatticians in 93 countries speaking 117 different languages. We’re committed to diversity, equity, and inclusion, and our common goal is to democratize publishing and commerce so that anyone with a story can tell it, and anyone with a product can sell it, regardless of income, gender, politics, language, or where they live in the world.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)[![image](https://owasp.org/assets/images/corp-member-logo/securityjourney_300x90.png)](http://www.SecurityJourney.com)[![image](https://owasp.org/assets/images/corp-member-logo/Checkmarxn-NewLogo2024.jpg)](http://checkmarx.com)[![image](https://owasp.org/assets/images/corp-member-logo/Backslash-logo.png)](https://www.backslash.security/?utm_campaign=Launch&utm_source=owasp-sponsorship&utm_medium=banner&utm_content=homepage)[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)[![image](https://owasp.org/assets/images/corp-member-logo/Equixly.png)](https://equixly.com)[![image](https://owasp.org/assets/images/corp-member-logo/BrightSecurity.png)](https://brightsec.com/)[![image](https://owasp.org/assets/images/corp-member-logo/cydrill_logo_300x90-01.png)](https://cydrill.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Rakuten2022.png)](https://global.rakuten.com/corp/)
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
