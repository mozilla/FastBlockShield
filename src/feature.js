/* global TabRecords, VARIATIONS */

// Constants for the page_reloaded_survey telemetry probe.
const SURVEY_SHOWN = 1;
const SURVEY_PAGE_BROKEN = 2;
const SURVEY_PAGE_NOT_BROKEN = 3;

class Feature {
  constructor() {}

  async configure(studyInfo) {
    let { variation } = studyInfo;

    // The userid will be used to create a unique hash
    // for the etld + userid combination.
    let {userid} = await browser.storage.local.get("userid");
    if (!userid) {
      userid = this.generateUUID();
      await browser.storage.local.set({userid});
    }
    this.userid = userid;

    variation = VARIATIONS[variation.name];

    for (const pref in variation.prefs) {
      browser.prefs.registerPrefCleanup(pref);

      const value = variation.prefs[pref];
      if (typeof value === "boolean") {
        browser.prefs.setBoolPref(pref, value);
      } else if (typeof value === "string") {
        browser.prefs.setStringPref(pref, value);
      } else if (typeof value === "number") {
        browser.prefs.setIntPref(pref, value);
      }
    }

    // Initialize listeners in privileged code.
    browser.trackers.init();

    // Whenever trackers are detected on a tab, record their presence.
    browser.trackers.onRecordTrackers.addListener(
      (tabId, trackersFound, trackersBlocked) => {
        if (tabId < 0) {
          return;
        }
        const tabInfo = TabRecords.getOrInsertTabInfo(tabId);
        tabInfo.hasTrackers = true;
        tabInfo.telemetryPayload.num_blockable_trackers = trackersFound;
        tabInfo.telemetryPayload.num_trackers_blocked = trackersBlocked;
      }
    );

    // Record when users submitted a breakage report in the control center.
    browser.trackers.onReportBreakage.addListener(
      tabId => {
        if (tabId < 0) {
          return;
        }

        const tabInfo = TabRecords.getOrInsertTabInfo(tabId);
        tabInfo.telemetryPayload.user_reported_page_breakage = true;
      }
    );
    browser.trackers.onAddException.addListener(tabId => {
      if (tabId < 0) {
        return;
      }
      const tabInfo = TabRecords.getOrInsertTabInfo(tabId);
      tabInfo.telemetryPayload.user_added_exception = true;
    });

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

        // Reset survey count when no longer refreshing
        if (!data.pageReloaded) {
          tabInfo.surveyShown = false;
          tabInfo.reloadCount = 0;
        }

        tabInfo.telemetryPayload.page_reloaded = data.pageReloaded;
        for (const key in data.performanceEvents) {
          tabInfo.telemetryPayload[key] = data.performanceEvents[key];
        }

        this.SHA256(userid + data.etld).then(hash => {
          tabInfo.telemetryPayload.etld = hash;

          // Show the user a survey if the page was reloaded.
          if (data.pageReloaded && tabInfo.hasTrackers) {
            tabInfo.reloadCount += 1;
            this.possiblyShowNotification(tabInfo);
          }
        });
      }
    });

    // Watch for the user pressing the "Yes this page is broken"
    // button and record the answer.
    browser.notificationBar.onReportPageBroken.addListener(
      tabId => {
        const tabInfo = TabRecords.getOrInsertTabInfo(tabId);
        tabInfo.telemetryPayload.page_reloaded_survey = SURVEY_PAGE_BROKEN;
        this.recordSurveyInteraction(tabInfo);
      },
    );

    // Watch for the user pressing the "No this page is not broken"
    // button and record the answer.
    browser.notificationBar.onReportPageNotBroken.addListener(
      tabId => {
        const tabInfo = TabRecords.getOrInsertTabInfo(tabId);
        tabInfo.telemetryPayload.page_reloaded_survey = SURVEY_PAGE_NOT_BROKEN;
        this.recordSurveyInteraction(tabInfo);
      },
    );

    browser.trackers.onErrorDetected.addListener(
      (error, tabId) => {
        this.recordPageError(error, tabId);
      }
    );
  }

  recordSurveyInteraction(tabInfo) {
    browser.storage.local.set({[tabInfo.telemetryPayload.etld]: true});
  }

  recordPageError(error, tabId) {
    const tabInfo = TabRecords.getOrInsertTabInfo(tabId);
    if (`num_${error}` in tabInfo.telemetryPayload) {
      tabInfo.telemetryPayload[`num_${error}`] += 1;
    }
  }

  // Adapted from https://gist.github.com/jed/982883
  generateUUID() {
    const randomNumbers = window.crypto.getRandomValues(new Uint8Array(32)).values();
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, a =>
      (a ^ randomNumbers.next().value & 0b1111 >> a / 4).toString(16)
    );
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

  // Start at 40% chance of showing the notification,
  // increment by 10% until at 6 times, then it is guaranteed.
  // Never show the popup again on the same site if the popup has been interacted with.
  // If the popup is ignored, do not show it while the user continues refreshing
  // but reset upon navigation and possibly show again. The popup can show again on the
  // same site and page if it was ignored.
  async possiblyShowNotification(tabInfo) {
    const storedEtld = await browser.storage.local.get(tabInfo.telemetryPayload.etld);
    if (storedEtld[tabInfo.telemetryPayload.etld] || tabInfo.surveyShown) {
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
    // This is not triggering properly, see
    // https://github.com/mozilla/shield-studies-addon-utils/issues/246
  }
}

// make an instance of the feature class available to background.js
// construct only. will be configured after setup
window.feature = new Feature();
