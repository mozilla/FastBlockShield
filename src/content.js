let port = browser.runtime.connect();

port.onMessage.addListener(function(m) {
  if (m.message === "navigation") {
    let perfEntries = performance.getEntriesByType("navigation");
    // there *should* be only one entry - I haven't see anything to the alternative yet
    for (const entry of perfEntries) {
      let payload;
      if (entry.type === "reload") {
        // get the data from content, since it is more reliable
        // send Telemetry only accepts strings...
        payload = {
          PAGE_RELOADED: "true",
          HOSTNAME: location.hostname,
          TIME_TO_DOM_CONTENT_LOADED_START_MS: entry.domContentLoadedEventStart.toString(),
          TIME_TO_DOM_COMPLETE_MS: entry.domComplete.toString(),
          TIME_TO_DOM_INTERACTIVE_MS: entry.domInteractive.toString(),
          TIME_TO_LOAD_EVENT_START_MS: entry.loadEventStart.toString(),
          TIME_TO_LOAD_EVENT_END_MS: entry.loadEventEnd.toString(),
          TIME_TO_RESPONSE_START_MS: entry.responseStart.toString(),
          // Missing:
          // TIME_TO_NON_BLANK_PAINT_MS ( integer)
          // TIME_TO_DOM_LOADING_MS ( integer)
          // TIME_TO_FIRST_INTERACTION_MS ( integer)
        };
        port.postMessage({message: "reload", payload});
      } else {
        payload = {
          PAGE_RELOADED: "false",
          HOSTNAME: location.hostname,
          TIME_TO_DOM_CONTENT_LOADED_START_MS: entry.domContentLoadedEventStart.toString(),
          TIME_TO_DOM_COMPLETE_MS: entry.domComplete.toString(),
          TIME_TO_DOM_INTERACTIVE_MS: entry.domInteractive.toString(),
          TIME_TO_LOAD_EVENT_START_MS: entry.loadEventStart.toString(),
          TIME_TO_LOAD_EVENT_END_MS: entry.loadEventEnd.toString(),
          TIME_TO_RESPONSE_START_MS: entry.responseStart.toString(),
          // Missing:
          // TIME_TO_NON_BLANK_PAINT_MS ( integer)
          // TIME_TO_DOM_LOADING_MS ( integer)
          // TIME_TO_FIRST_INTERACTION_MS ( integer)
        };
        port.postMessage({message: "navigate", payload});
      }
    }
  }
});

