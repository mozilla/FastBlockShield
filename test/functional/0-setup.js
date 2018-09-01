/* eslint-env node, mocha */

// for unhandled promise rejection debugging
process.on("unhandledRejection", r => console.error(r)); // eslint-disable-line no-console

const {assert} = require("chai");
const utils = require("./utils");

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
  this.timeout(15000);

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
    const SETUP_DELAY = 500;
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
