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

describe("reload survey doorhanger", function() {
  // This gives Firefox time to start, and us a bit longer during some of the tests.
  this.timeout(15000);

  let driver;

  // runs ONCE
  before(async () => {
    driver = await utils.setupWebdriver.promiseSetupDriver(
      utils.FIREFOX_PREFERENCES,
    );
    await utils.setupWebdriver.installAddon(driver);
    await driver.sleep(1000);
  });

  after(() => {
    driver.quit();
  });

  describe("shows a survey after reloading the page 6 times max", function() {
    let studyPings;
    let tries = 0;

    async function checkDoorhangerPresent() {
      driver.setContext(Context.CHROME);
      const result = await driver.findElements(By.id("fast-block-notification"));
      return !!result.length;
    }

    before(async () => {
      await utils.setPreference(driver, "privacy.trackingprotection.enabled", true);
      await driver.sleep(500);

      const time = Date.now();
      driver.setContext(Context.CONTENT);
      await driver.get("https://itisatrap.org/firefox/its-a-tracker.html");
      await driver.sleep(1500);
      while (tries++ < 6) {
        const hasSeenDoorhanger = await checkDoorhangerPresent();
        driver.setContext(Context.CONTENT);
        await driver.navigate().refresh();
        await driver.sleep(1500);
        if (hasSeenDoorhanger) {
          break;
        }
      }

      studyPings = await utils.telemetry.getShieldPingsAfterTimestamp(
        driver,
        time,
      );
      studyPings = studyPings.filter(ping => ping.type === "shield-study-addon");
    });

    it("shows the doorhanger after at most 6 tries", async () => {
      assert.isAtMost(tries, 6, "Should have shown the doorhanger after at most 6 tries");
    });

    it("has recorded one ping per reload", async () => {
      assert.equal(studyPings.length, tries, "one shield telemetry ping per reload");
    });

    it("correctly records whether the page was reloaded", async () => {
      for (let i = 0; i < studyPings.length; i++) {
        const ping = studyPings[i];
        const attributes = ping.payload.data.attributes;
        if (i === studyPings.length - 1) {
          assert.equal(attributes.page_reloaded, "false", `page reloaded is false on ${i}`);
        } else {
          assert.equal(attributes.page_reloaded, "true", `page reloaded is true on ${i}`);
        }

        if (i === 0) {
          assert.equal(parseInt(attributes.page_reloaded_survey), 1, "page reloaded survey shown");
        } else {
          assert.equal(parseInt(attributes.page_reloaded_survey), 0, `page reloaded survey not shown on ${i}`);
        }
      }
    });

    after(async () => {
      await utils.clearPreference(driver, "privacy.trackingprotection.enabled");
    });
  });

});
