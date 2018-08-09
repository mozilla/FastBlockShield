/* global XPCOMUtils, sendAsyncMessage, docShell */
const {classes: Cc, interfaces: Ci} = Components;
const trackerListener = {
  QueryInterface: XPCOMUtils.generateQI(["nsIWebProgressListener", "nsISupportsWeakReference"]),
  onLocationChange: function(progress, request, uri, flag) {
    if (progress.isTopLevel) {
      sendAsyncMessage("locationChange");
    }
  },
  // Is it possible to get this message more than once per page?
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

console.log("RUNNNNNNNINININININING");

// handle uncaught promises errors
addEventListener('unhandledrejection', function(e) {
  console.log("REJECT", e);
});

// handle uncaught errors
addEventListener('error', function(e) {
  console.log("ERRORROROORORO$$$$$$#####$$$", e);
  sendAsyncMessage("pageError", e.error.name);
  // this also works
  // content.postMessage({error: simplifiedError}, '*');
});


