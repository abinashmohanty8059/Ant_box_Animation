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
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
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
  const heroBg = $('#heroBg');
  const heroWrap = $('#hero');

  if (heroBg && !prefersReducedMotion()) {
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;
    let targetScrollY = 0;
    let curScrollY = 0;

    // Mouse parallax (desktop only)
    const isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (false) {
      heroWrap.addEventListener('mousemove', (e) => {
        const rect = heroWrap.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 35; // Sensitivity
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 22;
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

    const ctaBg = $('#ctaBg');
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
          const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
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
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 4;
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
  const chatTrigger = $('#chatTrigger');
  const chatWindow = $('#chatWindow');
  const chatCloseBtn = $('#chatCloseBtn');
  const chatInput = $('#chatInput');
  const chatSendBtn = $('#chatSendBtn');
  const chatMessages = $('#chatMessages');
  const chatWelcome = $('#chatWelcome');
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

    // Brand Footer Scroll-Reactive Animation (ANTBOX)
    const brandStrip = $('#brandFooterStrip');
    const partAnt = $('.part-ant');
    const partBox = $('.part-box');

    if (brandStrip && partAnt && partBox) {
      const getStartTranslation = () => {
        return window.innerWidth < 768 ? '22vw' : '35vw';
      };

      // Set initial states
      gsap.set(partAnt, { x: () => `-${getStartTranslation()}` });
      gsap.set(partBox, { x: () => getStartTranslation() });

      // Animate ANT left-to-center
      gsap.to(partAnt, {
        x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: brandStrip,
          start: 'top bottom', // when strip top enters viewport bottom
          end: 'bottom bottom', // when strip bottom meets viewport bottom
          scrub: 1
        }
      });

      // Animate BOX right-to-center
      gsap.to(partBox, {
        x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: brandStrip,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1
        }
      });
    }
  }

  /* ── Masked Heading — Video Through Text ─────────────────── */
  (function initMaskedHeading() {
    const root = $('#maskedHeading');
    const measure = $('#mhMeasure');
    const media = $('#mhMedia');
    const reveal = $('#mhReveal');
    if (!root || !measure || !media) return;

    const FILL_SCALE = 1.28;
    const PARALLAX = 28;
    const DRIFT = 16;
    const TEXT_SCALE = 0.115; // font-size = container-width * TEXT_SCALE

    const words = ['Built', 'for', 'the', 'Future'];
    const glyphEls = words.map((_, i) => $(`#mhG${i}`));
    const wordEls = words.map((_, i) => $(`#mhWord${i}`));
    const baseEls = words.map((_, i) => $(`#mhBase${i}`));

    const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

    // Current and target offset for smooth lerp
    let ox = 0, oy = 0, tx = 0, ty = 0;
    let clock = 0, last = performance.now();
    let rafId = 0;

    /* Sync: measure DOM → SVG text position & font */
    function sync() {
      const W = root.clientWidth;
      const fs = clamp(W * TEXT_SCALE, 28, 220);
      root.style.fontSize = `${fs.toFixed(1)}px`;

      const cs = window.getComputedStyle(measure);

      for (let i = 0; i < words.length; i++) {
        const g = glyphEls[i];
        const w = wordEls[i];
        const b = baseEls[i];
        if (!g || !w || !b) continue;

        // x = word's left offset inside measure container
        // y = baseline element's offsetTop (= top of line + line-height)
        g.setAttribute('x', `${w.offsetLeft}`);
        g.setAttribute('y', `${b.offsetTop}`);
        g.style.fontFamily = cs.fontFamily;
        g.style.fontSize = cs.fontSize;
        g.style.fontWeight = cs.fontWeight;
        g.style.letterSpacing = cs.letterSpacing;
      }
      place();
    }

    /* Place: apply parallax + drift transform to video */
    function place() {
      const W = root.clientWidth;
      const H = root.clientHeight;
      const maxX = Math.max(0, ((FILL_SCALE - 1) / 2) * W);
      const maxY = Math.max(0, ((FILL_SCALE - 1) / 2) * H);
      media.style.transform =
        `translate3d(${clamp(ox, -maxX, maxX).toFixed(2)}px,` +
        `${clamp(oy, -maxY, maxY).toFixed(2)}px, 0)` +
        ` scale(${FILL_SCALE})`;
    }

    /* Animation loop: drift + mousemove lerp */
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;

      const dx = Math.sin(clock * 0.21) * DRIFT;
      const dy = Math.cos(clock * 0.17) * DRIFT * 0.6;

      const ease = 1 - Math.exp(-dt / 0.18);
      ox += (tx + dx - ox) * ease;
      oy += (ty + dy - oy) * ease;

      place();
      rafId = requestAnimationFrame(frame);
    }

    /* Mousemove parallax */
    function onMove(e) {
      const r = root.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / (r.width || 1)) * 2 - 1;
      const ny = ((e.clientY - r.top) / (r.height || 1)) * 2 - 1;
      tx = clamp(nx, -1, 1) * -PARALLAX;
      ty = clamp(ny, -1, 1) * -PARALLAX;
    }
    function onLeave() { tx = 0; ty = 0; }

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);

    /* ResizeObserver keeps SVG text positions accurate */
    const ro = new ResizeObserver(sync);
    ro.observe(root);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(sync).catch(() => { });
    }
    sync();

    /* Start the RAF drift loop */
    rafId = requestAnimationFrame(frame);

    /* GSAP rise-reveal on scroll-into-view */
    if (typeof gsap !== 'undefined' && !prefersReducedMotion()) {
      const riseDistance = () => (parseFloat(window.getComputedStyle(root).fontSize) || 60) * 1.15;

      // Set initial state: glyphs hidden below via GSAP
      const validGlyphs = glyphEls.filter(Boolean);
      gsap.set(validGlyphs, { y: () => riseDistance() });
      if (reveal) reveal.style.opacity = '1';

      const io = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) {
          gsap.to(validGlyphs, {
            y: 0,
            duration: 1.1,
            stagger: 0.09,
            ease: 'power4.out',
            overwrite: 'auto'
          });
          io.disconnect();
        }
      }, { threshold: 0.25 });
      io.observe(root);
    }
  })();

  /* ── Init complete ───────────────────────────────────────── */
  console.log('%c🐜 AntBox loaded', 'color:#7c3aed;font-weight:bold;font-size:14px;');

})();


/* ============================================================
   WHY ANTBOX — Scroll-Driven Canvas + Text Overlay
   Targets the #why section which now acts as the scroll spacer.
   ============================================================ */
(function initBoxAnimation() {
  'use strict';

  /* ── Constants ───────────────────────────────────────────── */
  var TOTAL_FRAMES = 100;
  var FRAME_DIR = 'frames/';

  /* ── DOM refs ────────────────────────────────────────────── */
  var section = document.getElementById('why');
  var canvas = document.getElementById('boxCanvas');
  var loader = document.getElementById('box-anim-loader');
  var loaderBar = document.getElementById('boxLoaderBar');
  var hint = document.getElementById('box-scroll-hint');

  /* Text overlay elements */
  var headEl = document.getElementById('whyOverlayHead');
  var card1 = document.getElementById('whyCard1');
  var card2 = document.getElementById('whyCard2');
  var card3 = document.getElementById('whyCard3');

  if (!section || !canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  /* ── Frame cache ─────────────────────────────────────────── */
  var frames = new Array(TOTAL_FRAMES).fill(null);
  var loadedCount = 0;
  var frameWidth = 0;
  var frameHeight = 0;
  var currentFrameIndex = 0;

  function pad3(n) { return String(n).padStart(3, '0'); }

  /* ── Canvas sizing ───────────────────────────────────────── */
  function resizeCanvas() {
    if (!frameWidth || !frameHeight) return;
    var aspect = frameWidth / frameHeight;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var w, h;
    if (vw / vh > aspect) { h = vh; w = h * aspect; }
    else { w = vw; h = w / aspect; }
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFrame(currentFrameIndex);
  }

  /* ── Frame rendering ─────────────────────────────────────── */
  function drawFrame(index) {
    var img = frames[index];
    if (!img || !img.complete || !img.naturalWidth) return;
    var w = canvas.width / dpr;
    var h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
  }

  function getFrameIndex(progress) {
    var raw = Math.round(progress * (TOTAL_FRAMES - 1));
    return raw < 0 ? 0 : raw > TOTAL_FRAMES - 1 ? TOTAL_FRAMES - 1 : raw;
  }

  /* ── Easing helpers ──────────────────────────────────────── */
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function fadeIn(p, s, e) { return clamp01((p - s) / Math.max(e - s, 0.001)); }
  function fadeOut(p, s, e) { return 1 - clamp01((p - s) / Math.max(e - s, 0.001)); }

  /* ── Text overlay sync ───────────────────────────────────── */
  function updateOverlay(p) {
    /* Heading: full until 0.18, fades out 0.18 → 0.36 */
    if (headEl) {
      var ho = p < 0.18 ? 1 : fadeOut(p, 0.18, 0.36);
      var hty = (1 - ho) * -16;
      headEl.style.opacity = ho;
      headEl.style.transform = 'translateX(-50%) translateY(' + hty + 'px)';
    }

    /* Card helper — uses data-slide ("-1" = from above, "1" = from below) */
    function applyCard(el) {
      if (!el) return;
      var dataIn = parseFloat(el.getAttribute('data-in') || '0.2');
      var dataOut = parseFloat(el.getAttribute('data-out') || '0.9');
      var slideDir = parseFloat(el.getAttribute('data-slide') || '1'); /* -1 top, +1 bottom */
      var oi = fadeIn(p, dataIn, dataIn + 0.12);
      var oo = dataOut > 1 ? 1 : fadeOut(p, dataOut - 0.10, dataOut);
      var op = oi * oo;
      /* Slide from 20px in the card's natural entry direction to 0 */
      var ty = (1 - oi) * 20 * slideDir;
      el.style.opacity = op;
      el.style.transform = 'translateY(' + ty + 'px)';
    }

    applyCard(card1);
    applyCard(card2);
    applyCard(card3);
  }

  /* ── Interpolated render loop ────────────────────────────── */
  var targetProgress = 0;
  var currentProgress = 0;
  var rafPending = false;
  var hintHidden = false;

  function scheduleRender() {
    if (!rafPending) { rafPending = true; requestAnimationFrame(renderLoop); }
  }

  function renderLoop() {
    rafPending = false;
    currentProgress += (targetProgress - currentProgress) * 0.18;

    var idx = getFrameIndex(currentProgress);
    if (idx !== currentFrameIndex) {
      currentFrameIndex = idx;
      drawFrame(idx);
    }

    updateOverlay(currentProgress);

    if (Math.abs(targetProgress - currentProgress) > 0.0003) {
      rafPending = true;
      requestAnimationFrame(renderLoop);
    }
  }

  function onProgress(p) {
    targetProgress = p;
    if (p > 0.02 && !hintHidden && hint) {
      hint.classList.add('hidden');
      hintHidden = true;
    }
    /* Notify particle-text module */
    if (typeof window._ptUpdate === 'function') window._ptUpdate(p);
    scheduleRender();
  }

  /* ── Native scroll fallback ──────────────────────────────── */
  function initNativeScroll() {
    function handleScroll() {
      var rect = section.getBoundingClientRect();
      var total = section.offsetHeight - window.innerHeight;
      var scrolled = -rect.top;
      onProgress(Math.max(0, Math.min(1, scrolled / total)));
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── GSAP ScrollTrigger ──────────────────────────────────── */
  function initGSAPScroll() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: function (self) { onProgress(self.progress); }
      });
      if (window.lenis) {
        window.lenis.on('scroll', ScrollTrigger.update);
      }
    } else {
      initNativeScroll();
    }
  }

  /* ── Preload all frames ──────────────────────────────────── */
  function preloadFrames() {
    for (var i = 0; i < TOTAL_FRAMES; i++) {
      (function (index) {
        var img = new Image();
        img.onload = function () {
          frames[index] = img;
          if (!frameWidth && img.naturalWidth) {
            frameWidth = img.naturalWidth;
            frameHeight = img.naturalHeight;
            resizeCanvas();
            drawFrame(0);
            updateOverlay(0);
          }
          loadedCount++;
          if (loaderBar) {
            loaderBar.style.width = ((loadedCount / TOTAL_FRAMES) * 100) + '%';
          }
          if (loadedCount >= TOTAL_FRAMES) {
            if (loader) setTimeout(function () { loader.classList.add('hidden'); }, 400);
            drawFrame(currentFrameIndex);
          }
        };
        img.onerror = function () {
          loadedCount++;
          if (loadedCount >= TOTAL_FRAMES && loader) {
            setTimeout(function () { loader.classList.add('hidden'); }, 400);
          }
        };
        img.src = FRAME_DIR + pad3(index + 1) + '.png';
        frames[index] = img;
      }(i));
    }
  }

  /* ── Window resize ───────────────────────────────────────── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 120);
  }, { passive: true });

  /* ── Boot ────────────────────────────────────────────────── */
  preloadFrames();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(initGSAPScroll, 0); });
  } else {
    setTimeout(initGSAPScroll, 0);
  }

}());


/* ============================================================
   PARTICLE TEXT — "Thinking Inside the Box"
   Vanilla Canvas implementation. Appears when the #why scroll
   animation reaches ~85% progress, disappears on scroll away.
   ============================================================ */
(function initParticleText() {
  'use strict';

  var pCanvas = document.getElementById('particleCanvas');
  if (!pCanvas) return;

  var pCtx = pCanvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  /* ── Config ──────────────────────────────────────────────── */
  var LINE1 = 'Thinking Inside';
  var LINE2 = 'the Box';
  var PARTICLE_SIZE = 2.0;
  var DENSITY = 4;        /* sample every N logical pixels */
  var COLOR_BASE = '#0d0d14';
  var COLOR_HIGHLIGHT = '#7c3aed';
  var HIGHLIGHT_RATIO = 0.22;
  var SHOW_START = 0.80;     /* progress when canvas fades in */
  var GATHER_START = 0.83;     /* particles start gathering */
  var GATHER_FULL = 0.96;     /* fully gathered */
  var SPRING = 0.10;
  var FRICTION = 0.80;
  var DRIFT = 0.55;
  var REPEL_R = 110;
  var REPEL_F = 7;

  /* ── State ───────────────────────────────────────────────── */
  var particles = [];
  var gathered = 0;    /* 0=scattered, 1=gathered (lerped) */
  var isVisible = false;
  var animId = null;
  var vw = 0, vh = 0;
  var mouseX = -9999, mouseY = -9999;

  /* ── Canvas resize ───────────────────────────────────────── */
  function resize() {
    vw = pCanvas.parentElement ? pCanvas.parentElement.offsetWidth : window.innerWidth;
    vh = pCanvas.parentElement ? pCanvas.parentElement.offsetHeight : window.innerHeight;
    pCanvas.style.width = vw + 'px';
    pCanvas.style.height = vh + 'px';
    pCanvas.width = Math.round(vw * dpr);
    pCanvas.height = Math.round(vh * dpr);
    pCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (particles.length) buildParticles(); /* recompute home positions */
  }

  /* ── Sample text into particle home positions ────────────── */
  function buildParticles() {
    /* Compute font size responsively */
    var fs = Math.round(Math.min(vw * 0.082, 88));
    if (vw < 600) fs = Math.round(Math.min(vw * 0.10, 52));

    var font = '800 ' + fs + 'px Century Gothic, CenturyGothic, AppleGothic, Trebuchet MS, sans-serif';
    var lineH = fs * 1.25;
    var cy = vh / 2;
    var cx = vw / 2;

    /* Render text to a temporary offscreen canvas */
    var ofc = document.createElement('canvas');
    ofc.width = Math.round(vw * dpr);
    ofc.height = Math.round(vh * dpr);
    var oc = ofc.getContext('2d');
    oc.scale(dpr, dpr);
    oc.fillStyle = '#ffffff';
    oc.font = font;
    oc.textAlign = 'center';
    oc.textBaseline = 'middle';
    oc.fillText(LINE1, cx, cy - lineH / 2);
    oc.fillText(LINE2, cx, cy + lineH / 2);

    var imgData = oc.getImageData(0, 0, ofc.width, ofc.height);
    var data = imgData.data;
    var step = DENSITY * dpr;

    var homes = [];
    for (var py = 0; py < ofc.height; py += step) {
      for (var px = 0; px < ofc.width; px += step) {
        var idx = (Math.floor(py) * ofc.width + Math.floor(px)) * 4;
        if (data[idx + 3] > 140) {
          homes.push({ x: px / dpr, y: py / dpr });
        }
      }
    }

    /* Thin to max 4000 particles for performance */
    if (homes.length > 4000) {
      var step2 = Math.ceil(homes.length / 4000);
      homes = homes.filter(function (_, i) { return i % step2 === 0; });
    }

    /* Preserve velocities when rebuilding (e.g. on resize) */
    var oldLen = particles.length;
    particles = homes.map(function (h, i) {
      var old = particles[i];
      return {
        homeX: h.x,
        homeY: h.y,
        x: old ? old.x : vw * Math.random(),
        y: old ? old.y : vh * Math.random(),
        vx: old ? old.vx * 0.5 : (Math.random() - 0.5) * 3,
        vy: old ? old.vy * 0.5 : (Math.random() - 0.5) * 3,
        size: PARTICLE_SIZE * (0.7 + Math.random() * 0.6),
        hl: Math.random() < HIGHLIGHT_RATIO
      };
    });
  }

  /* ── Draw one frame ──────────────────────────────────────── */
  function drawFrame() {
    pCtx.clearRect(0, 0, vw, vh);

    var gp = gathered;   /* 0-1 */
    var len = particles.length;

    for (var i = 0; i < len; i++) {
      var p = particles[i];

      /* Spring toward home (strength scales with gather progress) */
      var fx = (p.homeX - p.x) * SPRING * gp;
      var fy = (p.homeY - p.y) * SPRING * gp;

      /* Random drift when not yet gathered */
      if (gp < 0.98) {
        fx += (Math.random() - 0.5) * DRIFT * (1 - gp);
        fy += (Math.random() - 0.5) * DRIFT * (1 - gp);
      }

      /* Pointer repel */
      var mdx = p.x - mouseX;
      var mdy = p.y - mouseY;
      var md2 = mdx * mdx + mdy * mdy;
      if (md2 < REPEL_R * REPEL_R && md2 > 0.01) {
        var md = Math.sqrt(md2);
        var frc = (REPEL_R - md) / REPEL_R * REPEL_F;
        fx += (mdx / md) * frc;
        fy += (mdy / md) * frc;
      }

      p.vx = (p.vx + fx) * FRICTION;
      p.vy = (p.vy + fy) * FRICTION;
      p.x += p.vx;
      p.y += p.vy;

      /* Draw */
      var alpha = Math.min(1, gp * 1.5);
      if (alpha < 0.01) continue;

      pCtx.globalAlpha = alpha;

      if (p.hl) {
        /* Purple highlight with glow */
        pCtx.shadowBlur = 7;
        pCtx.shadowColor = COLOR_HIGHLIGHT;
        pCtx.fillStyle = COLOR_HIGHLIGHT;
      } else {
        pCtx.shadowBlur = 0;
        pCtx.fillStyle = COLOR_BASE;
      }

      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.size, 0, 6.2832);
      pCtx.fill();
    }

    pCtx.globalAlpha = 1;
    pCtx.shadowBlur = 0;
  }

  /* ── RAF loop ────────────────────────────────────────────── */
  function loop() {
    drawFrame();
    animId = requestAnimationFrame(loop);
  }

  /* ── Show / hide ─────────────────────────────────────────── */
  function show() {
    if (isVisible) return;
    isVisible = true;
    pCanvas.classList.add('pt-active');
    if (!animId) animId = requestAnimationFrame(loop);
  }

  function hide() {
    if (!isVisible) return;
    isVisible = false;
    gathered = 0;
    pCanvas.classList.remove('pt-active');
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    pCtx.clearRect(0, 0, vw, vh);
  }

  /* ── Public update hook — called by onProgress ───────────── */
  window._ptUpdate = function (p) {
    if (p >= SHOW_START) {
      show();
      /* Lerp gathered value toward target */
      var target = 0;
      if (p >= GATHER_FULL) target = 1;
      else if (p >= GATHER_START) target = (p - GATHER_START) / (GATHER_FULL - GATHER_START);
      gathered += (target - gathered) * 0.12;
    } else {
      hide();
    }
  };

  /* ── Pointer tracking ────────────────────────────────────── */
  pCanvas.addEventListener('mousemove', function (e) {
    var r = pCanvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  }, { passive: true });

  pCanvas.addEventListener('mouseleave', function () {
    mouseX = -9999; mouseY = -9999;
  });

  /* ── Resize ──────────────────────────────────────────────── */
  var rTimer;
  window.addEventListener('resize', function () {
    clearTimeout(rTimer);
    rTimer = setTimeout(resize, 140);
  }, { passive: true });

  /* ── Boot ────────────────────────────────────────────────── */
  function boot() {
    resize();
    buildParticles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

}());


/* ============================================================
   BALLPIT PHYSICS SIMULATION
   Vanilla Canvas 2D simulation overlay for the Hero section.
   Includes gravity, friction, wall bouncing, and ball-to-ball
   elastic collisions. Mouse repulsion adds cursor interactivity.
   ============================================================ */
(function initBallpit() {
  'use strict';

  var canvas = document.getElementById('ballpitCanvas');
  var hero = document.getElementById('hero');
  if (!canvas || !hero) return;

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  /* ── Configuration ───────────────────────────────────────── */
  var COUNT = 100;
  var GRAVITY = 0.01;   /* Acceleration downward */
  var FRICTION = 0.9975;  /* Decay factor */
  var WALL_BOUNCE = 0.95;   /* Energy retention on walls */
  var BALL_BOUNCE = 0.85;   /* Coefficient of restitution between balls */
  var REPEL_R = 160;    /* Mouse repel radius */
  var REPEL_F = 0.95;   /* Mouse repel force */

  /* ── State ───────────────────────────────────────────────── */
  var balls = [];
  var width = 0;
  var height = 0;
  var mouseX = -9999;
  var mouseY = -9999;

  /* Color themes (radial gradients for 3D sphere look) */
  var ballThemes = [
    { start: '#c084fc', end: '#7c3aed', shadow: '#5b21b6' }, /* Purple Theme */
    { start: '#f472b6', end: '#db2777', shadow: '#9d174d' }, /* Pink/Accent Theme */
    { start: '#a78bfa', end: '#8b5cf6', shadow: '#6d28d9' }, /* Violet Theme */
    { start: '#ffffff', end: '#d4d4d8', shadow: '#a1a1aa' }, /* Neutral White */
    { start: '#e4e4e7', end: '#a1a1aa', shadow: '#71717a' }  /* Neutral Gray */
  ];

  /* ── Resize canvas to match hero ─────────────────────────── */
  function resize() {
    width = hero.offsetWidth;
    height = hero.offsetHeight;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* Keep balls inside the resized boundary */
    for (var i = 0; i < balls.length; i++) {
      var b = balls[i];
      b.x = Math.max(b.r, Math.min(width - b.r, b.x));
      b.y = Math.max(b.r, Math.min(height - b.r, b.y));
    }
  }

  /* ── Create initial ball array ───────────────────────────── */
  function createBalls() {
    var minR = width < 600 ? 8 : 12;
    var maxR = width < 600 ? 16 : 24;

    balls = [];
    for (var i = 0; i < COUNT; i++) {
      var r = minR + Math.random() * (maxR - minR);
      var theme = ballThemes[Math.floor(Math.random() * ballThemes.length)];

      balls.push({
        x: r + Math.random() * (width - r * 2),
        y: r + Math.random() * (height - r * 5), /* spawn in upper half */
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 2,
        r: r,
        mass: r * r, /* Mass proportional to circle area */
        theme: theme
      });
    }
  }

  /* ── Physics Update ──────────────────────────────────────── */
  function updatePhysics() {
    var i, j, b;

    /* 1. Apply gravity, friction, drag, and move */
    for (i = 0; i < COUNT; i++) {
      b = balls[i];
      b.vy += GRAVITY;
      b.vx *= FRICTION;
      b.vy *= FRICTION;
      b.x += b.vx;
      b.y += b.vy;

      /* Boundary check & bounce */
      if (b.x - b.r < 0) {
        b.x = b.r;
        b.vx = -b.vx * WALL_BOUNCE;
      } else if (b.x + b.r > width) {
        b.x = width - b.r;
        b.vx = -b.vx * WALL_BOUNCE;
      }

      if (b.y - b.r < 0) {
        b.y = b.r;
        b.vy = -b.vy * WALL_BOUNCE;
      } else if (b.y + b.r > height) {
        b.y = height - b.r;
        b.vy = -b.vy * WALL_BOUNCE;
        /* Extra friction when sliding on the floor */
        b.vx *= 0.98;
      }

      /* Mouse Repulsion */
      var dx = b.x - mouseX;
      var dy = b.y - mouseY;
      var distSq = dx * dx + dy * dy;
      if (distSq < REPEL_R * REPEL_R && distSq > 0.1) {
        var dist = Math.sqrt(distSq);
        var force = (REPEL_R - dist) / REPEL_R * REPEL_F;
        b.vx += (dx / dist) * force;
        b.vy += (dy / dist) * force;
      }
    }

    /* 2. Resolve Ball-to-Ball Collisions */
    for (i = 0; i < COUNT; i++) {
      var a = balls[i];
      for (j = i + 1; j < COUNT; j++) {
        var b2 = balls[j];
        var cdx = b2.x - a.x;
        var cdy = b2.y - a.y;
        var cDistSq = cdx * cdx + cdy * cdy;
        var minDist = a.r + b2.r;

        if (cDistSq < minDist * minDist) {
          var cDist = Math.sqrt(cDistSq);
          if (cDist === 0) continue;

          var overlap = minDist - cDist;
          var nx = cdx / cDist;
          var ny = cdy / cDist;

          /* Positional correction (resolve overlapping) */
          var totalMass = a.mass + b2.mass;
          a.x -= nx * overlap * (b2.mass / totalMass);
          a.y -= ny * overlap * (b2.mass / totalMass);
          b2.x += nx * overlap * (a.mass / totalMass);
          b2.y += ny * overlap * (a.mass / totalMass);

          /* Dynamic momentum resolution (impulse model) */
          var rvx = a.vx - b2.vx;
          var rvy = a.vy - b2.vy;
          var velAlongNormal = rvx * nx + rvy * ny;

          if (velAlongNormal > 0) { /* Moving toward each other */
            var impulse = (1 + BALL_BOUNCE) * velAlongNormal / (1 / a.mass + 1 / b2.mass);
            a.vx -= (impulse / a.mass) * nx;
            a.vy -= (impulse / a.mass) * ny;
            b2.vx += (impulse / b2.mass) * nx;
            b2.vy += (impulse / b2.mass) * ny;
          }
        }
      }
    }
  }

  /* ── Render frame ────────────────────────────────────────── */
  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < COUNT; i++) {
      var b = balls[i];

      /* Radial gradient for 3D sphere highlight */
      var grad = ctx.createRadialGradient(
        b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.05,
        b.x, b.y, b.r
      );
      grad.addColorStop(0, b.theme.start);
      grad.addColorStop(0.7, b.theme.end);
      grad.addColorStop(1, b.theme.shadow);

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  /* ── Render Loop ─────────────────────────────────────────── */
  function loop() {
    updatePhysics();
    draw();
    requestAnimationFrame(loop);
  }

  /* ── Mouse events on hero container ──────────────────────── */
  hero.addEventListener('mousemove', function (e) {
    var rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }, { passive: true });

  hero.addEventListener('mouseleave', function () {
    mouseX = -9999;
    mouseY = -9999;
  });

  /* Touch support for mobile */
  hero.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      var rect = hero.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
    }
  }, { passive: true });

  hero.addEventListener('touchend', function () {
    mouseX = -9999;
    mouseY = -9999;
  });

  /* ── Window resize ───────────────────────────────────────── */
  var rTimer;
  window.addEventListener('resize', function () {
    clearTimeout(rTimer);
    rTimer = setTimeout(function () {
      resize();
    }, 150);
  }, { passive: true });

  /* ── Initialize ──────────────────────────────────────────── */
  resize();
  createBalls();
  requestAnimationFrame(loop);

}());


/* ============================================================
   BOUNCE CARDS ANIMATION (INTERACTIVE GALLERY)
   Vanilla JS implementation using GSAP. Pins the section vertically
   and translates the gallery row horizontally as the user scrolls
   down, before moving to the next section.
   ============================================================ */
(function initBounceCards() {
  'use strict';

  var container = document.querySelector('.bounceCardsScrollWrap');
  if (!container) return;

  var cards = container.querySelectorAll('.card');

  /* Alternating tilt angles for the cards */
  var rotations = [-4, 3, -2, 4, -3, 2, -4, 3, -3, 4, -2, 3];

  /* ── GSAP entrance with ScrollTrigger ─────────────────────── */
  function startEntrance() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    /* 1. Staggered Entrance Animation */
    gsap.timeline({
      scrollTrigger: {
        trigger: '#bounce-cards-section',
        start: 'top 85%', /* Trigger stagger entrance before pinning */
        once: true
      }
    })
      .fromTo(cards,
        {
          scale: 0.1,
          rotation: 0,
          y: 80,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotation: function (i) { return rotations[i] || 0; },
          duration: 1.2,
          delay: 0.1,
          stagger: 0.15,
          ease: 'elastic.out(1, 0.6)'
        }
      );

    /* 2. Horizontal Scroll Pinning */
    gsap.to(container, {
      x: function () {
        return -(container.scrollWidth - window.innerWidth);
      },
      ease: 'none',
      scrollTrigger: {
        trigger: '#bounce-cards-section',
        pin: true,
        scrub: 0.8,
        start: 'top top',
        end: function () {
          return '+=' + (container.scrollWidth - window.innerWidth);
        },
        invalidateOnRefresh: true
      }
    });

    /* 3. Hover interactions (enableHover) ───────────────────── */
    cards.forEach(function (card, idx) {
      var initialRot = rotations[idx] || 0;

      card.addEventListener('mouseenter', function () {
        gsap.to(card, {
          scale: 1.08,
          rotation: 0, /* Straighten on hover */
          y: -25,      /* Float up slightly */
          zIndex: 10,
          duration: 0.35,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', function () {
        gsap.to(card, {
          scale: 1,
          rotation: initialRot,
          y: 0,
          zIndex: 1,
          duration: 0.35,
          ease: 'power2.out'
        });
      });
    });
  }

  /* ── Boot ────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEntrance);
  } else {
    startEntrance();
  }

}());
