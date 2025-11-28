document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const slug = body.getAttribute("data-page") || "home";
  const hero = document.querySelector(".hero, .hero-carousel");

  fetch("site-data.json", { cache: "no-store" })
    .then(r => r.json())
    .then(site => {
      if (!site.pages) return;

      const page = site.pages.find(p => p.slug === slug);
      if (!page) return;

      const h = page.hero || {};

      // --------------------------------------------------------
      // HERO BACKGROUND
      // --------------------------------------------------------
      if (hero && h.bg) {
        hero.style.backgroundImage =
          `linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)), url('${h.bg}')`;
        hero.style.backgroundSize = "cover";
        hero.style.backgroundPosition = "center";
      }

      // --------------------------------------------------------
      // HERO HEIGHT
      // --------------------------------------------------------
      if (hero) {
        let height = "100vh";
        switch (h.size) {
          case "small":  height = "40vh"; break;
          case "medium": height = "60vh"; break;
          case "large":  height = "80vh"; break;
          case "full":   height = "100vh"; break;
          case "custom":
            height = (h.customHeight || "100vh");
            break;
        }
        hero.style.height = height;
      }

      // --------------------------------------------------------
      // TITLE + SUBTITLE
      // --------------------------------------------------------
      const title = hero?.querySelector("h1");
      const sub   = hero?.querySelector("p");

      if (title) title.textContent = h.overlay || "";
      if (sub)   sub.textContent = h.sub || "";

      // --------------------------------------------------------
      // MENU TRANSPARENCY
      // --------------------------------------------------------
      const header = document.querySelector("header");
      if (header) {
        if (h.transparentMenu) {
          header.style.background = "transparent";
        } else {
          header.style.background = "rgba(0,0,0,0.95)";
        }
      }

      // --------------------------------------------------------
      // PARALLAX & FLOAT BEHAVIOR
      // (basic starter — can expand later)
      // --------------------------------------------------------
      if (h.behavior === "parallax-medium" || h.behavior === "parallax-slow") {
        window.addEventListener("scroll", () => {
          const rate = h.behavior === "parallax-slow" ? 0.15 : 0.3;
          hero.style.transform = `translateY(${window.scrollY * rate}px)`;
        });
      }

      if (h.behavior === "float-up") {
        hero.style.transition = "transform 1.2s ease-out";
        hero.style.transform = "translateY(35px)";
        setTimeout(() => {
          hero.style.transform = "translateY(0px)";
        }, 80);
      }
    })
    .catch(err => console.log("live.js error:", err));
});

