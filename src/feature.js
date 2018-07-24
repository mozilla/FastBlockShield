/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(feature)" }]*/

class Feature {
  constructor() {}

  configure(studyInfo) {
    const feature = this;
    const { variation } = studyInfo;

    // Initiate our browser action
    new BrowserActionButtonChoiceFeature(variation);

    // TODO: how will I get the lists, will it be a pref?
    switch (variation.name) {
      case "0":
        // "TPL0"
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setBoolPref("browser.fastblock.enabled", false);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "1":
        // "TPL1"
        browser.prefs.setIntPref("privacy.fastblock.list", 1);
        browser.prefs.setBoolPref("browser.fastblock.enabled", false);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "2":
        // "TPL2"
        browser.prefs.setIntPref("privacy.fastblock.list", 2);
        browser.prefs.setBoolPref("browser.fastblock.enabled", false);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "3":
        // "TPL3"
        browser.prefs.setIntPref("privacy.fastblock.list", 3);
        browser.prefs.setBoolPref("browser.fastblock.enabled", false);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "4":
        // "FB2L0"
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setIntPref("browser.fastblock.timeout", 2000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "5":
        // "FB2L1"
        browser.prefs.setIntPref("privacy.fastblock.list", 1);
        browser.prefs.setIntPref("browser.fastblock.timeout", 2000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "6":
        // "FB2L2"
        browser.prefs.setIntPref("privacy.fastblock.list", 2);
        browser.prefs.setIntPref("browser.fastblock.timeout", 2000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "7":
        // "FB2L3"
        browser.prefs.setIntPref("privacy.fastblock.list", 3);
        browser.prefs.setIntPref("browser.fastblock.timeout", 2000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "8":
        // "FB5L0"
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setIntPref("browser.fastblock.timeout", 5000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "9":
        // "FB5L1"
        browser.prefs.setIntPref("privacy.fastblock.list", 1);
        browser.prefs.setIntPref("browser.fastblock.timeout", 5000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "10":
        // "FB5L2"
        browser.prefs.setIntPref("privacy.fastblock.list", 2);
        browser.prefs.setIntPref("browser.fastblock.timeout", 5000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "11":
        // "FB5L3"
        browser.prefs.setIntPref("privacy.fastblock.list", 3);
        browser.prefs.setIntPref("browser.fastblock.timeout", 5000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "12":
        // Control
        browser.prefs.setBoolPref("browser.fastblock.enabled", false);
        break;
      case "13":
        // "TT"
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
        feature.payload = m.payload;

        if (m.message === "reload") {
          console.log("message here:", m);
          console.log("reload event");
          // TODO: copy implementation of page reload research - increment probability of showing survey https://docs.google.com/document/d/1u2AIjPwJdiU7dAz8vmefEObAZUnXMarfwbjnpzVjhXs/edit#heading=h.sdmvtreqzdw0

          browser.notificationBar.show();

          setTimeout(() => {
            // TODO: send only if trackers on page
            // Get # of trackers blocked add to payload

            feature.sendTelemetry(feature.payload);
          }, 20000); // 20 seconds, it's a reload, so we want to wait for the user's response
        } else if (m.message === "navigate") {
          setTimeout(() => {
            // TODO: send only if trackers on page
            // Get # of trackers blocked add to payload

            feature.sendTelemetry(feature.payload);
          }, 8000); // 8 seconds
        }
      });
    }
    browser.runtime.onConnect.addListener(connected);

    browser.webNavigation.onCompleted.addListener(() => {
      if (portFromCS) {
        portFromCS.postMessage({message: "navigation"});
      }
    });

    // TODO: ensure we send this telemetry before changing pages so as not to mix up 
    // the pings, danger of this because of the timeout.
    browser.notificationBar.onSurveyShown.addListener(
        () => {
          feature.addToPayload({
            SURVEY_SHOWN: "true",
          });
        },
      );

      browser.notificationBar.onReportPageBroken.addListener(
        () => {
          feature.addToPayload({
            SURVEY_REPORTED_BROKEN: "true",
          });
        },
      );

      browser.notificationBar.onReportPageNotBroken.addListener(
        () => {
          feature.addToPayload({
            SURVEY_REPORTED_BROKEN: "false",
          });
        },
      );
  }

  addToPayload(data) {
    console.log("adding to payload", data);
    feature.payload = {...this.payload, ...data};
  }

  /* good practice to have the literal 'sending' be wrapped up */
  sendTelemetry(stringStringMap) {
    browser.study.sendTelemetry(stringStringMap);
  }

  /**
   * Called at end of study, and if the user disables the study or it gets uninstalled by other means.
   */
  async cleanup() {
    // TODO: put prefs back
  }
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
