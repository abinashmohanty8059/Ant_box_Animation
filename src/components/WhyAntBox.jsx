import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ParticleCanvas from './ParticleCanvas';

gsap.registerPlugin(ScrollTrigger);

export default function WhyAntBox() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const loaderRef = useRef(null);
  const loaderBarRef = useRef(null);
  const hintRef = useRef(null);
  const headElRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  const framesRef = useRef(new Array(100).fill(null));
  const frameWidthRef = useRef(0);
  const frameHeightRef = useRef(0);
  const currentFrameIndexRef = useRef(0);
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const rafPendingRef = useRef(false);
  const hintHiddenRef = useRef(false);
  const isPreloadingRef = useRef(false);

  useGSAP(() => {
    const section = containerRef.current;
    const canvas = canvasRef.current;
    const loader = loaderRef.current;
    const loaderBar = loaderBarRef.current;
    const hint = hintRef.current;
    const headEl = headElRef.current;
    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;

    if (!section || !canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const TOTAL_FRAMES = 100;
    const FRAME_DIR = '/frames/';

    function pad3(n) { return String(n).padStart(3, '0'); }

    function resizeCanvas() {
      if (!frameWidthRef.current || !frameHeightRef.current) return;
      const aspect = frameWidthRef.current / frameHeightRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let w, h;
      if (vw / vh > aspect) {
        h = vh;
        w = h * aspect;
      } else {
        w = vw;
        h = w / aspect;
      }
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(currentFrameIndexRef.current);
    }

    function drawFrame(index) {
      const img = framesRef.current[index];
      if (!img || !img.complete || !img.naturalWidth) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
    }

    function getFrameIndex(progress) {
      const raw = Math.round(progress * (TOTAL_FRAMES - 1));
      return raw < 0 ? 0 : raw > TOTAL_FRAMES - 1 ? TOTAL_FRAMES - 1 : raw;
    }

    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function fadeIn(p, s, e) { return clamp01((p - s) / Math.max(e - s, 0.001)); }
    function fadeOut(p, s, e) { return 1 - clamp01((p - s) / Math.max(e - s, 0.001)); }

    function updateOverlay(p) {
      /* Heading: full until 0.18, fades out 0.18 -> 0.36 */
      if (headEl) {
        const ho = p < 0.18 ? 1 : fadeOut(p, 0.18, 0.36);
        const hty = (1 - ho) * -16;
        headEl.style.opacity = ho;
        headEl.style.transform = `translateX(-50%) translateY(${hty}px)`;
      }

      /* Card helper - uses data-slide ("-1" = from above, "1" = from below) */
      function applyCard(el) {
        if (!el) return;
        const dataIn = parseFloat(el.getAttribute('data-in') || '0.2');
        const dataOut = parseFloat(el.getAttribute('data-out') || '0.9');
        const slideDir = parseFloat(el.getAttribute('data-slide') || '1');
        const oi = fadeIn(p, dataIn, dataIn + 0.12);
        const oo = dataOut > 1 ? 1 : fadeOut(p, dataOut - 0.10, dataOut);
        const op = oi * oo;
        const ty = (1 - oi) * 20 * slideDir;
        el.style.opacity = op;
        el.style.transform = `translateY(${ty}px)`;
      }

      applyCard(card1);
      applyCard(card2);
      applyCard(card3);
    }

    let rafId;
    function renderLoop() {
      rafPendingRef.current = false;
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.18;

      const idx = getFrameIndex(currentProgressRef.current);
      if (idx !== currentFrameIndexRef.current) {
        currentFrameIndexRef.current = idx;
        drawFrame(idx);
      }

      updateOverlay(currentProgressRef.current);

      if (Math.abs(targetProgressRef.current - currentProgressRef.current) > 0.0003) {
        rafPendingRef.current = true;
        rafId = requestAnimationFrame(renderLoop);
      }
    }

    function scheduleRender() {
      if (!rafPendingRef.current) {
        rafPendingRef.current = true;
        rafId = requestAnimationFrame(renderLoop);
      }
    }

    function onProgress(p) {
      targetProgressRef.current = p;
      if (p > 0.02 && !hintHiddenRef.current && hint) {
        hint.classList.add('hidden');
        hintHiddenRef.current = true;
      }
      if (typeof window._ptUpdate === 'function') window._ptUpdate(p);
      scheduleRender();
    }

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 120);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // GSAP ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        onProgress(self.progress);
      }
    });

    // Preload all frames if not already loaded or currently preloading
    const alreadyLoaded = framesRef.current.length === TOTAL_FRAMES &&
                          framesRef.current.every(img => img && img.complete && img.naturalWidth > 0);

    if (alreadyLoaded) {
      if (loader) loader.classList.add('hidden');
      const img = framesRef.current[0];
      frameWidthRef.current = img.naturalWidth;
      frameHeightRef.current = img.naturalHeight;
      resizeCanvas();
      drawFrame(currentFrameIndexRef.current);
      updateOverlay(0);
    } else if (!isPreloadingRef.current) {
      isPreloadingRef.current = true;
      let loadedCount = 0;
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.onload = () => {
          framesRef.current[i] = img;
          if (!frameWidthRef.current && img.naturalWidth) {
            frameWidthRef.current = img.naturalWidth;
            frameHeightRef.current = img.naturalHeight;
            resizeCanvas();
            drawFrame(0);
            updateOverlay(0);
          }
          loadedCount++;
          if (loaderBar) {
            loaderBar.style.width = ((loadedCount / TOTAL_FRAMES) * 100) + '%';
          }
          if (loadedCount >= TOTAL_FRAMES) {
            isPreloadingRef.current = false;
            if (loader) {
              setTimeout(() => {
                loader.classList.add('hidden');
              }, 400);
            }
            drawFrame(currentFrameIndexRef.current);
          }
        };

        img.onerror = () => {
          loadedCount++;
          if (loadedCount >= TOTAL_FRAMES) {
            isPreloadingRef.current = false;
            if (loader) {
              setTimeout(() => {
                loader.classList.add('hidden');
              }, 400);
            }
          }
        };

        img.src = `${FRAME_DIR}${pad3(i + 1)}.png`;
        framesRef.current[i] = img;
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(rafId);
      trigger.kill();
      // clean img handlers
      framesRef.current.forEach(img => {
        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      });
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="why" aria-labelledby="why-heading">
      <div className="why-anim-sticky">

        {/* Loading overlay */}
        <div ref={loaderRef} id="box-anim-loader" aria-hidden="true">
          <div className="box-loader-bar-wrap">
            <div ref={loaderBarRef} className="box-loader-bar" id="boxLoaderBar"></div>
          </div>
          <p className="box-loader-text">Loading…</p>
        </div>

        {/* Canvas — frames rendered here */}
        <canvas ref={canvasRef} id="boxCanvas" aria-hidden="true"></canvas>

        {/* Text overlay — synced with scroll / frame progress */}
        <div className="why-overlay" aria-label="Why AntBox">

          {/* Phase 0: Heading */}
          <div ref={headElRef} className="why-overlay-head" id="whyOverlayHead">
            <p className="section-eyebrow why-eyebrow">Why AntBox</p>
            <h2 className="section-headline why-headline" id="why-heading">
              Not a job board.<br />Not a course platform.<br />
              <em className="accent-italic">Something new.</em>
            </h2>
          </div>

          {/* Phase 1: Card 1 */}
          <div ref={card1Ref} className="why-overlay-card" id="whyCard1" data-in="0.15" data-out="0.5" data-slide="-1">
            <h3 className="why-title">Ecosystem, Not Silos</h3>
            <p className="why-body">We connect academia, students, and enterprises in a single continuous loop. Learning
              informs building, building informs validation, and validation leads to hiring.</p>
          </div>

          {/* Phase 2: Card 2 */}
          <div ref={card2Ref} className="why-overlay-card" id="whyCard2" data-in="0.40" data-out="0.75" data-slide="1">
            <h3 className="why-title">Proof Over Pedigree</h3>
            <p className="why-body">Our AI readiness engine shifts focus from where you went to school to what you can
              actually do. We measure capability, adaptability, and execution — not institution prestige.</p>
          </div>

          {/* Phase 3: Card 3 */}
          <div ref={card3Ref} className="why-overlay-card" id="whyCard3" data-in="0.65" data-out="1.1" data-slide="1">
            <h3 className="why-title">Action-Oriented</h3>
            <p className="why-body">No passive video watching. AntBox requires active participation through sprints, live
              briefs, and continuous feedback loops that simulate real work environments.</p>
          </div>

          {/* Scroll hint */}
          <div ref={hintRef} id="box-scroll-hint" aria-hidden="true">
            <div className="box-hint-arrow"></div>
            <span className="box-hint-label">Scroll to reveal</span>
          </div>

        </div>

        {/* Particle text canvas — "Thinking Inside the Box" */}
        <ParticleCanvas />

      </div>
    </section>
  );
}
