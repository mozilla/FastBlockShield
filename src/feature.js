/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(feature)" }]*/

class Feature {
  constructor() {}

  configure(studyInfo) {
    const feature = this;
    const { variation, isFirstRun } = studyInfo;

    // Initiate our browser action
    new BrowserActionButtonChoiceFeature(variation);

    switch (variation.name) {
      case "TPL0":
        browser.prefs.setIntPref("privacy.fastblock.version", 0);
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setIntPref("privacy.fastblock.enabled", -1);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "TPL1":
        browser.prefs.setIntPref("privacy.fastblock.version", 1);
        browser.prefs.setIntPref("privacy.fastblock.list", 1);
        browser.prefs.setIntPref("privacy.fastblock.enabled", -1);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "TPL2":
        browser.prefs.setIntPref("privacy.fastblock.version", 2);
        browser.prefs.setIntPref("privacy.fastblock.list", 2);
        browser.prefs.setIntPref("privacy.fastblock.enabled", -1);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "TPL3":
        browser.prefs.setIntPref("privacy.fastblock.version", 3);
        browser.prefs.setIntPref("privacy.fastblock.list", 3);
        browser.prefs.setIntPref("privacy.fastblock.enabled", -1);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB2L0":
        browser.prefs.setIntPref("privacy.fastblock.version", 4);
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setIntPref("privacy.fastblock.enabled", 0);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB2L1":
        browser.prefs.setIntPref("privacy.fastblock.version", 5);
        browser.prefs.setIntPref("privacy.fastblock.list", 1);
        browser.prefs.setIntPref("privacy.fastblock.enabled", 0);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB2L2":
        browser.prefs.setIntPref("privacy.fastblock.version", 6);
        browser.prefs.setIntPref("privacy.fastblock.list", 2);
        browser.prefs.setIntPref("privacy.fastblock.enabled", 0);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB2L3":
        browser.prefs.setIntPref("privacy.fastblock.version", 7);
        browser.prefs.setIntPref("privacy.fastblock.list", 3);
        browser.prefs.setIntPref("privacy.fastblock.enabled", 0);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB5L0":
        browser.prefs.setIntPref("privacy.fastblock.version", 8);
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setIntPref("privacy.fastblock.enabled", 1);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB5L1":
        browser.prefs.setIntPref("privacy.fastblock.version", 9);
        browser.prefs.setIntPref("privacy.fastblock.list", 1);
        browser.prefs.setIntPref("privacy.fastblock.enabled", 1);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB5L2":
        browser.prefs.setIntPref("privacy.fastblock.version", 10);
        browser.prefs.setIntPref("privacy.fastblock.list", 2);
        browser.prefs.setIntPref("privacy.fastblock.enabled", 1);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB5L3":
        browser.prefs.setIntPref("privacy.fastblock.version", 11);
        browser.prefs.setIntPref("privacy.fastblock.list", 3);
        browser.prefs.setIntPref("privacy.fastblock.enabled", 1);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "Control":
        browser.prefs.setIntPref("privacy.fastblock.version", 1000);
        break;
      case "TT":
        browser.prefs.setIntPref("privacy.fastblock.version", 16);
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setIntPref("privacy.fastblock.enabled", -1);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", true);
        break;
    }

    // perform something only during first run
    if (isFirstRun) {
      browser.introductionNotificationBar.onIntroductionShown.addListener(
        () => {
          console.log("onIntroductionShown");

          feature.sendTelemetry({
            event: "onIntroductionShown",
          });
        },
      );

      browser.introductionNotificationBar.onIntroductionAccept.addListener(
        () => {
          console.log("onIntroductionAccept");
          feature.sendTelemetry({
            event: "onIntroductionAccept",
          });
        },
      );

      browser.introductionNotificationBar.onIntroductionLeaveStudy.addListener(
        () => {
          console.log("onIntroductionLeaveStudy");
          feature.sendTelemetry({
            event: "onIntroductionLeaveStudy",
          });
          browser.study.endStudy("introduction-leave-study");
        },
      );
      browser.introductionNotificationBar.show(variation.name);
    }
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
