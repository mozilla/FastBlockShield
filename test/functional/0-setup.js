/* eslint-env node, mocha */

// for unhandled promise rejection debugging
process.on("unhandledRejection", r => console.error(r)); // eslint-disable-line no-console

const assert = require("assert");
const utils = require("./utils");

async function checkPrefs(driver, prefs) {
  for (let [name, value] of prefs) {
    let val = await utils.getPreference(driver, name);
    assert.equal(val, value, `set the right pref for ${name}`);
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

    it("sets the correct prefs for variation TPL0", async () => {
      await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "TPL0");
      let addonId = await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(1000);

      await checkPrefs(driver, [
        ["privacy.fastblock.list", 0],
        ["browser.fastblock.enabled", false],
        ["privacy.trackingprotection.enabled", true],
        ["network.http.tailing.enabled", false],
      ]);

      await utils.setupWebdriver.uninstallAddon(driver, addonId);

      // TODO check that prefs were cleared

      await utils.clearPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName");
    });

    it("sets the correct prefs for variation TPL1", async () => {
      await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "TPL1");
      let addonId = await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(1000);

      await checkPrefs(driver, [
        ["privacy.fastblock.list", 1],
        ["browser.fastblock.enabled", false],
        ["privacy.trackingprotection.enabled", true],
        ["network.http.tailing.enabled", false],
      ]);

      await utils.setupWebdriver.uninstallAddon(driver, addonId);

      // TODO check that prefs were cleared

      await utils.clearPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName");
    });

    it("sets the correct prefs for variation TPL2", async () => {
      await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "TPL2");
      let addonId = await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(1000);

      await checkPrefs(driver, [
        ["privacy.fastblock.list", 2],
        ["browser.fastblock.enabled", false],
        ["privacy.trackingprotection.enabled", true],
        ["network.http.tailing.enabled", false],
      ]);

      await utils.setupWebdriver.uninstallAddon(driver, addonId);

      // TODO check that prefs were cleared

      await utils.clearPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName");
    });

    it("sets the correct prefs for variation TPL3", async () => {
      await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "TPL3");
      let addonId = await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(1000);

      await checkPrefs(driver, [
        ["privacy.fastblock.list", 3],
        ["browser.fastblock.enabled", false],
        ["privacy.trackingprotection.enabled", true],
        ["network.http.tailing.enabled", false],
      ]);

      await utils.setupWebdriver.uninstallAddon(driver, addonId);

      // TODO check that prefs were cleared

      await utils.clearPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName");
    });

    it("sets the correct prefs for variation FB2L0", async () => {
      await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "FB2L0");
      let addonId = await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(1000);

      await checkPrefs(driver, [
        ["privacy.fastblock.list", 0],
        ["browser.fastblock.timeout", 2000],
        ["browser.fastblock.enabled", true],
        ["privacy.trackingprotection.enabled", false],
        ["network.http.tailing.enabled", false],
      ]);

      await utils.setupWebdriver.uninstallAddon(driver, addonId);

      // TODO check that prefs were cleared

      await utils.clearPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName");
    });

    it("sets the correct prefs for variation FB2L1", async () => {
      await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "FB2L1");
      let addonId = await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(1000);

      await checkPrefs(driver, [
        ["privacy.fastblock.list", 1],
        ["browser.fastblock.timeout", 2000],
        ["browser.fastblock.enabled", true],
        ["privacy.trackingprotection.enabled", false],
        ["network.http.tailing.enabled", false],
      ]);

      await utils.setupWebdriver.uninstallAddon(driver, addonId);

      // TODO check that prefs were cleared

      await utils.clearPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName");
    });

    it("sets the correct prefs for variation FB2L2", async () => {
      await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "FB2L2");
      let addonId = await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(1000);

      await checkPrefs(driver, [
        ["privacy.fastblock.list", 2],
        ["browser.fastblock.timeout", 2000],
        ["browser.fastblock.enabled", true],
        ["privacy.trackingprotection.enabled", false],
        ["network.http.tailing.enabled", false],
      ]);

      await utils.setupWebdriver.uninstallAddon(driver, addonId);

      // TODO check that prefs were cleared

      await utils.clearPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName");
    });

    it("sets the correct prefs for variation FB2L3", async () => {
      await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "FB2L3");
      let addonId = await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(1000);

      await checkPrefs(driver, [
        ["privacy.fastblock.list", 3],
        ["browser.fastblock.timeout", 2000],
        ["browser.fastblock.enabled", true],
        ["privacy.trackingprotection.enabled", false],
        ["network.http.tailing.enabled", false],
      ]);

      await utils.setupWebdriver.uninstallAddon(driver, addonId);

      // TODO check that prefs were cleared

      await utils.clearPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName");
    });

    it("sets the correct prefs for variation FB5L0", async () => {
      await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "FB5L0");
      let addonId = await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(1000);

      await checkPrefs(driver, [
        ["privacy.fastblock.list", 0],
        ["browser.fastblock.timeout", 5000],
        ["browser.fastblock.enabled", true],
        ["privacy.trackingprotection.enabled", false],
        ["network.http.tailing.enabled", false],
      ]);

      await utils.setupWebdriver.uninstallAddon(driver, addonId);

      // TODO check that prefs were cleared

      await utils.clearPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName");
    });

    it("sets the correct prefs for variation FB5L1", async () => {
      await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "FB5L1");
      let addonId = await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(1000);

      await checkPrefs(driver, [
        ["privacy.fastblock.list", 1],
        ["browser.fastblock.timeout", 5000],
        ["browser.fastblock.enabled", true],
        ["privacy.trackingprotection.enabled", false],
        ["network.http.tailing.enabled", false],
      ]);

      await utils.setupWebdriver.uninstallAddon(driver, addonId);

      // TODO check that prefs were cleared

      await utils.clearPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName");
    });

    it("sets the correct prefs for variation FB5L2", async () => {
      await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "FB5L2");
      let addonId = await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(1000);

      await checkPrefs(driver, [
        ["privacy.fastblock.list", 2],
        ["browser.fastblock.timeout", 5000],
        ["browser.fastblock.enabled", true],
        ["privacy.trackingprotection.enabled", false],
        ["network.http.tailing.enabled", false],
      ]);

      await utils.setupWebdriver.uninstallAddon(driver, addonId);

      // TODO check that prefs were cleared

      await utils.clearPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName");
    });

    it("sets the correct prefs for variation FB5L3", async () => {
      await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "FB5L3");
      let addonId = await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(1000);

      await checkPrefs(driver, [
        ["privacy.fastblock.list", 3],
        ["browser.fastblock.timeout", 5000],
        ["browser.fastblock.enabled", true],
        ["privacy.trackingprotection.enabled", false],
        ["network.http.tailing.enabled", false],
      ]);

      await utils.setupWebdriver.uninstallAddon(driver, addonId);

      // TODO check that prefs were cleared

      await utils.clearPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName");
    });

    it("sets the correct prefs for variation Control", async () => {
      await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "Control");
      let addonId = await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(1000);

      await checkPrefs(driver, [
        ["browser.fastblock.enabled", false],
      ]);

      await utils.setupWebdriver.uninstallAddon(driver, addonId);

      // TODO check that prefs were cleared

      await utils.clearPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName");
    });

    it("sets the correct prefs for variation TT", async () => {
      await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "TT");
      let addonId = await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(1000);

      await checkPrefs(driver, [
        ["privacy.fastblock.list", 0],
        ["browser.fastblock.enabled", true],
        ["privacy.trackingprotection.enabled", false],
        ["network.http.tailing.enabled", true],
      ]);

      await utils.setupWebdriver.uninstallAddon(driver, addonId);

      // TODO check that prefs were cleared

      await utils.clearPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName");
    });

  });
});
