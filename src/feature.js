/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(feature)" }]*/

class Feature {
  constructor() {}

  configure(studyInfo) {
    const feature = this;
    const { variation } = studyInfo;

    // Initiate our browser action
    new BrowserActionButtonChoiceFeature(variation);

    // TODO: switch "variation.name" for int representing branch number, so I don't have to store it in a pref
    // TODO: how will I get the lists, will it be a pref?
    switch (variation.name) {
      case "TPL0":
        browser.prefs.setIntPref("privacy.fastblock.version", 0);
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setBoolPref("browser.fastblock.enabled", false);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "TPL1":
        browser.prefs.setIntPref("privacy.fastblock.version", 1);
        browser.prefs.setIntPref("privacy.fastblock.list", 1);
        browser.prefs.setBoolPref("browser.fastblock.enabled", false);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "TPL2":
        browser.prefs.setIntPref("privacy.fastblock.version", 2);
        browser.prefs.setIntPref("privacy.fastblock.list", 2);
        browser.prefs.setBoolPref("browser.fastblock.enabled", false);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "TPL3":
        browser.prefs.setIntPref("privacy.fastblock.version", 3);
        browser.prefs.setIntPref("privacy.fastblock.list", 3);
        browser.prefs.setBoolPref("browser.fastblock.enabled", false);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB2L0":
        browser.prefs.setIntPref("privacy.fastblock.version", 4);
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setIntPref("browser.fastblock.timeout", 2000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB2L1":
        browser.prefs.setIntPref("privacy.fastblock.version", 5);
        browser.prefs.setIntPref("privacy.fastblock.list", 1);
        browser.prefs.setIntPref("browser.fastblock.timeout", 2000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB2L2":
        browser.prefs.setIntPref("privacy.fastblock.version", 6);
        browser.prefs.setIntPref("privacy.fastblock.list", 2);
        browser.prefs.setIntPref("browser.fastblock.timeout", 2000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB2L3":
        browser.prefs.setIntPref("privacy.fastblock.version", 7);
        browser.prefs.setIntPref("privacy.fastblock.list", 3);
        browser.prefs.setIntPref("browser.fastblock.timeout", 2000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB5L0":
        browser.prefs.setIntPref("privacy.fastblock.version", 8);
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setIntPref("browser.fastblock.timeout", 5000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB5L1":
        browser.prefs.setIntPref("privacy.fastblock.version", 9);
        browser.prefs.setIntPref("privacy.fastblock.list", 1);
        browser.prefs.setIntPref("browser.fastblock.timeout", 5000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB5L2":
        browser.prefs.setIntPref("privacy.fastblock.version", 10);
        browser.prefs.setIntPref("privacy.fastblock.list", 2);
        browser.prefs.setIntPref("browser.fastblock.timeout", 5000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB5L3":
        browser.prefs.setIntPref("privacy.fastblock.version", 11);
        browser.prefs.setIntPref("privacy.fastblock.list", 3);
        browser.prefs.setIntPref("browser.fastblock.timeout", 5000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "Control":
        browser.prefs.setBoolPref("browser.fastblock.enabled", false);
        break;
      case "TT":
        browser.prefs.setIntPref("privacy.fastblock.version", 16);
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", true);
        break;
    }

    let portFromCS;
    function connected(p) {
      portFromCS = p;

      portFromCS.onMessage.addListener((m) => {
        if (m.message === "reload") {
          // Have the content script show the notification instead.
          // keeping this here for furture message passing.

          console.log("reload event");
          browser.notificationBar.show();
        }
      });
    }

    browser.runtime.onConnect.addListener(connected);

    browser.webNavigation.onCompleted.addListener(() => {
      portFromCS.postMessage({message: "navigation"});

      // const TIME_TO_DOM_CONTENT_LOADED_START_MS = performance.getEntries()[0].domContentLoadedEventStart;
      // const TIME_TO_DOM_COMPLETE_MS = performance.getEntries()[0].domComplete;
      // const TIME_TO_DOM_INTERACTIVE_MS = performance.getEntries()[0].domInteractive;
      // const TIME_TO_LOAD_EVENT_START_MS = performance.getEntries()[0].loadEventStart;
      // const TIME_TO_LOAD_EVENT_END_MS = performance.getEntries()[0].loadEventEnd;
    });

    // TIME_TO_NON_BLANK_PAINT_MS ( integer)
    // TIME_TO_DOM_LOADING_MS ( integer)
    // TIME_TO_FIRST_INTERACTION_MS ( integer)
    // TIME_TO_RESPONSE_START_MS ( integer)

    // var renderTime = perfData.domComplete - perfData.domLoading;
    // var perfData = window.performance.timing;
    // var pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  }

  /* good practice to have the literal 'sending' be wrapped up */
  sendTelemetry(stringStringMap) {
    browser.study.sendTelemetry(stringStringMap);
  }

  /**
   * Called at end of study, and if the user disables the study or it gets uninstalled by other means.
   */
  async cleanup() {}
}

class BrowserActionButtonChoiceFeature {
  /**
   * - set image, text, click handler (telemetry)
   */
  constructor(variation) {
    console.log(
      "Initializing BrowserActionButtonChoiceFeature:",
      variation.name,
    );
    this.timesClickedInSession = 0;

    browser.browserAction.onClicked.addListener(() => this.handleButtonClick());
    console.log("initialized");
  }

  /** handleButtonClick
   *
   * - instrument browserAction button clicks
   * - change label
   */
  handleButtonClick() {
    console.log("handleButtonClick");
    // note: doesn't persist across a session, unless you use localStorage or similar.
    this.timesClickedInSession += 1;
    console.log("got a click", this.timesClickedInSession);
    browser.browserAction.setBadgeText({
      text: this.timesClickedInSession.toString(),
    });

    // telemetry: FIRST CLICK
    if (this.timesClickedInSession === 1) {
      browser.study.sendTelemetry({ event: "button-first-click-in-session" });
    }

    // telemetry EVERY CLICK
    browser.study.sendTelemetry({
      event: "button-click",
      timesClickedInSession: "" + this.timesClickedInSession,
    });

    // webExtension-initiated ending for "used-often"
    //
    // - 3 timesClickedInSession in a session ends the study.
    // - see `../Config.jsm` for what happens during this ending.
    if (this.timesClickedInSession >= 3) {
      browser.study.endStudy("used-often");
    }
  }
}

// make an instance of the feature class available to background.js
// construct only. will be configured after setup
window.feature = new Feature();
