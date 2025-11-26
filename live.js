// live.js – the $50k engine
fetch('data.json?t=' + Date.now())
  .then(r => r.json())
  .then(d => {
    // Font
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = d.font;
    document.head.appendChild(font);
    document.body.style.fontFamily = `"${d.fontName}", sans-serif`;

    // Colors
    document.body.style.color = d.textColor;
    document.querySelector('header').style.background = d.headerBg;
    document.querySelectorAll('.btn').forEach(b => b.style.background = d.primaryColor);

    // Parallax hero
    document.querySelector('.hero-carousel').style.backgroundAttachment = d.heroParallax ? 'fixed' : 'scroll';

    // Banner
    let banner = document.getElementById('siteBanner');
    if (!banner) { banner = document.createElement('div'); banner.id = 'siteBanner'; document.body.prepend(banner); }
    banner.textContent = d.bannerText || '';
    banner.style.display = d.bannerOn ? 'block' : 'none';

    // Hero carousel
    const carousel = document.querySelector('.hero-carousel');
    carousel.innerHTML = '<button class="arrow prev">‹</button><button class="arrow next">›</button><div class="dots"></div>';
    d.heroSlides.forEach((s, i) => {
      const slide = document.createElement('div');
      slide.className = 'slide' + (i === 0 ? ' active' : '');
      slide.style.backgroundImage = `url('${s.image}')`;
      slide.innerHTML = `<div class="slide-content"><h1>${s.title.replace(/<br>/g,'<br>')}</h1><p>${s.subtitle}</p><a href="${s.buttonLink}" class="btn">${s.buttonText}</a></div>`;
      carousel.appendChild(slide);

      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => showSlide(i);
      carousel.querySelector('.dots').appendChild(dot);
    });

    // Dynamic cards section
    let cardsSection = document.getElementById('dynamic-cards');
    if (!cardsSection) {
      cardsSection = document.createElement('section');
      cardsSection.id = 'dynamic-cards';
      cardsSection.style = 'padding:6rem 1rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem;max-width:1200px;margin:auto';
      document.querySelector('main')?.before(cardsSection);
    }
    cardsSection.innerHTML = '';
    d.cards.forEach(c => {
      const card = document.createElement('a');
      card.href = c.link;
      card.className = 'card';
      card.innerHTML = `
        <img src="${c.image}" style="width:100%;height:200px;object-fit:cover;border-radius:12px">
        <h3 style="margin:1rem 0">${c.title}</h3>
        <p>${c.text}</p>
      `;
      cardsSection.appendChild(card);
    });

    // Floating donate button
    let fab = document.getElementById('fab');
    if (!fab) {
      fab = document.createElement('a');
      fab.id = 'fab';
      fab.href = 'support.html';
      fab.innerHTML = '❤️ Donate';
      fab.style = 'position:fixed;bottom:30px;right:30px;background:#c00;color:white;padding:16px 24px;border-radius:50px;box-shadow:0 8px 20px rgba(0,0,0,0.3);font-weight:bold;z-index:999;animation:pulse 2s infinite';
      document.body.appendChild(fab);
    }

    // Carousel logic
    let current = 0;
    const slides = carousel.querySelectorAll('.slide');
    const dots = carousel.querySelectorAll('.dot');
    const showSlide = n => {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      slides[n].classList.add('active');
      dots[n].classList.add('active');
      current = n;
    };
    carousel.querySelector('.prev').onclick = () => showSlide((current - 1 + slides.length) % slides.length);
    carousel.querySelector('.next').onclick = () => showSlide((current + 1) % slides.length);
    setInterval(() => carousel.querySelector('.next').click(), 7000);

    // Smooth scroll + card tilt
    document.documentElement.style.scrollBehavior = 'smooth';
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.transform = `perspective(1000px) rotateY(${(x/rect.width-0.5)*20}deg) rotateX(${-(y/rect.height-0.5)*20}deg)`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = 'none');
    });
  });

// Pulse animation for FAB
const style = document.createElement('style');
style.textContent = `
@keyframes pulse {0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
#siteBanner{background:#c00;color:white;padding:12px;font-weight:bold;text-align:center}
.card{transition:transform .3s,box-shadow .3s;background:white;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1);text-decoration:none;color:inherit}
.card:hover{box-shadow:0 20px 40px rgba(0,0,0,0.2)}
`;
document.head.appendChild(style);
