"use strict";

/* global ExtensionAPI, ExtensionCommon, ExtensionUtils, XPCOMUtils, Services */
ChromeUtils.import("resource://gre/modules/Services.jsm");
ChromeUtils.import("resource://gre/modules/XPCOMUtils.jsm");

const { EventManager, EventEmitter } = ExtensionCommon;

const {Management: {global: {tabTracker}}} = ChromeUtils.import("resource://gre/modules/Extension.jsm", {});

XPCOMUtils.defineLazyModuleGetter(
  this,
  "BrowserWindowTracker",
  "resource:///modules/BrowserWindowTracker.jsm",
);

class TrackersEventEmitter extends EventEmitter {
  emitTrackersExist(tabId) {
    this.emit("trackers-exist", {tabId});
  }
  emitErrorDetected(error, tabId) {
    this.emit("page-error-detected", error, tabId);
  }
}

/* https://firefox-source-docs.mozilla.org/toolkit/components/extensions/webextensions/functions.html */
this.trackers = class extends ExtensionAPI {
  constructor(extension) {
    super(extension);
    this.framescriptUrl = extension.getURL("privileged/trackers/framescript.js");
  }


  onShutdown(shutdownReason) {
    EveryWindow.unregisterCallback("set-content-listeners");
    for (const win of [...BrowserWindowTracker.orderedWindows]) {
      const mm = win.getGroupMessageManager("browsers");
      // Ensure the framescript will not be loaded in any newly opened tabs.
      mm.removeDelayedFrameScript(this.framescriptUrl);
    }
  }

  getAPI(context) {
    const trackersEventEmitter = new TrackersEventEmitter();
    /* global EveryWindow */
    Services.scriptloader.loadSubScript(
      context.extension.getURL("privileged/trackers/EveryWindow.js"));
    return {
      trackers: {
        async unmount(win) {
          const mm = win.ownerGlobal.getGroupMessageManager("browsers");
          mm.removeMessageListener("trackerStatus", this.trackerCallback);
          mm.removeMessageListener("pageError", this.pageErrorCallback);
        },
        async trackerCallback(e) {
          if (e.data.content) {
            const tabId = tabTracker.getBrowserTabId(e.target);
            trackersEventEmitter.emitTrackersExist(tabId);
          }
        },
        async pageErrorCallback(e) {
          const tabId = tabTracker.getBrowserTabId(e.target);
          trackersEventEmitter.emitErrorDetected(e.data, tabId);
        },
        async setListeners(win) {
          const mm = win.getGroupMessageManager("browsers");
          // Web Progress Listener has detected a change.
          mm.addMessageListener("trackerStatus", this.trackerCallback);
          mm.addMessageListener("pageError", this.pageErrorCallback);

          mm.loadFrameScript(context.extension.getURL("privileged/trackers/framescript.js"), true);
        },
        async listenForTrackers() {
          EveryWindow.registerCallback("set-content-listeners", this.setListeners.bind(this), this.unmount.bind(this));
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
