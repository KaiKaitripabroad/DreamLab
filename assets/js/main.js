/* js/main.js */

// ——— Navbar scroll state ———
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

// ——— Hamburger menu ———
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ——— Intersection Observer: timeline items ———
const timelineItems = document.querySelectorAll('.timeline-item[data-aos]');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 120);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
timelineItems.forEach(el => observer.observe(el));

// ——— Smooth active nav highlight ———
const sections = document.querySelectorAll('section[id]');
const navAnchorMap = {};
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href?.startsWith('#')) navAnchorMap[href.slice(1)] = a;
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      const link = navAnchorMap[entry.target.id];
      if (link) {
        if (entry.isIntersecting) link.style.color = 'var(--accent)';
        else link.style.color = '';
      }
    });
  },
  { rootMargin: '-40% 0px -50% 0px' }
);
sections.forEach(s => sectionObserver.observe(s));

// ——— Event map: close / reopen ———
const eventMapBlock = document.getElementById('eventMapBlock');
const eventMapClose = document.getElementById('eventMapClose');
const eventMapReopen = document.getElementById('eventMapReopen');

function setEventMapOpen(open) {
  if (!eventMapBlock || !eventMapClose || !eventMapReopen) return;
  if (open) {
    eventMapBlock.classList.remove('is-closed');
    eventMapReopen.hidden = true;
    eventMapClose.setAttribute('aria-expanded', 'true');
  } else {
    eventMapBlock.classList.add('is-closed');
    eventMapReopen.hidden = false;
    eventMapClose.setAttribute('aria-expanded', 'false');
  }
}

eventMapClose?.addEventListener('click', () => setEventMapOpen(false));
eventMapReopen?.addEventListener('click', () => setEventMapOpen(true));
