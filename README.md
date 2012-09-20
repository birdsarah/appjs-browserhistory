#Browser History - An AppJS application

Takes your firefox browsing history and presents it so its easy to see what you've been looking at recently (customizable).

---
## Requirements

* Node

AppJS is built on node and appjs (www.appjs.org)

See README-AppJS for more information on AppJS

Browser History is built on an early version of AppJS (0.0.13). AppJS is under active development (now at 0.0.19) and I would not 
expect that this app will work on later versions.

This repo includes the appropriate AppJS version and other node modules

---
## Installation

Install node as instructed here: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

Get this repo:
<pre>git clone git://github.com/birdsarah/appjs-browserhistory.git</pre>

Go to app directory:
<pre>cd appjs-browserhistory/browserhistory</pre>

Edit the settings in __index.js__ (note this is the index.js in the directory browserhistory, not the one in the root directory):
```javascript
/*USER INPUTS*/
/*The number of individual history items you would like to aggregate*/
var number_of_hits = 100;

/*Location of your firefox profile - this is where we will look to find you places.sqlite database */
var location_of_profile = 'PATH TO YOUR FIREFOX PROFILE'

/*****END OF USER INPUTS******/
```
On Ubuntu, for example, your firefox profile is somewhere like: /home/bird/.mozilla/firefox/14i4gvbc.default/

Run the app:
<pre>node --harmony index.js</pre>
(again, this is the index.js in the directory browserhistory, not the root directory)

