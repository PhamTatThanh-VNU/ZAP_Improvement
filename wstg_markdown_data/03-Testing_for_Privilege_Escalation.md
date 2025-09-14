# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [05-Authorization Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/)
# Testing for Privilege Escalation
ID  
---  
WSTG-ATHZ-03  
## Summary
This section describes the issue of escalating privileges from one stage to another. During this phase, the tester should verify that it is not possible for a user to modify their privileges or roles inside the application in ways that could allow privilege escalation attacks.
Privilege escalation occurs when a user gets access to more resources or functionality than they are normally allowed, and such elevation or changes should have been prevented by the application. This is usually caused by a flaw in the application. The result is that the application performs actions with more privileges than those intended by the developer or system administrator.
The degree of escalation depends on what privileges the attacker is authorized to possess, and what privileges can be obtained in a successful exploit. For example, a programming error that allows a user to gain extra privilege after successful authentication limits the degree of escalation, because the user is already authorized to hold some privilege. Likewise, a remote attacker gaining superuser privilege without any authentication presents a greater degree of escalation.
Usually, people refer to _vertical escalation_ when it is possible to access resources granted to more privileged accounts (e.g., acquiring administrative privileges for the application), and to _horizontal escalation_ when it is possible to access resources granted to a similarly configured account (e.g., in an online banking application, accessing information related to a different user).
## Test Objectives
  * Identify injection points related to privilege manipulation.
  * Fuzz or otherwise attempt to bypass security measures.


## How to Test
### Testing for Role/Privilege Manipulation
In every portion of the application where a user can create information in the database (e.g., making a payment, adding a contact, or sending a message), can receive information (statement of account, order details, etc.), or delete information (drop users, messages, etc.), it is necessary to record that functionality. The tester should try to access such functions as another user in order to verify if it is possible to access a function that should not be permitted by the user’s role/privilege (but might be permitted as another user).
#### Manipulation of User Group
For example: The following HTTP POST allows the user that belongs to `grp001` to access order #0001:
```
POST /user/viewOrder.jsp HTTP/1.1
Host: www.example.com
...

groupID=grp001&orderID=0001

```

Verify if a user that does not belong to `grp001` can modify the value of the parameters `groupID` and `orderID` to gain access to that privileged data.
#### Manipulation of User Profile
For example: The following server’s answer shows a hidden field in the HTML returned to the user after a successful authentication.
```
HTTP/1.1 200 OK
Server: Netscape-Enterprise/6.0
Date: Wed, 1 Apr 2006 13:51:20 GMT
Set-Cookie: USER=aW78ryrGrTWs4MnOd32Fs51yDqp; path=/; domain=www.example.com
Set-Cookie: SESSION=k+KmKeHXTgDi1J5fT7Zz; path=/; domain= www.example.com
Cache-Control: no-cache
Pragma: No-cache
Content-length: 247
Content-Type: text/html
Expires: Thu, 01 Jan 1970 00:00:00 GMT
Connection: close

<form  name="autoriz" method="POST" action = "visual.jsp">
<input type="hidden" name="profile" value="SysAdmin">\

<body onload="document.forms.autoriz.submit()">
</td>
</tr>

```

What if the tester modifies the value of the variable `profile` to `SysAdmin`? Is it possible to become **administrator**?
#### Manipulation of Condition Value
For example: In an environment where the server sends an error message contained as a value in a specific parameter in a set of answer codes, as the following:
```
@0`1`3`3``0`UC`1`Status`OK`SEC`5`1`0`ResultSet`0`PVValid`-1`0`0` Notifications`0`0`3`Command  Manager`0`0`0` StateToolsBar`0`0`0`
StateExecToolBar`0`0`0`FlagsToolBar`0

```

The server gives an implicit trust to the user. It believes that the user will answer with the above message closing the session.
In this condition, verify that it is not possible to escalate privileges by modifying the parameter values. In this particular example, by modifying the `PVValid` value from `-1` to `0` (no error conditions), it may be possible to authenticate as administrator to the server.
#### Manipulation of IP Address
Some sites limit access or count the number of failed login attempts based on IP address.
For example:
```
X-Forwarded-For: 8.1.1.1

```

In this case, if the site uses the value of `X-forwarded-For` as client IP address, tester may change the IP value of the `X-forwarded-For` HTTP header to workaround the IP source identification.
### Testing for Vertical Bypassing Authorization Schema
A vertical authorization bypass is specific to the case that an attacker obtains a role higher than their own. Testing for this bypass focuses on verifying how the vertical authorization schema has been implemented for each role. For every function, page, specific role, or request that the application executes, it is necessary to verify if it is possible to:
  * Access resources that should be accessible only to a higher role user.
  * Operate functions on resources that should be operative only by a user that holds a higher or specific role identity.


For each role:
  1. Register a user.
  2. Establish and maintain two different sessions based on the two different roles.
  3. For every request, change the session identifier from the original to another role’s session identifier and evaluate the responses for each.
  4. An application will be considered vulnerable if the weaker privileged session contains the same data, or indicate successful operations on higher privileged functions.


#### Banking Site Roles Scenario
The following table illustrates the system roles on a banking site. Each role binds with specific permissions for the event menu functionality:
ROLE | PERMISSION | ADDITIONAL PERMISSION  
---|---|---  
Administrator | Full Control | Delete  
Manager | Modify, Add, Read | Add  
Staff | Read, Modify | Modify  
Customer | Read Only |   
The application will be considered vulnerable if the:
  1. Customer could operate administrator, manager or staff functions;
  2. Staff user could operate manager or administrator functions;
  3. Manager could operate administrator functions.


Suppose that the `deleteEvent` function is part of the administrator account menu of the application, and it is possible to access it by requesting the following URL: `https://www.example.com/account/deleteEvent`. Then, the following HTTP request is generated when calling the `deleteEvent` function:
```
POST /account/deleteEvent HTTP/1.1
Host: www.example.com
[other HTTP headers]
Cookie: SessionID=ADMINISTRATOR_USER_SESSION

EventID=1000001

```

The valid response:
```
HTTP/1.1 200 OK
[other HTTP headers]

{"message": "Event was deleted"}

```

The attacker may try and execute the same request:
```
POST /account/deleteEvent HTTP/1.1
Host: www.example.com
[other HTTP headers]
Cookie: SessionID=CUSTOMER_USER_SESSION

EventID=1000002

```

If the response of the attacker’s request contains the same data `{"message": "Event was deleted"}` the application is vulnerable.
#### Administrator Page Access
Suppose that the administrator menu is part of the administrator account.
The application will be considered vulnerable if any role other than administrator could access the administrator menu. Sometimes, developers perform authorization validation at the GUI level only, and leave the functions without authorization validation, thus potentially resulting in a vulnerability.
### URL Traversal
Try to traverse the site and check if some of pages that may miss the authorization check.
For example:
```
/../.././userInfo.html

```

### WhiteBox
If the URL authorization check is only done by partial URL match, then it’s likely testers or hackers may workaround the authorization by URL encoding techniques.
For example:
```
startswith(), endswith(), contains(), indexOf()

```

## Tools
  * [Zed Attack Proxy (ZAP)](https://www.zaproxy.org)


* * *
[Edit on GitHub](https://github.com/OWASP/www-project-web-security-testing-guide/blob/master/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/03-Testing_for_Privilege_Escalation.md)
**The OWASP ® Foundation** works to improve the security of software through its community-led open source software projects, hundreds of chapters worldwide, tens of thousands of members, and by hosting local and global conferences. 
## Spotlight: Scitum S.A de C.V:
[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)
Scitum is the leading cybersecurity company in Mexico, Latin America, the United States, and some European countries. Scitum’s primary focus is to fulfill all of our client’s needs with services that fully cover the cycle of cybersecurity, among which consultancy and provided services stand out. We are part of Telmex and Grupo Carso, providing great support and financial capability to deal with complex, large-scale projects.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/JitLogo.png)](https://jit.io)[![image](https://owasp.org/assets/images/corp-member-logo/Adobe.png)](http://trust.adobe.com)[![image](https://owasp.org/assets/images/corp-member-logo/ZINAD.png)](http://www.zinad.net)[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)[![image](https://owasp.org/assets/images/corp-member-logo/salesforce.png)](https://www.salesforce.com/)[![image](https://owasp.org/assets/images/corp-member-logo/ThreatSpikeLabsLogo.png)](https://www.threatspike.com)[![image](https://owasp.org/assets/images/corp-member-logo/Tirreno.png)](https://www.tirreno.com)
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
