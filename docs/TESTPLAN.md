# Test plan for this add-on

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Contents**

* [Manual / QA TEST Instructions](#manual--qa-test-instructions)
  * [Preparations](#preparations)
  * [Install the add-on and enroll in the study](#install-the-add-on-and-enroll-in-the-study)
* [Expected User Experience / Functionality](#expected-user-experience--functionality)
  * [Do these tests](#do-these-tests)
  * [Design](#design)
  * [Note: checking "sent Telemetry is correct"](#note-checking-sent-telemetry-is-correct)
* [Debug](#debug)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Manual / QA TEST Instructions

### Preparations

* Download a Nightly version of Firefox
* After 2018-09-04, use Beta instead

### Install the add-on and enroll in the study

* (Create profile: <https://developer.mozilla.org/Firefox/Multiple_profiles>, or via some other method)
* Navigate to _about:config_ and set the following preferences. (If a preference does not exist, create it by right-clicking in the white area and selecting New -> String)
* Set `shieldStudy.logLevel` to `All`. This permits shield-add-on log output in browser console.
* Set `extensions.fastblock-shield_mozilla_org.test.variationName` to `FB2L0` (or any other study variation/branch to test specifically)
<!-- TODO: create a zip file with this add-on  -->
* Go to [this study's tracking bug](tbd: replace with your study's launch bug link in bugzilla) and install the latest add-on zip file

### Variations

There are a number of variations to study features and heuristics:

  * `Control`
    * 4 control branches - denoted by `[0-3]`
  * Tracking Protection - denoted by `TP`
  * Fastblock - denoted by `FB`
    * 2 timeouts - denoted by `[2|5]`
    * 4 separate block-lists - denoted by `L[0-3]`

All the variations are listed in
[`variations.js`](https://github.com/mozilla/FastBlockShield/blob/master/src/variations.js).
You can run any of them like so:

```
npm start -- -f Nightly --pref=extensions.fastblock-shield_mozilla_org.test.variationName=FB2L0
```

## Expected User Experience / Functionality

In all variations:

  * Nothing different should happen in Private Browsing or Safe Mode operation.
  * Nothing different should happen on a page without trackers.
  * No telemetry will be sent on a page without trackers.
  * Panel Behaviour:
    * If the user refreshes a page that has trackers on it, they have a chance of being shown
      a panel notification: "Did you reload this page to resolve loading issues?". This chance is 100% by the 6th refresh.
    * If the panel is ignored it will not show up again on the next refreshes. Once the user
      navigates, on the next refresh there is once again a chance the panel will show up. And the
      chance that it might show up on the same etld+1 is once again possible.
    * If "yes" or "no" is clicked on the panel, it will never show up again for that etld+1.
    * The panel should not dismiss until interacted with, or until the user navigates or refreshes
      the page
  * Telemetry Behaviour:
    * Telemetry will be sent upon page unload.

    
### Control
In a Control [variation](#variations):

  * There are no differences for Control branches from the behaviours described for all variations

```
npm start -- -f Nightly --pref=extensions.button-icon-preference_shield_mozilla_org.
test.variationName=Control0
```

### Tracking Protection

 ```
 npm start -- -f Nightly --pref=extensions.button-icon-preference_shield_mozilla_org.
 test.variationName=TP
 ```

 In a Tracking Protection [variation](#variations):

   * The user should see the "How Tracking Protection works" onboarding experience
     when they first visit a site with trackers detected.
   * The "Content Blocking" panel should show "Trackers: Blocked",
     "Slow-loading Trackers: Add blocking...", and "Disable Blocking for This
     Site"

### Fastblock

 ```
 npm start -- -f Nightly --pref=extensions.button-icon-preference_shield_mozilla_org.
 test.variationName=FB2L0
 ```

 In a Fastblock [variation](#variations):

   * The user will not receive any Fastblock onboarding
   * The "Content Blocking" panel should show "Slow-loading Trackers: Blocked",
     "Trackers: Add blocking...", and "Disable Blocking for This Site"

### Testing Guide

In combination with the above instructions, add the pref `shieldStudy.logLevel=all` to the command to see extra logging. The logging will show the contents of the Telemetry ping, and the variation.

```
npm start -- -f Nightly --pref=extensions.fastblock-shield_mozilla_org.test.variationName=TPL0 --pref=shieldStudy.logLevel=all
```

### Websites to test

You can find a good a assortment of test sites with trackers on the [Tracking Protection Wiki Page](https://wiki.mozilla.org/Security/Tracking_protection#QA). These pages were designed to simply and reliably load one or two tracking resources for testing.

Here is a [test page](https://mozilla.github.io/FastBlockShield/) that causes various Javascript Errors when buttons are clicked. The page also contains a GA tracker, resulting in a telemetry ping. The errors should be reported in the telemetry ping.

Of course there is a large variety of sites on the internet that employ trackers and cause errors. This study should generally work the same for all of them, though there may be specific exceptions. In general please be aware of the sensitivity of FastBlock to network speed and that sites can also intermittently differ in how they load trackers or throw errors.

### Design

Any UI in a Shield study should be consistent with standard Firefox design specifications. These standards can be found at [design.firefox.com](https://design.firefox.com/photon/welcome.html). Firefox logo specifications can be found [here](https://design.firefox.com/photon/visuals/product-identity-assets.html).

### Note: checking "sent Telemetry is correct"

* Open the Browser Console using Firefox's top menu at `Tools > Web Developer > Browser Console`. This will display Shield (loading/telemetry) log output from the add-on.

See [TELEMETRY.md](./TELEMETRY.md) for more details on what pings are sent by this add-on.

## Debug

To debug installation and loading of the add-on:

* Open the Browser Console using Firefox's top menu at `Tools > Web Developer > Browser Console`. This will display Shield (loading/telemetry) and log output from the add-on.
