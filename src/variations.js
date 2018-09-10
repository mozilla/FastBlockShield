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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      // Reset TP list to the default value.
      "urlclassifier.trackingTable": "test-track-simple,base-track-digest256",

      // Disable FastBlock UI.
      "browser.contentblocking.fastblock.ui.enabled": false,
      "browser.contentblocking.fastblock.control-center.ui.enabled": false,

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      // L0 gets the default lists.
      "urlclassifier.trackingAnnotationTable": "test-track-simple,base-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock1-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock1-trackwhite-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

      "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock1-track-digest256,fastblock1-trackwhite-digest256",

      "urlclassifier.disallow_completion": "test-malware-simple,test-harmful-simple,test-phish-simple,test-unwanted-simple,test-track-simple,test-trackwhite-simple,test-block-simple,goog-downloadwhite-digest256,base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,goog-passwordwhite-proto,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock1-track-digest256,fastblock1-trackwhite-digest256",

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock2-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock2-trackwhite-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

      "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock2-track-digest256,fastblock2-trackwhite-digest256",

      "urlclassifier.disallow_completion": "test-malware-simple,test-harmful-simple,test-phish-simple,test-unwanted-simple,test-track-simple,test-trackwhite-simple,test-block-simple,goog-downloadwhite-digest256,base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,goog-passwordwhite-proto,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock2-track-digest256,fastblock2-trackwhite-digest256",

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock3-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

      "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock3-track-digest256",

      "urlclassifier.disallow_completion": "test-malware-simple,test-harmful-simple,test-phish-simple,test-unwanted-simple,test-track-simple,test-trackwhite-simple,test-block-simple,goog-downloadwhite-digest256,base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,goog-passwordwhite-proto,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock3-track-digest256",

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
    },
  },

    "FB2L4": {
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

        // Make sure to enable tailing.
        "network.http.tailing.enabled": true,

        "urlclassifier.trackingAnnotationTable": "test-track-simple,ads-track-digest256,social-track-digest256",

        // Disable TP UI.
        "browser.contentblocking.trackingprotection.ui.enabled": false,
        "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

        // Ensure we download the lists faster.
        "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      // L0 gets the default lists.
      "urlclassifier.trackingAnnotationTable": "test-track-simple,base-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock1-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock1-trackwhite-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

      "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock1-track-digest256,fastblock1-trackwhite-digest256",

      "urlclassifier.disallow_completion": "test-malware-simple,test-harmful-simple,test-phish-simple,test-unwanted-simple,test-track-simple,test-trackwhite-simple,test-block-simple,goog-downloadwhite-digest256,base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,goog-passwordwhite-proto,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock1-track-digest256,fastblock1-trackwhite-digest256",

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock2-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock2-trackwhite-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

      "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock2-track-digest256,fastblock2-trackwhite-digest256",

      "urlclassifier.disallow_completion": "test-malware-simple,test-harmful-simple,test-phish-simple,test-unwanted-simple,test-track-simple,test-trackwhite-simple,test-block-simple,goog-downloadwhite-digest256,base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,goog-passwordwhite-proto,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock2-track-digest256,fastblock2-trackwhite-digest256",

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock3-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

      "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock3-track-digest256",

      "urlclassifier.disallow_completion": "test-malware-simple,test-harmful-simple,test-phish-simple,test-unwanted-simple,test-track-simple,test-trackwhite-simple,test-block-simple,goog-downloadwhite-digest256,base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,goog-passwordwhite-proto,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock3-track-digest256",

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
    },
  },

  "FB5L4": {
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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,ads-track-digest256,social-track-digest256",

      // Disable TP UI.
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,base-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256",

      // Disable TP and FastBlock UI.
      "browser.contentblocking.fastblock.ui.enabled": false,
      "browser.contentblocking.fastblock.control-center.ui.enabled": false,
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock1-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock1-trackwhite-digest256",

      // Disable TP and FastBlock UI.
      "browser.contentblocking.fastblock.ui.enabled": false,
      "browser.contentblocking.fastblock.control-center.ui.enabled": false,
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

      "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock1-track-digest256,fastblock1-trackwhite-digest256",

      "urlclassifier.disallow_completion": "test-malware-simple,test-harmful-simple,test-phish-simple,test-unwanted-simple,test-track-simple,test-trackwhite-simple,test-block-simple,goog-downloadwhite-digest256,base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,goog-passwordwhite-proto,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock1-track-digest256,fastblock1-trackwhite-digest256",

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock2-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256,fastblock2-trackwhite-digest256",

      // Disable TP and FastBlock UI.
      "browser.contentblocking.fastblock.ui.enabled": false,
      "browser.contentblocking.fastblock.control-center.ui.enabled": false,
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

      "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock2-track-digest256,fastblock2-trackwhite-digest256",

      "urlclassifier.disallow_completion": "test-malware-simple,test-harmful-simple,test-phish-simple,test-unwanted-simple,test-track-simple,test-trackwhite-simple,test-block-simple,goog-downloadwhite-digest256,base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,goog-passwordwhite-proto,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock2-track-digest256,fastblock2-trackwhite-digest256",

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,fastblock3-track-digest256",
      "urlclassifier.trackingAnnotationWhitelistTable": "test-trackwhite-simple,mozstd-trackwhite-digest256",

      // Disable TP and FastBlock UI.
      "browser.contentblocking.fastblock.ui.enabled": false,
      "browser.contentblocking.fastblock.control-center.ui.enabled": false,
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

      "browser.safebrowsing.provider.mozilla.lists": "base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock3-track-digest256",

      "urlclassifier.disallow_completion": "test-malware-simple,test-harmful-simple,test-phish-simple,test-unwanted-simple,test-track-simple,test-trackwhite-simple,test-block-simple,goog-downloadwhite-digest256,base-track-digest256,mozstd-trackwhite-digest256,content-track-digest256,mozplugin-block-digest256,mozplugin2-block-digest256,block-flash-digest256,except-flash-digest256,allow-flashallow-digest256,except-flashallow-digest256,block-flashsubdoc-digest256,except-flashsubdoc-digest256,except-flashinfobar-digest256,goog-passwordwhite-proto,ads-track-digest256,social-track-digest256,analytics-track-digest256,fastblock3-track-digest256",

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
    },
  },
  "ControlL4": {
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

      // Make sure to enable tailing.
      "network.http.tailing.enabled": true,

      "urlclassifier.trackingAnnotationTable": "test-track-simple,ads-track-digest256,social-track-digest256",

      // Disable TP and FastBlock UI.
      "browser.contentblocking.fastblock.ui.enabled": false,
      "browser.contentblocking.fastblock.control-center.ui.enabled": false,
      "browser.contentblocking.trackingprotection.ui.enabled": false,
      "browser.contentblocking.trackingprotection.control-center.ui.enabled": false,

      // Ensure we download the lists faster.
      "browser.safebrowsing.provider.mozilla.nextupdatetime": "1",
    },
  },
};
