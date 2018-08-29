# Fast Block Shield Study

This repository is a [Shield Study](https://wiki.mozilla.org/Firefox/Shield/Shield_Studies) based on the [Shield Studies Add-on Template](https://github.com/mozilla/shield-studies-addon-template). 

### About This Add-on

The sole focus of the Fastblock feature is to restrict the loading of trackers. It monitors trackers waiting for the first byte of data since the start of navigation of the current tab's top level document. If this is not received within a timeout, the request is canceled. If any bytes are received, the timeout is stopped. In some of the experimental branches, a few tracker requests are whitelisted, and do not have this monitoring. These include resources known to cause breakage, such essential audio/video, and commenting platforms.

## Development

You must run the study with [Firefox
Nightly](https://www.mozilla.org/en-US/firefox/channel/desktop/#nightly)

See [Getting
Started](https://github.com/mozilla/FastBlockShield/blob/master/docs/DEV.md#getting-started) for instructions to install, run, lint, and build the add-on.

You should be able to `npm start -- -f Nightly`

### Tests

We currently have functional tests, you can find them under `test/functional/`.
Please test your new code and make sure to run the tests before committing.

To run the tests, use

```shell
npm run build
npm run test:func
```

Note that you have to re-run `npm run build` when making changes to study code because the tests use a bundled version of the add-on.

## Running Variations

First, be sure you go through the [Development](#Development) steps and are able
to `npm start -- -f Nightly`

To run a specific variation, you will pass the variation name to the `start`
command with `--pref`.

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

## User Scenarios

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
