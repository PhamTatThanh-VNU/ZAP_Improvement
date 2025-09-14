# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [01-Information Gathering](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/)
# Conduct Search Engine Discovery Reconnaissance for Information Leakage
ID  
---  
WSTG-INFO-01  
## Summary
In order for search engines to work, computer programs (or `robots`) regularly fetch data (referred to as [crawling](https://en.wikipedia.org/wiki/Web_crawler)) from billions of pages on the web. These programs find web content and functionality by following links from other pages, or by looking at sitemaps. If a site uses a special file called `robots.txt` to list pages that it does not want search engines to fetch, then the pages listed there will be ignored. This is a basic overview - Google offers a more in-depth explanation of [how a search engine works](https://support.google.com/webmasters/answer/70897?hl=en).
Testers can use search engines to perform reconnaissance on sites and web applications. There are direct and indirect elements to search engine discovery and reconnaissance: direct methods relate to searching the indexes and the associated content from caches, while indirect methods relate to learning sensitive design and configuration information by searching forums, newsgroups, and tendering sites.
Once a search engine robot has completed crawling, it commences indexing the web content based on tags and associated attributes, such as `<TITLE>`, in order to return relevant search results. If the `robots.txt` file is not updated during the lifetime of the site, and in-line HTML meta tags that instruct robots not to index content have not been used, then it is possible for indexes to contain web content not intended to be included by the owners. Site owners may use the previously mentioned `robots.txt`, HTML meta tags, authentication, and tools provided by search engines to remove such content.
## Test Objectives
  * Identify what sensitive design and configuration information of the application, system, or organization is exposed directly (on the organization’s site) or indirectly (via third-party services).


## How to Test
Use a search engine to search for potentially sensitive information. This may include:
  * network diagrams and configurations;
  * archived posts and emails by administrators or other key staff;
  * logon procedures and username formats;
  * usernames, passwords, and private keys;
  * third-party, or cloud service configuration files;
  * revealing error message content; and
  * non-public applications (development, test, User Acceptance Testing (UAT), and staging versions of sites).


### Search Engines
Do not limit testing to just one search engine provider, as different search engines may generate different results. Search engine results can vary in a few ways, depending on when the engine last crawled content, and the algorithm the engine uses to determine relevant pages. Consider using the following (alphabetically listed) search engines:
  * [Baidu](https://www.baidu.com/), China’s [most popular](https://en.wikipedia.org/wiki/Web_search_engine#Market_share) search engine.
  * [Bing](https://www.bing.com/), a search engine owned and operated by Microsoft, and the second [most popular](https://en.wikipedia.org/wiki/Web_search_engine#Market_share) worldwide. Supports [advanced search keywords](https://help.bing.microsoft.com/#apex/18/en-US/10001/-1).
  * [binsearch.info](https://binsearch.info/), a search engine for binary Usenet newsgroups.
  * [Common Crawl](https://commoncrawl.org/), “an open repository of web crawl data that can be accessed and analyzed by anyone.”
  * [DuckDuckGo](https://duckduckgo.com/), a privacy-focused search engine that compiles results from many different [sources](https://help.duckduckgo.com/results/sources/). Supports [search syntax](https://help.duckduckgo.com/duckduckgo-help-pages/results/syntax/).
  * [Google](https://www.google.com/), which offers the world’s [most popular](https://en.wikipedia.org/wiki/Web_search_engine#Market_share) search engine, and uses a ranking system to attempt to return the most relevant results. Supports [search operators](https://support.google.com/websearch/answer/2466433).
  * [Internet Archive Wayback Machine](https://archive.org/web/), “building a digital library of internet sites and other cultural artifacts in digital form.”
  * [Shodan](https://www.shodan.io/), a service for searching internet-connected devices and services. Usage options include a limited free plan as well as paid subscription plans.


### Search Operators
A search operator is a special keyword or syntax that extends the capabilities of regular search queries, and can help obtain more specific results. They generally take the form of `operator:query`. Here are some commonly supported search operators:
  * `site:` will limit the search to the provided domain.
  * `inurl:` will only return results that include the keyword in the URL.
  * `intitle:` will only return results that have the keyword in the page title.
  * `intext:` or `inbody:` will only search for the keyword in the body of pages.
  * `filetype:` will match only a specific file type, i.e. `.png`, or `.php`.


For example, to find the web content of owasp.org as indexed by a typical search engine, the syntax required is:
```
site:owasp.org

```

![Google Site Operation Search Result Example](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/images/Google_site_Operator_Search_Results_Example_20200406.png)  
_Figure 4.1.1-1: Google Site Operation Search Result Example_
### Viewing Cached Content
To search for content that has previously been indexed, use the `cache:` operator. This is helpful for viewing content that may have changed since the time it was indexed, or that may no longer be available. Not all search engines provide cached content to search; the most useful source at time of writing is Google.
To view `owasp.org` as it is cached, the syntax is:
```
cache:owasp.org

```

![Google Cache Operation Search Result Example](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/images/Google_cache_Operator_Search_Results_Example_20200406.png)  
_Figure 4.1.1-2: Google Cache Operation Search Result Example_
### Google Hacking or Dorking
Searching with operators can be a very effective discovery technique when combined with the creativity of the tester. Operators can be chained to effectively discover specific kinds of sensitive files and information. This technique, called [Google hacking](https://en.wikipedia.org/wiki/Google_hacking) or Dorking, is also possible using other search engines, as long as the search operators are supported.
A database of dorks, like the [Google Hacking Database](https://www.exploit-db.com/google-hacking-database), is a useful resource that can help uncover specific information. Some categories of dorks available on this database include:
  * Footholds
  * Files containing usernames
  * Sensitive Directories
  * Web Server Detection
  * Vulnerable Files
  * Vulnerable Servers
  * Error Messages
  * Files containing juicy info
  * Files containing passwords
  * Sensitive Online Shopping Info


## Remediation
Carefully consider the sensitivity of design and configuration information before it is posted online.
Periodically review the sensitivity of existing design and configuration information that is posted online.
* * *
[Edit on GitHub](https://github.com/OWASP/www-project-web-security-testing-guide/blob/master/latest/4-Web_Application_Security_Testing/01-Information_Gathering/01-Conduct_Search_Engine_Discovery_Reconnaissance_for_Information_Leakage.md)
**The OWASP ® Foundation** works to improve the security of software through its community-led open source software projects, hundreds of chapters worldwide, tens of thousands of members, and by hosting local and global conferences. 
## Spotlight: Salesforce
[![image](https://owasp.org/assets/images/corp-member-logo/salesforce.png)](https://www.salesforce.com/)
Salesforce is the world’s (#)1 customer relationship management (CRM) platform. Our cloud-based applications for sales, service, marketing, and more don’t require IT experts to set up or manage — simply log in and start connecting to customers in a whole new way.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)[![image](https://owasp.org/assets/images/corp-member-logo/Backslash-logo.png)](https://www.backslash.security/?utm_campaign=Launch&utm_source=owasp-sponsorship&utm_medium=banner&utm_content=homepage)[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)[![image](https://owasp.org/assets/images/corp-member-logo/BlackDuck.png)](https://www.blackduck.com/)[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/sq1_logo_dark_version.png)](https://www.sq1.security)[![image](https://owasp.org/assets/images/corp-member-logo/UnboundSecurity.png)](https://unboundsecurity.ai/)
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
