/**
 * A helper object to make it easier to store and retrieve information
 * about a specific tab, such as telemetry payload or how many times it was reloaded.
 */
window.TabRecords = {
  _tabs: new Map(),

  resetPayload(tabId) {
    const tabInfo = this._tabs.get(tabId);
    tabInfo.telemetryPayload = {
      etld: null,
      num_blockable_trackers: 0,
      num_trackers_blocked: 0,
      TIME_TO_DOM_CONTENT_LOADED_START_MS: -1,
      TIME_TO_DOM_COMPLETE_MS: -1,
      TIME_TO_DOM_INTERACTIVE_MS: -1,
      TIME_TO_LOAD_EVENT_START_MS: -1,
      TIME_TO_LOAD_EVENT_END_MS: -1,
      TIME_TO_RESPONSE_START_MS: -1,
      // Missing:
      // TIME_TO_NON_BLANK_PAINT_MS ( integer)
      // TIME_TO_DOM_LOADING_MS ( integer)
      // TIME_TO_FIRST_INTERACTION_MS ( integer)
      page_reloaded: false,
      page_reloaded_survey: 0,
      user_reported_page_breakage: false,
      num_script_url_page: 0,
      num_EvalError: 0,
      num_InternalError: 0,
      num_RangeError: 0,
      num_ReferenceError: 0,
      num_SyntaxError: 0,
      num_TypeError: 0,
      num_URIError: 0,
      num_SecurityError: 0,
    };

    return tabInfo;
  },

  getOrInsertTabInfo(tabId) {
    let tabInfo = this._tabs.get(tabId);
    if (tabInfo) {
      return tabInfo;
    }

    tabInfo = {
      surveyShown: false,
      reloadCount: 0,
      hasTrackers: false,
    };

    this._tabs.set(tabId, tabInfo);
    this.resetPayload(tabId);
    return tabInfo;
  },

  deleteTabEntry(tabId) {
    this._tabs.delete(tabId);
  },
};
