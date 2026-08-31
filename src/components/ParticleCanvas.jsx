import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const pCanvas = canvasRef.current;
    if (!pCanvas) return;

    const pCtx = pCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    /* ── Config ──────────────────────────────────────────────── */
    const LINE1 = 'Thinking Inside';
    const LINE2 = 'the Box';
    const PARTICLE_SIZE = 2.0;
    const DENSITY = 4;        /* sample every N logical pixels */
    const COLOR_BASE = '#0d0d14';
    const COLOR_HIGHLIGHT = '#7c3aed';
    const HIGHLIGHT_RATIO = 0.22;
    const SHOW_START = 0.80;     /* progress when canvas fades in */
    const GATHER_START = 0.83;     /* particles start gathering */
    const GATHER_FULL = 0.96;     /* fully gathered */
    const SPRING = 0.10;
    const FRICTION = 0.80;
    const DRIFT = 0.55;
    const REPEL_R = 110;
    const REPEL_F = 7;

    /* ── State ───────────────────────────────────────────────── */
    let particles = [];
    let gathered = 0;    /* 0=scattered, 1=gathered (lerped) */
    let isVisible = false;
    let animId = null;
    let vw = 0, vh = 0;
    let mouseX = -9999, mouseY = -9999;

    function resize() {
      const parent = pCanvas.parentElement;
      vw = parent ? parent.offsetWidth : window.innerWidth;
      vh = parent ? parent.offsetHeight : window.innerHeight;
      pCanvas.style.width = vw + 'px';
      pCanvas.style.height = vh + 'px';
      pCanvas.width = Math.round(vw * dpr);
      pCanvas.height = Math.round(vh * dpr);
      pCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length) buildParticles();
    }

    function buildParticles() {
      let fs = Math.round(Math.min(vw * 0.082, 88));
      if (vw < 600) fs = Math.round(Math.min(vw * 0.10, 52));

      const font = '800 ' + fs + 'px Century Gothic, CenturyGothic, AppleGothic, Trebuchet MS, sans-serif';
      const lineH = fs * 1.25;
      const cy = vh / 2;
      const cx = vw / 2;

      const ofc = document.createElement('canvas');
      ofc.width = Math.round(vw * dpr);
      ofc.height = Math.round(vh * dpr);
      const oc = ofc.getContext('2d');
      oc.scale(dpr, dpr);
      oc.fillStyle = '#ffffff';
      oc.font = font;
      oc.textAlign = 'center';
      oc.textBaseline = 'middle';
      oc.fillText(LINE1, cx, cy - lineH / 2);
      oc.fillText(LINE2, cx, cy + lineH / 2);

      const imgData = oc.getImageData(0, 0, ofc.width, ofc.height);
      const data = imgData.data;
      const step = DENSITY * dpr;

      let homes = [];
      for (let py = 0; py < ofc.height; py += step) {
        for (let px = 0; px < ofc.width; px += step) {
          const idx = (Math.floor(py) * ofc.width + Math.floor(px)) * 4;
          if (data[idx + 3] > 140) {
            homes.push({ x: px / dpr, y: py / dpr });
          }
        }
      }

      if (homes.length > 4000) {
        const step2 = Math.ceil(homes.length / 4000);
        homes = homes.filter((_, i) => i % step2 === 0);
      }

      particles = homes.map((h, i) => {
        const old = particles[i];
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

    function drawFrame() {
      pCtx.clearRect(0, 0, vw, vh);

      const gp = gathered;
      const len = particles.length;

      for (let i = 0; i < len; i++) {
        const p = particles[i];

        let fx = (p.homeX - p.x) * SPRING * gp;
        let fy = (p.homeY - p.y) * SPRING * gp;

        if (gp < 0.98) {
          fx += (Math.random() - 0.5) * DRIFT * (1 - gp);
          fy += (Math.random() - 0.5) * DRIFT * (1 - gp);
        }

        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < REPEL_R * REPEL_R && md2 > 0.01) {
          const md = Math.sqrt(md2);
          const frc = (REPEL_R - md) / REPEL_R * REPEL_F;
          fx += (mdx / md) * frc;
          fy += (mdy / md) * frc;
        }

        p.vx = (p.vx + fx) * FRICTION;
        p.vy = (p.vy + fy) * FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        const alpha = Math.min(1, gp * 1.5);
        if (alpha < 0.01) continue;

        pCtx.globalAlpha = alpha;

        if (p.hl) {
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

    let isSectionIntersecting = false;

    function loop() {
      drawFrame();
      animId = requestAnimationFrame(loop);
    }

    function show() {
      if (isVisible) return;
      isVisible = true;
      pCanvas.classList.add('pt-active');
      if (isSectionIntersecting && !animId) animId = requestAnimationFrame(loop);
    }

    function hide() {
      if (!isVisible) return;
      isVisible = false;
      gathered = 0;
      pCanvas.classList.remove('pt-active');
      if (animId) { cancelAnimationFrame(animId); animId = null; }
      pCtx.clearRect(0, 0, vw, vh);
    }

    window._ptUpdate = (p) => {
      if (p >= SHOW_START) {
        show();
        let target = 0;
        if (p >= GATHER_FULL) target = 1;
        else if (p >= GATHER_START) target = (p - GATHER_START) / (GATHER_FULL - GATHER_START);
        gathered += (target - gathered) * 0.12;
      } else {
        hide();
      }
    };

    function handleMouseMove(e) {
      const r = pCanvas.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    }

    function handleMouseLeave() {
      mouseX = -9999;
      mouseY = -9999;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      isSectionIntersecting = entry.isIntersecting;
      if (isSectionIntersecting) {
        if (isVisible && !animId) {
          animId = requestAnimationFrame(loop);
        }
      } else {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }
    }, { threshold: 0.05 });

    observer.observe(pCanvas);

    pCanvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    pCanvas.addEventListener('mouseleave', handleMouseLeave);

    let rTimer;
    const handleResize = () => {
      clearTimeout(rTimer);
      rTimer = setTimeout(resize, 140);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Initial boot
    resize();
    buildParticles();

    return () => {
      observer.disconnect();
      window._ptUpdate = null;
      window.removeEventListener('resize', handleResize);
      pCanvas.removeEventListener('mousemove', handleMouseMove);
      pCanvas.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(rTimer);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} id="particleCanvas" aria-hidden="true"></canvas>
  );
}
