import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const containerRef = useRef(null);
  const ctaBgRef = useRef(null);

  useGSAP(() => {
    const section = containerRef.current;
    const ctaBg = ctaBgRef.current;
    if (!section || !ctaBg) return;

    gsap.fromTo(ctaBg,
      { y: -70 },
      {
        y: 70,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }, { scope: containerRef });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const revealEls = container.querySelectorAll('.reveal');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (revealEls.length > 0 && !prefersReducedMotion) {
      const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      revealEls.forEach(el => revealObs.observe(el));

      return () => {
        revealObs.disconnect();
      };
    } else {
      revealEls.forEach(el => el.classList.add('visible'));
    }
  }, []);

  return (
    <section ref={containerRef} id="cta" aria-labelledby="cta-heading">

      <div ref={ctaBgRef} className="cta-bg-art" id="ctaBg" aria-hidden="true" style={{ transform: 'scale(1.15)' }}>
        <video autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.42) contrast(1.05)', opacity: 0.95 }}>
          <source src="https://ik.imagekit.io/n9uuondomb/AntBox_training/Team_working.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="cta-glow-left" aria-hidden="true"></div>
      <div className="cta-glow-right" aria-hidden="true"></div>

      <div className="cta-inner reveal">
        <p className="section-eyebrow" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>Start Now</p>
        <h2 className="cta-headline" id="cta-heading">
          Your career doesn't start<br />at graduation. It starts
          <em className="accent-italic">now.</em>
        </h2>
        <p className="cta-sub">
          Join the platform that is reshaping how talent meets opportunity
          — one sprint, one validation, one offer at a time.
        </p>
        <a href="#" className="btn btn-white" style={{ fontSize: '0.75rem', padding: '1.1rem 2.5rem' }} id="cta-main-btn">
          Enter Platform →
        </a>
      </div>

    </section>
  );
}
