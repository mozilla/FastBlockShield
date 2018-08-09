"use strict";

/* global ExtensionAPI, ExtensionCommon, ExtensionUtils, XPCOMUtils */
ChromeUtils.import("resource://gre/modules/Services.jsm");
ChromeUtils.import("resource://gre/modules/XPCOMUtils.jsm");

const { EventManager, EventEmitter } = ExtensionCommon;

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
  emitTrackersExist() {
    this.emit("trackers-exist");
  }
  emitlocationChange() {
    this.emit("location-change");
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
              trackersEventEmitter.emitTrackersExist();
            }
          });
          mm.addMessageListener("locationChange", () => {
            trackersEventEmitter.emitlocationChange();
          });
          mm.loadFrameScript(context.extension.getURL("privileged/trackers/framescript.js"), true);
        },
        onRecordTrackers: new EventManager(
          context,
          "trackers.onRecordTrackers",
          fire => {
            const listener = value => {
              fire.async(value);
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
            const listener = value => {
              fire.async(value);
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
      },
    };
  }
};
