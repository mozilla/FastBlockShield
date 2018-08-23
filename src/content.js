// TODO some of this should probably be transmitted earlier already, maybe on DOMContentLoaded.
window.addEventListener("load", () => {
  // We call setTimeout because otherwise our loadEventEnd entry (which is
  // filled after the "load" event handler runs) would be empty.
  setTimeout(function() {
    // there *should* be only one entry - I haven't see anything to the alternative yet
    const entry = performance.getEntriesByType("navigation")[0];

    const data = {
      pageReloaded: entry.type === "reload",
      etld: location.hostname,
      performanceEvents: {
        TIME_TO_DOM_CONTENT_LOADED_START_MS: entry.domContentLoadedEventStart,
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

    browser.runtime.sendMessage({message: "contentInfo", data});
  }, 0);
});

window.addEventListener("unload", () => {
  browser.runtime.sendMessage({message: "unload"});
});
