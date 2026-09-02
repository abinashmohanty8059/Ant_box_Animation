import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const HOVER_ITEMS = {
  realWork: {
    title: 'REAL WORK',
    subtitle: 'Projects & Production Sprints',
    img: '/assets/stock_images/01 — The Colony.png',
  },
  evidence: {
    title: 'VERIFIED EVIDENCE',
    subtitle: 'Immutable Proof of Skill',
    img: '/assets/stock_images/07 — Real Work, Real Impact.png',
  },
  capability: {
    title: 'CAPABILITY',
    subtitle: 'Industry Verified Readiness',
    img: '/assets/stock_images/12 — Future-Proof Talent.png',
  },
};

export default function HoverSignalsSection() {
  const sectionRef = useRef(null);
  const previewRef = useRef(null);

  const [activeItem, setActiveItem] = useState(null);

  // Smooth GSAP quickTo setters for cursor tracking
  const xToRef = useRef(null);
  const yToRef = useRef(null);

  useEffect(() => {
    // Preload stock images
    Object.values(HOVER_ITEMS).forEach((item) => {
      const img = new Image();
      img.src = item.img;
    });

    const preview = previewRef.current;
    if (preview) {
      gsap.set(preview, { xPercent: -50, yPercent: -120, opacity: 0, scale: 0.94 });
      xToRef.current = gsap.quickTo(preview, 'x', { duration: 0.25, ease: 'power3.out' });
      yToRef.current = gsap.quickTo(preview, 'y', { duration: 0.25, ease: 'power3.out' });
    }

    const handleMouseMove = (e) => {
      if (!xToRef.current || !yToRef.current || !previewRef.current) return;

      const cardWidth = 320;
      const cardHeight = 220;
      const padding = 20;

      // Keep within viewport boundaries
      let targetX = e.clientX;
      let targetY = e.clientY;

      if (targetX + cardWidth / 2 > window.innerWidth - padding) {
        targetX = window.innerWidth - cardWidth / 2 - padding;
      } else if (targetX - cardWidth / 2 < padding) {
        targetX = cardWidth / 2 + padding;
      }

      if (targetY - cardHeight < padding) {
        targetY = e.clientY + cardHeight + padding;
      }

      xToRef.current(targetX);
      yToRef.current(targetY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleMouseEnter = (key, e) => {
    // Disable hover preview on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    setActiveItem(HOVER_ITEMS[key]);

    if (xToRef.current && yToRef.current) {
      xToRef.current(e.clientX);
      yToRef.current(e.clientY - 15);
    }

    if (previewRef.current) {
      gsap.to(previewRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  };

  const handleMouseLeave = () => {
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        opacity: 0,
        scale: 0.94,
        duration: 0.25,
        ease: 'power2.in',
        overwrite: 'auto',
      });
    }
  };

  return (
    <section ref={sectionRef} id="hover-signals" aria-label="Proof of Capability Overview">
      <div className="hs-container">
        
        <p className="hs-eyebrow">03 // PROOF OF CAPABILITY</p>

        <h2 className="hs-editorial-text">
          Learn by taking on meaningful challenges and building your{' '}
          <span
            className="hs-word-target"
            onMouseEnter={(e) => handleMouseEnter('realWork', e)}
            onMouseLeave={handleMouseLeave}
          >
            real work
            <span className="hs-underline" />
          </span>{' '}
          into something that can be measured.
          <br /><br />
          Capture every meaningful outcome as{' '}
          <span
            className="hs-word-target"
            onMouseEnter={(e) => handleMouseEnter('evidence', e)}
            onMouseLeave={handleMouseLeave}
          >
            verified evidence
            <span className="hs-underline" />
          </span>{' '}
          of how you think, build, and solve.
          <br /><br />
          Put your{' '}
          <span
            className="hs-word-target"
            onMouseEnter={(e) => handleMouseEnter('capability', e)}
            onMouseLeave={handleMouseLeave}
          >
            capability
            <span className="hs-underline" />
          </span>{' '}
          in front of the companies that value what you can actually do.
        </h2>

      </div>

      {/* Floating Cursor-Tracking Image Preview Card */}
      <div
        ref={previewRef}
        className="hs-floating-preview"
        aria-hidden="true"
        style={{ pointerEvents: 'none' }}
      >
        {activeItem && (
          <div className="hs-preview-card">
            <div className="hs-preview-img-wrap">
              <img src={activeItem.img} alt="" className="hs-preview-img" />
            </div>
            <div className="hs-preview-footer">
              <span className="hs-preview-title">{activeItem.title}</span>
              <span className="hs-preview-sub">{activeItem.subtitle}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
