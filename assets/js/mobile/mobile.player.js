// assets/js/mobile/mobile.player.js

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  if (!isMobile) return;

  const source = document.querySelector('[data-podcast-player]');
  if (!source) return;

  const title = source.getAttribute('data-title') || 'Latest episode';
  const sub   = source.getAttribute('data-sub')   || 'Tap to listen';
  const art   = source.getAttribute('data-art')   || '';
  const href  = source.getAttribute('data-url')   || '#';

  const player = document.createElement('div');
  player.className = 'hn-player';

  player.innerHTML = `
    <div class="hn-player-art">
      ${art ? `<img src="${art}" alt="">` : ''}
    </div>
    <div class="hn-player-main">
      <div class="hn-player-title">${escapeHtml(title)}</div>
      <div class="hn-player-sub">${escapeHtml(sub)}</div>
    </div>
    <button class="hn-player-cta" type="button">Play</button>
    <button class="hn-player-close" type="button">×</button>
  `;

  document.body.appendChild(player);

  requestAnimationFrame(() => {
    setTimeout(() => {
      player.classList.add('visible');
    }, 300);
  });

  const closeBtn = player.querySelector('.hn-player-close');
  const ctaBtn   = player.querySelector('.hn-player-cta');

  closeBtn.addEventListener('click', () => {
    player.classList.remove('visible');
    setTimeout(() => player.remove(), 250);
  });

  ctaBtn.addEventListener('click', () => {
    if (href && href !== '#') {
      window.location.href = href;
    } else {
      // Future: scroll to embedded player
      const embed = document.querySelector('.block-podcast iframe');
      if (embed) {
        embed.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
});
