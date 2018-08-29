"use strict";

/* global ExtensionAPI */

ChromeUtils.import("resource://gre/modules/Services.jsm");

const cleanupPrefs = new Set();

/* https://firefox-source-docs.mozilla.org/toolkit/components/extensions/webextensions/functions.html */
this.prefs = class extends ExtensionAPI {
  getAPI(context) {
    return {
      prefs: {
        registerPrefCleanup(pref) {
          cleanupPrefs.add(pref);
        },
        setStringPref: Services.prefs.setStringPref,
        getStringPref: Services.prefs.getStringPref,
        setIntPref: Services.prefs.setIntPref,
        getIntPref: Services.prefs.getIntPref,
        setBoolPref: Services.prefs.setBoolPref,
        getBoolPref: Services.prefs.getBoolPref,
      }
    };
  }

  // Cleanup prefs from here because the cleanup methods in the extension are not properly triggering.
  // See for progress: https://github.com/mozilla/shield-studies-addon-utils/issues/246
  onShutdown(shutdownReason) {
    for (let pref of cleanupPrefs) {
      Services.prefs.clearUserPref(pref);
    }
  }
};
