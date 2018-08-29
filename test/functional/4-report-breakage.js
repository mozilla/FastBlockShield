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

describe("report breakage button", function() {
  // This gives Firefox time to start, and us a bit longer during some of the tests.
  this.timeout(15000);

  let driver;

  // runs ONCE
  before(async () => {
    driver = await utils.setupWebdriver.promiseSetupDriver(
      utils.FIREFOX_PREFERENCES,
    );
    // IMPORTANT: avoid submitting real breakage data.
    await utils.setPreference(driver, "browser.contentblocking.reportBreakage.url", "");
    await utils.setupWebdriver.installAddon(driver);
    await driver.sleep(500);
  });

  after(() => {
    driver.quit();
  });

  describe("records a user clicking the report breakage button", function() {
    let studyPings;

    before(async () => {
      await utils.setPreference(driver, "privacy.trackingprotection.enabled", true);
      await driver.sleep(500);

      let time = Date.now();
      driver.setContext(Context.CONTENT);
      await driver.get("https://itisatrap.org/firefox/its-a-tracker.html");
      await driver.sleep(1000);
      driver.setContext(Context.CHROME);
      // Open the control center.
      let identityBox = await driver.wait(until.elementLocated(By.id("identity-box")), 1000);
      identityBox.click();
      await driver.sleep(500);
      // Open the "report breakage" dialog.
      let reportDialogButton = await driver.wait(until.elementLocated(By.id("identity-popup-content-blocking-report-breakage")), 1000);
      reportDialogButton.click();
      await driver.sleep(500);
      // Submit the report.
      let reportBreakageButton = await driver.wait(until.elementLocated(By.id("identity-popup-breakageReportView-submit")), 1000);
      reportBreakageButton.click();
      await driver.sleep(500);
      driver.setContext(Context.CONTENT);
      // Navigate somewhere else to send the telemetry.
      await driver.get("https://example.com");
      await driver.sleep(500);
      studyPings = await utils.telemetry.getShieldPingsAfterTimestamp(
        driver,
        time,
      );
      studyPings = studyPings.filter(ping => ping.type === "shield-study-addon");
    });

    it("has recorded one ping", async () => {
      assert(studyPings.length == 1, "one shield telemetry ping");
    });

    it("correctly records that the user submit a breakage report", async () => {
      let ping = studyPings[0];
      let attributes = ping.payload.data.attributes;
      assert.equal(attributes.user_reported_page_breakage, "true", "user reported breakage is included in the ping");
    });

    after(async () => {
      await utils.clearPreference(driver, "browser.fastblock.enabled");
      await utils.clearPreference(driver, "privacy.trackingprotection.enabled");
    });
  });

});
