// nav.js - dynamic nav renderer (reads admin/localStorage)
document.addEventListener('DOMContentLoaded', () => {
  let siteData = localStorage.getItem('honestnews_siteData_v1');
  let pages = [];
  if (siteData) {
    try { pages = JSON.parse(siteData).pages || []; } catch(e){ pages = []; }
  }
  if (!pages.length && typeof DEFAULT_PAGES !== 'undefined') pages = DEFAULT_PAGES;

  const navs = document.querySelectorAll('.nav-menu');
  navs.forEach(nav => {
    nav.innerHTML = '';
    pages.forEach(p => {
      const a = document.createElement('a');
      a.href = p.url;
      a.textContent = p.title;
      nav.appendChild(a);
    });
  });
});
