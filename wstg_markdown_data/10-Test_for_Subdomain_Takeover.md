# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [02-Configuration and Deployment Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/)
# Test for Subdomain Takeover
ID  
---  
WSTG-CONF-10  
## Summary
A successful exploitation of this kind of vulnerability allows an adversary to claim and take control of the victim’s subdomain. This attack relies on the following:
  1. The victim’s external DNS server subdomain record is configured to point to a non-existing or non-active resource/external service/endpoint. The proliferation of XaaS (Anything as a Service) products and public cloud services offer a lot of potential targets to consider.
  2. The service provider hosting the resource/external service/endpoint does not handle subdomain ownership verification properly.


If the subdomain takeover is successful, a wide variety of attacks are possible (serving malicious content, phishing, stealing user session cookies, credentials, etc.). This vulnerability could be exploited for a wide variety of DNS resource records including: `A`, `CNAME`, `MX`, `NS`, `TXT` etc. In terms of the attack severity, an `NS` subdomain takeover (although less likely) has the highest impact, because a successful attack could result in full control over the whole DNS zone and the victim’s domain.
### GitHub
  1. The victim (victim.com) uses GitHub for development and configured a DNS record (`coderepo.victim.com`) to access it.
  2. The victim decides to migrate their code repository from GitHub to a commercial platform and does not remove `coderepo.victim.com` from their DNS server.
  3. An adversary discovers that `coderepo.victim.com` is hosted on GitHub and claims it using GitHub Pages and their own GitHub account.


### Expired Domain
  1. The victim (victim.com) owns another domain (victimotherdomain.com) and uses a CNAME record (www) to reference the other domain (`www.victim.com` –> `victimotherdomain.com`)
  2. At some point, victimotherdomain.com expires, becoming available for registration by anyone. Since the CNAME record is not deleted from the victim.com DNS zone, anyone who registers `victimotherdomain.com` has full control over `www.victim.com` until the DNS record is removed or updated.


## Test Objectives
  * Enumerate all possible domains (previous and current).
  * Identify any forgotten or misconfigured domains.


## How to Test
### Black-Box Testing
The first step is to enumerate the victim DNS servers and resource records. There are multiple ways to accomplish this task; for example, DNS enumeration using a list of common subdomains dictionary, DNS brute force or using web search engines and other OSINT data sources.
Using the dig command the tester looks for the following DNS server response messages that warrant further investigation:
  * `NXDOMAIN`
  * `SERVFAIL`
  * `REFUSED`
  * `no servers could be reached.`


#### Testing DNS A, CNAME Record Subdomain Takeover
Perform a basic DNS enumeration on the victim’s domain (`victim.com`) using `dnsrecon`:
```
$ ./dnsrecon.py -d victim.com
[*] Performing General Enumeration of Domain: victim.com
...
[-] DNSSEC is not configured for victim.com
[*]      A subdomain.victim.com 192.30.252.153
[*]      CNAME subdomain1.victim.com fictioussubdomain.victim.com
...

```

Identify which DNS resource records are dead and point to inactive/not-used services. Using the dig command for the `CNAME` record:
```
$ dig CNAME fictioussubdomain.victim.com
; <<>> DiG 9.10.3-P4-Ubuntu <<>> ns victim.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 42950
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

```

The following DNS responses warrant further investigation: `NXDOMAIN`.
To test the `A` record the tester performs a whois database lookup and identifies GitHub as the service provider:
```
$ whois 192.30.252.153 | grep "OrgName"
OrgName: GitHub, Inc.

```

The tester visits `subdomain.victim.com` or issues a HTTP GET request which returns a “404 - File not found” response which is a clear indication of the vulnerability.
![GitHub 404 File Not Found response](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/images/subdomain_takeover_ex1.jpeg)  
_Figure 4.2.10-1: GitHub 404 File Not Found response_
The tester claims the domain using GitHub Pages:
![GitHub claim domain](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/images/subdomain_takeover_ex2.jpeg)  
_Figure 4.2.10-2: GitHub claim domain_
#### Testing NS Record Subdomain Takeover
Identify all nameservers for the domain in scope:
```
$ dig ns victim.com +short
ns1.victim.com
nameserver.expireddomain.com

```

In this fictitious example, the tester checks if the domain `expireddomain.com` is active with a domain registrar search. If the domain is available for purchase the subdomain is vulnerable.
The following DNS responses warrant further investigation: `SERVFAIL` or `REFUSED`.
### Gray-Box Testing
The tester has the DNS zone file available, which means DNS enumeration is not necessary. The testing methodology is the same.
## Remediation
To mitigate the risk of subdomain takeover, the vulnerable DNS resource record(s) should be removed from the DNS zone. Continuous monitoring and periodic checks are recommended as best practice.
## Tools
  * [dig - man page](https://linux.die.net/man/1/dig)
  * [recon-ng - Web Reconnaissance framework](https://github.com/lanmaster53/recon-ng)
  * [theHarvester - OSINT intelligence gathering tool](https://github.com/laramies/theHarvester)
  * [Sublist3r - OSINT subdomain enumeration tool](https://github.com/aboul3la/Sublist3r)
  * [dnsrecon - DNS Enumeration Script](https://github.com/darkoperator/dnsrecon)
  * [OWASP Amass DNS enumeration](https://github.com/OWASP/Amass)
  * [OWASP Domain Protect](https://owasp.org/www-project-domain-protect)


## Spotlight: DevSecAI
[![image](https://owasp.org/assets/images/corp-member-logo/DevSecAI.png)](http://www.devsecai.io)
The DevSecAI Platform helps organisations securely design, build, and deploy AI systems by embedding security best practices across the entire AI/ML lifecycle-covering data handling, model training, deployment, and post-deployment monitoring. Every customer is also assigned an embedded DevSecAI engineer to fine-tune platform results. We are a global security consultancy that also provides AI Security Advisory services which are also automated and integrated within our DevSecAI Platform.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Equixly.png)](https://equixly.com)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)[![image](https://owasp.org/assets/images/corp-member-logo/SecureCodeWarrior.png)](https://www.securecodewarrior.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)
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
