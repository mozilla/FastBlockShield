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
const DELAY = process.env.DELAY ? parseInt(process.env.DELAY) : 500;

describe("reload survey doorhanger", function() {
  // This gives Firefox time to start, and us a bit longer during some of the tests.
  this.timeout(DELAY * 30);

  let driver;

  // runs ONCE
  before(async () => {
    driver = await utils.setupWebdriver.promiseSetupDriver(
      utils.FIREFOX_PREFERENCES,
    );
    await utils.setupWebdriver.installAddon(driver);
    await driver.sleep(DELAY);
  });

  after(() => {
    driver.quit();
  });

  describe("shows a survey after reloading the page 6 times max", function() {
    let studyPings;
    let reloads = 0;

    async function checkDoorhangerPresent() {
      const result = await driver.findElements(By.id("fast-block-notification"));
      return !!result.length;
    }

    before(async () => {
      await driver.sleep(DELAY);

      const time = Date.now();
      driver.setContext(Context.CONTENT);
      await driver.get("https://itisatrap.org/firefox/its-a-tracker.html");
      await driver.sleep(DELAY);
      driver.setContext(Context.CHROME);
      while (reloads++ < 6) {
        await driver.executeScript(`document.getElementById("Browser:Reload").click()`);
        await driver.sleep(DELAY);
        const hasSeenDoorhanger = await checkDoorhangerPresent();
        if (hasSeenDoorhanger) {
          break;
        }
      }

      driver.setContext(Context.CONTENT);
      await driver.get("https://example.com");
      await driver.sleep(DELAY);

      studyPings = await utils.telemetry.getShieldPingsAfterTimestamp(
        driver,
        time,
      );
      studyPings = studyPings.filter(ping => ping.type === "shield-study-addon");
    });

    it("shows the doorhanger after at most 6 reloads", async () => {
      assert.isAtMost(reloads, 6, "Should have shown the doorhanger after at most 6 reloads");
    });

    it("has recorded one ping per tracking page", async () => {
      assert.equal(studyPings.length, reloads + 1, "one shield telemetry ping per tracking page load");
    });

    it("correctly records whether the page was reloaded", async () => {
      for (let i = 0; i < studyPings.length; i++) {
        const ping = studyPings[i];
        const attributes = ping.payload.data.attributes;
        if (i === 0) {
          assert.equal(attributes.page_reloaded, "false", `page reloaded is false on ${i}/${reloads}`);
        } else {
          assert.equal(attributes.page_reloaded, "true", `page reloaded is true on ${i}/${reloads}`);
        }

        // The survey will be shown for the second-to-last document, because the last
        // one is where the survey shows (and it gets discarded via navigation so it
        // doesn't receive its own survey).
        if (i === 1) {
          assert.equal(parseInt(attributes.page_reloaded_survey), 1, `page reloaded survey shown on ${i}/${reloads}`);
        } else {
          assert.equal(parseInt(attributes.page_reloaded_survey), 0, `page reloaded survey not shown on ${i}/${reloads}`);
        }
      }
    });
  });

  describe("allows subsequently showing a survey on the same tab after a navigation event", function() {
    let studyPings;
    const reloads = 5;

    before(async () => {
      await driver.sleep(DELAY);

      const time = Date.now();
      driver.setContext(Context.CONTENT);
      await driver.get("https://itisatrap.org/firefox/its-a-tracker.html");
      await driver.sleep(DELAY);
      driver.setContext(Context.CHROME);
      for (let i = 0; i < reloads; i++) {
        await driver.executeScript(`document.getElementById("Browser:Reload").click()`);
        await driver.sleep(DELAY);
      }

      driver.setContext(Context.CONTENT);
      await driver.get("https://example.com");
      await driver.sleep(DELAY);

      studyPings = await utils.telemetry.getShieldPingsAfterTimestamp(
        driver,
        time,
      );
      studyPings = studyPings.filter(ping => ping.type === "shield-study-addon");
    });

    it("shows the doorhanger after at most 6 reloads", async () => {
      assert.isAtMost(reloads, 6, "Should have shown the doorhanger after at most 6 reloads");
    });

    it("has recorded one ping per tracking page", async () => {
      assert.equal(studyPings.length, reloads + 1, "one shield telemetry ping per tracking page load");
    });
  });

  describe("records the correct survey response for yes", function() {
    let studyPings;
    const reloads = 8;
    let doorhangerShownFor = Infinity;

    async function checkDoorhangerPresent() {
      const result = await driver.findElements(By.id("fast-block-notification"));
      return !!result.length;
    }

    before(async () => {
      // Reset the doorhanger shown state by restarting the browser.
      driver.quit();
      driver = await utils.setupWebdriver.promiseSetupDriver(
        utils.FIREFOX_PREFERENCES,
      );
      await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(DELAY);

      const time = Date.now();
      driver.setContext(Context.CONTENT);
      await driver.get("https://itisatrap.org/firefox/its-a-tracker.html");
      await driver.sleep(DELAY);
      driver.setContext(Context.CHROME);
      for (let i = 0; i < reloads; i++) {
        await driver.executeScript(`document.getElementById("Browser:Reload").click()`);
        await driver.sleep(DELAY);
        const hasSeenDoorhanger = await checkDoorhangerPresent();
        if (hasSeenDoorhanger) {
          doorhangerShownFor = i;
          await driver.executeScript(`document.getElementById("fast-block-notification").button.click()`);
        }
      }

      // Discard the final ping.
      driver.setContext(Context.CONTENT);
      await driver.get("https://example.com");
      await driver.sleep(DELAY);

      studyPings = await utils.telemetry.getShieldPingsAfterTimestamp(
        driver,
        time,
      );
      studyPings = studyPings.filter(ping => ping.type === "shield-study-addon");
    });

    it("shows the doorhanger after at most 6 reloads", async () => {
      assert.isAtMost(doorhangerShownFor, 5, "Should have shown the doorhanger after at most 6 reloads");
    });

    it("has recorded one ping per tracking page", async () => {
      assert.equal(studyPings.length, reloads + 1, "one shield telemetry ping per tracking page load");
    });

    it("correctly records whether the page was reloaded", async () => {
      // The first pings are listed last in this array.
      studyPings.reverse();

      for (let i = 0; i < studyPings.length; i++) {
        const ping = studyPings[i];
        const attributes = ping.payload.data.attributes;
        if (i === studyPings.length - 1) {
          assert.equal(attributes.page_reloaded, "false", `page reloaded is false on ${i}/${reloads}`);
        } else {
          assert.equal(attributes.page_reloaded, "true", `page reloaded is true on ${i}/${reloads}`);
        }

        if (i === doorhangerShownFor) {
          assert.equal(parseInt(attributes.page_reloaded_survey), 2, `page reloaded survey answered on ${i}/${reloads}`);
        } else if (i === studyPings.length - 1) {
          assert.equal(parseInt(attributes.page_reloaded_survey), 0, `page reloaded survey previously answered on ${i}/${reloads}`);
        } else if (i > doorhangerShownFor) {
          assert.equal(parseInt(attributes.page_reloaded_survey), 4, `page reloaded survey previously answered on ${i}/${reloads}`);
        } else {
          assert.equal(parseInt(attributes.page_reloaded_survey), 0, `page reloaded survey not shown on ${i}/${reloads}`);
        }
      }
    });
  });

  describe("records the correct survey response for no", function() {
    let studyPings;
    const reloads = 8;
    let doorhangerShownFor = Infinity;

    async function checkDoorhangerPresent() {
      const result = await driver.findElements(By.id("fast-block-notification"));
      return !!result.length;
    }

    before(async () => {
      // Reset the doorhanger shown state by restarting the browser.
      driver.quit();
      driver = await utils.setupWebdriver.promiseSetupDriver(
        utils.FIREFOX_PREFERENCES,
      );
      await utils.setupWebdriver.installAddon(driver);
      await driver.sleep(DELAY);

      const time = Date.now();
      driver.setContext(Context.CONTENT);
      await driver.get("https://itisatrap.org/firefox/its-a-tracker.html");
      await driver.sleep(DELAY);
      driver.setContext(Context.CHROME);
      for (let i = 0; i < reloads; i++) {
        await driver.executeScript(`document.getElementById("Browser:Reload").click()`);
        await driver.sleep(DELAY);
        const hasSeenDoorhanger = await checkDoorhangerPresent();
        if (hasSeenDoorhanger) {
          doorhangerShownFor = i;
          await driver.executeScript(`document.getElementById("fast-block-notification").secondaryButton.click()`);
        }
      }

      // Discard the final ping.
      driver.setContext(Context.CONTENT);
      await driver.get("https://example.com");
      await driver.sleep(DELAY);

      studyPings = await utils.telemetry.getShieldPingsAfterTimestamp(
        driver,
        time,
      );
      studyPings = studyPings.filter(ping => ping.type === "shield-study-addon");
    });

    it("shows the doorhanger after at most 6 reloads", async () => {
      assert.isAtMost(doorhangerShownFor, 5, "Should have shown the doorhanger after at most 6 reloads");
    });

    it("has recorded one ping per tracking page", async () => {
      assert.equal(studyPings.length, reloads + 1, "one shield telemetry ping per tracking page load");
    });

    it("correctly records whether the page was reloaded", async () => {
      // The first pings are listed last in this array.
      studyPings.reverse();

      for (let i = 0; i < studyPings.length; i++) {
        const ping = studyPings[i];
        const attributes = ping.payload.data.attributes;
        if (i === studyPings.length - 1) {
          assert.equal(attributes.page_reloaded, "false", `page reloaded is false on ${i}/${reloads}`);
        } else {
          assert.equal(attributes.page_reloaded, "true", `page reloaded is true on ${i}/${reloads}`);
        }

        if (i === doorhangerShownFor) {
          assert.equal(parseInt(attributes.page_reloaded_survey), 3, `page reloaded survey answered on ${i}/${reloads}`);
        } else if (i === studyPings.length - 1) {
          assert.equal(parseInt(attributes.page_reloaded_survey), 0, `page reloaded survey previously answered on ${i}/${reloads}`);
        } else if (i > doorhangerShownFor) {
          assert.equal(parseInt(attributes.page_reloaded_survey), 5, `page reloaded survey previously answered on ${i}/${reloads}`);
        } else {
          assert.equal(parseInt(attributes.page_reloaded_survey), 0, `page reloaded survey not shown on ${i}/${reloads}`);
        }
      }
    });
  });
});
