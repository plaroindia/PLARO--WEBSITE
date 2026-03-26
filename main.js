// =============================================
// PLARO — Main JavaScript
// Scroll animations, navbar, interactions
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // -------- NAVBAR SCROLL BEHAVIOR --------
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // -------- SMOOTH SCROLL FOR ANCHOR LINKS --------
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const targetId = href.split('#')[1];
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, '#' + targetId);
      }
    });
  });

  // -------- INTERSECTION OBSERVER: FEATURE CARD REVEAL --------
  const cards = document.querySelectorAll('.feature-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger animation by index
        const cardIndex = Array.from(cards).indexOf(entry.target);
        const delay = (cardIndex % 3) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  cards.forEach(card => observer.observe(card));

  // -------- GENERAL REVEAL OBSERVER --------
  const revealElements = document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale');

  const mainRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        mainRevealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => mainRevealObserver.observe(el));

  // -------- SECTION INTRO REVEAL (Legacy Custom fallback) --------
  const sectionIntro = document.querySelector('.section-intro');
  const posSection = document.querySelector('.positioning-section');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  [sectionIntro, posSection].forEach(el => {
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      sectionObserver.observe(el);
    }
  });

  // -------- TAIKEN CHOICE INTERACTION --------
  const choices = document.querySelectorAll('.ts-choice');
  choices.forEach(choice => {
    choice.addEventListener('click', () => {
      choices.forEach(c => c.classList.remove('ts-choice-active'));
      choice.classList.add('ts-choice-active');
    });
  });

  // -------- PEARL TAGS PARALLAX ON MOUSE MOVE --------
  const pearlVisual = document.querySelector('.pearl-visual');
  if (pearlVisual) {
    pearlVisual.addEventListener('mousemove', (e) => {
      const rect = pearlVisual.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;

      const core = pearlVisual.querySelector('.pearl-core');
      if (core) {
        core.style.transform = `translate(calc(-50% + ${dx * 12}px), calc(-50% + ${dy * 12}px))`;
      }
    });

    pearlVisual.addEventListener('mouseleave', () => {
      const core = pearlVisual.querySelector('.pearl-core');
      if (core) {
        core.style.transform = 'translate(-50%, -50%)';
      }
    });
  }

  // -------- DOMAIN CHIPS RIPPLE --------
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.style.transform = 'scale(0.95)';
      chip.style.background = 'rgba(99, 102, 241, 0.35)';
      setTimeout(() => {
        chip.style.transform = '';
        chip.style.background = '';
      }, 200);
    });
  });

  // -------- JOURNEY FLOW HOVER ANIMATION --------
  const jfSteps = document.querySelectorAll('.jf-step');
  jfSteps.forEach((step, i) => {
    step.style.transitionDelay = `${i * 50}ms`;
  });

  // -------- TYPED-STYLE BADGE TEXT ROTATION --------
  const heroStats = document.querySelectorAll('.stat-num');
  heroStats.forEach((el, i) => {
    const originalText = el.textContent;
    let count = 0;
    const target = parseInt(originalText);
    if (!isNaN(target)) {
      const interval = setInterval(() => {
        count += Math.ceil(target / 20);
        if (count >= target) {
          el.textContent = originalText;
          clearInterval(interval);
        } else {
          el.textContent = count;
        }
      }, 60);
    }
  });

  // -------- DATA INDEX INDICATOR LINE --------
  // Adds a subtle colored top-border accent per feature number
  cards.forEach(card => {
    const index = parseInt(card.getAttribute('data-index'));
    if (!index) return;
    const hue = (index * 28) % 360;
    const accent = document.createElement('div');
    accent.style.cssText = `
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, hsl(${hue}, 70%, 65%), transparent);
      border-radius: 32px 32px 0 0;
      opacity: 0.6;
      z-index: 2;
    `;
    card.prepend(accent);
  });

  // -------- MOBILE MENU TOGGLE --------
  const mobileToggles = document.querySelectorAll('.mobile-toggle');
  const navLinksList = document.querySelector('.nav-links');

  if (mobileToggles.length > 0 && navLinksList) {
    mobileToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinksList.classList.toggle('active');
      });
    });

    const navLinksListItems = document.querySelectorAll('.nav-links a');
    navLinksListItems.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggles.forEach(t => t.classList.remove('active'));
        navLinksList.classList.remove('active');
      });
    });
  }

});