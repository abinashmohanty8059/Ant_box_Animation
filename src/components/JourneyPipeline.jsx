import { useEffect, useRef } from 'react';

export default function JourneyPipeline() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scroll Reveal IntersectionObserver for elements in Journey Section
    const revealEls = container.querySelectorAll('.reveal, .reveal-left, .reveal-right');
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

    // Cleanup
    return () => {
      revealObs.disconnect();
    };
  }, []);

  return (
    <section ref={containerRef} id="journey" aria-label="From Potential to Proof">
      <div className="container">

        {/* Editorial Intro */}
        <div className="journey-intro">
          <div className="reveal-left">
            <p className="section-eyebrow">The AntBox Advantage</p>
            <h2 className="section-headline">
              Potential is everywhere.<br />
              <span className="accent-italic text-purple">Proof is rare.</span>
            </h2>
          </div>
          <div className="reveal-right">
            <p className="section-body">
              AntBox closes the gap between learning and doing. We put emerging talent into real environments, real
              workflows, and real challenges—so potential becomes something companies can actually see.
            </p>
          </div>
        </div>

        {/* Optional AntBox Brand Moment */}
        <div className="brand-editorial-moment reveal">
          <p className="editorial-quote">Resumes tell a story. Work leaves <span
              className="accent-italic text-purple">evidence.</span></p>
        </div>

        {/* Redesigned Layout */}
        <div className="journey-layout">

          {/* Horizontal Proof Pipeline */}
          <div className="pipeline-column">
            <div className="pipeline-container reveal">

              {/* Flow line */}
              <div className="pipeline-flow-line">
                <div className="pipeline-progress" id="pipelineProgress"></div>
              </div>

              <div className="pipeline-stages">
                {/* Stage 01 */}
                <div className="pipeline-stage" data-stage="1">
                  <div className="stage-num">01</div>
                  <div className="stage-icon-wrap">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor"
                        d="M12 2L1 9l11 7 9-5.73v5.73h2V9L12 2zm0 11.5L5.26 9 12 5.5 18.74 9 12 13.5zM11 16.58V20h2v-3.42c1.72-.45 3-2 3-3.83h-2c0 1.1-.9 2-2 2s-2-.9-2-2H8c0 1.83 1.28 3.38 3 3.83z" />
                    </svg>
                  </div>
                  <div className="stage-content">
                    <h3 className="stage-title">Train with intent</h3>
                    <p className="stage-subtitle">Learn what the real world demands.</p>
                    <p className="stage-desc">Structured learning, mentorship, and specialised career tracks help
                      high-potential talent build relevant skills with a clear direction.</p>
                  </div>
                </div>

                {/* Stage 02 */}
                <div className="pipeline-stage active" data-stage="2">
                  <div className="stage-num">02</div>
                  <div className="stage-icon-wrap">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor"
                        d="M3 13h8V3H3v10zm2-8h4v6H5V5zm8 16h8V11h-8v10zm2-8h4v6h-4v-6zM3 21h8v-6H3v6zm2-4h4v2H5v-2zM13 3v6h8V3h-8zm6 4h-4V5h4v2z" />
                    </svg>
                  </div>
                  <div className="stage-content">
                    <h3 className="stage-title">Work for real</h3>
                    <p className="stage-subtitle">Move beyond simulations.</p>
                    <p className="stage-desc">Talent works on real briefs, real tools, and live workflows—building experience
                      that cannot be captured by a certificate alone.</p>
                  </div>
                </div>

                {/* Stage 03 */}
                <div className="pipeline-stage focus" data-stage="3">
                  <div className="stage-num">03</div>
                  <div className="stage-icon-wrap">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor"
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" />
                    </svg>
                  </div>
                  <div className="stage-content">
                    <h3 className="stage-title">Perform & prove</h3>
                    <p className="stage-subtitle">Let the work speak.</p>
                    <p className="stage-desc">Performance is evaluated through demonstrated output, consistency,
                      collaboration, and execution—not just resumes.</p>
                    <span className="stage-label">Proof of Work → Verified</span>
                  </div>
                </div>

                {/* Stage 04 */}
                <div className="pipeline-stage" data-stage="4">
                  <div className="stage-num">04</div>
                  <div className="stage-icon-wrap">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor"
                        d="M5 13H19V11H5v2zm0-4h14V7H5v2zm0 8h14v-2H5v2zm16 4H3V3h18v18zM5 5v14h14V5H5z" />
                    </svg>
                  </div>
                  <div className="stage-content">
                    <h3 className="stage-title">Deploy with confidence</h3>
                    <p className="stage-subtitle">Ready from day one.</p>
                    <p className="stage-desc">Companies gain access to talent that has already worked in professional
                      environments and understands the expectations of execution.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Brand Proof Panel */}
          <div className="proof-panel-column reveal-right">
            <div className="proof-panel">
              <h3 className="proof-panel-title">What companies actually see</h3>

              <div className="proof-signals">
                <div className="proof-signal">
                  <div className="signal-header">
                    <span className="signal-dot"></span>
                    <span className="signal-title">Verified Work Output</span>
                  </div>
                  <p className="signal-desc">Real projects and demonstrated execution.</p>
                </div>

                <div className="proof-signal">
                  <div className="signal-header">
                    <span className="signal-dot"></span>
                    <span className="signal-title">Performance Signals</span>
                  </div>
                  <p className="signal-desc">A clearer picture of how someone actually works.</p>
                </div>

                <div className="proof-signal">
                  <div className="signal-header">
                    <span className="signal-dot"></span>
                    <span className="signal-title">Readiness, Not Just Credentials</span>
                  </div>
                  <p className="signal-desc">Talent evaluated for contribution, not just qualification.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
