// HN Admin Pages Library
// - Add / remove pages
// - Keep site.menu in sync

window.HNAdmin = window.HNAdmin || {};

(function (HNAdmin) {
  function ensureRoot(data) {
    if (!data.site) data.site = {};
    if (!Array.isArray(data.site.menu)) data.site.menu = [];
    if (!data.pages) data.pages = {};
  }

  // Add a new page + menu item
  // options: { id, label, href }
  HNAdmin.addPage = function (data, options) {
    ensureRoot(data);

    var id = options.id;
    var label = options.label || id;
    var href = options.href || (id === "home" ? "index.html" : id + ".html");

    if (!id) {
      throw new Error("HNAdmin.addPage: id is required");
    }
    if (data.pages[id]) {
      throw new Error("HNAdmin.addPage: page id already exists: " + id);
    }

    // Create page entry
    data.pages[id] = {
      id: id,
      title: label,
      slug: id === "home" ? "index" : id,
      hero: {
        eyebrow: label,
        title: label,
        subtitle: "",
        style: "simple",
        transparentHeader: false,
        backgroundImage: ""
      },
      blocks: []
    };

    // Add to menu
    data.site.menu.push({
      id: id,
      label: label,
      href: href
    });

    return data;
  };

  // Remove a page + menu item
  HNAdmin.removePage = function (data, id) {
    ensureRoot(data);
    if (!id) return data;

    if (data.pages[id]) {
      delete data.pages[id];
    }

    data.site.menu = data.site.menu.filter(function (item) {
      return item.id !== id;
    });

    return data;
  };

  // Rename a page (updates page.title + menu label)
  // options: { id, newLabel }
  HNAdmin.renamePage = function (data, options) {
    ensureRoot(data);
    var id = options.id;
    var newLabel = options.newLabel;

    if (!id || !newLabel) {
      throw new Error("HNAdmin.renamePage: id and newLabel are required");
    }

    if (data.pages[id]) {
      data.pages[id].title = newLabel;
      if (data.pages[id].hero && !data.pages[id].hero.lockTitle) {
        data.pages[id].hero.title = newLabel;
      }
    }

    data.site.menu.forEach(function (item) {
      if (item.id === id) {
        item.label = newLabel;
      }
    });

    return data;
  };

  // Reorder menu items (takes an array of ids in new order)
  HNAdmin.reorderMenu = function (data, newOrderIds) {
    ensureRoot(data);
    var idToItem = {};
    data.site.menu.forEach(function (item) {
      idToItem[item.id] = item;
    });

    var reordered = [];
    newOrderIds.forEach(function (id) {
      if (idToItem[id]) {
        reordered.push(idToItem[id]);
        delete idToItem[id];
      }
    });

    // Any leftovers (ids not in newOrderIds) get appended
    Object.keys(idToItem).forEach(function (id) {
      reordered.push(idToItem[id]);
    });

    data.site.menu = reordered;
    return data;
  };
})(window.HNAdmin);
