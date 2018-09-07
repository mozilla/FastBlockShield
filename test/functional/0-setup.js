/* eslint-env node, mocha */

// for unhandled promise rejection debugging
process.on("unhandledRejection", r => console.error(r)); // eslint-disable-line no-console

const {assert} = require("chai");
const utils = require("./utils");
const SETUP_DELAY = process.env.DELAY ? parseInt(process.env.DELAY) : 500;

const allPrefs = [
  "browser.contentblocking.enabled",
  "browser.contentblocking.ui.enabled",
  "security.pki.distrust_ca_policy",
  "browser.contentblocking.reportBreakage.enabled",
  "browser.fastblock.enabled",
  "browser.fastblock.timeout",
  "privacy.trackingprotection.enabled",
  "network.http.tailing.enabled",
  "urlclassifier.trackingTable",
  "urlclassifier.trackingAnnotationTable",
  "urlclassifier.trackingAnnotationWhitelistTable",
  "browser.contentblocking.fastblock.ui.enabled",
  "browser.contentblocking.fastblock.control-center.ui.enabled",
  "browser.contentblocking.trackingprotection.ui.enabled",
  "browser.contentblocking.trackingprotection.control-center.ui.enabled",
  "browser.safebrowsing.provider.mozilla.lists",
];

async function checkPrefs(driver, prefs) {
  for (const pref of allPrefs) {
    // eslint-disable-next-line eqeqeq
    if (prefs[pref] != undefined) {
      const val = await utils.getPreference(driver, pref);
      assert.equal(val, prefs[pref], `set the right pref for ${pref}`);
    } else {
      const hasUserValue = await utils.prefHasUserValue(driver, pref);
      assert.isFalse(hasUserValue, `${pref} is set to the default`);
    }
  }
}

describe("setup and teardown", function() {
  // This gives Firefox time to start, and us a bit longer during some of the tests.
  this.timeout(SETUP_DELAY * 15);

  let driver;

  // runs ONCE
  before(async () => {
    driver = await utils.setupWebdriver.promiseSetupDriver(
      utils.FIREFOX_PREFERENCES,
    );
  });

  after(() => {
    driver.quit();
  });

  describe("sets up the correct prefs, depending on the variation", function() {
    let addonId;

    describe("sets the correct prefs for variation TP", () => {
      before(async () => {
        await utils.setPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName", "TP");
        addonId = await utils.setupWebdriver.installAddon(driver);
        await driver.sleep(SETUP_DELAY);
      });

      it("has the correct prefs after install", async () => {
        await checkPrefs(driver, {
          "browser.contentblocking.enabled": true,
          "browser.contentblocking.ui.enabled": true,
          "security.pki.distrust_ca_policy": 1,
          "browser.contentblocking.reportBreakage.enabled": true,
          "browser.fastblock.enabled": false,
          "privacy.trackingprotection.enabled": true,
          "network.http.tailing.enabled": true,
          "urlclassifier.trackingTable": "test-track-simple,base-track-digest256",
          "browser.contentblocking.fastblock.ui.enabled": false,
          "browser.contentblocking.fastblock.control-center.ui.enabled": false,
        });
      });

      it("has the correct prefs after uninstall", async () => {
        await utils.setupWebdriver.uninstallAddon(driver, addonId);
        await checkPrefs(driver, {});
      });

      after(async () => {
        await utils.clearPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName");
      });
    });

    describe("sets the correct prefs for variation FB2L0", () => {
      before(async () => {
        await utils.setPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName", "FB2L0");
        addonId = await utils.setupWebdriver.installAddon(driver);
        await driver.sleep(SETUP_DELAY);
      });

      it("has the correct prefs after install", async () => {
        await checkPrefs(driver, {
          "browser.contentblocking.enabled": true,
          "browser.contentblocking.ui.enabled": true,
          "security.pki.distrust_ca_policy": 1,
          "browser.contentblocking.reportBreakage.enabled": true,
          "browser.fastblock.enabled": true,
          "browser.fastblock.timeout": 2000,
          "privacy.trackingprotection.enabled": false,
          "network.http.tailing.enabled": true,
          "urlclassifier.trackingAnnotationTable": "test-track-simple,base-track-digest256",
          "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256",
          "browser.contentblocking.trackingprotection.ui.enabled": false,
          "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
        });
      });

      it("has the correct prefs after uninstall", async () => {
        await utils.setupWebdriver.uninstallAddon(driver, addonId);
        await checkPrefs(driver, {});
      });

      after(async () => {
        await utils.clearPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName");
      });
    });

    describe("sets the correct prefs for variation FB2L1", () => {
      before(async () => {
        await utils.setPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName", "FB2L1");
        addonId = await utils.setupWebdriver.installAddon(driver);
        await driver.sleep(SETUP_DELAY);
      });

      it("has the correct prefs after install", async () => {
        await checkPrefs(driver, {
          "browser.contentblocking.enabled": true,
          "browser.contentblocking.ui.enabled": true,
          "security.pki.distrust_ca_policy": 1,
          "browser.contentblocking.reportBreakage.enabled": true,
          "browser.fastblock.enabled": true,
          "browser.fastblock.timeout": 2000,
          "privacy.trackingprotection.enabled": false,
          "network.http.tailing.enabled": true,
          "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock1-track-digest256",
          "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock1-trackwhite-digest256",
          "browser.contentblocking.trackingprotection.ui.enabled": false,
          "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
          "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock1-track-digest256,fastblock1-trackwhite-digest256",
        });
      });

      it("has the correct prefs after uninstall", async () => {
        await utils.setupWebdriver.uninstallAddon(driver, addonId);
        await checkPrefs(driver, {});
      });

      after(async () => {
        await utils.clearPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName");
      });
    });

    describe("sets the correct prefs for variation FB2L2", () => {
      before(async () => {
        await utils.setPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName", "FB2L2");
        addonId = await utils.setupWebdriver.installAddon(driver);
        await driver.sleep(SETUP_DELAY);
      });

      it("has the correct prefs after install", async () => {
        await checkPrefs(driver, {
          "browser.contentblocking.enabled": true,
          "browser.contentblocking.ui.enabled": true,
          "security.pki.distrust_ca_policy": 1,
          "browser.contentblocking.reportBreakage.enabled": true,
          "browser.fastblock.enabled": true,
          "browser.fastblock.timeout": 2000,
          "privacy.trackingprotection.enabled": false,
          "network.http.tailing.enabled": true,
          "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock2-track-digest256",
          "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock2-trackwhite-digest256",
          "browser.contentblocking.trackingprotection.ui.enabled": false,
          "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
          "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock2-track-digest256,fastblock2-trackwhite-digest256",
        });
      });

      it("has the correct prefs after uninstall", async () => {
        await utils.setupWebdriver.uninstallAddon(driver, addonId);
        await checkPrefs(driver, {});
      });

      after(async () => {
        await utils.clearPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName");
      });
    });

    describe("sets the correct prefs for variation FB2L3", () => {
      before(async () => {
        await utils.setPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName", "FB2L3");
        addonId = await utils.setupWebdriver.installAddon(driver);
        await driver.sleep(SETUP_DELAY);
      });

      it("has the correct prefs after install", async () => {
        await checkPrefs(driver, {
          "browser.contentblocking.enabled": true,
          "browser.contentblocking.ui.enabled": true,
          "security.pki.distrust_ca_policy": 1,
          "browser.contentblocking.reportBreakage.enabled": true,
          "browser.fastblock.enabled": true,
          "browser.fastblock.timeout": 2000,
          "privacy.trackingprotection.enabled": false,
          "network.http.tailing.enabled": true,
          "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock3-track-digest256",
          "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256",
          "browser.contentblocking.trackingprotection.ui.enabled": false,
          "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
          "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock3-track-digest256",
        });
      });

      it("has the correct prefs after uninstall", async () => {
        await utils.setupWebdriver.uninstallAddon(driver, addonId);
        await checkPrefs(driver, {});
      });

      after(async () => {
        await utils.clearPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName");
      });
    });

    describe("sets the correct prefs for variation FB5L0", () => {
      before(async () => {
        await utils.setPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName", "FB5L0");
        addonId = await utils.setupWebdriver.installAddon(driver);
        await driver.sleep(SETUP_DELAY);
      });

      it("has the correct prefs after install", async () => {
        await checkPrefs(driver, {
          "browser.contentblocking.enabled": true,
          "browser.contentblocking.ui.enabled": true,
          "security.pki.distrust_ca_policy": 1,
          "browser.contentblocking.reportBreakage.enabled": true,
          "browser.fastblock.enabled": true,
          "browser.fastblock.timeout": 5000,
          "privacy.trackingprotection.enabled": false,
          "network.http.tailing.enabled": true,
          "urlclassifier.trackingAnnotationTable": "test-track-simple,base-track-digest256",
          "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256",
          "browser.contentblocking.trackingprotection.ui.enabled": false,
          "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
        });
      });

      it("has the correct prefs after uninstall", async () => {
        await utils.setupWebdriver.uninstallAddon(driver, addonId);
        await checkPrefs(driver, {});
      });

      after(async () => {
        await utils.clearPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName");
      });
    });

    describe("sets the correct prefs for variation FB5L1", () => {
      before(async () => {
        await utils.setPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName", "FB5L1");
        addonId = await utils.setupWebdriver.installAddon(driver);
        await driver.sleep(SETUP_DELAY);
      });

      it("has the correct prefs after install", async () => {
        await checkPrefs(driver, {
          "browser.contentblocking.enabled": true,
          "browser.contentblocking.ui.enabled": true,
          "security.pki.distrust_ca_policy": 1,
          "browser.contentblocking.reportBreakage.enabled": true,
          "browser.fastblock.enabled": true,
          "browser.fastblock.timeout": 5000,
          "privacy.trackingprotection.enabled": false,
          "network.http.tailing.enabled": true,
          "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock1-track-digest256",
          "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock1-trackwhite-digest256",
          "browser.contentblocking.trackingprotection.ui.enabled": false,
          "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
          "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock1-track-digest256,fastblock1-trackwhite-digest256",
        });
      });

      it("has the correct prefs after uninstall", async () => {
        await utils.setupWebdriver.uninstallAddon(driver, addonId);
        await checkPrefs(driver, {});
      });

      after(async () => {
        await utils.clearPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName");
      });
    });

    describe("sets the correct prefs for variation FB5L2", () => {
      before(async () => {
        await utils.setPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName", "FB5L2");
        addonId = await utils.setupWebdriver.installAddon(driver);
        await driver.sleep(SETUP_DELAY);
      });

      it("has the correct prefs after install", async () => {
        await checkPrefs(driver, {
          "browser.contentblocking.enabled": true,
          "browser.contentblocking.ui.enabled": true,
          "security.pki.distrust_ca_policy": 1,
          "browser.contentblocking.reportBreakage.enabled": true,
          "browser.fastblock.enabled": true,
          "browser.fastblock.timeout": 5000,
          "privacy.trackingprotection.enabled": false,
          "network.http.tailing.enabled": true,
          "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock2-track-digest256",
          "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock2-trackwhite-digest256",
          "browser.contentblocking.trackingprotection.ui.enabled": false,
          "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
          "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock2-track-digest256,fastblock2-trackwhite-digest256",
        });
      });

      it("has the correct prefs after uninstall", async () => {
        await utils.setupWebdriver.uninstallAddon(driver, addonId);
        await checkPrefs(driver, {});
      });

      after(async () => {
        await utils.clearPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName");
      });
    });

    describe("sets the correct prefs for variation FB5L3", () => {
      before(async () => {
        await utils.setPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName", "FB5L3");
        addonId = await utils.setupWebdriver.installAddon(driver);
        await driver.sleep(SETUP_DELAY);
      });

      it("has the correct prefs after install", async () => {
        await checkPrefs(driver, {
          "browser.contentblocking.enabled": true,
          "browser.contentblocking.ui.enabled": true,
          "security.pki.distrust_ca_policy": 1,
          "browser.contentblocking.reportBreakage.enabled": true,
          "browser.fastblock.enabled": true,
          "browser.fastblock.timeout": 5000,
          "privacy.trackingprotection.enabled": false,
          "network.http.tailing.enabled": true,
          "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock3-track-digest256",
          "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256",
          "browser.contentblocking.trackingprotection.ui.enabled": false,
          "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
          "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock3-track-digest256",
        });
      });

      it("has the correct prefs after uninstall", async () => {
        await utils.setupWebdriver.uninstallAddon(driver, addonId);
        await checkPrefs(driver, {});
      });

      after(async () => {
        await utils.clearPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName");
      });
    });

    describe("sets the correct prefs for variation ControlL0", () => {
      before(async () => {
        await utils.setPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName", "ControlL0");
        addonId = await utils.setupWebdriver.installAddon(driver);
        await driver.sleep(SETUP_DELAY);
      });

      it("has the correct prefs after install", async () => {
        await checkPrefs(driver, {
          "browser.contentblocking.enabled": true,
          "browser.contentblocking.ui.enabled": true,
          "security.pki.distrust_ca_policy": 1,
          "browser.contentblocking.reportBreakage.enabled": true,
          "browser.fastblock.enabled": false,
          "privacy.trackingprotection.enabled": false,
          "network.http.tailing.enabled": true,
          "urlclassifier.trackingAnnotationTable": "test-track-simple,base-track-digest256",
          "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256",
          "browser.contentblocking.fastblock.ui.enabled": false,
          "browser.contentblocking.fastblock.control-center.ui.enabled": false,
          "browser.contentblocking.trackingprotection.ui.enabled": false,
          "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
        });
      });

      it("has the correct prefs after uninstall", async () => {
        await utils.setupWebdriver.uninstallAddon(driver, addonId);
        await checkPrefs(driver, {});
      });

      after(async () => {
        await utils.clearPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName");
      });
    });

    describe("sets the correct prefs for variation ControlL1", () => {
      before(async () => {
        await utils.setPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName", "ControlL1");
        addonId = await utils.setupWebdriver.installAddon(driver);
        await driver.sleep(SETUP_DELAY);
      });

      it("has the correct prefs after install", async () => {
        await checkPrefs(driver, {
          "browser.contentblocking.enabled": true,
          "browser.contentblocking.ui.enabled": true,
          "security.pki.distrust_ca_policy": 1,
          "browser.contentblocking.reportBreakage.enabled": true,
          "browser.fastblock.enabled": false,
          "privacy.trackingprotection.enabled": false,
          "network.http.tailing.enabled": true,
          "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock1-track-digest256",
          "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock1-trackwhite-digest256",
          "browser.contentblocking.fastblock.ui.enabled": false,
          "browser.contentblocking.fastblock.control-center.ui.enabled": false,
          "browser.contentblocking.trackingprotection.ui.enabled": false,
          "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
          "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock1-track-digest256,fastblock1-trackwhite-digest256",
        });
      });

      it("has the correct prefs after uninstall", async () => {
        await utils.setupWebdriver.uninstallAddon(driver, addonId);
        await checkPrefs(driver, {});
      });

      after(async () => {
        await utils.clearPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName");
      });
    });

    describe("sets the correct prefs for variation ControlL2", () => {
      before(async () => {
        await utils.setPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName", "ControlL2");
        addonId = await utils.setupWebdriver.installAddon(driver);
        await driver.sleep(SETUP_DELAY);
      });

      it("has the correct prefs after install", async () => {
        await checkPrefs(driver, {
          "browser.contentblocking.enabled": true,
          "browser.contentblocking.ui.enabled": true,
          "security.pki.distrust_ca_policy": 1,
          "browser.contentblocking.reportBreakage.enabled": true,
          "browser.fastblock.enabled": false,
          "privacy.trackingprotection.enabled": false,
          "network.http.tailing.enabled": true,
          "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock2-track-digest256",
          "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock2-trackwhite-digest256",
          "browser.contentblocking.fastblock.ui.enabled": false,
          "browser.contentblocking.fastblock.control-center.ui.enabled": false,
          "browser.contentblocking.trackingprotection.ui.enabled": false,
          "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
          "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock2-track-digest256,fastblock2-trackwhite-digest256",
        });
      });

      it("has the correct prefs after uninstall", async () => {
        await utils.setupWebdriver.uninstallAddon(driver, addonId);
        await checkPrefs(driver, {});
      });

      after(async () => {
        await utils.clearPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName");
      });
    });

    describe("sets the correct prefs for variation ControlL3", () => {
      before(async () => {
        await utils.setPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName", "ControlL3");
        addonId = await utils.setupWebdriver.installAddon(driver);
        await driver.sleep(SETUP_DELAY);
      });

      it("has the correct prefs after install", async () => {
        await checkPrefs(driver, {
          "browser.contentblocking.enabled": true,
          "browser.contentblocking.ui.enabled": true,
          "security.pki.distrust_ca_policy": 1,
          "browser.contentblocking.reportBreakage.enabled": true,
          "browser.fastblock.enabled": false,
          "privacy.trackingprotection.enabled": false,
          "network.http.tailing.enabled": true,
          "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock3-track-digest256",
          "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256",
          "browser.contentblocking.fastblock.ui.enabled": false,
          "browser.contentblocking.fastblock.control-center.ui.enabled": false,
          "browser.contentblocking.trackingprotection.ui.enabled": false,
          "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
          "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock3-track-digest256",
        });
      });

      it("has the correct prefs after uninstall", async () => {
        await utils.setupWebdriver.uninstallAddon(driver, addonId);
        await checkPrefs(driver, {});
      });

      after(async () => {
        await utils.clearPreference(driver, "extensions.fastblock_shield_mozilla_org.test.variationName");
      });
    });

  });
});
