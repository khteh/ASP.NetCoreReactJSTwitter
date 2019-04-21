# ASP.NetCoreTwitterOAuth
ASP.Net Core 2.0 ReactJS with Twitter OAuth Authentication

## Description:

This application is using Twitter embedded timeline widget. It implements the following features:

* Authenticate with Twitter using OAuth
* Show profile tweets of authenticated user
* Show tweets followed by authenticated user
* Post tweets

## Build Steps:
* cd ASP.NetCoreReactJSTwitter; npm install;
* Open the solution file in Visual Studio
* Right click the project and choose "Manage User Secrets"
* Enter the following values into the secret file:

    "Authentication:Twitter:ConsumerKey": "tgv8MPCvBb72k4K3wFrgTo3pF",

    "Authentication:Twitter:ConsumerSecret": "1DKBMZiKy0ZoF3hN2sGI2JJDOpZB59SsQN9IrPn6jC61Cm0ErD",

    "Authentication:Twitter.AccessToken": "961852359478427648-OMe0VMdVykHndwE1B4fs3NcWh8dScxP",

    "Authentication:Twitter.AccessTokenSecret": "RXLWMUiy2mHDt3UwGTxv6USjpvatZFdGNBdpYECuUmTpn"

* Save the file
* Build and run the solution. This can usually be achieved by hitting "F5" key.

## Continuous Integration:
* Integrated with CircleCI

## Known Issues:

* Posting tweet with large image will fail: https://github.com/linvi/tweetinvi/issues/648
* Tweet "like" status is not updated in timeline widget: https://twittercommunity.com/t/profile-timeline-widget-does-not-show-the-like-status/101334
