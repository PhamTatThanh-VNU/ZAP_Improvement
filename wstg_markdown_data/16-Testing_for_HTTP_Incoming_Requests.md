# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [07-Input Validation Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/)
# Testing for HTTP Incoming Requests
ID  
---  
WSTG-INPV-16  
## Summary
This section describes how to monitor all incoming/outgoing HTTP requests on both client-side or server-side. The purpose of this testing is to verify if there is unnecessary or suspicious HTTP request sending in the background.
Most of Web security testing tools (i.e. AppScan, BurpSuite, ZAP) act as HTTP Proxy. This will require changes of proxy on client-side application or browser. The testing techniques listed below is primary focused on how we can monitor HTTP requests without changes of client-side which will be more close to production usage scenario.
## Test Objectives
  * Monitor all incoming and outgoing HTTP requests to the Web Server to inspect any suspicious requests.
  * Monitor HTTP traffic without changes of end user Browser proxy or client-side application.


## How to Test
### Reverse Proxy
There is situation that we would like to monitor all HTTP incoming requests on web server but we can’t change configuration on the browser or application client-side. In this scenario, we can setup a reverse proxy on web server end to monitor all incoming/outgoing requests on web server.
For windows platform, Fiddler Classic is recommended. It provides not only monitor but can also edit/reply the HTTP requests. Refer to [this reference for how to configure Fiddler as reverse Proxy](https://docs.telerik.com/fiddler/configure-fiddler/tasks/usefiddlerasreverseproxy)
For Linux platform, Charles Web Debugging Proxy may be used.
The testing steps:
  1. Install Fiddler or Charles on Web Server
  2. Configure the Fiddler or Charles as Reverse Proxy
  3. Capture the HTTP traffic
  4. Inspect HTTP traffic
  5. Modify HTTP requests and replay the modified requests for testing


### Port Forwarding
Port forwarding is another way to allow us intercept HTTP requests without changes of client-side. You can also use Charles as a SOCKS proxy to act as port forwarding or uses of Port Forwarding tools. It will allow us to forward all coming client-side captured traffic to web server port.
The testing flow will be:
  1. Install the Charles or port forwarding on another machine or web Server
  2. Configure the Charles as Socks proxy as port forwarding.


### TCP-level Network Traffic Capture
This technique monitor all the network traffic at TCP-level. TCPDump or WireShark tools can be used. However, these tools don’t allow us edit the captured traffic and send modified HTTP requests for testing. To replay the captured traffic (PCAP) packets, Ostinato can be used.
The testing steps will be:
  1. Activate TCPDump or WireShark on Web Server to capture network traffic
  2. Monitor the captured files (PCAP)
  3. Edit PCAP files by Ostinato tool based on need
  4. Reply the HTTP requests


Fiddler or Charles are recommended since these tools can capture HTTP traffic and also easily edit/reply the modified HTTP requests. In addition, if the web traffic is HTTPS, the wireshark will need to import the web server private key to inspect the HTTPS message body. Otherwise, the HTTPS message body of the captured traffic will all be encrypted.
## Tools
  * [Fiddler](https://www.telerik.com/fiddler/)
  * [TCPProxy](https://grinder.sourceforge.net/g3/tcpproxy.html)
  * [Charles Web Debugging Proxy](https://www.charlesproxy.com/)
  * [WireShark](https://www.wireshark.org/)
  * [PowerEdit-Pcap](https://sourceforge.net/projects/powereditpcap/)
  * [pcapteller](https://github.com/BlackArch/pcapteller)
  * [replayproxy](https://github.com/sparrowt/replayproxy)
  * [Ostinato](https://ostinato.org/)


## Spotlight: Equixly
[![image](https://owasp.org/assets/images/corp-member-logo/Equixly.png)](https://equixly.com)
Equixly helps developers and organizations create more secure applications, increase their security posture, and spread knowledge of new vulnerabilities. Equixly offers a SaaS platform that allows integrating API security testing within the software development lifecycle (SLDC) to detect flaws, reduce bug-fixing costs, and exponentially scale penetration testing upon every new functionality released. The platform can automatically perform API attacks leveraging a novel machine learning (ML) algorithm trained over thousands of security tests. Then, Equixly returns near-real-time results and a predictive remediation plan that developers can use to fix their application issues autonomously.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)[![image](https://owasp.org/assets/images/corp-member-logo/SCSK.jpeg)](https://www.scsk.jp/)[![image](https://owasp.org/assets/images/corp-member-logo/SecureCodeWarrior.png)](https://www.securecodewarrior.com/)[![image](https://owasp.org/assets/images/corp-member-logo/GuardSquare.png)](https://www.guardsquare.com/)[![image](https://owasp.org/assets/images/corp-member-logo/promon_logo_dark.png)](http://promon.co)[![image](https://owasp.org/assets/images/corp-member-logo/Cybozu.png)](https://cybozu.co.jp/en/company/)[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)[![image](https://owasp.org/assets/images/corp-member-logo/GuidePoint.png)](https://www.guidepointsecurity.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Vijil.png)](https://vijil.ai)
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
