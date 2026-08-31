import { useEffect, useRef } from 'react';

export default function Enterprises() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const revealEls = container.querySelectorAll('.reveal-left, .reveal-right');
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
    <section ref={containerRef} id="corporates" aria-label="For Enterprises" aria-labelledby="corp-heading">
      <div className="container">
        <div className="two-col-dark">

          {/* Left: Benefits */}
          <div className="reveal-left">
            <p className="dark-eyebrow">For Enterprises</p>
            <h2 className="dark-headline" id="corp-heading">
              Ready to build<br />your <em className="accent-italic">tribes?</em>
            </h2>

            <div className="benefit-list">

              <div className="benefit-item">
                <div className="benefit-icon-wrap" aria-hidden="true">🎯</div>
                <div>
                  <h3 className="benefit-title">Pre-Validated Talent</h3>
                  <p className="benefit-body">Stop sifting through identical resumes. Access candidates who have already
                    proven their skills on your specific briefs and problem statements.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon-wrap" aria-hidden="true">⚡</div>
                <div>
                  <h3 className="benefit-title">Reduce Time-to-Hire</h3>
                  <p className="benefit-body">Identify high-potential candidates earlier in their academic journey and build
                    relationships before they graduate — ahead of the competition.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon-wrap" aria-hidden="true">📊</div>
                <div>
                  <h3 className="benefit-title">Predictive Analytics</h3>
                  <p className="benefit-body">Leverage our AI readiness engine to predict a candidate's success rate in your
                    specific corporate environment with measurable accuracy.</p>
                </div>
              </div>

            </div>

            <a href="#cta" className="btn btn-white" id="corp-cta-btn">Hire with AntBox →</a>
          </div>

          {/* Right: Tribe Analytics visualization */}
          <div className="reveal-right">
            <div className="tribe-viz">

              <div className="tribe-viz-header">
                <span className="tribe-viz-title">Tribe Analytics Engine</span>
                <span className="tribe-live">
                  <span className="tribe-live-dot" aria-hidden="true"></span>
                  Live
                </span>
              </div>

              {/* Video container */}
              <div className="tribe-video-container">
                <video autoPlay muted loop playsInline className="tribe-video">
                  <source src="https://ik.imagekit.io/n9uuondomb/AntBox_training/Team_discussing.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="tribe-video-overlay"></div>
              </div>

              {/* Stats row */}
              <div className="tribe-stats">
                <div className="tribe-stat">
                  <div className="tribe-stat-label">Pipeline Strength</div>
                  <div className="tribe-stat-value">1,000 <span className="accent">+ candidates</span></div>
                </div>
                <div className="tribe-stat">
                  <div className="tribe-stat-label">Avg Readiness</div>
                  <div className="tribe-stat-value">87<span className="accent">%</span></div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
