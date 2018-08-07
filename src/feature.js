/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(feature)" }]*/

class Feature {
  constructor() {}

  configure(studyInfo) {
    const feature = this;
    const { variation } = studyInfo;
    this.contentConnected = this.contentConnected.bind(this);
    this.payload = {};
    this.trackersOnPage = false;
    browser.storage.local.get("fastblockRecords").then((data) => {
      this.fastblockRecords = data || {};
    });

    // TODO: how will I get the lists, will it be a pref?
    // TODO reduce this to an array of sorts
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

    browser.runtime.onConnect.addListener(this.contentConnected);
    browser.webNavigation.onCompleted.addListener(() => {
      if (feature.portFromCS) {
        feature.portFromCS.postMessage({message: "navigation"});
      }
    });

    browser.trackers.listenForTrackers();
    browser.trackers.onLocationChanged.addListener(
      () => {
        // reset tracker status when location changes
        this.trackersOnPage = false;
      }
    );

    browser.trackers.onRecordTrackers.addListener(
      () => {
        this.trackersOnPage = true;
      }
    );

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

  contentConnected(p) {
    this.portFromCS = p;
    // Let the content know we've navigated.
    this.portFromCS.onMessage.addListener((m) => {
      // Only send telemetry and show notification if trackers exist on the page.
      if (!this.trackersOnPage) {
        console.log("trackers don't exist returning");
        return;
      }

      this.payload = {...m.payload};
      if (m.message === "reload") {
        // set default value so we can increment.
        this.fastblockRecords[m.payload.HOSTNAME] = this.fastblockRecords[m.payload.HOSTNAME] || {count: 0, survey_shown: false};
        this.fastblockRecords[m.payload.HOSTNAME].count += 1;
        if (!this.fastblockRecords[m.payload.HOSTNAME].survey_shown) {
          this.possiblyShowNotification(m.payload.HOSTNAME);
        }

        setTimeout(() => {
          this.sendTelemetry(this.payload);
        }, 20000); // 20 seconds, it's a reload, so we want to possibly wait for the user's response
      } else if (m.message === "navigate") {
        setTimeout(() => {
          this.sendTelemetry(this.payload);
        }, 8000); // 8 seconds
      }
    });
  }

  // start at 40% chance, increment by 10% until at 6 times, then it is guaranteed
  // currently, do not show question again per hostname
  // should this be per session per hostname? or X amount of times per hostname.
  // The refresh count is retained across sessions - ex if they refresh once
  // then close the browser and later refresh on the same page, that page's count
  // will be retained and incremented.
  possiblyShowNotification(hostname) {
    let reloadCount = this.fastblockRecords[hostname].count;
    let num = Math.floor(Math.random() * 10);
    if (num <= (3 + reloadCount)) {
      this.fastblockRecords[hostname].survey_shown = true;
      browser.notificationBar.show();
    }
    browser.storage.local.set({fastblockRecords: this.fastblockRecords});
  }

  addToPayload(data) {
    console.log("adding to payload", data);
    this.payload = {...this.payload, ...data};
  }

  // TODO: ensure we send this telemetry before changing pages so as not to mix up
  // the pings, danger of this because of the timeout.
  /* good practice to have the literal 'sending' be wrapped up */
  sendTelemetry(stringStringMap) {
    browser.study.sendTelemetry(stringStringMap);
    this.payload = {};
  }

  /**
   * Called at end of study, and if the user disables the study or it gets uninstalled by other means.
   */
  async cleanup() {
    // TODO: put prefs back
  }
}

// make an instance of the feature class available to background.js
// construct only. will be configured after setup
window.feature = new Feature();
