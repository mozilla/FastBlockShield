let port = browser.runtime.connect();

// possible to catch refresh action with this, but navigation has not yet updated, no stats
// window.onunload = () => {}

port.postMessage({message: "hello from content script"});

port.onMessage.addListener(function(m) {
  if (m.message === "navigation") {
    let perfEntries = performance.getEntriesByType("navigation");
    for (const entry of perfEntries) {
      if (entry.type === "reload") {
        port.postMessage({message: "reload"});
        // inject footer or header to query user here
        // NOTE: do not query on multiple reloads (ex. user might be refreshing stats)
      }
    }
  }
});

