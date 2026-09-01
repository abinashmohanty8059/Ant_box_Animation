import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ScrollReveal from './ui/ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export default function ProofOfWorkSection() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const section = containerRef.current;
    if (!section) return;

    // Eyebrow & CTA button GSAP entrance
    const eyebrow = section.querySelector('.pow-eyebrow');
    const ctaWrap = section.querySelector('.pow-cta-wrap');
    const imageFrame = section.querySelector('.pow-image-frame');
    const artifactCard = section.querySelector('.pow-artifact-card');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });

    if (eyebrow) {
      tl.from(eyebrow, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
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
        '-=0.3'
      );
    }

    if (imageFrame) {
      tl.from(
        imageFrame,
        {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        },
        '-=0.5'
      );
    }

    if (artifactCard) {
      tl.from(
        artifactCard,
        {
          x: 30,
          y: -20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.5'
      );
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="proof-of-work" aria-label="From Potential to Proof">
      <div className="pow-container">
        
        {/* LEFT COLUMN: Editorial Typography & CTA */}
        <div className="pow-left">
          <p className="pow-eyebrow">From Potential to Proof</p>

          {/* 4-line stacked main headline with ScrollReveal */}
          <h2 className="pow-headline-main">
            <ScrollReveal
              baseOpacity={0.1}
              enableBlur={true}
              baseRotation={3}
              blurStrength={4}
              wordAnimationEnd="bottom 45%"
            >
              {"BUILD\nEVIDENCE\nTHAT\nSPEAKS"}
            </ScrollReveal>
          </h2>

          {/* Italic secondary phrase with ScrollReveal */}
          <p className="pow-headline-italic">
            <ScrollReveal
              baseOpacity={0.15}
              enableBlur={true}
              baseRotation={2}
              blurStrength={3}
              wordAnimationEnd="bottom 42%"
            >
              louder than a degree.
            </ScrollReveal>
          </p>

          {/* Body paragraph with ScrollReveal */}
          <p className="pow-body">
            <ScrollReveal
              baseOpacity={0.2}
              enableBlur={true}
              baseRotation={1}
              blurStrength={2}
              wordAnimationEnd="bottom 40%"
            >
              Stop relying on static credentials. The AntBox protocol captures your actual capabilities through verifiable sprints, generating immutable proof of skill for the world's most demanding enterprises.
            </ScrollReveal>
          </p>

          <div className="pow-cta-wrap">
            <a href="#explore" className="pow-cta-btn">
              <span>BUILD YOUR PROOF</span>
              <span className="pow-cta-arrow">→</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Image & Floating Verification Card */}
        <div className="pow-right">
          <div className="pow-image-frame">
            <img
              src="/assets/stock_images/04 — Proof of Work.png"
              alt="AntBox Proof of Work Protocol"
              className="pow-image"
              loading="lazy"
            />
          </div>

          {/* Floating Verification Artifact Card */}
          <div className="pow-artifact-card">
            <div className="pow-artifact-header">
              <span className="pow-artifact-num">ARTIFACT #892</span>
              <span className="pow-status-badge">
                <span className="pow-status-dot" />
                VERIFIED
              </span>
            </div>

            <h3 className="pow-artifact-title">System Architecture Sprint</h3>

            <div className="pow-artifact-meta">
              <div className="pow-meta-row">
                <span className="pow-meta-label">Score</span>
                <span className="pow-meta-val pow-meta-val--score">94 / 100</span>
              </div>
              <div className="pow-meta-row">
                <span className="pow-meta-label">Enterprise</span>
                <span className="pow-meta-val">GlobalBank</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
