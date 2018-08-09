let port = browser.runtime.connect();

window.addEventListener("load", function() {
  // there *should* be only one entry - I haven't see anything to the alternative yet
  let entry = performance.getEntriesByType("navigation")[0];

  let data = {
    pageReloaded: entry.type == "reload",
    etld: location.hostname,
    performanceEvents: {
      TIME_TO_DOM_CONTENT_LOADED_START_MS: entry.domContentLoadedEventStart.toString(),
      TIME_TO_DOM_COMPLETE_MS: entry.domComplete,
      TIME_TO_DOM_INTERACTIVE_MS: entry.domInteractive,
      TIME_TO_LOAD_EVENT_START_MS: entry.loadEventStart,
      TIME_TO_LOAD_EVENT_END_MS: entry.loadEventEnd,
      TIME_TO_RESPONSE_START_MS: entry.responseStart,
    },
    // Missing:
    // TIME_TO_NON_BLANK_PAINT_MS ( integer)
    // TIME_TO_DOM_LOADING_MS ( integer)
    // TIME_TO_FIRST_INTERACTION_MS ( integer)
  };

  port.postMessage({message: "contentInfo", data});
});
