# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [06-Session Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/)
# Testing for Session Fixation
ID  
---  
WSTG-SESS-03  
## Summary
Session fixation is enabled by the insecure practice of preserving the same value of the session cookies before and after authentication. This typically happens when session cookies are used to store state information even before login, e.g., to add items to a shopping cart before authenticating for payment.
In the generic exploit of session fixation vulnerabilities, an attacker can obtain a set of session cookies from the target site without first authenticating. The attacker can then force these cookies into the victim’s browser using different techniques. If the victim later authenticates at the target site and the cookies are not refreshed upon login, the victim will be identified by the session cookies chosen by the attacker. The attacker is then able to impersonate the victim with these known cookies.
This issue can be fixed by refreshing the session cookies after the authentication process. Alternatively, the attack can be prevented by ensuring the integrity of session cookies. When considering network attackers, i.e., attackers who control the network used by the victim, use full [HSTS](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security) or add the`__Host-` / `__Secure-` prefix to the cookie name.
Full HSTS adoption occurs when a host activates HSTS for itself and all its sub-domains. This is described in a paper called _Testing for Integrity Flaws in Web Sessions_ by Stefano Calzavara, Alvise Rabitti, Alessio Ragazzo, and Michele Bugliesi.
## Test Objectives
  * Analyze the authentication mechanism and its flow.
  * Force cookies and assess the impact.


## How to Test
In this section we give an explanation of the testing strategy that will be shown in the next section.
The first step is to make a request to the site to be tested (_e.g._ `www.example.com`). If the tester requests the following:
```
GET / HTTP/1.1
Host: www.example.com

```

They will obtain the following response:
```
HTTP/1.1 200 OK
Date: Wed, 14 Aug 2008 08:45:11 GMT
Server: IBM_HTTP_Server
Set-Cookie: JSESSIONID=0000d8eyYq3L0z2fgq10m4v-rt4:-1; Path=/; secure
Cache-Control: no-cache="set-cookie,set-cookie2"
Expires: Thu, 01 Dec 1994 16:00:00 GMT
Keep-Alive: timeout=5, max=100
Connection: Keep-Alive
Content-Type: text/html;charset=Cp1254
Content-Language: en-US

```

The application sets a new session identifier, `JSESSIONID=0000d8eyYq3L0z2fgq10m4v-rt4:-1`, for the client.
Next, if the tester successfully authenticates to the application with the following POST to `https://www.example.com/authentication.php`:
```
POST /authentication.php HTTP/1.1
Host: www.example.com
[...]
Referer: https://www.example.com
Cookie: JSESSIONID=0000d8eyYq3L0z2fgq10m4v-rt4:-1
Content-Type: application/x-www-form-urlencoded
Content-length: 57

Name=Meucci&wpPassword=secret!&wpLoginattempt=Log+in

```

The tester observes the following response from the server:
```
HTTP/1.1 200 OK
Date: Thu, 14 Aug 2008 14:52:58 GMT
Server: Apache/2.2.2 (Fedora)
X-Powered-By: PHP/5.1.6
Content-language: en
Cache-Control: private, must-revalidate, max-age=0
X-Content-Encoding: gzip
Content-length: 4090
Connection: close
Content-Type: text/html; charset=UTF-8
...
HTML data
...

```

As no new cookie has been issued upon a successful authentication, the tester knows that it is possible to perform session hijacking unless the integrity of the session cookie is ensured.
The tester can send a valid session identifier to a user (possibly using a social engineering trick), wait for them to authenticate, and subsequently verify that privileges have been assigned to this cookie.
### Test with Forced Cookies
This testing strategy is targeted at network attackers, hence it only needs to be applied to sites without full HSTS adoption (sites with full HSTS adoption are secure, since all their cookies have integrity). We assume to have two testing accounts on the site under test, one to act as the victim and one to act as the attacker. We simulate a scenario where the attacker forces in the victim’s browser all the cookies which are not freshly issued after login and do not have integrity. After the victim’s login, the attacker presents the forced cookies to the site to access the victim’s account: if they are enough to act on the victim’s behalf, session fixation is possible.
Here are the steps for executing this test:
  1. Reach the login page of the site.
  2. Save a snapshot of the cookie jar before logging in, excluding cookies which contain the `__Host-` or `__Secure-` prefix in their name.
  3. Login to the site as the victim and reach any page offering a secure function requiring authentication.
  4. Set the cookie jar to the snapshot taken at step 2.
  5. Trigger the secure function identified at step 3.
  6. Observe whether the operation at step 5 has been performed successfully. If so, the attack was successful.
  7. Clear the cookie jar, login as the attacker and reach the page at step 3.
  8. Write in the cookie jar, one by one, the cookies saved at step 2.
  9. Trigger again the secure function identified at step 3.
  10. Clear the cookie jar and login again as the victim.
  11. Observe whether the operation at step 9 has been performed successfully in the victim’s account. If so, the attack was successful; otherwise, the site is secure against session fixation.


We recommend using two different machines or browsers for the victim and the attacker. This allows you to decrease the number of false positives if the web application does fingerprinting to verify access enabled from a given cookie. A shorter but less precise variant of the testing strategy only requires one testing account. It follows the same steps, but it halts at step 6.
## Remediation
Implement a session token renewal after a user successfully authenticates.
The application should always first invalidate the existing session ID before authenticating a user, and if the authentication is successful, provide another session ID.
## Tools
  * [ZAP](https://www.zaproxy.org)


## Spotlight: InfoSecMap
[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)
InfoSecMap is a worldwide directory of InfoSec events and groups, created and maintained by community members and industry professionals. From major conferences to CTFs and local meetups, it features carefully curated, up-to-date content tailored for the InfoSec community. The platform's advanced filtering system allows users to conduct detailed searches across thousands of events, including active Call for Papers, Trainers, Sponsors, and Volunteers. Community-driven and free to use, InfoSecMap is the ultimate resource for staying connected and engaged in InfoSec.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Pynt.png)](https://www.pynt.io/)[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/ZenLogo.png)](http://www.zengroup.co.in)[![image](https://owasp.org/assets/images/corp-member-logo/mindsetters_logo_transparent_web_owasp.png)](http://www.mindsetters.com)[![image](https://owasp.org/assets/images/corp-member-logo/salesforce.png)](https://www.salesforce.com/)[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/ThreatSpikeLabsLogo.png)](https://www.threatspike.com)[![image](https://owasp.org/assets/images/corp-member-logo/Monzo.png)](https://monzo.com/)
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
