import { useEffect, useRef, useState } from 'react';

export default function StatsMarquee() {
  const [valCount, setValCount] = useState('0');
  const [entCount, setEntCount] = useState('0');
  const [rateCount, setRateCount] = useState('0');
  
  const containerRef = useRef(null);
  const marqueeTrackRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scroll Reveal Observer (stat-cards delay entrance)
    const revealEls = container.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
          setTimeout(() => el.classList.add('visible'), delay);
          revealObs.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObs.observe(el));

    // 2. Counter Animation Observer
    const animated = { val: false, ent: false, rate: false };
    
    function animateCounter(target, setVal) {
      const duration = 1600;
      const start = performance.now();
      let rafId;

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        let text;
        if (current >= 1000) {
          const decimals = current >= 10000 ? 0 : 1;
          const suffix = target >= 1000 ? ',000' : 'k';
          text = (current / 1000).toFixed(decimals).replace('.0', '') + suffix;
        } else {
          text = current.toString();
        }

        if (progress < 1) {
          setVal(text);
          rafId = requestAnimationFrame(step);
        } else {
          const finalVal = target >= 10000
            ? '10,000'
            : target >= 1000
              ? target.toLocaleString()
              : target.toString();
          setVal(finalVal);
        }
      };

      rafId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafId);
    }

    let cancelVal = null;
    let cancelEnt = null;
    let cancelRate = null;

    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          
          if (target === 10000 && !animated.val) {
            animated.val = true;
            cancelVal = animateCounter(10000, setValCount);
            counterObs.unobserve(el);
          } else if (target === 50 && !animated.ent) {
            animated.ent = true;
            cancelEnt = animateCounter(50, setEntCount);
            counterObs.unobserve(el);
          } else if (target === 70 && !animated.rate) {
            animated.rate = true;
            cancelRate = animateCounter(70, setRateCount);
            counterObs.unobserve(el);
          }
        }
      });
    }, { threshold: 0.4 });

    const counters = container.querySelectorAll('.stat-count');
    counters.forEach(el => counterObs.observe(el));

    // Cleanup
    return () => {
      revealObs.disconnect();
      counterObs.disconnect();
      if (cancelVal) cancelVal();
      if (cancelEnt) cancelEnt();
      if (cancelRate) cancelRate();
    };
  }, []);

  const handleMouseEnter = () => {
    if (marqueeTrackRef.current) {
      marqueeTrackRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleMouseLeave = () => {
    if (marqueeTrackRef.current) {
      marqueeTrackRef.current.style.animationPlayState = 'running';
    }
  };

  return (
    <section ref={containerRef} id="stats" aria-label="Platform impact">
      <div className="container">

        <div className="stats-grid">

          <div className="stat-card reveal" data-delay="0">
            <p className="stat-number">
              <span className="stat-count" data-target="10000">{valCount}</span>
              <span className="accent">+</span>
            </p>
            <p className="stat-label">Students Validated</p>
          </div>

          <div className="stat-card reveal" data-delay="100">
            <p className="stat-number">
              <span className="stat-count" data-target="50">{entCount}</span>
              <span className="accent">+</span>
            </p>
            <p className="stat-label">Enterprises Hiring</p>
          </div>

          <div className="stat-card reveal" data-delay="200">
            <p className="stat-number">
              <span className="stat-count" data-target="70">{rateCount}</span>
              <span className="accent">%</span>
            </p>
            <p className="stat-label">Placement Rate</p>
          </div>

        </div>

      </div>

      {/* Marquee strip */}
      <div className="marquee-wrap" aria-hidden="true" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div className="marquee-track" id="marqueeTrack" ref={marqueeTrackRef}>
          {/* Items duplicated for seamless loop */}
          <div className="marquee-item">Validated Talent Pool <span className="dot">•</span></div>
          <div className="marquee-item">Campus to Corporate <span className="dot">•</span></div>
          <div className="marquee-item">Tribe Building <span className="dot">•</span></div>
          <div className="marquee-item">AI Readiness Engine <span className="dot">•</span></div>
          <div className="marquee-item">Career Sprints <span className="dot">•</span></div>
          <div className="marquee-item">Live Work Experience <span className="dot">•</span></div>
          <div className="marquee-item">Pre-Placement Offers <span className="dot">•</span></div>
          <div className="marquee-item">Validated Talent Pool <span className="dot">•</span></div>
          <div className="marquee-item">Campus to Corporate <span className="dot">•</span></div>
          <div className="marquee-item">Tribe Building <span className="dot">•</span></div>
          <div className="marquee-item">AI Readiness Engine <span className="dot">•</span></div>
          <div className="marquee-item">Career Sprints <span className="dot">•</span></div>
          <div className="marquee-item">Live Work Experience <span className="dot">•</span></div>
          <div className="marquee-item">Pre-Placement Offers <span className="dot">•</span></div>
        </div>
      </div>
    </section>
  );
}
