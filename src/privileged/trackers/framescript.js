/* global XPCOMUtils, sendAsyncMessage, docShell */
const {classes: Cc, interfaces: Ci} = Components;
const trackerListener = {
  QueryInterface: XPCOMUtils.generateQI(["nsIWebProgressListener", "nsISupportsWeakReference"]),
  onSecurityChange: function(webProgress, request, state) {
    const isBlocking = state & Ci.nsIWebProgressListener.STATE_BLOCKED_TRACKING_CONTENT;
    const isAllowing = state & Ci.nsIWebProgressListener.STATE_LOADED_TRACKING_CONTENT;
    if (isBlocking || isAllowing) {
      // There are trackers on this page.
      sendAsyncMessage("trackerStatus", {
        content: true,
      });
    } else {
      // There are no trackers on this page
      sendAsyncMessage("trackerStatus", {
        content: false,
      });
    }
  },
};

const filter = Cc["@mozilla.org/appshell/component/browser-status-filter;1"].createInstance(Ci.nsIWebProgress);
filter.addProgressListener(trackerListener, Ci.nsIWebProgress.NOTIFY_ALL);
const webProgress = docShell.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebProgress);
webProgress.addProgressListener(filter, Ci.nsIWebProgress.NOTIFY_ALL);

// Listen for errors from the content.
addEventListener("error", function(e) {
  sendAsyncMessage("pageError", e.error.name);
});
