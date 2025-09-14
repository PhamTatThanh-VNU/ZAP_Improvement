# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [09-Testing for Weak Cryptography](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/)
# Testing for Weak Encryption
ID  
---  
WSTG-CRYP-04  
## Summary
Incorrect uses of encryption algorithms may result in sensitive data exposure, key leakage, broken authentication, insecure session, and spoofing attacks. There are some encryption or hash algorithms known to be weak and are not suggested for use such as MD5 and RC4.
In addition to the right choices of secure encryption or hash algorithms, the right uses of parameters also matter for the security level. For example, ECB (Electronic Code Book) mode generally should not be used.
## Test Objectives
  * Provide a guideline for the identification weak encryption or hashing uses and implementations.


## How to Test
### Basic Security Checklist
  * When using AES128 or AES256, the IV (Initialization Vector) must be random and unpredictable. Refer to [FIPS 140-2, Security Requirements for Cryptographic Modules](https://csrc.nist.gov/publications/detail/fips/140/2/final), section 4.9.1. random number generator tests. For example, in Java, `java.util.Random` is considered a weak random number generator. `java.security.SecureRandom` should be used instead of `java.util.Random`.
  * For asymmetric encryption, use Elliptic Curve Cryptography (ECC) with a secure curve like `Curve25519` preferred. 
    * If ECC can’t be used then use RSA encryption with a minimum 2048bit key.
  * When uses of RSA in signature, PSS padding is recommended.
  * Weak hash/encryption algorithms should not be used such MD5, RC4, DES, Blowfish, SHA1. 1024-bit RSA or DSA, 160-bit ECDSA (elliptic curves), 80/112-bit 2TDEA (two key triple DES)
  * Minimum Key length requirements:


```
Key exchange: Diffie–Hellman key exchange with minimum 2048 bits
Message Integrity: HMAC-SHA2
Message Hash: SHA2 256 bits
Asymmetric encryption: RSA 2048 bits
Symmetric-key algorithm: AES 128 bits
Password Hashing: PBKDF2, Scrypt, Bcrypt
ECDH, ECDSA: 256 bits

```

  * Uses of SSH, CBC mode should not be used.
  * When symmetric encryption algorithm is used, ECB (Electronic Code Book) mode should not be used.
  * When PBKDF2 is used to hash password, the parameter of iteration is recommended to be over 10000. [NIST](https://pages.nist.gov/800-63-3/sp800-63b.html#sec5) also suggests at least 10,000 iterations of the hash function. In addition, MD5 hash function is forbidden to be used with PBKDF2 such as PBKDF2WithHmacMD5.


### Source Code Review
  * Search for the following keywords to identify use of weak algorithms: `MD4, MD5, RC4, RC2, DES, Blowfish, SHA-1, ECB`
  * For Java implementations, the following API is related to encryption. Review the parameters of the encryption implementation. For example,


```
SecretKeyFactory(SecretKeyFactorySpikeyFacSpi,Providerprovider,Stringalgorithm)
SecretKeySpec(byte[]key,intoffset,intlen,Stringalgorithm)
Cipherc=Cipher.getInstance("DES/CBC/PKCS5Padding");

```

  * For RSA encryption, the following padding modes are suggested.


```
RSA/ECB/OAEPWithSHA-1AndMGF1Padding (2048)
RSA/ECB/OAEPWithSHA-256AndMGF1Padding (2048)

```

  * Search for `ECB`, it’s not allowed to be used in padding.
  * Review if different IV (initial Vector) is used.


```
// Use a different IV value for every encryption
byte[]newIv=...;
s=newGCMParameterSpec(s.getTLen(),newIv);
cipher.init(...,s);
...

```

  * Search for `IvParameterSpec`, check if the IV value is generated differently and randomly.


```
IvParameterSpeciv=newIvParameterSpec(randBytes);
SecretKeySpecskey=newSecretKeySpec(key.getBytes(),"AES");
Ciphercipher=Cipher.getInstance("AES/CBC/PKCS5Padding");
cipher.init(Cipher.ENCRYPT_MODE,skey,iv);

```

  * In Java, search for MessageDigest to check if weak hash algorithm (MD5 or CRC) is used. For example:


`MessageDigest md5 = MessageDigest.getInstance("MD5");`
  * For signature, SHA1 and MD5 should not be used. For example:


`Signature sig = Signature.getInstance("SHA1withRSA");`
  * Search for `PBKDF2`. To generate the hash value of password, `PBKDF2` is suggested to be used. Review the parameters to generate the `PBKDF2` has value.


The iterations should be over **10000** , and the **salt** value should be generated as **random value**.
```
privatestaticbyte[]pbkdf2(char[]password,byte[]salt,intiterations,intbytes)
throwsNoSuchAlgorithmException,InvalidKeySpecException
{
PBEKeySpecspec=newPBEKeySpec(password,salt,iterations,bytes*8);
SecretKeyFactoryskf=SecretKeyFactory.getInstance(PBKDF2_ALGORITHM);
returnskf.generateSecret(spec).getEncoded();
}

```

  * Hard-coded sensitive information:


```
User related keywords: name, root, su, sudo, admin, superuser, login, username, uid
Key related keywords: public key, AK, SK, secret key, private key, passwd, password, pwd, share key, shared key, cryto, base64
Other common sensitive keywords: sysadmin, root, privilege, pass, key, code, master, admin, uname, session, token, Oauth, privatekey, shared secret

```

## Tools
  * Vulnerability scanners such as Nessus, NMAP (scripts), or OpenVAS can scan for use or acceptance of weak encryption against protocol such as SNMP, TLS, SSH, SMTP, etc.
  * Use static code analysis tool to do source code review such as klocwork, Fortify, Coverity, CheckMark for the following cases.


```
CWE-261: Weak Cryptography for Passwords
CWE-323: Reusing a Nonce, Key Pair in Encryption
CWE-326: Inadequate Encryption Strength
CWE-327: Use of a Broken or Risky Cryptographic Algorithm
CWE-328: Reversible One-Way Hash
CWE-329: Not Using a Random IV with CBC Mode
CWE-330: Use of Insufficiently Random Values
CWE-347: Improper Verification of Cryptographic Signature
CWE-354: Improper Validation of Integrity Check Value
CWE-547: Use of Hard-coded, Security-relevant Constants
CWE-780: Use of RSA Algorithm without OAEP

```

## Spotlight: InfoSecMap
[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)
InfoSecMap is a worldwide directory of InfoSec events and groups, created and maintained by community members and industry professionals. From major conferences to CTFs and local meetups, it features carefully curated, up-to-date content tailored for the InfoSec community. The platform's advanced filtering system allows users to conduct detailed searches across thousands of events, including active Call for Papers, Trainers, Sponsors, and Volunteers. Community-driven and free to use, InfoSecMap is the ultimate resource for staying connected and engaged in InfoSec.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/Backslash-logo.png)](https://www.backslash.security/?utm_campaign=Launch&utm_source=owasp-sponsorship&utm_medium=banner&utm_content=homepage)[![image](https://owasp.org/assets/images/corp-member-logo/Checkmarxn-NewLogo2024.jpg)](http://checkmarx.com)[![image](https://owasp.org/assets/images/corp-member-logo/SKUDONET.png)](https://www.skudonet.com)[![image](https://owasp.org/assets/images/corp-member-logo/bionic_logo_1.png)](https://www.bionic.ai/)[![image](https://owasp.org/assets/images/corp-member-logo/Arnica.png)](https://www.arnica.io)[![image](https://owasp.org/assets/images/corp-member-logo/GitGuardian1.png)](http://gitguardian.com)[![image](https://owasp.org/assets/images/corp-member-logo/Adobe.png)](http://trust.adobe.com)[![image](https://owasp.org/assets/images/corp-member-logo/Zimperiumlogo_300x90px.jpeg)](https://www.zimperium.com/)[![image](https://owasp.org/assets/images/corp-member-logo/salesforce.png)](https://www.salesforce.com/)
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
