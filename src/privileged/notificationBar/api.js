"use strict";

/* global ExtensionAPI */

ChromeUtils.import("resource://gre/modules/Console.jsm");
ChromeUtils.import("resource://gre/modules/Services.jsm");
ChromeUtils.import("resource://gre/modules/XPCOMUtils.jsm");
ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
ChromeUtils.import("resource://gre/modules/ExtensionUtils.jsm");

/* eslint-disable-next-line */
var {EventManager, EventEmitter} = ExtensionCommon;
/* eslint-disable-next-line no-var */
var {Management: {global: {tabTracker}}} = ChromeUtils.import("resource://gre/modules/Extension.jsm", {});

// eslint-disable-next-line no-undef
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

/** Display instrumented 'notification bar' explaining the feature to the user
 *
 *   Telemetry Probes:
 *
 *   - {event: survey-shown}
 *
 *   - {event: page-broken}
 *
 *   - {event: page-not-broken}
 *
 *    Note:  Bar WILL NOT SHOW if the only window open is a private window.
 *
 *    Note:  Handling of 'x' is not implemented.  For more complete implementation:
 *
 *      https://github.com/gregglind/57-perception-shield-study/blob/680124a/addon/lib/Feature.jsm#L148-L152
 *
 */
class NotificationBarEventEmitter extends EventEmitter {
  emitShow(variationName) {
    const self = this;
    const recentWindow = getMostRecentBrowserWindow();
    const doc = recentWindow.document;

    const browser = recentWindow.gBrowser.selectedBrowser;
    const tabId = tabTracker.getBrowserTabId(browser);

    const primaryAction =  {
      label: "Yes!",
      accessKey: "f",
      callback: () => {
        self.emit("page-broken", {tabId});
      },
    };

    const secondaryActions =  [
      {
        label: "Nope",
        accessKey: "d",
        callback: () => {
          self.emit("page-not-broken", {tabId});
        },
      },
    ];

    const populatePanel = (event) => {
      // console.log("EVENT HAPPENED", event);
      // Can edit the contents of the panel here if we want variations per branch
      // if (event !== "shown") {
      //   return;
      // }
    };

    doc.defaultView.PopupNotifications.show(browser, "fast-block-notification", "Is this page broken?", null, primaryAction, secondaryActions, {eventCallback: populatePanel});
  }
}

this.notificationBar = class extends ExtensionAPI {
  /**
   * Extension Shutdown
   * Goes through each tab for each window and removes the notification, if it exists.
   */
  onShutdown(shutdownReason) {
    for (const win of BrowserWindowTracker.orderedWindows) {
      for (const browser of win.gBrowser.browsers) {
        const notification = win.PopupNotifications.getNotification("fast-block-notification", browser);
        if (notification) {
          win.PopupNotifications.remove(notification);
        }
      }
    }
  }

  getAPI(context) {
    const notificationBarEventEmitter = new NotificationBarEventEmitter();
    return {
      notificationBar: {
        show() {
          notificationBarEventEmitter.emitShow();
        },
        onReportPageBroken: new EventManager(
          context,
          "notificationBar.onReportPageBroken",
          fire => {
            const listener = (value, {tabId}) => {
              fire.async(tabId);
            };
            notificationBarEventEmitter.on(
              "page-broken",
              listener,
            );
            return () => {
              notificationBarEventEmitter.off(
                "page-broken",
                listener,
              );
            };
          },
        ).api(),
        onReportPageNotBroken: new EventManager(
          context,
          "notificationBar.onReportPageNotBroken",
          fire => {
            const listener = (value, {tabId}) => {
              fire.async(tabId);
            };
            notificationBarEventEmitter.on(
              "page-not-broken",
              listener,
            );
            return () => {
              notificationBarEventEmitter.off(
                "page-not-broken",
                listener,
              );
            };
          },
        ).api(),
      },
    };
  }
};
