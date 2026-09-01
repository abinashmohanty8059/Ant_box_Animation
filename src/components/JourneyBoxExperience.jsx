import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ParticleCanvas from './ParticleCanvas';
import { useBoxFrames } from '../hooks/useBoxFrames';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────────
   STAGE DATA (4 Checkpoints - Story Timeline in Left Column)
───────────────────────────────────────────────────────────────────────────── */
const STAGES = [
  {
    num: '01',
    title: 'Train with intent',
    subtitle: 'Learn what the real world demands.',
    desc: 'Structured learning, mentorship, and specialised career tracks help high-potential talent build relevant skills with a clear direction.',
    side: 'left',
    activateAt: 0.12,
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 2L1 9l11 7 9-5.73v5.73h2V9L12 2zm0 11.5L5.26 9 12 5.5 18.74 9 12 13.5z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Work for real',
    subtitle: 'Move beyond simulations.',
    desc: 'Talent works on real briefs, real tools, and live workflows—building experience that cannot be captured by a certificate alone.',
    side: 'left',
    activateAt: 0.30,
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M3 13h8V3H3v10zm2-8h4v6H5V5zm8 16h8V11h-8v10zm2-8h4v6h-4v-6zM3 21h8v-6H3v6zm2-4h4v2H5v-2zM13 3v6h8V3h-8zm6 4h-4V5h4v2z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Perform & prove',
    subtitle: 'Let the work speak.',
    desc: 'Performance is evaluated through demonstrated output, consistency, and execution — not just resumes.',
    label: 'Proof of Work → Verified',
    side: 'right',
    activateAt: 0.48,
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Deploy with confidence',
    subtitle: 'Ready from day one.',
    desc: 'Companies gain access to talent that has already worked in professional environments and understands real execution.',
    side: 'left',
    activateAt: 0.66,
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   CHECKPOINT NODE POSITIONS (Nodes sit directly ON the continuous SVG path)
───────────────────────────────────────────────────────────────────────────── */
const NODES_POS = [
  { x: 50, y: 22 },
  { x: 72, y: 38 },
  { x: 28, y: 56 },
  { x: 58, y: 74 },
];

/* Single, elegant, continuous S-curve path passing through the center of every node */
const ZIG_PATH = [
  'M 50 14',
  'C 50 18, 50 20, 50 22',
  'C 50 30, 72 30, 72 38',
  'C 72 46, 28 48, 28 56',
  'C 28 64, 58 66, 58 74',
  'C 58 80, 85 80, 105 82',
].join(' ');

// Normalized path progression targets where the stroke reaches each node (0.00 -> 1.00)
const NODE_PATH_TARGETS = [0.08, 0.32, 0.58, 0.82];

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT — JOURNEY BOX EXPERIENCE
───────────────────────────────────────────────────────────────────────────── */
export default function JourneyBoxExperience() {
  const containerRef = useRef(null);

  // Shared box hook for right-side product hero
  const { canvasRef, loaderRef, loaderBarRef, drawFrameAtProgress } = useBoxFrames({
    maxFraction: 0.75,
    zoomFactor: 1.0,
  });

  const headlineRef = useRef(null);
  const svgPathRef = useRef(null);
  const nodeRefs = useRef([null, null, null, null]);
  const hintRef = useRef(null);
  const hintHiddenRef = useRef(false);

  // Lerped scroll progress state
  const currentPRef = useRef(0);
  const targetPRef = useRef(0);
  const rafRef = useRef(null);

  useGSAP(() => {
    const section = containerRef.current;
    const pathEl = svgPathRef.current;
    if (!section || !pathEl) return;

    const pathLen = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = pathLen + 'px';
    pathEl.style.strokeDashoffset = pathLen + 'px';

    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function remap(v, a, b, c, d) {
      return c + clamp01((v - a) / Math.max(b - a, 0.001)) * (d - c);
    }

    /* ── Single rAF tick loop ────────────────────────────────────────────── */
    function tick() {
      rafRef.current = null;
      const p = currentPRef.current;

      /* 1. Box canvas frame animation */
      drawFrameAtProgress(p);

      /* 2. Single continuous SVG path draw (p = 0.06 -> 0.82) */
      const pathP = clamp01(remap(p, 0.06, 0.82, 0, 1));
      pathEl.style.strokeDashoffset = (pathLen * (1 - pathP)) + 'px';

      /* 3. Headline fade out */
      const head = headlineRef.current;
      if (head) {
        const ho = clamp01(remap(p, 0.08, 0.18, 1, 0));
        head.style.opacity = ho;
        head.style.transform = 'translateY(' + ((1 - ho) * -20) + 'px)';
      }

      /* 4. Checkpoint Activation, Single-Card Handoff, and Path-Driven Node Scale/Pulse */
      nodeRefs.current.forEach((node, i) => {
        if (!node) return;

        const windowStart = STAGES[i].activateAt;
        const windowEnd = i < 3 ? STAGES[i + 1].activateAt : 0.82;

        const isActive = p >= windowStart && p < windowEnd;
        const isCompleted = p >= windowEnd;

        node.classList.toggle('jbe-node--active', isActive);
        node.classList.toggle('jbe-node--completed', isCompleted);

        // Path-driven node scale pulse: when path reaches node center, pulse node up to 1.32x
        const iconEl = node.querySelector('.jbe-node-icon');
        if (iconEl) {
          const targetP = NODE_PATH_TARGETS[i];
          const dist = Math.abs(pathP - targetP);
          let pulse = 0;
          if (dist < 0.08) {
            pulse = Math.sin((1 - dist / 0.08) * (Math.PI / 2));
          }

          const scale = 1 + pulse * 0.32;
          iconEl.style.transform = 'scale(' + scale.toFixed(3) + ')';

          if (pulse > 0.05) {
            const auraPx = Math.round(14 * pulse);
            const alpha1 = (0.22 * pulse).toFixed(2);
            const alpha2 = (0.35 * pulse).toFixed(2);
            iconEl.style.boxShadow = `0 0 0 ${auraPx}px rgba(124, 58, 237, ${alpha1}), 0 10px 30px rgba(124, 58, 237, ${alpha2})`;
          } else {
            iconEl.style.boxShadow = '';
          }
        }

        // Story Card Handoff Animation (Only 1 card active at a time)
        const card = node.querySelector('.jbe-stage-card');
        if (card) {
          let cardOpacity = 0;
          let cardY = 20;

          if (isActive) {
            const fadeInP = clamp01(remap(p, windowStart, windowStart + 0.04, 0, 1));
            const fadeOutP = clamp01(remap(p, windowEnd - 0.04, windowEnd, 1, 0));
            cardOpacity = fadeInP * fadeOutP;
            cardY = (1 - fadeInP) * 20 - (1 - fadeOutP) * 12;
          }

          card.style.opacity = cardOpacity.toFixed(3);
          card.style.transform = 'translateY(' + cardY + 'px)';
          card.style.filter = isActive ? 'blur(0px)' : 'blur(6px)';
        }
      });

      /* 5. Particle canvas at section payoff (p > 0.88) */
      if (typeof window._ptUpdate === 'function') window._ptUpdate(p);

      /* 6. Scroll hint hide */
      const hint = hintRef.current;
      if (p > 0.04 && !hintHiddenRef.current && hint) {
        hint.classList.add('hidden');
        hintHiddenRef.current = true;
      }

      /* Lerp progression */
      const diff = targetPRef.current - p;
      if (Math.abs(diff) > 0.0004) {
        currentPRef.current += diff * 0.14;
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    function scheduleTick() {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    }

    /* ── Master ScrollTrigger ────────────────────────────────────────────── */
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        targetPRef.current = self.progress;
        scheduleTick();
      },
    });

    return () => {
      trigger.kill();
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="journey-box"
      aria-labelledby="journey-heading"
    >
      {/* ── STICKY VIEWPORT (100vh) — 43/57 SPLIT SCREEN ─────────────── */}
      <div className="jbe-sticky">

        {/* Loader */}
        <div ref={loaderRef} className="jbe-loader" aria-hidden="true">
          <div className="jbe-loader-bar-wrap">
            <div ref={loaderBarRef} className="jbe-loader-bar" />
          </div>
          <p className="jbe-loader-text">Loading…</p>
        </div>

        {/* ── LEFT COLUMN: TIMELINE STORYTELLING (43vw) ─────────────── */}
        <div className="jbe-left-col">

          {/* Left Column Editorial Headline */}
          <div ref={headlineRef} className="jbe-headline-block">
            <p className="jbe-eyebrow">The AntBox Path</p>
            <h2 className="jbe-headline" id="journey-heading">
              Resumes tell a story.<br />
              Work leaves{' '}
              <em className="accent-italic">evidence.</em>
            </h2>
          </div>

          {/* SINGLE CONTINUOUS SVG PATH & CHECKPOINTS */}
          <div className="jbe-zigzag-wrap" aria-hidden="true">
            <svg
              className="jbe-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              overflow="visible"
            >
              {/* Single Base Ghost Track */}
              <path
                d={ZIG_PATH}
                fill="none"
                stroke="rgba(124,58,237,0.12)"
                strokeWidth="2.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {/* Single Revealed Active Purple Path */}
              <path
                ref={svgPathRef}
                d={ZIG_PATH}
                fill="none"
                stroke="#7C3AED"
                strokeWidth="3"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Checkpoints — 76px circles sitting directly ON the path */}
            {STAGES.map((stage, i) => {
              const { x, y } = NODES_POS[i];
              return (
                <div
                  key={i}
                  ref={el => { nodeRefs.current[i] = el; }}
                  className="jbe-stage"
                  style={{ left: x + '%', top: y + '%' }}
                >
                  {/* Large Checkpoint Circle */}
                  <div className="jbe-node-icon" aria-hidden="true">
                    {stage.icon}
                  </div>

                  {/* Number Label Below Circle */}
                  <span className="jbe-stage-num">{stage.num}</span>

                  {/* Story Card — Handoff Animation */}
                  <div className={'jbe-stage-card jbe-stage-card--' + stage.side}>
                    <h3 className="jbe-stage-title">{stage.title}</h3>
                    <p className="jbe-stage-sub">{stage.subtitle}</p>
                    <p className="jbe-stage-desc">{stage.desc}</p>
                    {stage.label && (
                      <span className="jbe-stage-label">{stage.label}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scroll hint */}
          <div ref={hintRef} className="jbe-scroll-hint" aria-hidden="true">
            <div className="jbe-hint-line" />
            <span className="jbe-hint-label">Scroll to explore</span>
          </div>

        </div>{/* /jbe-left-col */}

        {/* ── RIGHT COLUMN: HERO PRODUCT CANVAS (57vw) ──────────────── */}
        <div className="jbe-right-col">
          <canvas ref={canvasRef} className="jbe-canvas" aria-hidden="true" />
          <ParticleCanvas />
        </div>{/* /jbe-right-col */}

      </div>{/* /jbe-sticky */}
    </section>
  );
}
