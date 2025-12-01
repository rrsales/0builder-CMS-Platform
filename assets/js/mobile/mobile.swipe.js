// assets/js/mobile/mobile.swipe.js

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('[data-mobile-menu-overlay]');
  const drawer  = document.querySelector('[data-mobile-nav-drawer]');
  const body    = document.body;

  if (!overlay && !drawer) return;

  let startX = null;
  let startY = null;
  let tracking = false;

  function onTouchStart(e) {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    tracking = true;
  }

  function onTouchMove(e) {
    if (!tracking || e.touches.length !== 1) return;
    // cheap vertical vs horizontal discrimination, but we only care about end
  }

  function onTouchEnd(e) {
    if (!tracking) return;
    tracking = false;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      // horizontal swipe
      if (dx > 0) {
        // swipe right: maybe open drawer (future)
      } else {
        // swipe left: close things
        if (drawer && drawer.classList.contains('open')) {
          drawer.classList.remove('open');
        }
        if (overlay && overlay.classList.contains('open')) {
          overlay.classList.remove('open');
        }
        body.classList.remove('hn-no-scroll');
      }
    }
  }

  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchmove', onTouchMove, { passive: true });
  document.addEventListener('touchend', onTouchEnd);
});
