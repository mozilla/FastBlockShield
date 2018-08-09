# Fast Block Shield Study

This repository is a [Shield Study](https://wiki.mozilla.org/Firefox/Shield/Shield_Studies) based on the [Shield Studies Addon Template](https://github.com/mozilla/shield-studies-addon-template). 

### About This Add-on

The sole focus of the Fastblock feature is to restrict the loading of trackers. It monitors trackers waiting for the first byte of data since the start of navigation of the current tab's top level document. If this is not received within 5s, the request is canceled. If any bytes are received, the 5s timer is stopped. In some of the experimental branches, a few tracker requests are whitelisted, and do not have this monitoring. These include resources known to cause breakage, such essential audio/video, and commenting platforms.

## Development

### Setup

```
npm install
npm run build
```

### Running

```
npm start -- -f Nightly
```
