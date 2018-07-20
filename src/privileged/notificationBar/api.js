"use strict";

/* global ExtensionAPI */

ChromeUtils.import("resource://gre/modules/Console.jsm");
ChromeUtils.import("resource://gre/modules/Services.jsm");
ChromeUtils.import("resource://gre/modules/XPCOMUtils.jsm");
ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
ChromeUtils.import("resource://gre/modules/ExtensionUtils.jsm");

// eslint-disable-next-line no-undef
const { EventManager } = ExtensionCommon;
// eslint-disable-next-line no-undef
const { EventEmitter } = ExtensionUtils;

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
 *   - {event: introduction-shown}
 *
 *   - {event: introduction-accept}
 *
 *   - {event: introduction-leave-study}
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

    let primaryAction =  {
      label: "Yes!",
      accessKey: "f",
      callback: () => {
        console.log("YESSS");
      },
    }

    let secondaryActions =  [
      {
        label: "Nope",
        accessKey: "d",
        callback: () => {
          console.log("NO");
        },
      },
    ]

    let populatePanel = (event) => {
      // console.log("EVENT HAPPENED", event);
      // Can edit the contents of the panel here if we want variations per branch
      // if (event !== "shown") {
      //   return;
      // }
    };

    doc.defaultView.PopupNotifications.show(recentWindow.gBrowser.selectedBrowser, "fast-block-notification", "Is this page broken?", null, primaryAction, secondaryActions, {eventCallback: populatePanel})

    self.emit("introduction-shown");
  }
}

this.notificationBar = class extends ExtensionAPI {
  /**
   * Extension Shutdown
   * APIs that allocate any resources (e.g., adding elements to the browser’s user interface,
   * setting up internal event listeners, etc.) must free these resources when the extension
   * for which they are allocated is shut down.
   */
  onShutdown(shutdownReason) {
    console.log("onShutdown", shutdownReason);
    // TODO: remove any active ui
  }

  getAPI(context) {
    const notificationBarEventEmitter = new NotificationBarEventEmitter();
    return {
      notificationBar: {
        show() {
          notificationBarEventEmitter.emitShow();
        },
        // TODO: customize some events for telemetry
        onIntroductionShown: new EventManager(
          context,
          "notificationBar.onIntroductionShown",
          fire => {
            const listener = value => {
              fire.async(value);
            };
            notificationBarEventEmitter.on(
              "introduction-shown",
              listener,
            );
            return () => {
              notificationBarEventEmitter.off(
                "introduction-shown",
                listener,
              );
            };
          },
        ).api(),
        onIntroductionAccept: new EventManager(
          context,
          "notificationBar.onIntroductionAccept",
          fire => {
            const listener = value => {
              fire.async(value);
            };
            notificationBarEventEmitter.on(
              "introduction-accept",
              listener,
            );
            return () => {
              notificationBarEventEmitter.off(
                "introduction-accept",
                listener,
              );
            };
          },
        ).api(),
        onIntroductionLeaveStudy: new EventManager(
          context,
          "notificationBar.onIntroductionLeaveStudy",
          fire => {
            const listener = value => {
              fire.async(value);
            };
            notificationBarEventEmitter.on(
              "introduction-leave-study",
              listener,
            );
            return () => {
              notificationBarEventEmitter.off(
                "introduction-leave-study",
                listener,
              );
            };
          },
        ).api(),
      },
    };
  }
};
