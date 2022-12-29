Chrome extension to bulk edit environment variables in amazon web services elastic beanstalk.

![img](https://i.ibb.co/dWRYDLz/image.png)

## WHY?

In AWS Elastic Beanstalk there are some ways to upload the secrets from code, but those who want to do it from the interface have a section for it, unfortunately this interface does not have bulk edit, if you have 130 variables you must copy and paste KEY/VALUE 260 times to hand, and then in each update check if they are up-to-date.

## Simple Solution

This extension allows you to import/export environment variables with a couple of clicks, so you forget about this headache.

## Usage

Download the source code and install the extension in chrome.

Here you have an article talking about how to do it: [How to install Chrome extensions manually from GitHub](https://dev.to/ben/how-to-install-chrome-extensions-manually-from-github-1612) by @benhalpern

### Export secrets

![Website](https://i.ibb.co/fMwXSN1/image.png)

Being in your AWS Elastic Beanstalk panel you will see that it automatically detects the secrets, and it will leave you in the last section to click "export".

If it doesn't detect the secrets, close and open the extension again or reload the page (the secrets must be visible on your screen for you to get them)

### Import secrets

Your secrets must be a plain text file, it doesn't matter if .env, .txt...

Just click on import:

![Import](https://i.ibb.co/V2V2gwM/image.png)

If you check the box, the secrets will be added after the ones you already have, if not, it will replace all.

Warning, if you have 70 secrets, you upload a file with 50 and replace mode, it will replace the first 50 secrets but won't delete the next 20 you already had, manually click the delete cross in AWS, it won't take much...

## For developers

Do what you want with it, it is developed in 2 hours, it may contain bugs and the occasional console.log lost.

I hope it at least saves you time, I needed it...

Any pull request is welcome, if it helps you mark the star :)

