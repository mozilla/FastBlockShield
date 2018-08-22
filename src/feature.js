/* global TabRecords */

// Constants for the page_reloaded_survey telemetry probe.
const SURVEY_SHOWN = 1;
const SURVEY_PAGE_BROKEN = 2;
const SURVEY_PAGE_NOT_BROKEN = 3;

class Feature {
  constructor() {}

  async configure(studyInfo) {
    const { variation } = studyInfo;

    // The userid will be used to create a unique hash
    // for the etld + userid combination.
    let {userid} = await browser.storage.sync.get("userid");
    if (!userid) {
      userid = this.generateUUID();
      await browser.storage.sync.set({userid});
    }
    this.userid = userid;

    // TODO: how will I get the lists, will it be a pref?
    // TODO reduce this to an array of sorts
    switch (variation.name) {
      case "TPL0":
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setBoolPref("browser.fastblock.enabled", false);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "TPL1":
        browser.prefs.setIntPref("privacy.fastblock.list", 1);
        browser.prefs.setBoolPref("browser.fastblock.enabled", false);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "TPL2":
        browser.prefs.setIntPref("privacy.fastblock.list", 2);
        browser.prefs.setBoolPref("browser.fastblock.enabled", false);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "TPL3":
        browser.prefs.setIntPref("privacy.fastblock.list", 3);
        browser.prefs.setBoolPref("browser.fastblock.enabled", false);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", true);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB2L0":
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setIntPref("browser.fastblock.timeout", 2000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB2L1":
        browser.prefs.setIntPref("privacy.fastblock.list", 1);
        browser.prefs.setIntPref("browser.fastblock.timeout", 2000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB2L2":
        browser.prefs.setIntPref("privacy.fastblock.list", 2);
        browser.prefs.setIntPref("browser.fastblock.timeout", 2000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB2L3":
        browser.prefs.setIntPref("privacy.fastblock.list", 3);
        browser.prefs.setIntPref("browser.fastblock.timeout", 2000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB5L0":
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setIntPref("browser.fastblock.timeout", 5000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB5L1":
        browser.prefs.setIntPref("privacy.fastblock.list", 1);
        browser.prefs.setIntPref("browser.fastblock.timeout", 5000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB5L2":
        browser.prefs.setIntPref("privacy.fastblock.list", 2);
        browser.prefs.setIntPref("browser.fastblock.timeout", 5000);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", false);
        break;
      case "FB5L3":
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
        browser.prefs.setIntPref("privacy.fastblock.list", 0);
        browser.prefs.setBoolPref("browser.fastblock.enabled", true);
        browser.prefs.setBoolPref("privacy.trackingprotection.enabled", false);
        browser.prefs.setBoolPref("network.http.tailing.enabled", true);
        break;
    }

    // Whenever trackers are detected on a tab, record their presence.
    browser.trackers.listenForTrackers();
    browser.trackers.onRecordTrackers.addListener(
      tabId => {
        if (tabId < 0) {
          return;
        }
        const tabInfo = TabRecords.getOrInsertTabInfo(tabId);
        tabInfo.hasTrackers = true;
      }
    );

    // When a tab is removed, make sure to submit telemetry for the
    // last page and delete the tab entry.
    browser.tabs.onRemoved.addListener(tabId => {
      const tabInfo = TabRecords.getOrInsertTabInfo(tabId);
      // Only submit telemetry if we have recorded load info and
      // the tab actually has trackers.
      if (tabInfo.telemetryPayload.etld && tabInfo.hasTrackers) {
        this.sendTelemetry(tabInfo.telemetryPayload);
      }
      TabRecords.deleteTabEntry(tabId);
    });

    // Watch for messages from the content script about page information
    // such as whether the page was reloaded and load timing info.
    browser.runtime.onMessage.addListener((content, sender) => {
      // When the top-level location of a tab changes, submit telemetry probes
      // for the old page and reset the payload to record the new page.
      if (content.message === "unload") {
        const tabInfo = TabRecords.getOrInsertTabInfo(sender.tab.id);
        // Only submit telemetry if we have recorded load info and
        // the tab actually has trackers.
        if (tabInfo.telemetryPayload.etld && tabInfo.hasTrackers) {
          this.sendTelemetry(tabInfo.telemetryPayload);
        }
        TabRecords.resetPayload(sender.tab.id);
        tabInfo.hasTrackers = false;

      // We've arrived at a page, record the timing and page error telemetry.
      } else if (content.message === "contentInfo") {
        const {data} = content;
        const tabInfo = TabRecords.getOrInsertTabInfo(sender.tab.id);

        this.SHA256(userid + data.etld).then(hash => {
          tabInfo.telemetryPayload.etld = hash;
        });

        tabInfo.telemetryPayload.page_reloaded = data.pageReloaded;
        for (const key in data.performanceEvents) {
          tabInfo.telemetryPayload[key] = data.performanceEvents[key];
        }

        // Show the user a survey if the page was reloaded.
        if (data.pageReloaded && tabInfo.hasTrackers) {
          tabInfo.reloadCount += 1;
          this.possiblyShowNotification(tabInfo);
        }
      }
    });

    // Watch for the user pressing the "Yes this page is broken"
    // button and record the answer.
    browser.notificationBar.onReportPageBroken.addListener(
      tabId => {
        const tabInfo = TabRecords.getOrInsertTabInfo(tabId);
        tabInfo.telemetryPayload.page_reloaded_survey = SURVEY_PAGE_BROKEN;
      },
    );

    // Watch for the user pressing the "No this page is not broken"
    // button and record the answer.
    browser.notificationBar.onReportPageNotBroken.addListener(
      tabId => {
        const tabInfo = TabRecords.getOrInsertTabInfo(tabId);
        tabInfo.telemetryPayload.page_reloaded_survey = SURVEY_PAGE_NOT_BROKEN;
      },
    );

    browser.trackers.onErrorDetected.addListener(
      (error, tabId) => {
        this.recordPageError(error, tabId);
      }
    );
  }

  recordPageError(error, tabId) {
    const tabInfo = TabRecords.getOrInsertTabInfo(tabId);
    if (`num_${error}` in tabInfo.telemetryPayload) {
      tabInfo.telemetryPayload[`num_${error}`] += 1;
    }
  }

  generateUUID() {
    let d = new Date().getTime();
    const uuid = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[x]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  SHA256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder("utf-8").encode(message);
    // hash the message
    return crypto.subtle.digest("SHA-256", msgBuffer).then((hash) => {
      // convert ArrayBuffer to Array
      const hashArray = Array.from(new Uint8Array(hash));
      // convert bytes to hex string
      const hashHex = hashArray.map(b => ("00" + b.toString(16)).slice(-2)).join("");
      return hashHex;
    });
  }

  // start at 40% chance, increment by 10% until at 6 times, then it is guaranteed
  // currently, do not show question again per hostname
  // should this be per session per hostname? or X amount of times per hostname.
  // The refresh count is retained across sessions - ex if they refresh once
  // then close the browser and later refresh on the same page, that page's count
  // will be retained and incremented.
  possiblyShowNotification(tabInfo) {
    if (tabInfo.surveyShown) {
      return;
    }

    const num = Math.floor(Math.random() * 10);
    if (num <= (3 + tabInfo.reloadCount)) {
      tabInfo.telemetryPayload.page_reloaded_survey = SURVEY_SHOWN;
      tabInfo.surveyShown = true;
      browser.notificationBar.show();
    }
  }

  /**
   * Takes a flat JSON object, converts all values to strings and
   * submits it to Shield telemetry.
   */
  sendTelemetry(payload) {
    const stringToStringMap = {};

    // Shield Telemetry deals with flat string-string mappings.
    for (const key in payload) {
      stringToStringMap[key] = payload[key].toString();
    }

    browser.study.sendTelemetry(stringToStringMap);
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
