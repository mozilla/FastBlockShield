/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "getStudySetup" }]*/
/* global VARIATIONS */

/**
 *  Overview:
 *
 *  - constructs a well-formatted `studySetup` for use by `browser.study.setup`
 *  - mostly declarative, except that some fields are set at runtime
 *    asynchronously.
 *
 *  Advanced features:
 *  - testing overrides from preferences
 *  - expiration time
 *  - some user defined endings.
 *  - study defined 'shouldAllowEnroll' logic.
 */

/** Base for studySetup, as used by `browser.study.setup`.
 *
 * Will be augmented by 'getStudySetup'
 */
const baseStudySetup = {
  // used for activeExperiments tagging (telemetryEnvironment.setActiveExperiment)
  activeExperimentName: browser.runtime.id,

  // uses shield sampling and telemetry semantics.  Future: will support "pioneer"
  studyType: "shield",

  // telemetry
  telemetry: {
    // default false. Actually send pings.
    send: true,
    // Marks pings with testing=true.  Set flag to `true` before final release
    removeTestingFlag: true,
  },

  // We don't do surveys at the end of the study.
  endings: { },

  // Will be set in getStudySetup().
  weightedVariations: null,

  // maximum time that the study should run, from the first run
  expire: {
    days: 14,
  },
};

/**
 * Augment declarative studySetup with any necessary async values
 *
 * @return {object} studySetup A complete study setup object
 */
async function getStudySetup() {
  // shallow copy
  const studySetup = Object.assign({}, baseStudySetup);

  studySetup.weightedVariations = Object.keys(VARIATIONS).map(variation => {
    return {name: variation, weight: VARIATIONS[variation].weight};
  });

  studySetup.allowEnroll = true;

  const testingPreferences = await browser.testingOverrides.listPreferences();
  console.log(
    "The preferences that can be used to override testing flags: ",
    testingPreferences,
  );
  studySetup.testing = {
    variationName: await browser.testingOverrides.getVariationNameOverride(),
    firstRunTimestamp: await browser.testingOverrides.getFirstRunTimestampOverride(),
    expired: await browser.testingOverrides.getExpiredOverride(),
  };
  return studySetup;
}
