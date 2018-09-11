"use strict";

/* global AddonManager, ExtensionAPI, ExtensionCommon, ExtensionUtils, XPCOMUtils, Services */
ChromeUtils.import("resource://gre/modules/Services.jsm");
ChromeUtils.import("resource://gre/modules/XPCOMUtils.jsm");
ChromeUtils.defineModuleGetter(this, "AddonManager", "resource://gre/modules/AddonManager.jsm");

/* eslint-disable-next-line no-var */
var {EventManager, EventEmitter} = ExtensionCommon;
/* eslint-disable-next-line no-var */
var {Management: {global: {tabTracker}}} = ChromeUtils.import("resource://gre/modules/Extension.jsm", {});

XPCOMUtils.defineLazyModuleGetter(
  this,
  "BrowserWindowTracker",
  "resource:///modules/BrowserWindowTracker.jsm",
);

class TrackersEventEmitter extends EventEmitter {
  emitReportBreakage(tabId) {
    this.emit("report-breakage", tabId);
  }
  emitPageBeforeUnload(tabId, data) {
    this.emit("page-before-unload", tabId, data);
  }
  emitPageUnload(tabId, data) {
    this.emit("page-unload", tabId, data);
  }
  emitErrorDetected(error, tabId) {
    this.emit("page-error-detected", error, tabId);
  }
  emitAddException(tabId) {
    this.emit("exception-added", tabId);
  }
  emitPageDOMContentLoaded(tabId) {
    this.emit("page-DOMContentLoaded", tabId);
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
          mm.removeMessageListener("pageError", this.pageErrorCallback);
          mm.removeMessageListener("FastBlock:DOMContentLoaded", this.pageDOMContentLoaded);
          mm.removeMessageListener("unload", this.pageUnloadCallback);
          mm.removeMessageListener("beforeunload", this.pageBeforeUnloadCallback);

          const reportBreakageButton = win.document.getElementById("identity-popup-breakageReportView-submit");
          reportBreakageButton.removeEventListener("command", this.onReportBreakageButtonCommand);
          const addExceptionButton = win.document.getElementById("tracking-action-unblock");
          addExceptionButton.removeEventListener("command", this.onAddExceptionButtonCommand);
        },

        async pageErrorCallback(e) {
          const tabId = tabTracker.getBrowserTabId(e.target);
          trackersEventEmitter.emitErrorDetected(e.data, tabId);
        },

        async pageBeforeUnloadCallback(e) {
          const tabId = tabTracker.getBrowserTabId(e.target);
          let uri;
          try {
            uri = Services.io.newURI(e.data.telemetryData.completeLocation);
            e.data.telemetryData.etld =
              Services.eTLD.getBaseDomainFromHost(e.data.telemetryData.hostname);
          } catch (error) {
            return;
          }
          // Browser is never private, so type can always be "trackingprotection"
          e.data.telemetryData.user_has_tracking_protection_exception =
            Services.perms.testExactPermission(uri, "trackingprotection") === Services.perms.ALLOW_ACTION;
          trackersEventEmitter.emitPageBeforeUnload(tabId, e.data.telemetryData);
        },

        async pageUnloadCallback(e) {
          const tabId = tabTracker.getBrowserTabId(e.target);
          let uri;
          try {
            uri = Services.io.newURI(e.data.telemetryData.completeLocation);
            e.data.telemetryData.etld =
              Services.eTLD.getBaseDomainFromHost(e.data.telemetryData.hostname);
          } catch (error) {
            return;
          }
          // Browser is never private, so type can always be "trackingprotection"
          e.data.telemetryData.user_has_tracking_protection_exception =
            Services.perms.testExactPermission(uri, "trackingprotection") === Services.perms.ALLOW_ACTION;
          trackersEventEmitter.emitPageUnload(tabId, e.data.telemetryData);
        },

        async pageDOMContentLoadedCallback(e) {
          const tabId = tabTracker.getBrowserTabId(e.target);
          trackersEventEmitter.emitPageDOMContentLoaded(tabId);
        },

        onReportBreakageButtonCommand(e) {
          const win = e.target.ownerGlobal;
          const tabId = tabTracker.getBrowserTabId(win.gBrowser.selectedBrowser);
          trackersEventEmitter.emitReportBreakage(tabId);
        },

        async onAddExceptionButtonCommand(e) {
          const win = e.target.ownerGlobal;
          const tabId = tabTracker.getBrowserTabId(win.gBrowser.selectedBrowser);
          trackersEventEmitter.emitAddException(tabId);
        },

        async setListeners(win) {
          const mm = win.getGroupMessageManager("browsers");
          // Web Progress Listener has detected a change.
          mm.addMessageListener("pageError", this.pageErrorCallback);
          mm.addMessageListener("FastBlock:DOMContentLoaded", this.pageDOMContentLoadedCallback);
          // We pass "true" as the third argument to signify that we want to listen
          // to messages even when the framescript is unloading, to catch tabs closing.
          mm.addMessageListener("FastBlock:beforeunload", this.pageBeforeUnloadCallback, true);
          mm.addMessageListener("FastBlock:unload", this.pageUnloadCallback, true);

          mm.loadFrameScript(context.extension.getURL("privileged/trackers/framescript.js"), true);

          const reportBreakageButton = win.document.getElementById("identity-popup-breakageReportView-submit");
          reportBreakageButton.addEventListener("command", this.onReportBreakageButtonCommand);
          // The user has clicked "disable protection for this site"
          const addExceptionButton = win.document.getElementById("tracking-action-unblock");
          addExceptionButton.addEventListener("command", this.onAddExceptionButtonCommand);
        },

        async init() {
          EveryWindow.registerCallback("set-content-listeners", this.setListeners.bind(this), this.unmount.bind(this));

          // Listen for addon disabling or uninstall.
          AddonManager.addAddonListener(this);
        },

        onUninstalling(addon) {
          this.handleDisableOrUninstall(addon);
        },

        onDisabled(addon) {
          this.handleDisableOrUninstall(addon);
        },

        handleDisableOrUninstall(addon) {
          if (addon.id !== context.extension.id) {
            return;
          }

          AddonManager.removeAddonListener(this);
          // This is needed even for onUninstalling, because it nukes the addon
          // from UI. If we don't do this, the user has a chance to "undo".
          addon.uninstall();
        },

        onPageUnload: new EventManager(
          context,
          "trackers.onPageUnload",
          fire => {
            const listener = (value, tabId, data) => {
              fire.async(tabId, data);
            };
            trackersEventEmitter.on(
              "page-unload",
              listener,
            );
            return () => {
              trackersEventEmitter.off(
                "page-unload",
                listener,
              );
            };
          },
        ).api(),

        onPageDOMContentLoaded: new EventManager(
          context,
          "trackers.onPageDOMContentLoaded",
          fire => {
            const listener = (value, tabId) => {
              fire.async(tabId);
            };
            trackersEventEmitter.on(
              "page-DOMContentLoaded",
              listener,
            );
            return () => {
              trackersEventEmitter.off(
                "page-DOMContentLoaded",
                listener,
              );
            };
          },
        ).api(),

        onPageBeforeUnload: new EventManager(
          context,
          "trackers.onPageBeforeUnload",
          fire => {
            const listener = (value, tabId, data) => {
              fire.async(tabId, data);
            };
            trackersEventEmitter.on(
              "page-before-unload",
              listener,
            );
            return () => {
              trackersEventEmitter.off(
                "page-before-unload",
                listener,
              );
            };
          },
        ).api(),

        onReportBreakage: new EventManager(
          context,
          "trackers.onReportBreakage",
          fire => {
            const listener = (value, tabId) => {
              fire.async(tabId);
            };
            trackersEventEmitter.on(
              "report-breakage",
              listener,
            );
            return () => {
              trackersEventEmitter.off(
                "report-breakage",
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

        onAddException: new EventManager(
          context,
          "trackers.onAddException",
          fire => {
            const listener = (value, tabId) => {
              fire.async(tabId);
            };
            trackersEventEmitter.on(
              "exception-added",
              listener,
            );
            return () => {
              trackersEventEmitter.off(
                "exception-added",
                listener,
              );
            };
          },
        ).api(),
      },
    };
  }
};
