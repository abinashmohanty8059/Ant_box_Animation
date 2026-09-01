import { useEffect, useRef } from 'react';
// import BallpitCanvas from './BallpitCanvas';

export default function Hero() {
  const heroRef = useRef(null);
  const heroBgRef = useRef(null);

  useEffect(() => {
    const heroBg = heroBgRef.current;
    if (!heroBg) return;

    const prefersReducedMotion = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion()) return;

    let targetScrollY = 0;
    let curScrollY = 0;
    let animationFrameId;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    function updateParallax() {
      curScrollY += (targetScrollY - curScrollY) * 0.12;
      const yScrollShift = curScrollY * 0.45;

      if (curScrollY < window.innerHeight + 150) {
        heroBg.style.transform = `translate3d(0px, ${yScrollShift}px, 0) scale(1.15)`;
      }

      animationFrameId = requestAnimationFrame(updateParallax);
    }

    updateParallax();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section ref={heroRef} id="hero" aria-label="Hero">
      {/* Background artwork */}
      <div ref={heroBgRef} className="hero-bg" id="heroBg" aria-hidden="true"></div>

      {/* Gradient overlay for readability */}
      <div className="hero-overlay" aria-hidden="true"></div>

      {/* Ballpit physics canvas (commented out) */}
      {/* <BallpitCanvas /> */}

      {/* Content */}
      <div className="hero-content" id="heroContent">
        <h1 className="hero-headline">
          The platform that bridges<br />
          <span style={{ whiteSpace: 'nowrap' }}><em className="accent-italic">talent</em> with opportunity.</span>
        </h1>

        <p className="hero-sub">
          Build meaningful connections, discover your potential, and create
          opportunities through experiences that prepare you for what comes next.
        </p>

        <div className="hero-actions">
          <a href="#students" className="btn btn-primary" id="hero-student-btn">I'm a Student →</a>
          <a href="#corporates" className="btn btn-outline" id="hero-corp-btn">For Enterprises</a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="scroll-hint" aria-hidden="true">
        <div className="scroll-hint-line"></div>
        <div className="scroll-hint-dot"></div>
      </div>
    </section>
  );
}
