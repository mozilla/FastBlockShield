"use strict";

/* global ExtensionAPI */

ChromeUtils.import("resource://gre/modules/Services.jsm");

/* https://firefox-source-docs.mozilla.org/toolkit/components/extensions/webextensions/functions.html */
this.prefs = class extends ExtensionAPI {
  getAPI(context) {
    return {
      // eslint-disable-next-line no-undef
      prefs: Services.prefs
    };
  }

  // Cleanup prefs from here because the cleanup methods in the extension are not properly triggering.
  // See for progress: https://github.com/mozilla/shield-studies-addon-utils/issues/246
  onShutdown(shutdownReason) {
    // Reset these to default values (we should not have recruited anyone who did not originally have default values here)
    Services.prefs.clearUserPref("privacy.fastblock.list");
    Services.prefs.clearUserPref("browser.fastblock.enabled");
    Services.prefs.clearUserPref("browser.fastblock.timeout");
    Services.prefs.clearUserPref("privacy.trackingprotection.enabled");
    Services.prefs.clearUserPref("network.http.tailing.enabled")
  }
};
