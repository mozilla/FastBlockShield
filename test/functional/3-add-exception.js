/* eslint-env node, mocha */

// for unhandled promise rejection debugging
process.on("unhandledRejection", r => console.error(r)); // eslint-disable-line no-console

const {assert} = require("chai");
const utils = require("./utils");
const firefox = require("selenium-webdriver/firefox");
const Context = firefox.Context;
const webdriver = require("selenium-webdriver");
const By = webdriver.By;
const until = webdriver.until;

describe("add page exception button", function() {
  // This gives Firefox time to start, and us a bit longer during some of the tests.
  this.timeout(15000);

  let driver;

  // runs ONCE
  before(async () => {
    driver = await utils.setupWebdriver.promiseSetupDriver(
      utils.FIREFOX_PREFERENCES,
    );
    await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "TP");
    await driver.sleep(500);
    await utils.setupWebdriver.installAddon(driver);
    await driver.sleep(500);
  });

  after(() => {
    driver.quit();
  });

  describe("records a user clicking the 'disable protection for this site' button", function() {
    let studyPings;

    before(async () => {

      const time = Date.now();
      driver.setContext(Context.CONTENT);
      await driver.get("https://itisatrap.org/firefox/its-a-tracker.html");
      await driver.sleep(1000);
      driver.setContext(Context.CHROME);
      // Open the control center.
      const identityBox = await driver.wait(until.elementLocated(By.id("identity-box")), 1000);
      identityBox.click();
      await driver.sleep(500);
      // Locate and click the add exception button.
      const addExceptionButton = await driver.wait(until.elementLocated(By.id("tracking-action-unblock")), 1000);
      addExceptionButton.click();
      await driver.sleep(500);
      driver.setContext(Context.CONTENT);
      // Navigate somewhere else to send the telemetry.
      await driver.navigate().refresh();
      await driver.sleep(500);
      studyPings = await utils.telemetry.getShieldPingsAfterTimestamp(
        driver,
        time,
      );
      studyPings = studyPings.filter(ping => ping.type === "shield-study-addon");
    });

    it("has recorded one ping", async () => {
      assert(studyPings.length === 1, "one shield telemetry ping");
    });

    it("correctly records that the user added an exception for this page", async () => {
      const ping = studyPings[0];
      const attributes = ping.payload.data.attributes;
      assert.equal(attributes.user_added_exception, "true", "user added exception is included in the ping");
    });

    after(async () => {
      await utils.clearPreference(driver, "browser.fastblock.enabled");
      await utils.clearPreference(driver, "privacy.trackingprotection.enabled");
    });
  });

});
