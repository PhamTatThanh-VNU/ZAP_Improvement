# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [10-Business Logic Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/10-Business_Logic_Testing/)
# Test Upload of Unexpected File Types
ID  
---  
WSTG-BUSL-08  
## Summary
Many applications’ business processes allow for the upload and manipulation of data that is submitted via files. But the business process must check the files and only allow certain “approved” file types. Deciding what files are “approved” is determined by the business logic and is application/system specific. The risk is that by allowing users to upload files, attackers may submit an unexpected file type that could be executed and adversely impact the application or system through attacks that may deface the site, perform remote commands, browse the system files, browse the local resources, attack other servers, or exploit the local vulnerabilities, just to name a few.
Vulnerabilities related to the upload of unexpected file types is unique in that the upload should quickly reject a file if it does not have a specific extension. Additionally, this is different from uploading malicious files in that in most cases an incorrect file format may not by it self be inherently “malicious” but may be detrimental to the saved data. For example if an application accepts Windows Excel files, if a similar database file is uploaded it may be read but data extracted my be moved to incorrect locations.
The application may be expecting only certain file types to be uploaded for processing, such as `.csv` or `.txt` files. The application may not validate the uploaded file by extension (for low assurance file validation) or content (high assurance file validation). This may result in unexpected system or database results within the application/system or give attackers additional methods to exploit the application/system.
### Example
Suppose a picture sharing application allows users to upload a `.gif` or `.jpg` graphic file to the site. What if an attacker is able to upload an HTML file with a `<script>` tag in it or PHP file? The system may move the file from a temporary location to the final location where the PHP code can now be executed against the application or system.
## Test Objectives
  * Review the project documentation for file types that are rejected by the system.
  * Verify that the unwelcomed file types are rejected and handled safely.
  * Verify that file batch uploads are secure and do not allow any bypass against the set security measures.


## How to Test
### Specific Testing Method
  * Study the applications logical requirements.
  * Prepare a library of files that are “not approved” for upload that may contain files such as: jsp, exe, or HTML files containing script.
  * In the application navigate to the file submission or upload mechanism.
  * Submit the “not approved” file for upload and verify that they are properly prevented from uploading
  * Check if the site only does file type checks in client-side JavaScript
  * Check if the site only checks the file type by “Content-Type” in HTTP request.
  * Check if the site only checks the file type by the file extension.
  * Check if other uploaded files can be accessed directly by specified URL.
  * Check if the uploaded file can include code or script injection.
  * Check if there is any file path checking for uploaded files. Especially, hackers may compress files with specified path in ZIP so that the extracted files can be uploaded to intended path after uploading and unzipping.


## Related Test Cases
  * [Test File Extensions Handling for Sensitive Information](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/03-Test_File_Extensions_Handling_for_Sensitive_Information)
  * [Test Upload of Malicious Files](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/10-Business_Logic_Testing/09-Test_Upload_of_Malicious_Files)


## Remediation
Applications should be developed with mechanisms to only accept and manipulate “acceptable” files that the rest of the application functionality is ready to handle and expecting. Some specific examples include: deny lists or allow lists of file extensions, using “Content-Type” from the header, or using a file type recognizer, all to only allow specified file types into the system.
## Spotlight: Bloomberg
[![image](https://owasp.org/assets/images/corp-member-logo/Bloomberg.png)](https://www.bloomberg.com/company/values/tech-at-bloomberg/)
Bloomberg is a global leader in business and financial information, delivering trusted data, news, and insights that bring transparency, efficiency, and fairness to markets. The company helps connect influential communities across the global financial ecosystem via reliable technology solutions that enable our customers to make more informed decisions and foster better collaboration.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/SCSK.jpeg)](https://www.scsk.jp/)[![image](https://owasp.org/assets/images/corp-member-logo/Adobe.png)](http://trust.adobe.com)[![image](https://owasp.org/assets/images/corp-member-logo/invicti_logo_300x90_black.png)](https://www.invicti.com/)[![image](https://owasp.org/assets/images/corp-member-logo/InfoSecMap-logo-small.png)](https://infosecmap.com)[![image](https://owasp.org/assets/images/corp-member-logo/Root.png)](https://www.root.io/)[![image](https://owasp.org/assets/images/corp-member-logo/GuardSquare.png)](https://www.guardsquare.com/)[![image](https://owasp.org/assets/images/corp-member-logo/hitachien.png)](https://www.hitachi-systems.com/eng/index.html)[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)[![image](https://owasp.org/assets/images/corp-member-logo/fortify__logo__normal2x_1.png)](https://www.microfocus.com/en-us/cyberres/application-security)
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
