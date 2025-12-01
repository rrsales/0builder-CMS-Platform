/* ============================================================
   Honest News – MOBILE UI Framework
   Standalone system for all pages
   Includes: hamburger, drawer, overlay, animations
============================================================ */

/* Hide desktop nav when mobile */
@media (max-width: 900px){
  .desktop-only {
    display: none !important;
  }
}

/* SHOW mobile toggle */
.hn-mobile-toggle {
  display: none;
}

@media (max-width: 900px){
  .hn-mobile-toggle {
    display: flex;
    flex-direction: column;
    width: 32px;
    height: 24px;
    justify-content: space-between;
    cursor: pointer;
    z-index: 999999;
    background: transparent;
    border: none;
    padding: 0;
  }
  .hn-mobile-toggle span,
  .hn-mobile-toggle span::before,
  .hn-mobile-toggle span::after {
    content: "";
    display: block;
    height: 3px;
    background: #fff;
    border-radius: 3px;
    transition: .25s ease;
  }
}

/* Drawer menu */
.hn-mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 78%;
  max-width: 340px;
  height: 100%;
  background: #0f172a;
  z-index: 999998;
  padding: 20px;
  box-shadow: -4px 0 40px rgba(0,0,0,.75);
  transition: right .35s cubic-bezier(.19,1,.22,1);
  overflow-y: auto;
}

/* When open */
.hn-mobile-menu.open {
  right: 0;
}

/* Header inside drawer */
.hn-mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,.15);
}

.hn-mobile-menu-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

#mobileMenuClose {
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
}

/* Mobile UL */
#mobileNavMenu {
  list-style: none;
  margin: 0;
  padding: 0;
}

#mobileNavMenu li a {
  display: block;
  padding: 14px 4px;
  font-size: 1rem;
  color: #e5e7eb;
  text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,.08);
}

#mobileNavMenu li a.active {
  color: #38bdf8;
}

/* Screen dim background */
.hn-mobile-overlay {
  content: "";
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  z-index: 999997;
  opacity: 0;
  pointer-events: none;
  transition: opacity .25s ease;
}

.hn-mobile-overlay.visible {
  opacity: 1;
  pointer-events: auto;
}

/* Lock scroll when menu open */
body.hn-menu-open {
  overflow: hidden;
}
