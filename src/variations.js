window.VARIATIONS = {
  "TP": {
    weight: 1,
    prefs: {
      // Always turn on Content Blocking.
      "browser.contentblocking.enabled": true,
      "browser.contentblocking.ui.enabled": true,

      // Make sure we're not affected by the Symantec distrust.
      "security.pki.distrust_ca_policy": 1,

      // Show the "Report Breakage" dialog in the control center
      "browser.contentblocking.reportBreakage.enabled": true,

      "browser.fastblock.enabled": false,
      "privacy.trackingprotection.enabled": true,

      // Disable FastBlock UI.
      "browser.contentblocking.fastblock.ui.enabled": false,
      "browser.contentblocking.fastblock.control-center.ui.enabled": false,
    },
  },

  "FB2L0": {
    weight: 1,
    prefs: {
      // Always turn on Content Blocking.
      "browser.contentblocking.enabled": true,
      "browser.contentblocking.ui.enabled": true,

      // Make sure we're not affected by the Symantec distrust.
      "security.pki.distrust_ca_policy": 1,

      // Show the "Report Breakage" dialog in the control center
      "browser.contentblocking.reportBreakage.enabled": true,

      "browser.fastblock.enabled": true,
      "browser.fastblock.timeout": 2000,
      "privacy.trackingprotection.enabled": false,

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
    },
  },

  "FB2L1": {
    weight: 1,
    prefs: {
      // Always turn on Content Blocking.
      "browser.contentblocking.enabled": true,
      "browser.contentblocking.ui.enabled": true,

      // Make sure we're not affected by the Symantec distrust.
      "security.pki.distrust_ca_policy": 1,

      // Show the "Report Breakage" dialog in the control center
      "browser.contentblocking.reportBreakage.enabled": true,

      "browser.fastblock.enabled": true,
      "browser.fastblock.timeout": 2000,
      "privacy.trackingprotection.enabled": false,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock1-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock1-trackwhite-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
    },
  },

  "FB2L2": {
    weight: 1,
    prefs: {
      // Always turn on Content Blocking.
      "browser.contentblocking.enabled": true,
      "browser.contentblocking.ui.enabled": true,

      // Make sure we're not affected by the Symantec distrust.
      "security.pki.distrust_ca_policy": 1,

      // Show the "Report Breakage" dialog in the control center
      "browser.contentblocking.reportBreakage.enabled": true,

      "browser.fastblock.enabled": true,
      "browser.fastblock.timeout": 2000,
      "privacy.trackingprotection.enabled": false,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock2-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock2-trackwhite-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
    },
  },

  "FB2L3": {
    weight: 1,
    prefs: {
      // Always turn on Content Blocking.
      "browser.contentblocking.enabled": true,
      "browser.contentblocking.ui.enabled": true,

      // Make sure we're not affected by the Symantec distrust.
      "security.pki.distrust_ca_policy": 1,

      // Show the "Report Breakage" dialog in the control center
      "browser.contentblocking.reportBreakage.enabled": true,

      "browser.fastblock.enabled": true,
      "browser.fastblock.timeout": 2000,
      "privacy.trackingprotection.enabled": false,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock3-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock3-trackwhite-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
    },
  },

  "FB5L0": {
    weight: 1,
    prefs: {
      // Always turn on Content Blocking.
      "browser.contentblocking.enabled": true,
      "browser.contentblocking.ui.enabled": true,

      // Make sure we're not affected by the Symantec distrust.
      "security.pki.distrust_ca_policy": 1,

      // Show the "Report Breakage" dialog in the control center
      "browser.contentblocking.reportBreakage.enabled": true,

      "browser.fastblock.enabled": true,
      "browser.fastblock.timeout": 5000,
      "privacy.trackingprotection.enabled": false,

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
    },
  },

  "FB5L1": {
    weight: 1,
    prefs: {
      // Always turn on Content Blocking.
      "browser.contentblocking.enabled": true,
      "browser.contentblocking.ui.enabled": true,

      // Make sure we're not affected by the Symantec distrust.
      "security.pki.distrust_ca_policy": 1,

      // Show the "Report Breakage" dialog in the control center
      "browser.contentblocking.reportBreakage.enabled": true,

      "browser.fastblock.enabled": true,
      "browser.fastblock.timeout": 5000,
      "privacy.trackingprotection.enabled": false,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock1-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock1-trackwhite-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
    },
  },

  "FB5L2": {
    weight: 1,
    prefs: {
      // Always turn on Content Blocking.
      "browser.contentblocking.enabled": true,
      "browser.contentblocking.ui.enabled": true,

      // Make sure we're not affected by the Symantec distrust.
      "security.pki.distrust_ca_policy": 1,

      // Show the "Report Breakage" dialog in the control center
      "browser.contentblocking.reportBreakage.enabled": true,

      "browser.fastblock.enabled": true,
      "browser.fastblock.timeout": 5000,
      "privacy.trackingprotection.enabled": false,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock2-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock2-trackwhite-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
    },
  },

  "FB5L3": {
    weight: 1,
    prefs: {
      // Always turn on Content Blocking.
      "browser.contentblocking.enabled": true,
      "browser.contentblocking.ui.enabled": true,

      // Make sure we're not affected by the Symantec distrust.
      "security.pki.distrust_ca_policy": 1,

      // Show the "Report Breakage" dialog in the control center
      "browser.contentblocking.reportBreakage.enabled": true,

      "browser.fastblock.enabled": true,
      "browser.fastblock.timeout": 5000,
      "privacy.trackingprotection.enabled": false,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock3-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock3-trackwhite-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
    },
  },

  "ControlL0": {
    weight: 1,
    prefs: {
      // Always turn on Content Blocking.
      "browser.contentblocking.enabled": true,
      "browser.contentblocking.ui.enabled": true,

      // Make sure we're not affected by the Symantec distrust.
      "security.pki.distrust_ca_policy": 1,

      // Show the "Report Breakage" dialog in the control center
      "browser.contentblocking.reportBreakage.enabled": true,

      "browser.fastblock.enabled": false,
      "privacy.trackingprotection.enabled": false,

      // Disable TP and FastBlock UI.
      "browser.contentblocking.fastblock.ui.enabled": false,
      "browser.contentblocking.fastblock.control-center.ui.enabled": false,
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
    },
  },

  "ControlL1": {
    weight: 1,
    prefs: {
      // Always turn on Content Blocking.
      "browser.contentblocking.enabled": true,
      "browser.contentblocking.ui.enabled": true,

      // Make sure we're not affected by the Symantec distrust.
      "security.pki.distrust_ca_policy": 1,

      // Show the "Report Breakage" dialog in the control center
      "browser.contentblocking.reportBreakage.enabled": true,

      "browser.fastblock.enabled": false,
      "privacy.trackingprotection.enabled": false,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock1-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock1-trackwhite-digest256",

      // Disable TP and FastBlock UI.
      "browser.contentblocking.fastblock.ui.enabled": false,
      "browser.contentblocking.fastblock.control-center.ui.enabled": false,
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
    },
  },

  "ControlL2": {
    weight: 1,
    prefs: {
      // Always turn on Content Blocking.
      "browser.contentblocking.enabled": true,
      "browser.contentblocking.ui.enabled": true,

      // Make sure we're not affected by the Symantec distrust.
      "security.pki.distrust_ca_policy": 1,

      // Show the "Report Breakage" dialog in the control center
      "browser.contentblocking.reportBreakage.enabled": true,

      "browser.fastblock.enabled": false,
      "privacy.trackingprotection.enabled": false,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock2-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock2-trackwhite-digest256",

      // Disable TP and FastBlock UI.
      "browser.contentblocking.fastblock.ui.enabled": false,
      "browser.contentblocking.fastblock.control-center.ui.enabled": false,
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
    },
  },

  "ControlL3": {
    weight: 1,
    prefs: {
      // Always turn on Content Blocking.
      "browser.contentblocking.enabled": true,
      "browser.contentblocking.ui.enabled": true,

      // Make sure we're not affected by the Symantec distrust.
      "security.pki.distrust_ca_policy": 1,

      // Show the "Report Breakage" dialog in the control center
      "browser.contentblocking.reportBreakage.enabled": true,

      "browser.fastblock.enabled": false,
      "privacy.trackingprotection.enabled": false,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock3-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock3-trackwhite-digest256",

      // Disable TP and FastBlock UI.
      "browser.contentblocking.fastblock.ui.enabled": false,
      "browser.contentblocking.fastblock.control-center.ui.enabled": false,
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,
    },
  },
};
