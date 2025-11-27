// site-config.js
const SITE_CONFIG = {
  name: "Honest News Network",
  storageKey: "honestnews_siteData_v1", // must match admin.js
  heroDefaults: {
    height: "60vh",
    slides: [
      "assets/images/hero/hero1.jpg",
      "assets/images/hero/hero2.jpg",
      "assets/images/hero/hero3.jpg"
    ]
  },
  debug: false
};

if (SITE_CONFIG.debug) console.log("Site config loaded", SITE_CONFIG);

// site-config.js - site-wide config
const SITE = {
  name: "Honest News Network",
  version: "1.0",
  debug: false
};
console.log("site-config loaded", SITE);
