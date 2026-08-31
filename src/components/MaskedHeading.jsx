import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function MaskedHeading() {
  const containerRef = useRef(null);
  const rootRef = useRef(null);
  const measureRef = useRef(null);
  const mediaRef = useRef(null);
  const revealRef = useRef(null);

  useGSAP(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    const media = mediaRef.current;
    const reveal = revealRef.current;
    if (!root || !measure || !media || !reveal) return;

    const FILL_SCALE = 1.28;
    const PARALLAX = 28;
    const DRIFT = 16;
    const TEXT_SCALE = 0.115; // font-size = container-width * TEXT_SCALE

    const words = ['Built', 'for', 'the', 'Future'];
    const glyphEls = words.map((_, i) => root.querySelector(`#mhG${i}`));
    const wordEls = words.map((_, i) => root.querySelector(`#mhWord${i}`));
    const baseEls = words.map((_, i) => root.querySelector(`#mhBase${i}`));

    const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

    // Current and target offset for smooth lerp
    let ox = 0, oy = 0, tx = 0, ty = 0;
    let clock = 0, last = performance.now();
    let rafId = 0;

    /* Sync: measure DOM -> SVG text position & font */
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

    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave);

    /* ResizeObserver keeps SVG text positions accurate */
    const ro = new ResizeObserver(sync);
    ro.observe(root);

    let fontPromiseActive = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (fontPromiseActive) sync();
      }).catch(() => { });
    }
    sync();

    /* Start the RAF drift loop */
    rafId = requestAnimationFrame(frame);

    /* GSAP rise-reveal on scroll-into-view */
    const prefersReducedMotion = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let entranceObserver;
    if (!prefersReducedMotion()) {
      const riseDistance = () => (parseFloat(window.getComputedStyle(root).fontSize) || 60) * 1.15;

      // Set initial state: glyphs hidden below via GSAP
      const validGlyphs = glyphEls.filter(Boolean);
      gsap.set(validGlyphs, { y: () => riseDistance() });
      reveal.style.opacity = '1';

      entranceObserver = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) {
          gsap.to(validGlyphs, {
            y: 0,
            duration: 1.1,
            stagger: 0.09,
            ease: 'power4.out',
            overwrite: 'auto'
          });
          entranceObserver.disconnect();
        }
      }, { threshold: 0.25 });
      entranceObserver.observe(root);
    }

    return () => {
      fontPromiseActive = false;
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      ro.disconnect();
      cancelAnimationFrame(rafId);
      if (entranceObserver) entranceObserver.disconnect();
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="masked-heading-section" aria-hidden="true">
      <h2 ref={rootRef} id="maskedHeading" className="masked-heading"
        style={{ textAlign: 'center', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.06 }}>
        
        {/* Invisible measure layer for layout */}
        <span ref={measureRef} className="masked-heading__measure" id="mhMeasure">
          <span className="masked-heading__word" id="mhWord0">Built<i className="masked-heading__baseline"
              id="mhBase0"></i></span>
          <span className="masked-heading__word" id="mhWord1">for<i className="masked-heading__baseline" id="mhBase1"></i></span>
          <span className="masked-heading__word" id="mhWord2">the<i className="masked-heading__baseline" id="mhBase2"></i></span>
          <span className="masked-heading__word" id="mhWord3">Future<i className="masked-heading__baseline"
              id="mhBase3"></i></span>
        </span>

        {/* SVG clip path definition */}
        <svg className="masked-heading__defs" aria-hidden="true" focusable="false">
          <defs>
            <clipPath id="mhClip" clipPathUnits="userSpaceOnUse">
              <text id="mhG0">Built</text>
              <text id="mhG1">for</text>
              <text id="mhG2">the</text>
              <text id="mhG3">Future</text>
            </clipPath>
          </defs>
        </svg>

        {/* Reveal layer: video clipped through text */}
        <span ref={revealRef} className="masked-heading__reveal" id="mhReveal">
          <span className="masked-heading__clip" style={{ clipPath: 'url(#mhClip)' }}>
            <span ref={mediaRef} className="masked-heading__media" id="mhMedia">
              <video className="masked-heading__source"
                src="https://ik.imagekit.io/tm5te9cjl/ff/Aerial%20view%20of%20sand%20beach.%20Top%20view%20sea%20waves.%20Drone%20footage%20-%20Nature%20video,%20HD%20-%204K%20(720p,%20h264).mp4?updatedAt=1788042662542"
                autoPlay muted loop playsInline></video>
            </span>
          </span>
        </span>
      </h2>
    </section>
  );
}
