// assets/js/mobile/mobile.cards.js

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  if (!isMobile) return;

  const blocksRoot = document.querySelector('[data-blocks-target]');
  if (!blocksRoot) return;

  // Example: tap paragraphs to expand if long (future-proof)
  blocksRoot.addEventListener('click', (e) => {
    const paraBlock = e.target.closest('.block-paragraph');
    if (!paraBlock) return;

    paraBlock.classList.toggle('hn-expanded');
  });
});
