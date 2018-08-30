# Telemetry sent by this add-on

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Contents**

* [Usual Firefox Telemetry is mostly unaffected](#usual-firefox-telemetry-is-mostly-unaffected)
* [`shield-study` pings (common to all shield-studies)](#shield-study-pings-common-to-all-shield-studies)
* [`shield-study-addon` pings, specific to THIS study.](#shield-study-addon-pings-specific-to-this-study)
* [Example sequence for a 'voted => not sure' interaction](#example-payload-of-the-shield-study-addon-ping)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usual Firefox Telemetry is mostly unaffected

* No change: `main` and other pings are UNAFFECTED by this add-on, except that [shield-studies-addon-utils](https://github.com/mozilla/shield-studies-addon-utils) adds the add-on id as an active experiment in the telemetry environment.
* Respects telemetry preferences. If user has disabled telemetry, no telemetry will be sent.

## `shield-study` pings (common to all shield-studies)

[shield-studies-addon-utils](https://github.com/mozilla/shield-studies-addon-utils) sends the usual packets.

## `shield-study-addon` pings, specific to THIS study.

There is one ping per page visit, fired on the `unload` event.

## Example payload of the `shield-study-addon` ping.

These are the `payload` fields from the `shield-study-addon` bucket.

```
telemetry: {
  "version":3,
  "study_name":"fastblock-shield@mozilla.org",
  "branch":"TPL0",
  "addon_version":"2.0.0",
  "shield_version":"5.0.3",
  "type":"shield-study-addon",
  "data": {
    "attributes": {
      "etld":"f231d141395abf6f4c98dd55fe8c37e2752e82d72e1ffd3b64bdc6c978692fc6",
      "num_blockable_trackers":"2",
      "num_trackers_blocked":"2",
      "TIME_TO_DOM_CONTENT_LOADED_START_MS":"841",
      "TIME_TO_DOM_COMPLETE_MS":"1177",
      "TIME_TO_DOM_INTERACTIVE_MS":"811",
      "TIME_TO_LOAD_EVENT_START_MS":"1177",
      "TIME_TO_LOAD_EVENT_END_MS":"1178",
      "TIME_TO_RESPONSE_START_MS":"207",
      "page_reloaded":"true",
      "page_reloaded_survey":"1",
      "user_reported_page_breakage":"false",
      "user_added_exception":"false",
      "num_script_url_page":"0",
      "num_EvalError":"0",
      "num_InternalError":"0",
      "num_RangeError":"0",
      "num_ReferenceError":"0",
      "num_SyntaxError":"2",
      "num_TypeError":"1",
      "num_URIError":"0",
      "num_SecurityError":"0"
    }
  }
}
```
