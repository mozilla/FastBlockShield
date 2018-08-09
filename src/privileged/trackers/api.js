"use strict";

/* global ExtensionAPI, ExtensionCommon, ExtensionUtils, XPCOMUtils */
ChromeUtils.import("resource://gre/modules/Services.jsm");
ChromeUtils.import("resource://gre/modules/XPCOMUtils.jsm");

const { EventManager, EventEmitter } = ExtensionCommon;

var {Management: {global: {tabTracker}}} = ChromeUtils.import("resource://gre/modules/Extension.jsm", {});

XPCOMUtils.defineLazyModuleGetter(
  this,
  "BrowserWindowTracker",
  "resource:///modules/BrowserWindowTracker.jsm",
);

/** Return most recent NON-PRIVATE browser window, so that we can
 * manipulate chrome elements on it.
 */
function getMostRecentBrowserWindow() {
  return BrowserWindowTracker.getTopWindow({
    private: false,
    allowPopups: false,
  });
}

class TrackersEventEmitter extends EventEmitter {
  emitTrackersExist(tabId) {
    this.emit("trackers-exist", {tabId});
  }
  emitLocationChange(tabId) {
    this.emit("location-change", {tabId});
  }
  emitErrorDetected(error, tabId) {
    this.emit("page-error-detected", error, tabId);
  }
}

/* https://firefox-source-docs.mozilla.org/toolkit/components/extensions/webextensions/functions.html */
this.trackers = class extends ExtensionAPI {
  getAPI(context) {
    const trackersEventEmitter = new TrackersEventEmitter();
    console.log("CONTEXT", context);
    return {
      trackers: {
        async listenForTrackers() {
          // Set up frame script and message manager.
          // Must load framescript in order to get access to docShell.
          const mm = getMostRecentBrowserWindow().getGroupMessageManager("browsers");
          // Web Progress Listener has detected a change.
          mm.addMessageListener("trackerStatus", (message) => {
            // True or false depending on if the script contains tracker(s)
            // only send message on true.
            if (message.data.content) {
              let tabId = tabTracker.getBrowserTabId(message.target);
              trackersEventEmitter.emitTrackersExist(tabId);
            }
          });
          mm.addMessageListener("locationChange", (message) => {
            let tabId = tabTracker.getBrowserTabId(message.target);
            trackersEventEmitter.emitLocationChange(tabId);
          });
          mm.addMessageListener("pageError", (e) => {
            let tabId = tabTracker.getBrowserTabId(e.target);
            trackersEventEmitter.emitErrorDetected(e.data, tabId);
          });

          mm.loadFrameScript(context.extension.getURL("privileged/trackers/framescript.js"), true);
        },
        onRecordTrackers: new EventManager(
          context,
          "trackers.onRecordTrackers",
          fire => {
            const listener = (value, {tabId}) => {
              fire.async(tabId);
            };
            trackersEventEmitter.on(
              "trackers-exist",
              listener,
            );
            return () => {
              trackersEventEmitter.off(
                "trackers-exist",
                listener,
              );
            };
          },
        ).api(),
        onLocationChanged: new EventManager(
          context,
          "trackers.onLocationChanged",
          fire => {
            const listener = (value, {tabId}) => {
              fire.async(tabId);
            };
            trackersEventEmitter.on(
              "location-change",
              listener,
            );
            return () => {
              trackersEventEmitter.off(
                "location-change",
                listener,
              );
            };
          },
        ).api(),
        onErrorDetected: new EventManager(
          context,
          "trackers.onErrorDetected",
          fire => {
            const listener = (value, error, tabId) => {
              fire.async(error, tabId);
            };
            trackersEventEmitter.on(
              "page-error-detected",
              listener,
            );
            return () => {
              trackersEventEmitter.off(
                "page-error-detected",
                listener,
              );
            };
          },
        ).api(),
      },
    };
  }
};
