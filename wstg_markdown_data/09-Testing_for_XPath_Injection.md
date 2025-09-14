# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [07-Input Validation Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/)
# Testing for XPath Injection
ID  
---  
WSTG-INPV-09  
## Summary
XPath is a language that has been designed and developed primarily to address parts of an XML document. In XPath injection testing, we test if it is possible to inject XPath syntax into a request interpreted by the application, allowing an attacker to execute user-controlled XPath queries. When successfully exploited, this vulnerability may allow an attacker to bypass authentication mechanisms or access information without proper authorization.
Web applications heavily use databases to store and access the data they need for their operations. Historically, relational databases have been by far the most common technology for data storage, but, in the last years, we are witnessing an increasing popularity for databases that organize data using the XML language. Just like relational databases are accessed via SQL language, XML databases use XPath as their standard query language.
Since, from a conceptual point of view, XPath is very similar to SQL in its purpose and applications, an interesting result is that XPath injection attacks follow the same logic as [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) attacks. In some aspects, XPath is even more powerful than standard SQL, as its whole power is already present in its specifications, whereas a large number of the techniques that can be used in a SQL Injection attack depend on the characteristics of the SQL dialect used by the target database. This means that XPath injection attacks can be much more adaptable and ubiquitous. Another advantage of an XPath injection attack is that, unlike SQL, no ACLs are enforced, as our query can access every part of the XML document.
## Test Objectives
  * Identify XPATH injection points.


## How to Test
The [XPath attack pattern was first published by Amit Klein](https://dl.packetstormsecurity.net/papers/bypass/Blind_XPath_Injection_20040518.pdf) and is very similar to the usual SQL Injection. In order to get a first grasp of the problem, let’s imagine a login page that manages the authentication to an application in which the user must enter their username and password. Let’s assume that our database is represented by the following XML file:
```
<?xml version="1.0" encoding="ISO-8859-1"?>
<users>
    <user>
        <username>gandalf</username>
        <password>!c3</password>
        <account>admin</account>
    </user>
    <user>
        <username>Stefan0</username>
        <password>w1s3c</password>
        <account>guest</account>
    </user>
    <user>
        <username>tony</username>
        <password>Un6R34kb!e</password>
        <account>guest</account>
    </user>
</users>

```

An XPath query that returns the account whose username is `gandalf` and the password is `!c3` would be the following:
`string(//user[username/text()='gandalf' and password/text()='!c3']/account/text())`
If the application does not properly filter user input, the tester will be able to inject XPath code and interfere with the query result. For instance, the tester could input the following values:
```
Username: ' or '1' = '1
Password: ' or '1' = '1

```

Looks quite familiar, doesn’t it? Using these parameters, the query becomes:
`string(//user[username/text()='' or '1' = '1' and password/text()='' or '1' = '1']/account/text())`
As in a common SQL Injection attack, we have created a query that always evaluates to true, which means that the application will authenticate the user even if a username or a password have not been provided. And as in a common SQL Injection attack, with XPath injection, the first step is to insert a single quote (`'`) in the field to be tested, introducing a syntax error in the query, and to check whether the application returns an error message.
If there is no knowledge about the XML data internal details and if the application does not provide useful error messages that help us reconstruct its internal logic, it is possible to perform a [Blind XPath Injection](https://owasp.org/www-community/attacks/Blind_XPath_Injection) attack, whose goal is to reconstruct the whole data structure. The technique is similar to inference based SQL Injection, as the approach is to inject code that creates a query that returns one bit of information. [Blind XPath Injection](https://owasp.org/www-community/attacks/Blind_XPath_Injection) is explained in more detail by Amit Klein in the referenced paper.
## Spotlight: Automattic
[![image](https://owasp.org/assets/images/corp-member-logo/Automattic.png)](https://automattic.com/)
We are the people behind WordPress.com, Woo, Jetpack, WordPress VIP, Simplenote, Longreads, The Atavist, WPScan, Akismet, Gravatar, Crowdsignal, Cloudup, Tumblr, Day One, Pocket Casts, Newspack, Beeper, and more. We’re a distributed company with 1,914 Automatticians in 93 countries speaking 117 different languages. We’re committed to diversity, equity, and inclusion, and our common goal is to democratize publishing and commerce so that anyone with a story can tell it, and anyone with a product can sell it, regardless of income, gender, politics, language, or where they live in the world.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/GitGuardian1.png)](http://gitguardian.com)[![image](https://owasp.org/assets/images/corp-member-logo/Impart.png)](https://www.impart.security/)[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Backslash-logo.png)](https://www.backslash.security/?utm_campaign=Launch&utm_source=owasp-sponsorship&utm_medium=banner&utm_content=homepage)[![image](https://owasp.org/assets/images/corp-member-logo/SKUDONET.png)](https://www.skudonet.com)[![image](https://owasp.org/assets/images/corp-member-logo/approach_logo.png)](http://www.approach-cyber.com)[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)[![image](https://owasp.org/assets/images/corp-member-logo/Cybozu.png)](https://cybozu.co.jp/en/company/)[![image](https://owasp.org/assets/images/corp-member-logo/Checkmarxn-NewLogo2024.jpg)](http://checkmarx.com)
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
