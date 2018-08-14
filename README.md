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
