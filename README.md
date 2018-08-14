# Fast Block Shield Study

This repository is a [Shield Study](https://wiki.mozilla.org/Firefox/Shield/Shield_Studies) based on the [Shield Studies Addon Template](https://github.com/mozilla/shield-studies-addon-template). 

### About This Add-on

The sole focus of the Fastblock feature is to restrict the loading of trackers. It monitors trackers waiting for the first byte of data since the start of navigation of the current tab's top level document. If this is not received within a timeout, the request is canceled. If any bytes are received, the timeout is stopped. In some of the experimental branches, a few tracker requests are whitelisted, and do not have this monitoring. These include resources known to cause breakage, such essential audio/video, and commenting platforms.

## Development

You must run the study with [Firefox
Nightly](https://www.mozilla.org/en-US/firefox/channel/desktop/#nightly) or
[Developer
Edition](https://www.mozilla.org/firefox/developer/).

See [Getting
Started](https://github.com/mozilla/FastBlockShield/blob/master/docs/DEV.md#getting-started) for instructions to install, run, lint, and build the add-on.

You should be able to `npm start -- -f Nightly`

## Running Variations

First, be sure you go thru the [Development](#Development) steps and are able
to `npm start -- -f Nightly`

To run a specific variation, you will pass the variation name to the `start`
command with `--pref`.

### Variations

There are a number of variations to study features and heuristics:

  * `Control`
  * Tracking Protection - denoted by `TP`
  * Fastblock - denoted by `FB`
    * 2 timeouts - denoted by `[2|5]`
  * 4 separate block-lists - denoted by `L[0-3]`
  * Tracker tailing - denoted by `TT`

All the variations are listed in
[`feature.js`](https://github.com/mozilla/FastBlockShield/blob/master/src/feature.js).
You can run any of them like so:

```
npm start -- -f Nightly --pref=extensions.button-icon-preference_shield_mozilla_org.test.variationName=FB2L0
```

## User Scenarios

In all variations:

  * Nothing different should happen in Private Browsing or Safe Mode operation
  * If the user refreshes the page, by approximately the 6th time,
    they should be shown a panel notification: "Is this page broken?"

### Tracking Protection

```
npm start -- -f Nightly --pref=extensions.button-icon-preference_shield_mozilla_org.
test.variationName=TPL0
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

### Tracker Tailing

```
npm start -- -f Nightly --pref=extensions.button-icon-preference_shield_mozilla_org.
test.variationName=TT
```

In a Tracker-Tailing [variation](#variations):

TBD
