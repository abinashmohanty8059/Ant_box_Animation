import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const STOCK_IMAGES = [
  "/assets/stock_images/01 — The Colony.png",
  "/assets/stock_images/02 — From Campus to Corporate.png",
  "/assets/stock_images/03 — Career Sprint.png",
  "/assets/stock_images/04 — Proof of Work.png",
  "/assets/stock_images/05 — Talent Readiness Engine.png",
  "/assets/stock_images/06 — Build Your Tribe.png",
  "/assets/stock_images/07 — Real Work, Real Impact.png",
  "/assets/stock_images/08 — The Opportunity.png",
  "/assets/stock_images/09 — Built on Ownership.png",
  "/assets/stock_images/10 — Campus Energy.png",
  "/assets/stock_images/11 — Ant of Giving.png",
  "/assets/stock_images/12 — Future-Proof Talent.png"
];

const TOTAL_CARDS = 28;
const IMAGES = Array.from({ length: TOTAL_CARDS }, (_, i) => STOCK_IMAGES[i % STOCK_IMAGES.length]);

export default function ImageMorphPage() {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const cardsWrapRef = useRef(null);
  const introRef = useRef(null);
  const exploreRef = useRef(null);

  useGSAP(() => {
    const container = containerRef.current;
    const cardsWrap = cardsWrapRef.current;
    const intro = introRef.current;
    const explore = exploreRef.current;
    if (!container || !cardsWrap || !intro || !explore) return;

    const cards = cardsWrap.querySelectorAll('.morph-card-wrap');

    // 1. Initial SCATTER state setup
    gsap.set(cards, {
      x: () => (Math.random() - 0.5) * window.innerWidth * 0.9,
      y: () => (Math.random() - 0.5) * window.innerHeight * 0.9,
      rotation: () => (Math.random() - 0.5) * 80,
      scale: () => 0.4 + Math.random() * 0.3,
      opacity: 0
    });

    const introTimeline = gsap.timeline({ paused: true });

    // Fade in scatter cards
    introTimeline.to(cards, {
      opacity: 1,
      duration: 0.8,
      stagger: 0.02,
      ease: 'power2.out'
    });

    // 2. Scatter -> LINE (centered horizontal line layout)
    introTimeline.to(cards, {
      x: (i) => {
        const spacing = window.innerWidth < 768 ? 13 : 26;
        return (i - 13.5) * spacing;
      },
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 1.2,
      stagger: 0.02,
      ease: 'power3.inOut'
    }, '+=0.4');

    // 3. Line -> FULL CIRCLE (Complete 360 degrees circle around viewport center)
    introTimeline.to(cards, {
      x: (i) => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const R = vw < 768 ? 110 : Math.min(300, vw * 0.25, vh * 0.29);
        const angle = (i / TOTAL_CARDS) * 2 * Math.PI;
        return R * Math.cos(angle);
      },
      y: (i) => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const R = vw < 768 ? 110 : Math.min(300, vw * 0.25, vh * 0.29);
        const angle = (i / TOTAL_CARDS) * 2 * Math.PI;
        return R * Math.sin(angle);
      },
      rotation: (i) => {
        const angle = (i / TOTAL_CARDS) * 2 * Math.PI;
        return Math.sin(angle) * 15; // Natural readable tangent tilt
      },
      scale: 1,
      duration: 1.4,
      stagger: 0.015,
      ease: 'elastic.out(1, 0.85)'
    }, '+=1.0');

    // 4. Scroll Scrub: Orbit/Rotate the FULL CIRCLE slowly
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true
      }
    });

    // Fades intro texts out and explores text overlays in
    scrollTimeline.to(intro, { opacity: 0, y: -45, duration: 0.3 }, 0);
    scrollTimeline.to(explore, { opacity: 1, y: 0, duration: 0.45 }, 0.2);

    // Rotate cards container to create circular orbital motion
    scrollTimeline.to(cardsWrap, {
      rotation: 180,
      ease: 'none',
      duration: 2.0
    }, 0);

    // Simultaneously counter-rotate cards to keep images upright
    scrollTimeline.to(cards, {
      rotation: (i) => {
        const angle = (i / TOTAL_CARDS) * 2 * Math.PI;
        const initialRot = Math.sin(angle) * 15;
        return initialRot - 180;
      },
      ease: 'none',
      duration: 2.0
    }, 0);

    // Subtle pointer drift horizontal parallax
    const xTo = gsap.quickTo(cardsWrap, 'x', { duration: 0.8, ease: 'power2.out' });
    const handlePointerMove = (e) => {
      const px = (e.clientX / window.innerWidth) * 2 - 1;
      xTo(px * 50);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const entryObserver = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        introTimeline.play();
        entryObserver.disconnect();
      }
    }, { threshold: 0.01 });
    entryObserver.observe(container);

    return () => {
      entryObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="morph-page-container">
      <style>{`
        .morph-page-container {
          position: relative;
          width: 100%;
          min-height: 145vh;
          background: #ffffff;
          color: #0f0f11;
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
        }
        .morph-viewport {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .morph-text-overlay {
          position: absolute;
          bottom: 2vh;
          left: 0;
          width: 100%;
          z-index: 5;
          text-align: center;
          pointer-events: none;
        }
        .morph-text-overlay h1 {
          font-size: clamp(1.8rem, 5vw, 3.8rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          margin-bottom: 0.5rem;
          line-height: 1.1;
          color: #0f0f11;
        }
        .morph-text-overlay p {
          font-size: clamp(0.7rem, 2vw, 0.95rem);
          color: rgba(15, 15, 17, 0.55);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .morph-explore-title {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .morph-cards-inner-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 0;
          height: 0;
        }

        /* 3D card layout styles with larger sizing target */
        .morph-card-wrap {
          position: absolute;
          width: clamp(90px, 8.5vw, 115px);
          height: clamp(125px, 11.8vw, 160px);
          perspective: 1000px;
          cursor: pointer;
        }
        @media (max-width: 767px) {
          .morph-card-wrap {
            width: clamp(55px, 14vw, 75px);
            height: clamp(78px, 19.8vw, 105px);
          }
        }
        .morph-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1.0);
          transform-style: preserve-3d;
        }
        .morph-card-wrap:hover .morph-card-inner {
          transform: rotateY(180deg);
        }
        .morph-card-front, .morph-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.12);
        }
        .morph-card-front {
          background-color: #f4f4f5;
        }
        .morph-card-front img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .morph-card-back {
          background-color: #7c3aed;
          color: white;
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }
      `}</style>

      {/* STICKY VIEWPORT WRAP */}
      <div ref={viewportRef} className="morph-viewport">
        {/* INTRO TEXT BLOCK (Active at start) */}
        <div ref={introRef} className="morph-text-overlay" style={{ opacity: 1 }}>
          <h1>The future is built on AI.</h1>
          <p>SCROLL TO EXPLORE</p>
        </div>

        {/* EXPLORE TEXT BLOCK (Scrolled in) */}
        <div ref={exploreRef} className="morph-text-overlay" style={{ opacity: 0, transform: 'translateY(40px)' }}>
          <h1 className="morph-explore-title">Explore Our Vision</h1>
          <p>Discover a world where technology meets creativity.</p>
        </div>

        {/* MORPH CARDS INNER CONTAINER */}
        <div ref={cardsWrapRef} className="morph-cards-inner-wrap">
          {IMAGES.map((src, i) => (
            <div key={i} className="morph-card-wrap">
              <div className="morph-card-inner">
                {/* Front Side: Stock Graphic */}
                <div className="morph-card-front">
                  <img src={src} alt={`AntBox Vision Segment ${i + 1}`} loading="lazy" />
                </div>
                {/* Back Side: details overlay */}
                <div className="morph-card-back">
                  <span>VIEW</span>
                  <span>DETAILS</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
