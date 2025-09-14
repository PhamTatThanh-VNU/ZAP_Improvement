# WSTG - Latest
[Home](https://owasp.org/www-project-web-security-testing-guide/) > [Latest](https://owasp.org/www-project-web-security-testing-guide/latest/) > [4-Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/) > [02-Configuration and Deployment Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/)
# Test Cloud Storage
ID  
---  
WSTG-CONF-11  
## Summary
Cloud storage services allow web applications and services to store and access objects in the storage service. Improper access control configuration, however, may lead to the exposure of sensitive information, data tampering, or unauthorized access.
A known example is where an Amazon S3 bucket is misconfigured, although the other cloud storage services may also be exposed to similar risks. By default, all S3 buckets are private and can be accessed only by users who are explicitly granted access. Users can grant public access not only to the bucket itself but also to individual objects stored within that bucket. This may lead to an unauthorized user being able to upload new files, modify or read stored files.
## Test Objectives
  * Assess that the access control configuration for the storage services is properly in place.


## How to Test
First, identify the URL to access the data in the storage service, and then consider the following tests:
  * read unauthorized data
  * upload a new arbitrary file


You may use curl for the tests with the following commands and see if unauthorized actions can be performed successfully.
To test the ability to read an object:
```
curl -X GET https://<cloud-storage-service>/<object>

```

To test the ability to upload a file:
```
curl -X PUT -d 'test' 'https://<cloud-storage-service>/test.txt'

```

In the above command, it is recommended to replace the single quotes (‘) with double quotes (“) when running the command on a Windows machine.
### Testing for Amazon S3 Bucket Misconfiguration
The Amazon S3 bucket URLs follow one of two formats, either virtual host style or path-style.
  * Virtual Hosted Style Access


```
https://bucket-name.s3.Region.amazonaws.com/key-name

```

In the following example, `my-bucket` is the bucket name, `us-west-2` is the region, and `puppy.png` is the key-name:
```
https://my-bucket.s3.us-west-2.amazonaws.com/puppy.png

```

  * Path-Style Access


```
https://s3.Region.amazonaws.com/bucket-name/key-name

```

As above, in the following example, `my-bucket` is the bucket name, `us-west-2` is the region, and `puppy.png` is the key-name:
```
https://s3.us-west-2.amazonaws.com/my-bucket/puppy.png

```

For some regions, the legacy global endpoint that does not specify a region-specific endpoint can be used. Its format is also either virtual hosted style or path-style.
  * Virtual Hosted Style Access


```
https://bucket-name.s3.amazonaws.com

```

  * Path-Style Access


```
https://s3.amazonaws.com/bucket-name

```

#### Identify Bucket URL
For black-box testing, S3 URLs can be found in the HTTP messages. The following example shows a bucket URL is sent in the `img` tag in an HTTP response.
```
...
<img src="https://my-bucket.s3.us-west-2.amazonaws.com/puppy.png">
...

```

For gray-box testing, you can obtain bucket URLs from Amazon’s web interface, documents, source code, and any other available sources.
#### Testing with AWS-CLI
In addition to testing with curl, you can also test with the AWS command-line tool. In this case `s3://` URI scheme is used.
##### List
The following command lists all the objects of the bucket when it is configured public:
```
aws s3 ls s3://<bucket-name>

```

##### Upload
The following is the command to upload a file:
```
aws s3 cp arbitrary-file s3://bucket-name/path-to-save

```

This example shows the result when the upload has been successful.
```
$ aws s3 cp test.txt s3://bucket-name/test.txt
upload: ./test.txt to s3://bucket-name/test.txt

```

This example shows the result when the upload has failed.
```
$ aws s3 cp test.txt s3://bucket-name/test.txt
upload failed: ./test2.txt to s3://bucket-name/test2.txt An error occurred (AccessDenied) when calling the PutObject operation: Access Denied

```

##### Remove
The following is the command to remove an object:
```
aws s3 rm s3://bucket-name/object-to-remove

```

## Tools
  * [AWS CLI](https://aws.amazon.com/cli/)


## Spotlight: Backslash
[![image](https://owasp.org/assets/images/corp-member-logo/Backslash-logo.png)](https://www.backslash.security/?utm_campaign=Launch&utm_source=owasp-sponsorship&utm_medium=banner&utm_content=homepage)
Backslash is the first Cloud-Native Application Security solution for enterprise AppSec teams to provide unified security and business context to cloud-native code risk, coupled with automated threat modeling, code risk prioritization, and simplified remediation across applications and teams. With Backslash, AppSec teams can see and easily act upon the critical toxic code flows in their cloud-native applications; quickly prioritize code risks based on the relevant cloud context; and significantly cut MTTR (mean time to recovery) by enabling developers with the evidence they need to take ownership of the process.
## Corporate Supporters
[![image](https://owasp.org/assets/images/corp-member-logo/AppDome.png)](https://www.appdome.com/)[![image](https://owasp.org/assets/images/corp-member-logo/sq1_logo_dark_version.png)](https://www.sq1.security)[![image](https://owasp.org/assets/images/corp-member-logo/Salt_Security.png)](https://salt.security/)[![image](https://owasp.org/assets/images/corp-member-logo/atlassian-logo-gradient-horizontal-blue@2x.png)](https://www.atlassian.com)[![image](https://owasp.org/assets/images/corp-member-logo/Vijil.png)](https://vijil.ai)[![image](https://owasp.org/assets/images/corp-member-logo/Zelvin.jpg)](https://zelvin.com)[![image](https://owasp.org/assets/images/corp-member-logo/Automattic.png)](https://automattic.com/)[![image](https://owasp.org/assets/images/corp-member-logo/approach_logo.png)](http://www.approach-cyber.com)[![image](https://owasp.org/assets/images/corp-member-logo/securityjourney_300x90.png)](http://www.SecurityJourney.com)
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
