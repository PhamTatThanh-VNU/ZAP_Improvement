# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [09-Testing for Weak Cryptography](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/)
# Testing for Padding Oracle
ID  
---  
WSTG-CRYP-02  
## Summary
A padding oracle is a function of an application which decrypts encrypted data provided by the client, e.g. internal session state stored on the client, and leaks the state of the validity of the padding after decryption. The existence of a padding oracle allows an attacker to decrypt encrypted data and encrypt arbitrary data without knowledge of the key used for these cryptographic operations. This can lead to leakage of sensitive data or to privilege escalation vulnerabilities, if integrity of the encrypted data is assumed by the application.
Block ciphers encrypt data only in blocks of certain sizes. Block sizes used by common ciphers are 8 and 16 bytes. Data where the size doesn’t match a multiple of the block size of the used cipher has to be padded in a specific manner so the decryptor is able to strip the padding. A commonly used padding scheme is PKCS#7. It fills the remaining bytes with the value of the padding length.
### Example 1
If the padding has the length of 5 bytes, the byte value `0x05` is repeated five times after the plain text.
An error condition is present if the padding doesn’t match the syntax of the used padding scheme. A padding oracle is present if an application leaks this specific padding error condition for encrypted data provided by the client. This can happen by exposing exceptions (e.g. `BadPaddingException` in Java) directly, by subtle differences in the responses sent to the client or by another side-channel like timing behavior.
Certain modes of operation of cryptography allow bit-flipping attacks, where flipping of a bit in the cipher text causes that the bit is also flipped in the plain text. Flipping a bit in the n-th block of CBC encrypted data causes that the same bit in the (n+1)-th block is flipped in the decrypted data. The n-th block of the decrypted cipher text is garbaged by this manipulation.
The padding oracle attack enables an attacker to decrypt encrypted data without knowledge of the encryption key and used cipher by sending skillful manipulated cipher texts to the padding oracle and observing of the results returned by it. This causes loss of confidentiality of the encrypted data. E.g. in the case of session data stored on the client-side the attacker can gain information about the internal state and structure of the application.
A padding oracle attack also enables an attacker to encrypt arbitrary plain texts without knowledge of the used key and cipher. If the application assumes that integrity and authenticity of the decrypted data is given, an attacker could be able to manipulate internal session state and possibly gain higher privileges.
## Test Objectives
  * Identify encrypted messages that rely on padding.
  * Attempt to break the padding of the encrypted messages and analyze the returned error messages for further analysis.


## How to Test
### Black-Box Testing
First the possible input points for padding oracles must be identified. Generally the following conditions must be met:
  1. The data is encrypted. Good candidates are values which appear to be random.
  2. A block cipher is used. The length of the decoded (Base64 is used often) cipher text is a multiple of common cipher block sizes like 8 or 16 bytes. Different cipher texts (e.g. gathered by different sessions or manipulation of session state) share a common divisor in the length.


#### Example 2
`Dg6W8OiWMIdVokIDH15T/A==` results after base64 decoding in `0e 0e 96 f0 e8 96 30 87 55 a2 42 03 1f 5e 53 fc`. This seems to be random and 16 byte long.
If such an input value candidate is identified, the behavior of the application to bit-wise tampering of the encrypted value should be verified. Normally this base64 encoded value will include the initialization vector (IV) prepended to the cipher text. Given a plaintext _`p`_and a cipher with a block size _`n`_, the number of blocks will be _`b = ceil( length(p) / n)`_. The length of the encrypted string will be _`y=(b+1)*n`_due to the initialization vector. To verify the presence of the oracle, decode the string, flip the last bit of the second-to-last block _`b-1`_(the least significant bit of the byte at _`y-n-1`_), re-encode and send. Next, decode the original string, flip the last bit of the block _`b-2`_(the least significant bit of the byte at _`y-2*n-1`_), re-encode and send.
If it is known that the encrypted string is a single block (the IV is stored on the server or the application is using a bad practice hardcoded IV), several bit flips must be performed in turn. An alternative approach could be to prepend a random block, and flip bits in order to make the last byte of the added block take all possible values (0 to 255).
The tests and the base value should at least cause three different states while and after decryption:
  * Cipher text gets decrypted, resulting data is correct.
  * Cipher text gets decrypted, resulting data is garbled and causes some exception or error handling in the application logic.
  * Cipher text decryption fails due to padding errors.


Compare the responses carefully. Search especially for exceptions and messages which state that something is wrong with the padding. If such messages appear, the application contains a padding oracle. If the three different states described above are observable implicitly (different error messages, timing side-channels), there is a high probability that there is a padding oracle present at this point. Try to perform the padding oracle attack to ensure this.
##### Example 3
  * ASP.NET throws `System.Security.Cryptography.CryptographicException: Padding is invalid and cannot be removed.` if padding of a decrypted cipher text is broken.
  * In Java a `javax.crypto.BadPaddingException` is thrown in this case.
  * Decryption errors or similar can be possible padding oracles.


> A secure implementation will check for integrity and cause only two responses: `ok` and `failed`. There are no side channels which can be used to determine internal error states.
### Gray-Box Testing
Verify that all places where encrypted data from the client, that should only be known by the server, is decrypted. The following conditions should be met by such code:
  1. The integrity of the cipher text should be verified by a secure mechanism, like HMAC or authenticated cipher operation modes like GCM or CCM.
  2. All error states while decryption and further processing are handled uniformly.


### Example 4
[Visualization of the decryption process](https://erlend.oftedal.no/blog/poet/)
## Tools
  * [Bletchley](https://code.blindspotsecurity.com/trac/bletchley)
  * [PadBuster](https://github.com/GDSSecurity/PadBuster)
  * [Poracle](https://github.com/iagox86/Poracle)
  * [python-paddingoracle](https://github.com/mwielgoszewski/python-paddingoracle)


## Spotlight: InfoSecMap
[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)
InfoSecMap is a worldwide directory of InfoSec events and groups, created and maintained by community members and industry professionals. From major conferences to CTFs and local meetups, it features carefully curated, up-to-date content tailored for the InfoSec community. The platform's advanced filtering system allows users to conduct detailed searches across thousands of events, including active Call for Papers, Trainers, Sponsors, and Volunteers. Community-driven and free to use, InfoSecMap is the ultimate resource for staying connected and engaged in InfoSec.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Backslash-logo.png)](https://www.backslash.security/?utm_campaign=Launch&utm_source=owasp-sponsorship&utm_medium=banner&utm_content=homepage)[![image](https://owasp.org/assets/images/corp-member-logo/salesforce.png)](https://www.salesforce.com/)[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)[![image](https://owasp.org/assets/images/corp-member-logo/SecureFlag.png)](https://www.secureflag.com/)[![image](https://owasp.org/assets/images/corp-member-logo/IriusRisk.png)](https://www.iriusrisk.com/)[![image](https://owasp.org/assets/images/corp-member-logo/Traefik.png)](https://traefik.io/)[![image](https://owasp.org/assets/images/corp-member-logo/Digital.png)](http://digital.ai)[![image](https://owasp.org/assets/images/corp-member-logo/Scitum.png)](https://www.scitum.com.mx/)[![image](https://owasp.org/assets/images/corp-member-logo/Automattic.png)](https://automattic.com/)
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
