import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ScrollReveal from './ui/ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export default function TalentProfileSection() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const section = containerRef.current;
    if (!section) return;

    const eyebrow   = section.querySelector('.tp-eyebrow');
    const bodyText  = section.querySelector('.tp-body');
    const ctaWrap   = section.querySelector('.tp-cta-wrap');
    const cardEl    = section.querySelector('.tp-card');
    const livePill  = section.querySelector('.tp-live-pill');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });

    if (cardEl) {
      tl.from(
        cardEl,
        {
          y: 40,
          x: -20,
          opacity: 0,
          scale: 0.97,
          duration: 0.9,
          ease: 'power3.out',
        }
      );
    }

    if (livePill) {
      tl.from(
        livePill,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.4'
      );
    }

    if (eyebrow) {
      tl.from(
        eyebrow,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.5'
      );
    }

    if (bodyText) {
      tl.from(
        bodyText,
        {
          y: 25,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
        },
        '-=0.3'
      );
    }

    if (ctaWrap) {
      tl.from(
        ctaWrap,
        {
          y: 25,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
        },
        '-=0.4'
      );
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="talent-profile" aria-label="Talent Profile Capability Showcase">
      <div className="tp-container">
        
        {/* LEFT COLUMN: Interactive Talent Profile Card */}
        <div className="tp-left">
          <div className="tp-card">
            
            {/* Card Header: Avatar & Metadata */}
            <div className="tp-card-header">
              <div className="tp-avatar-wrap">
                <img
                  src="/assets/stock_images/05 — Talent Readiness Engine.png"
                  alt="Priya Sharma Profile"
                  className="tp-avatar-img"
                />
              </div>
              <div className="tp-header-info">
                <h3 className="tp-user-name">Priya Sharma</h3>
                <div className="tp-user-meta">
                  <span className="tp-user-id">ID: ABX-8992</span>
                  <span className="tp-bullet">•</span>
                  <span className="tp-verified-badge">
                    <span className="tp-badge-dot" />
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>

            {/* Capability Row 1: System Design */}
            <div className="tp-capability-row">
              <div className="tp-cap-icon-wrap">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                </svg>
              </div>
              <div className="tp-cap-info">
                <h4 className="tp-cap-title">System Design</h4>
                <p className="tp-cap-sub">3 Verified Artifacts</p>
              </div>
              <div className="tp-cap-score-wrap">
                <span className="tp-cap-score">94</span>
                <span className="tp-cap-label">READINESS SCORE</span>
              </div>
            </div>

            {/* Capability Row 2: Problem Solving */}
            <div className="tp-capability-row">
              <div className="tp-cap-icon-wrap">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4l3 3" />
                </svg>
              </div>
              <div className="tp-cap-info">
                <h4 className="tp-cap-title">Problem Solving</h4>
                <p className="tp-cap-sub">12 Peer Reviews</p>
              </div>
              <div className="tp-cap-score-wrap">
                <span className="tp-cap-score">88</span>
                <span className="tp-cap-label">READINESS SCORE</span>
              </div>
            </div>

            {/* Capability Growth Graph Area */}
            <div className="tp-graph-section">
              <p className="tp-graph-title">CAPABILITY GROWTH OVER TIME</p>
              <div className="tp-graph-svg-wrap">
                <svg className="tp-graph-svg" viewBox="0 0 300 70" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="tpGraphGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(124, 58, 237, 0.15)" />
                      <stop offset="100%" stopColor="rgba(124, 58, 237, 0.0)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 55 Q 75 48, 150 35 T 300 15 L 300 70 L 0 70 Z"
                    fill="url(#tpGraphGrad)"
                  />
                  <path
                    d="M 0 55 Q 75 48, 150 35 T 300 15"
                    fill="none"
                    stroke="rgba(124, 58, 237, 0.45)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Floating Status Label Pill */}
            <div className="tp-live-pill">
              <span className="tp-live-dot" />
              <span>LIVE SIGNAL DETECTED</span>
            </div>

          </div>{/* /tp-card */}
        </div>{/* /tp-left */}

        {/* RIGHT COLUMN: Editorial Typography & Call to Action */}
        <div className="tp-right">
          <p className="tp-eyebrow">From Proof to Profile</p>

          <h2 className="tp-headline-main">
            <ScrollReveal
              baseOpacity={0.1}
              enableBlur={true}
              baseRotation={3}
              blurStrength={4}
              wordAnimationEnd="bottom 45%"
            >
              {"Don't tell\ncompanies\nwhat you can\ndo."}
            </ScrollReveal>
          </h2>

          <p className="tp-headline-italic">
            <ScrollReveal
              baseOpacity={0.15}
              enableBlur={true}
              baseRotation={2}
              blurStrength={3}
              wordAnimationEnd="bottom 42%"
            >
              Show them.
            </ScrollReveal>
          </p>

          <p className="tp-body">
            The AntBox Talent Profile transforms raw output into a structured,
            verified portfolio of capabilities.
          </p>

          <div className="tp-cta-wrap">
            <a href="#profiles" className="tp-cta-btn">
              <span>EXPLORE PROFILES</span>
              <span className="tp-cta-arrow">→</span>
            </a>
          </div>
        </div>{/* /tp-right */}

      </div>
    </section>
  );
}
