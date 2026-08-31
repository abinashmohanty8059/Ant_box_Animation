import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function TalentStories() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const section = containerRef.current;
    if (!section) return;

    const pinnedWrapper = section.querySelector('.stories-pinned-wrapper');
    const introInner = section.querySelector('.intro-inner');
    const revealPanel = section.querySelector('.stories-reveal-panel');

    if (pinnedWrapper && introInner && revealPanel) {
      // Create ScrollTrigger Timeline for the Reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%', // pin briefly for the duration of the reveal
          pin: pinnedWrapper,
          pinSpacing: true,
          scrub: 1, // smooth scroll scrub
          anticipatePin: 1,
        }
      });

      // Animate the intro heading up slightly (y: -30px max) and reduce opacity
      tl.to(introInner, {
        y: -30,
        opacity: 0.15,
        ease: 'power3.inOut',
        duration: 1
      }, 0);

      // Expand the black reveal panel from the bottom using clip-path (duration 1.2)
      tl.to(revealPanel, {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'power3.inOut',
        duration: 1.2
      }, 0);
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="talent-stories" aria-label="AntBox Talent Stories">
      <div className="stories-pinned-wrapper">
        {/* Pinned Intro Heading */}
        <div className="stories-intro">
          <div className="container intro-inner">
            <div className="intro-left">
              <p className="section-eyebrow text-purple">THE COLONY</p>
            </div>
            <div className="intro-center">
              <h2 className="stories-headline">
                Where <em className="accent-italic text-purple">talent</em><br />
                meets opportunity.
              </h2>
              <p className="stories-subheadline">
                Real experiences. Meaningful connections. Proof of potential.
              </p>
            </div>
          </div>
        </div>

        {/* Expanding Black Surface mask (curtain reveal) */}
        <div className="stories-reveal-panel"></div>
      </div>

      {/* The Actual Gallery Content (positioned below the pinning stage) */}
      <div className="stories-gallery-content">
        <div className="container">
          <div className="gallery-grid">

            {/* Card 01 */}
            <div className="gallery-card">
              <div className="card-image-wrap">
                <img src="/assets/stock_images/01 — The Colony.png" alt="01 — The Colony" loading="lazy" />
              </div>
              <div className="card-meta">
                <div className="card-meta-left">
                  <span className="card-num">01</span>
                  <h4 className="card-title">The Colony</h4>
                </div>
                <span className="card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M5 19L19 5v12h2V3H9v2h12L5 19z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 02 */}
            <div className="gallery-card">
              <div className="card-image-wrap">
                <img src="/assets/stock_images/02 — From Campus to Corporate.png" alt="02 — From Campus to Corporate"
                  loading="lazy" />
              </div>
              <div className="card-meta">
                <div className="card-meta-left">
                  <span className="card-num">02</span>
                  <h4 className="card-title">From Campus to Corporate</h4>
                </div>
                <span className="card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M5 19L19 5v12h2V3H9v2h12L5 19z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 03 */}
            <div className="gallery-card">
              <div className="card-image-wrap">
                <img src="/assets/stock_images/03 — Career Sprint.png" alt="03 — Career Sprint" loading="lazy" />
              </div>
              <div className="card-meta">
                <div className="card-meta-left">
                  <span className="card-num">03</span>
                  <h4 className="card-title">Career Sprint</h4>
                </div>
                <span className="card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M5 19L19 5v12h2V3H9v2h12L5 19z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 04 */}
            <div className="gallery-card">
              <div className="card-image-wrap">
                <img src="/assets/stock_images/04 — Proof of Work.png" alt="04 — Proof of Work" loading="lazy" />
              </div>
              <div className="card-meta">
                <div className="card-meta-left">
                  <span className="card-num">04</span>
                  <h4 className="card-title">Proof of Work</h4>
                </div>
                <span className="card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M5 19L19 5v12h2V3H9v2h12L5 19z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 05 */}
            <div className="gallery-card">
              <div className="card-image-wrap">
                <img src="/assets/stock_images/05 — Talent Readiness Engine.png" alt="05 — Talent Readiness Engine"
                  loading="lazy" />
              </div>
              <div className="card-meta">
                <div className="card-meta-left">
                  <span className="card-num">05</span>
                  <h4 className="card-title">Talent Readiness Engine</h4>
                </div>
                <span className="card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M5 19L19 5v12h2V3H9v2h12L5 19z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 06 */}
            <div className="gallery-card">
              <div className="card-image-wrap">
                <img src="/assets/stock_images/06 — Build Your Tribe.png" alt="06 — Build Your Tribe" loading="lazy" />
              </div>
              <div className="card-meta">
                <div className="card-meta-left">
                  <span className="card-num">06</span>
                  <h4 className="card-title">Build Your Tribe</h4>
                </div>
                <span className="card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M5 19L19 5v12h2V3H9v2h12L5 19z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 07 */}
            <div className="gallery-card">
              <div className="card-image-wrap">
                <img src="/assets/stock_images/07 — Real Work, Real Impact.png" alt="07 — Real Work, Real Impact"
                  loading="lazy" />
              </div>
              <div className="card-meta">
                <div className="card-meta-left">
                  <span className="card-num">07</span>
                  <h4 className="card-title">Real Work, Real Impact</h4>
                </div>
                <span className="card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M5 19L19 5v12h2V3H9v2h12L5 19z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 08 */}
            <div className="gallery-card">
              <div className="card-image-wrap">
                <img src="/assets/stock_images/08 — The Opportunity.png" alt="08 — The Opportunity" loading="lazy" />
              </div>
              <div className="card-meta">
                <div className="card-meta-left">
                  <span className="card-num">08</span>
                  <h4 className="card-title">The Opportunity</h4>
                </div>
                <span className="card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M5 19L19 5v12h2V3H9v2h12L5 19z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 09 */}
            <div className="gallery-card">
              <div className="card-image-wrap">
                <img src="/assets/stock_images/09 — Built on Ownership.png" alt="09 — Built on Ownership" loading="lazy" />
              </div>
              <div className="card-meta">
                <div className="card-meta-left">
                  <span className="card-num">09</span>
                  <h4 className="card-title">Built on Ownership</h4>
                </div>
                <span className="card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M5 19L19 5v12h2V3H9v2h12L5 19z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 10 */}
            <div className="gallery-card">
              <div className="card-image-wrap">
                <img src="/assets/stock_images/10 — Campus Energy.png" alt="10 — Campus Energy" loading="lazy" />
              </div>
              <div className="card-meta">
                <div className="card-meta-left">
                  <span className="card-num">10</span>
                  <h4 className="card-title">Campus Energy</h4>
                </div>
                <span className="card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M5 19L19 5v12h2V3H9v2h12L5 19z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 11 */}
            <div className="gallery-card">
              <div className="card-image-wrap">
                <img src="/assets/stock_images/11 — Ant of Giving.png" alt="11 — Ant of Giving" loading="lazy" />
              </div>
              <div className="card-meta">
                <div className="card-meta-left">
                  <span className="card-num">11</span>
                  <h4 className="card-title">Ant of Giving</h4>
                </div>
                <span className="card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M5 19L19 5v12h2V3H9v2h12L5 19z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 12 */}
            <div className="gallery-card">
              <div className="card-image-wrap">
                <img src="/assets/stock_images/12 — Future-Proof Talent.png" alt="12 — Future-Proof Talent"
                  loading="lazy" />
              </div>
              <div className="card-meta">
                <div className="card-meta-left">
                  <span className="card-num">12</span>
                  <h4 className="card-title">Future-Proof Talent</h4>
                </div>
                <span className="card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M5 19L19 5v12h2V3H9v2h12L5 19z" />
                  </svg>
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
