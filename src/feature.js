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
        let tabInfo = TabRecords.getOrInsertTabInfo(tabId);
        tabInfo.hasTrackers = true;
      }
    );

    // When the top-level location of a tab changes, submit telemetry probes
    // for the old page and reset the payload to record the new page.
    browser.trackers.onLocationChanged.addListener(
      async (tabId) => {
        if (tabId < 0) {
          return;
        }
        let tabInfo = TabRecords.getOrInsertTabInfo(tabId);
        // Only submit telemetry if we have recorded load info and
        // the tab actually has trackers.
        if (tabInfo.telemetryPayload.etld && tabInfo.hasTrackers) {
          this.sendTelemetry(tabInfo.telemetryPayload);
        }
        TabRecords.resetPayload(tabId);
        tabInfo.hasTrackers = false;
      }
    );

    // When a tab is removed, make sure to submit telemetry for the
    // last page and delete the tab entry.
    browser.tabs.onRemoved.addListener(tabId => {
      let tabInfo = TabRecords.getOrInsertTabInfo(tabId);
      // Only submit telemetry if we have recorded load info and
      // the tab actually has trackers.
      if (tabInfo.telemetryPayload.etld && tabInfo.hasTrackers) {
        this.sendTelemetry(tabInfo.telemetryPayload);
      }
      TabRecords.deleteTabEntry(tabId);
    });

    // Watch for messages from the content script about page information
    // such as whether the page was reloaded and load timing info.
    browser.runtime.onConnect.addListener((p) => {
      p.onMessage.addListener(({data}) => {
        let tabInfo = TabRecords.getOrInsertTabInfo(p.sender.tab.id);
        tabInfo.telemetryPayload.etld = this.SHA256(userid + data.etld);
        tabInfo.telemetryPayload.page_reloaded = data.pageReloaded;
        for (let key in data.performanceEvents) {
          tabInfo.telemetryPayload[key] = data.performanceEvents[key];
        }

        // Show the user a survey if the page was reloaded.
        if (data.pageReloaded && tabInfo.hasTrackers) {
          tabInfo.reloadCount += 1;
          this.possiblyShowNotification(tabInfo);
        }
      });
    });

    // Watch for the user pressing the "Yes this page is broken"
    // button and record the answer.
    browser.notificationBar.onReportPageBroken.addListener(
      tabId => {
        let tabInfo = TabRecords.getOrInsertTabInfo(tabId);
        tabInfo.telemetryPayload.page_reloaded_survey = SURVEY_PAGE_BROKEN;
      },
    );

    // Watch for the user pressing the "No this page is not broken"
    // button and record the answer.
    browser.notificationBar.onReportPageNotBroken.addListener(
      tabId => {
        let tabInfo = TabRecords.getOrInsertTabInfo(tabId);
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
    } else {
      tabInfo.telemetryPayload.num_JS_exceptions += 1;
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

  /**
  *
  *  Secure Hash Algorithm (SHA256)
  *  http://www.webtoolkit.info/
  *
  *  Original code by Angel Marin, Paul Johnston.
  *
  **/
  SHA256(s) {
    const chrsz   = 8;
    const hexcase = 0;
    function safe_add(x, y) {
      const lsw = (x & 0xFFFF) + (y & 0xFFFF);
      const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }
    function S(X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R(X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
    function core_sha256(m, l) {
      const K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
        0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74,
        0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC,
        0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8,
        0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138,
        0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1,
        0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
        0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F,
        0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB,
        0xBEF9A3F7, 0xC67178F2);
      const HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F,
        0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
      const W = new Array(64);
      let a, b, c, d, e, f, g, h;
      let T1, T2;
      m[l >> 5] |= 0x80 << (24 - l % 32);
      m[((l + 64 >> 9) << 4) + 15] = l;
      for (let i = 0; i < m.length; i += 16) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        f = HASH[5];
        g = HASH[6];
        h = HASH[7];
        for (let j = 0; j < 64; j++) {
          if (j < 16) W[j] = m[j + i];
          else {
            W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]),
              Gamma0256(W[j - 15])), W[j - 16]);
          }
          T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
          T2 = safe_add(Sigma0256(a), Maj(a, b, c));
          h = g;
          g = f;
          f = e;
          e = safe_add(d, T1);
          d = c;
          c = b;
          b = a;
          a = safe_add(T1, T2);
        }
        HASH[0] = safe_add(a, HASH[0]);
        HASH[1] = safe_add(b, HASH[1]);
        HASH[2] = safe_add(c, HASH[2]);
        HASH[3] = safe_add(d, HASH[3]);
        HASH[4] = safe_add(e, HASH[4]);
        HASH[5] = safe_add(f, HASH[5]);
        HASH[6] = safe_add(g, HASH[6]);
        HASH[7] = safe_add(h, HASH[7]);
      }
      return HASH;
    }
    function str2binb(str) {
      const bin = Array();
      const mask = (1 << chrsz) - 1;
      for (let i = 0; i < str.length * chrsz; i += chrsz) {
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
      }
      return bin;
    }
    function Utf8Encode(string) {
      string = string.replace(/\r\n/g, "\n");
      let utftext = "";
      for (let n = 0; n < string.length; n++) {
        const c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    }
    function binb2hex(binarray) {
      const hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
      let str = "";
      for (let i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
        hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
      }
      return str;
    }
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
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
    let stringToStringMap = {};

    // Shield Telemetry deals with flat string-string mappings.
    for (let key in payload) {
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
