
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light-theme");
}

function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active',
      href === page || (page === '' && href === 'index.html')
    );
  });
}


function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


function initHamburger() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    })
  );
}


function initFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── Skill Bar Animation ── */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = (e.target.dataset.pct || '0') + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  fills.forEach(f => obs.observe(f));
}

/* ── Contact Form Validation ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: {
      el: form.querySelector('#name'),
      msg: form.querySelector('#nameError'),
      check: v => v.trim().length >= 2,
      err: 'Name must be at least 2 characters.'
    },
    email: {
      el: form.querySelector('#email'),
      msg: form.querySelector('#emailError'),
      check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      err: 'Please enter a valid email address.'
    },
    subject: {
      el: form.querySelector('#subject'),
      msg: form.querySelector('#subjectError'),
      check: v => v.trim().length >= 3,
      err: 'Subject must be at least 3 characters.'
    },
    message: {
      el: form.querySelector('#message'),
      msg: form.querySelector('#messageError'),
      check: v => v.trim().length >= 10,
      err: 'Message must be at least 10 characters.'
    }
  };

  function validateField(key) {
    const f = fields[key];
    if (!f.el) return true;
    const valid = f.check(f.el.value);
    f.el.classList.toggle('error', !valid);
    if (f.msg) {
      f.msg.textContent = valid ? '' : f.err;
      f.msg.classList.toggle('show', !valid);
    }
    return valid;
  }

  /* Live validation on blur + fix-on-type */
  Object.keys(fields).forEach(key => {
    const f = fields[key];
    if (f.el) f.el.addEventListener('blur', () => validateField(key));
    if (f.el) f.el.addEventListener('input', () => {
      if (f.el.classList.contains('error')) validateField(key);
    });
  });

  /* Submit */
  form.addEventListener('submit', e => {
    e.preventDefault();
    const allValid = Object.keys(fields)
      .map(k => validateField(k))
      .every(Boolean);
    if (!allValid) return;

    const btn       = form.querySelector('.submit-btn');
    const successEl = document.getElementById('formSuccess');
    btn.disabled    = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      form.style.display    = 'none';
      if (successEl) successEl.style.display = 'block';
    }, 1200);
  });
}

/* ── Typed Text Effect (Home only) ── */
function initTyped() {
  const el = document.getElementById('typed');
  if (!el) return;
  const words = ['Java Developer', 'Full Stack Developer', 'Problem Solver', 'IT Student'];
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);

    let delay = deleting ? 60 : 110;
    if (!deleting && ci === word.length)  { delay = 1800; deleting = true; }
    else if (deleting && ci === 0)        { deleting = false; wi = (wi + 1) % words.length; delay = 400; }
    setTimeout(tick, delay);
  }
  tick();
}
// 🌙 Dark Mode Toggle
//const toggleBtn = document.getElementById("themeToggle");

//toggleBtn.onclick = () => {
  //document.body.classList.toggle("dark-mode");
//};


// 🖱️ Custom Cursor
const cursor = document.getElementById("cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

/* ── Init All ── */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initNavbar();
  initHamburger();
  initFadeUp();
  initSkillBars();
  initContactForm();
  initTyped();
});