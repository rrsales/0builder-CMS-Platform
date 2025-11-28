<script src="live.js"></script>
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const pageSlug = body.getAttribute("data-page") || "home";

  // The hero section on the page
  const hero = document.querySelector(".hero");
  if (!hero) return; // if page has no hero, do nothing

  // Fetch site-data.json (must be in the repo root)
  fetch("site-data.json", { cache: "no-store" })
    .then(res => res.json())
    .then(site => {
      if (!site.pages) return;

      const page = site.pages.find(p => p.slug === pageSlug || p.title === "Home");
      if (!page || !page.hero) return;

      const h = page.hero;

      // Apply background image
      if (h.bg) {
        hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url('${h.bg}')`;
      }

      // Apply text (expects .hero h1 and .hero p elements)
      const titleEl = hero.querySelector("h1");
      const subEls = hero.querySelectorAll("p");
      if (titleEl && h.overlay) titleEl.textContent = h.overlay;
      if (subEls[0] && h.sub) subEls[0].textContent = h.sub;

      // Apply hero size
      let height = "100vh";
      switch (h.size) {
        case "small":  height = "40vh"; break;
        case "medium": height = "60vh"; break;
        case "large":  height = "80vh"; break;
        case "full":   height = "100vh"; break;
        case "custom":
          height = h.customHeight && h.customHeight.trim() ? h.customHeight.trim() : "100vh";
          break;
      }
      hero.style.height = height;

      // Transparent menu toggle (if your header supports it)
      if (h.transparentMenu) {
        document.documentElement.style.setProperty("--menu-bg", "transparent");
      } else {
        document.documentElement.style.setProperty("--menu-bg", "rgba(0,0,0,0.95)");
      }
    })
    .catch(err => {
      console.warn("live.js could not load site-data.json", err);
    });
});
