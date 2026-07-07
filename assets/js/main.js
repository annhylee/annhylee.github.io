// NAV scroll shadow
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile nav (hamburger)
const navToggle = document.querySelector('.nav-toggle');
const setMenu = (open) => {
  navbar.classList.toggle('menu-open', open);
  navToggle.classList.toggle('open', open);
  document.body.classList.toggle('nav-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
};
navToggle.addEventListener('click', () => setMenu(!navbar.classList.contains('menu-open')));
document.querySelectorAll('.nav-links a').forEach((a) => {
  a.addEventListener('click', () => setMenu(false));
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});

// Typing animation — titles come from _data/profile.yml via data-titles attribute
const el = document.getElementById('typed-title');
const titles = JSON.parse(el.dataset.titles);
let ti = 0, ci = 0, deleting = false;

function type() {
  const current = titles[ti];
  if (!deleting) {
    el.textContent = current.slice(0, ci + 1);
    ci++;
    if (ci === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    el.textContent = current.slice(0, ci - 1);
    ci--;
    if (ci === 0) {
      deleting = false;
      ti = (ti + 1) % titles.length;
    }
  }
  setTimeout(type, deleting ? 45 : 80);
}
setTimeout(type, 1600);

// Contact form — opens the visitor's mail app with the fields prefilled
const contactForm = document.querySelector('.contact-form');
if (contactForm && contactForm.dataset.email) {
  contactForm.querySelector('.btn-submit').addEventListener('click', () => {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const subject = '[홈페이지 문의] ' + (name || '이름 미기재');
    const lines = [];
    if (name) lines.push('이름/소속: ' + name);
    if (email) lines.push('회신 이메일: ' + email);
    if (lines.length) lines.push('');
    lines.push(message);
    window.location.href = 'mailto:' + contactForm.dataset.email +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
  });
}

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));
