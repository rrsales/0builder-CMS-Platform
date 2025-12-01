// HN Admin Hero Library
// - Update hero settings for a given page

window.HNAdmin = window.HNAdmin || {};

(function (HNAdmin) {
  function ensurePage(data, pageId) {
    if (!data.pages || !data.pages[pageId]) {
      throw new Error("HNAdmin.hero: page not found: " + pageId);
    }
    if (!data.pages[pageId].hero) {
      data.pages[pageId].hero = {};
    }
  }

  // options can include:
  // { eyebrow, title, subtitle, style, transparentHeader, backgroundImage }
  HNAdmin.updateHero = function (data, pageId, options) {
    ensurePage(data, pageId);
    var hero = data.pages[pageId].hero;

    Object.keys(options).forEach(function (key) {
      hero[key] = options[key];
    });

    return data;
  };

  // Convenience: toggle transparent header
  HNAdmin.setTransparentHeader = function (data, pageId, isTransparent) {
    ensurePage(data, pageId);
    data.pages[pageId].hero.transparentHeader = !!isTransparent;
    return data;
  };

  // Convenience: set hero style (e.g. "apple", "simple")
  HNAdmin.setHeroStyle = function (data, pageId, style) {
    ensurePage(data, pageId);
    data.pages[pageId].hero.style = style;
    return data;
  };
})(window.HNAdmin);
