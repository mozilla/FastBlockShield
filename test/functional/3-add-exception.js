/* eslint-env node, mocha */
/* eslint-disable no-unreachable */

// for unhandled promise rejection debugging
process.on("unhandledRejection", r => console.error(r)); // eslint-disable-line no-console

const {assert} = require("chai");
const utils = require("./utils");
const firefox = require("selenium-webdriver/firefox");
const Context = firefox.Context;
const webdriver = require("selenium-webdriver");
const By = webdriver.By;
const until = webdriver.until;
const DELAY = process.env.DELAY ? parseInt(process.env.DELAY) : 500;

describe("add page exception button", function() {
  // This gives Firefox time to start, and us a bit longer during some of the tests.
  this.timeout(DELAY * 15);

  let driver;

  // runs ONCE
  before(async () => {
    driver = await utils.setupWebdriver.promiseSetupDriver(
      utils.FIREFOX_PREFERENCES,
    );
    await utils.setPreference(driver, "extensions.fastblock-shield_mozilla_org.test.variationName", "TP");
    await driver.sleep(DELAY);
    await utils.setupWebdriver.installAddon(driver);
    await driver.sleep(DELAY);
  });

  after(() => {
    driver.quit();
  });

  describe("records a user clicking the 'disable protection for this site' button", function() {
    let studyPings;

    async function checkDoorhangerPresent() {
      const result = await driver.findElements(By.id("fast-block-notification"));
      return !!result.length;
    }

    before(async () => {

      const time = Date.now();
      driver.setContext(Context.CONTENT);
      await driver.get("https://itisatrap.org/firefox/its-a-tracker.html");
      await driver.sleep(DELAY);
      driver.setContext(Context.CHROME);
      // Open the control center.
      const identityBox = await driver.wait(until.elementLocated(By.id("identity-box")), 1000);
      identityBox.click();
      await driver.sleep(DELAY);
      // Locate and click the add exception button.
      const addExceptionButton = await driver.wait(until.elementLocated(By.id("tracking-action-unblock")), 1000);
      addExceptionButton.click();
      // The page refreshes after clicking the add exception button, causing a ping to occur or the
      // survey doorhanger to be shown.
      await driver.sleep(DELAY);

      // Interact with the doorhanger if it's showing.
      const doorhangerPresent = await checkDoorhangerPresent();
      if (doorhangerPresent) {
        await driver.executeScript(`document.getElementById("fast-block-notification").button.click()`);
        await driver.sleep(DELAY);
      }

      studyPings = await utils.telemetry.getShieldPingsAfterTimestamp(
        driver,
        time,
      );
      studyPings = studyPings.filter(ping => ping.type === "shield-study-addon");
    });

    it("has recorded one ping", async () => {
      assert.equal(studyPings.length, 1, "one shield telemetry ping");
    });

    it("correctly records that the user added an exception for this page", async () => {
      const ping = studyPings[0];
      const attributes = ping.payload.data.attributes;
      assert.equal(attributes.user_added_exception, "true", "user added exception is included in the ping");
    });
  });

});
