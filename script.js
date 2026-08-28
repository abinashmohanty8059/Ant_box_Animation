/**
 * AntBox — script.js
 * Vanilla JavaScript: Parallax · Nav · Scroll Reveal · Counter · Mobile Menu
 */

(function () {
  'use strict';

  /* ── Utility ───────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Navbar scroll effect ──────────────────────────────── */
  const navbar = $('#navbar');

  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ── Mobile menu ───────────────────────────────────────── */
  const hamburger   = $('#hamburger');
  const mobileMenu  = $('#mobileMenu');
  let menuOpen = false;

  function openMobileMenu() {
    menuOpen = true;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop();
  }

  window.closeMobileMenu = function () {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (window.lenis) window.lenis.start();
  };

  hamburger.addEventListener('click', () => {
    if (menuOpen) { closeMobileMenu(); } else { openMobileMenu(); }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMobileMenu();
  });

  /* ── Hero Parallax ─────────────────────────────────────── */
  const heroBg   = $('#heroBg');
  const heroWrap = $('#hero');

  if (heroBg && !prefersReducedMotion()) {
    let mouseX = 0, mouseY = 0;
    let curX   = 0, curY   = 0;
    let targetScrollY = 0;
    let curScrollY    = 0;

    // Mouse parallax (desktop only)
    const isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (isPointer) {
      heroWrap.addEventListener('mousemove', (e) => {
        const rect = heroWrap.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width  - 0.5) * 35; // Sensitivity
        mouseY = ((e.clientY - rect.top ) / rect.height - 0.5) * 22;
      }, { passive: true });

      heroWrap.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
      });
    }

    // Scroll tracking
    window.addEventListener('scroll', () => {
      targetScrollY = window.scrollY;
    }, { passive: true });

    const ctaBg   = $('#ctaBg');
    const ctaWrap = $('#cta');

    function updateParallax() {
      // Smoothly interpolate mouse target
      curX += (mouseX - curX) * 0.08;
      curY += (mouseY - curY) * 0.08;

      // Smoothly interpolate scroll target
      curScrollY += (targetScrollY - curScrollY) * 0.12;

      // Positive multiplier (0.4) shifts background down relative to container as we scroll down.
      // This means the background scrolls up slower than the text, creating a strong parallax depth.
      const yScrollShift = curScrollY * 0.45;

      if (curScrollY < window.innerHeight + 150) {
        heroBg.style.transform = `translate3d(${curX}px, ${curY + yScrollShift}px, 0) scale(1.15)`;
      }

      // Parallax for CTA background video
      if (ctaBg && ctaWrap) {
        const rect = ctaWrap.getBoundingClientRect();
        // Run only when the section is visible in the viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const diff = (window.innerHeight / 2) - (rect.top + rect.height / 2);
          const ctaShift = diff * 0.18; // Adjust parallax intensity
          ctaBg.style.transform = `translate3d(0, ${ctaShift}px, 0) scale(1.15)`;
        }
      }

      requestAnimationFrame(updateParallax);
    }
    updateParallax();
  }

  /* ── Scroll Reveal (IntersectionObserver) ──────────────── */
  const revealEls = $$('.reveal, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
          setTimeout(() => el.classList.add('visible'), delay);
          revealObs.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObs.observe(el));
  } else {
    // Fallback: show everything
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Counter animation ─────────────────────────────────── */
  const counters = $$('.stat-count');

  function animateCounter(el, target, duration = 1600) {
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current >= 1000
        ? (current / 1000).toFixed(current >= 10000 ? 0 : 1).replace('.0', '') + (target >= 1000 ? ',000' : 'k')
        : current;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target >= 10000
        ? '10,000'
        : target >= 1000
          ? target.toLocaleString()
          : target;
    };
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(el => counterObs.observe(el));
  }

  /* ── Skill bar animation ───────────────────────────────── */
  const skillBars = $$('.skill-bar-fill');

  if ('IntersectionObserver' in window && !prefersReducedMotion()) {
    const skillObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.width = el.dataset.width + '%';
          skillObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(el => skillObs.observe(el));
  } else {
    skillBars.forEach(el => { el.style.width = el.dataset.width + '%'; });
  }

  /* ── Smooth anchor scrolling ────────────────────────────── */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = $(href);
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 0;
        if (window.lenis) {
          window.lenis.scrollTo(target, { offset: -navH - 16 });
        } else {
          const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ── Feature card hover depth ─────────────────────────── */
  $$('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-3px)';
      card.style.transition = 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Why-card subtle tilt on hover (desktop) ─────────────── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion()) {
    $$('.why-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 4;
        const y = ((e.clientY - rect.top ) / rect.height - 0.5) * 4;
        card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(4px)`;
        card.style.transition = 'transform 0.1s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.35s ease, background 0.35s ease';
      });
    });
  }

  /* ── Marquee pause on hover ──────────────────────────────── */
  const marquee = $('#marqueeTrack');
  if (marquee) {
    const wrap = marquee.parentElement;
    wrap.addEventListener('mouseenter', () => { marquee.style.animationPlayState = 'paused'; });
    wrap.addEventListener('mouseleave', () => { marquee.style.animationPlayState = 'running'; });
  }

  /* ── Redesigned Student Stacked Card Deck ────────────────── */
  const cards = $$('#studentDeck .deck-card');
  const dots = $$('#deckDots .deck-dot');
  const currentCounter = $('#deckCurrent');
  const deckContainer = $('#studentDeck');
  const infoPanels = {
    1: $('#panel-real-world'),
    2: $('#panel-performance'),
    3: $('#panel-career'),
    4: $('#panel-real-world')
  };

  let activeIndex = 0; // 0 represents Card 1
  let deckTimer = null;
  const ROTATION_INTERVAL = 3000;

  // Initialize stack positions
  function updateDeckState() {
    cards.forEach((card, idx) => {
      // Calculate relative position in the stack starting from activeIndex
      const pos = (idx - activeIndex + cards.length) % cards.length;
      
      // Remove all stack position classes
      card.classList.remove('pos-1', 'pos-2', 'pos-3', 'pos-4', 'active');
      
      // Assign stack position class based on index offset
      if (pos === 0) {
        card.classList.add('pos-1', 'active');
        // Animate skill bars if it is card 1
        const fills = card.querySelectorAll('.skill-bar-fill');
        fills.forEach(fill => {
          const w = fill.dataset.width;
          if (w) fill.style.width = w + '%';
        });
      } else if (pos === 1) {
        card.classList.add('pos-2');
      } else if (pos === 2) {
        card.classList.add('pos-3');
      } else {
        card.classList.add('pos-4');
      }
    });

    // Update pagination dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });

    // Update page counter
    if (currentCounter) {
      currentCounter.textContent = '0' + (activeIndex + 1);
    }

    // Highlight corresponding info panel on the right
    Object.values(infoPanels).forEach(panel => {
      if (panel) panel.classList.remove('highlighted');
    });

    const activePanel = infoPanels[activeIndex + 1];
    if (activePanel) {
      activePanel.classList.add('highlighted');
    }
  }

  function startDeckRotation() {
    if (deckTimer) clearInterval(deckTimer);
    deckTimer = setInterval(() => {
      activeIndex = (activeIndex + 1) % cards.length;
      updateDeckState();
    }, ROTATION_INTERVAL);
  }

  function stopDeckRotation() {
    if (deckTimer) clearInterval(deckTimer);
  }

  // Bind hover states to pause rotation
  if (deckContainer) {
    deckContainer.addEventListener('mouseenter', stopDeckRotation);
    deckContainer.addEventListener('mouseleave', startDeckRotation);

    // Bind pagination dot click events
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        activeIndex = idx;
        updateDeckState();
      });
    });

    // Run initial setup
    updateDeckState();
    startDeckRotation();
  }
  /* ── Mini Chat Widget ────────────────────────────────────── */
  const chatTrigger  = $('#chatTrigger');
  const chatWindow   = $('#chatWindow');
  const chatCloseBtn = $('#chatCloseBtn');
  const chatInput    = $('#chatInput');
  const chatSendBtn  = $('#chatSendBtn');
  const chatMessages = $('#chatMessages');
  const chatWelcome  = $('#chatWelcome');
  let chatLottieAnim = null;

  // Initialize Lottie Animation
  if (chatTrigger && typeof lottie !== 'undefined') {
    chatLottieAnim = lottie.loadAnimation({
      container: $('#chatLottie'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/Confused_student.json'
    });
  }

  function openChat() {
    chatWindow.classList.add('open');
    chatWindow.setAttribute('aria-hidden', 'false');
    chatTrigger.classList.add('hidden');
    // Focus input
    setTimeout(() => chatInput.focus(), 300);
  }

  function closeChat() {
    chatWindow.classList.remove('open');
    chatWindow.setAttribute('aria-hidden', 'true');
    chatTrigger.classList.remove('hidden');
  }

  if (chatTrigger) chatTrigger.addEventListener('click', openChat);
  if (chatCloseBtn) chatCloseBtn.addEventListener('click', closeChat);

  // Send message simulation
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Hide welcome state if visible
    if (chatWelcome) chatWelcome.style.display = 'none';

    // Add user bubble
    appendMessage(text, 'user');
    chatInput.value = '';

    // Scroll to bottom
    const body = chatMessages.parentElement;
    body.scrollTop = body.scrollHeight;

    // Simulate Bot response
    setTimeout(() => {
      let botText = "Thank you for asking! I'm the AntBox AI Assistant. I can help you learn more about our Sprints, AI Readiness score, or connecting with Tribes. Feel free to explore our Platform or Solutions sections!";
      if (text.toLowerCase().includes('sprint')) {
        botText = "AntBox Sprints are intensive, guided skill programs designed by top experts. They focus on real-world briefs from top enterprises to prepare you for actual work environments.";
      } else if (text.toLowerCase().includes('score') || text.toLowerCase().includes('ready')) {
        botText = "Your AI Readiness Score is calculated by evaluating your active participation, problem-solving speed, and output quality across multiple Sprints. Employers trust this score over generic resumes!";
      } else if (text.toLowerCase().includes('tribe') || text.toLowerCase().includes('corporate')) {
        botText = "Tribes are vetted, pre-validated talent groups that match specific corporate needs. Companies can query our Tribe Analytics Engine to find candidate readiness profiles instantly.";
      }
      appendMessage(botText, 'bot');
      body.scrollTop = body.scrollHeight;
    }, 1000);
  }

  function appendMessage(content, sender) {
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', sender);
    bubble.textContent = content;
    chatMessages.appendChild(bubble);
  }

  if (chatSendBtn) chatSendBtn.addEventListener('click', sendMessage);
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  /* ── GSAP & Lenis Cinematic Scroll ───────────────────────── */
  if (!prefersReducedMotion() && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll
    let lenis;
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false
      });

      window.lenis = lenis;

      // Integrate Lenis with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }

    // Talent Stories Pinned Reveal Animation
    const storiesSection = $('#talent-stories');
    const pinnedWrapper = $('.stories-pinned-wrapper');
    const introInner = $('.intro-inner');
    const revealPanel = $('.stories-reveal-panel');

    if (storiesSection && pinnedWrapper && introInner && revealPanel) {
      // Create ScrollTrigger Timeline for the Reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: storiesSection,
          start: 'top top',
          end: '+=100%', // pin briefly for the duration of the reveal
          pin: '.stories-pinned-wrapper',
          pinSpacing: true,
          scrub: 1, // smooth scroll scrub
          anticipatePin: 1,
        }
      });

      // Animate the intro heading up slightly (y: -30px max) and reduce opacity
      tl.to(introInner, {
        y: -30,
        opacity: 0.15,
        ease: 'power3.inOut',
        duration: 1
      }, 0);

      // Expand the black reveal panel from the bottom using clip-path (duration 1.2)
      tl.to(revealPanel, {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'power3.inOut',
        duration: 1.2
      }, 0);
    }
  }

  /* ── Init complete ───────────────────────────────────────── */
  console.log('%c🐜 AntBox loaded', 'color:#7c3aed;font-weight:bold;font-size:14px;');

})();

