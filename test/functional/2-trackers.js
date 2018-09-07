/* eslint-env node, mocha */
/* eslint-disable no-unreachable */

// for unhandled promise rejection debugging
process.on("unhandledRejection", r => console.error(r)); // eslint-disable-line no-console

const {assert} = require("chai");
const utils = require("./utils");
const firefox = require("selenium-webdriver/firefox");
const Context = firefox.Context;
const DELAY = process.env.DELAY ? parseInt(process.env.DELAY) : 500;

describe("trackers", function() {
  // This gives Firefox time to start, and us a bit longer during some of the tests.
  this.timeout(DELAY * 15);

  let driver;

  // runs ONCE
  before(async () => {
    driver = await utils.setupWebdriver.promiseSetupDriver(
      utils.FIREFOX_PREFERENCES,
    );
    await utils.setupWebdriver.installAddon(driver);
  });

  after(() => {
    driver.quit();
  });

  describe("recording trackers with FB and TP turned off", function() {
    let studyPings;

    before(async () => {
      await driver.sleep(DELAY);
      await utils.setPreference(driver, "browser.fastblock.enabled", false);
      await utils.setPreference(driver, "privacy.trackingprotection.enabled", false);
      await driver.sleep(DELAY);

      const time = Date.now();
      driver.setContext(Context.CONTENT);
      await driver.get("https://example.com");
      await driver.sleep(DELAY);
      await driver.get("https://itisatrap.org/firefox/its-a-tracker.html");
      await driver.sleep(DELAY);
      await driver.get("https://example.com");
      await driver.sleep(DELAY);
      studyPings = await utils.telemetry.getShieldPingsAfterTimestamp(
        driver,
        time,
      );
      studyPings = studyPings.filter(ping => ping.type === "shield-study-addon");
    });

    it("has recorded one ping", async () => {
      assert.equal(studyPings.length, 1, "one shield telemetry ping");
    });

    it("correctly records the amount of trackers on the page", async () => {
      const ping = studyPings[0];
      const attributes = ping.payload.data.attributes;
      assert.equal(attributes.num_blockable_trackers, "1", "found all blockable trackers");
      assert.equal(attributes.num_trackers_blocked, "0", "found no blocked trackers");
    });

    after(async () => {
      await utils.clearPreference(driver, "browser.fastblock.enabled");
      await utils.clearPreference(driver, "privacy.trackingprotection.enabled");
    });
  });


  describe("recording trackers with FB not blocking", function() {
    let studyPings;

    before(async () => {
      await driver.sleep(DELAY);
      await utils.setPreference(driver, "browser.fastblock.enabled", true);
      await utils.setPreference(driver, "browser.fastblock.timeout", 10000);
      await utils.setPreference(driver, "privacy.trackingprotection.enabled", false);
      await driver.sleep(DELAY);

      const time = Date.now();
      driver.setContext(Context.CONTENT);
      await driver.get("https://example.com");
      await driver.sleep(DELAY);
      await driver.get("https://itisatrap.org/firefox/its-a-tracker.html");
      await driver.sleep(DELAY);
      await driver.get("https://example.com");
      await driver.sleep(DELAY);
      studyPings = await utils.telemetry.getShieldPingsAfterTimestamp(
        driver,
        time,
      );
      studyPings = studyPings.filter(ping => ping.type === "shield-study-addon");
    });

    it("has recorded one ping", async () => {
      assert(studyPings.length === 1, "one shield telemetry ping");
    });

    it("correctly records the amount of trackers on the page", async () => {
      const ping = studyPings[0];
      const attributes = ping.payload.data.attributes;
      assert.equal(attributes.num_blockable_trackers, "1", "found all blockable trackers");
      assert.equal(attributes.num_trackers_blocked, "0", "found no blocked trackers");
    });

    after(async () => {
      await utils.clearPreference(driver, "browser.fastblock.enabled");
      await utils.clearPreference(driver, "browser.fastblock.timeout");
      await utils.clearPreference(driver, "privacy.trackingprotection.enabled");
    });
  });

  describe("recording trackers with FB blocking", function() {
    let studyPings;

    before(async () => {
      await driver.sleep(DELAY);
      await utils.setPreference(driver, "browser.fastblock.enabled", true);
      await utils.setPreference(driver, "browser.fastblock.timeout", 0);
      await utils.setPreference(driver, "privacy.trackingprotection.enabled", false);
      await driver.sleep(DELAY);

      const time = Date.now();
      driver.setContext(Context.CONTENT);
      await driver.get("https://itisatrap.org/firefox/its-a-tracker.html");
      await driver.sleep(DELAY);
      await driver.get("https://example.com");
      await driver.sleep(DELAY);
      studyPings = await utils.telemetry.getShieldPingsAfterTimestamp(
        driver,
        time,
      );
      studyPings = studyPings.filter(ping => ping.type === "shield-study-addon");
    });

    it("has recorded one ping", async () => {
      assert(studyPings.length === 1, "one shield telemetry ping");
    });

    it("correctly records the amount of trackers on the page", async () => {
      const ping = studyPings[0];
      const attributes = ping.payload.data.attributes;
      assert.equal(attributes.num_blockable_trackers, "1", "found all blockable trackers");
      assert.equal(attributes.num_trackers_blocked, "1", "found all blocked trackers");
    });

    after(async () => {
      await utils.clearPreference(driver, "browser.fastblock.enabled");
      await utils.clearPreference(driver, "browser.fastblock.timeout");
      await utils.clearPreference(driver, "privacy.trackingprotection.enabled");
    });
  });

  describe("recording trackers with TP blocking", function() {
    let studyPings;

    before(async () => {
      await driver.sleep(DELAY);
      await utils.setPreference(driver, "browser.fastblock.enabled", false);
      await utils.setPreference(driver, "privacy.trackingprotection.enabled", true);
      await driver.sleep(DELAY);

      const time = Date.now();
      driver.setContext(Context.CONTENT);
      await driver.get("https://mozilla.github.io/tracking-test/disconnect.html");
      await driver.sleep(DELAY);
      await driver.get("https://example.com");
      await driver.sleep(DELAY);
      studyPings = await utils.telemetry.getShieldPingsAfterTimestamp(
        driver,
        time,
      );
      studyPings = studyPings.filter(ping => ping.type === "shield-study-addon");
    });

    it("has recorded one ping", async () => {
      assert(studyPings.length === 1, "one shield telemetry ping");
    });

    it("correctly records the amount of trackers on the page", async () => {
      const ping = studyPings[0];
      const attributes = ping.payload.data.attributes;
      assert.equal(attributes.num_blockable_trackers, "3", "found all blockable trackers");
      assert.equal(attributes.num_trackers_blocked, "3", "found all blocked trackers");
    });

    after(async () => {
      await utils.clearPreference(driver, "browser.fastblock.enabled");
      await utils.clearPreference(driver, "privacy.trackingprotection.enabled");
    });
  });

});
