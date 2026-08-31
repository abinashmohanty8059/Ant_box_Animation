import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function BounceCards() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const section = containerRef.current;
    if (!section) return;

    const wrap = section.querySelector('.bounceCardsScrollWrap');
    if (!wrap) return;

    const cards = wrap.querySelectorAll('.card');
    const rotations = [-4, 3, -2, 4, -3, 2, -4, 3, -3, 4, -2, 3];

    // 1. Staggered Entrance Animation
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 85%', /* Trigger stagger entrance before pinning */
        once: true
      }
    })
      .fromTo(cards,
        {
          scale: 0.1,
          rotation: 0,
          y: 80,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotation: (i) => rotations[i] || 0,
          duration: 1.2,
          delay: 0.1,
          stagger: 0.15,
          ease: 'elastic.out(1, 0.6)'
        }
      );

    // 2. Horizontal Scroll Pinning
    gsap.to(wrap, {
      x: () => -(wrap.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 0.8,
        start: 'top top',
        end: () => '+=' + (wrap.scrollWidth - window.innerWidth),
        invalidateOnRefresh: true
      }
    });

    // 3. Hover interactions
    cards.forEach((card, idx) => {
      const initialRot = rotations[idx] || 0;

      const handleMouseEnter = () => {
        gsap.to(card, {
          scale: 1.08,
          rotation: 0, /* Straighten on hover */
          y: -25,      /* Float up slightly */
          zIndex: 10,
          duration: 0.35,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          scale: 1,
          rotation: initialRot,
          y: 0,
          zIndex: 1,
          duration: 0.35,
          ease: 'power2.out'
        });
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      // Attach cleaners directly to node for easy retrieval
      card._enterClean = handleMouseEnter;
      card._leaveClean = handleMouseLeave;
    });

    return () => {
      // Clean up manually registered listeners
      cards.forEach((card) => {
        if (card._enterClean) card.removeEventListener('mouseenter', card._enterClean);
        if (card._leaveClean) card.removeEventListener('mouseleave', card._leaveClean);
      });
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="bounce-cards-section" aria-label="AntBox interactive gallery">
      <div className="bounceCardsScrollWrap">
        <div className="card" style={{ transform: 'scale(0)' }}>
          <img className="image" src="/assets/stock_images/01 — The Colony.png" alt="The Colony" />
          <div className="card-title-overlay">The Colony</div>
        </div>
        <div className="card" style={{ transform: 'scale(0)' }}>
          <img className="image" src="/assets/stock_images/02 — From Campus to Corporate.png" alt="From Campus to Corporate" />
          <div className="card-title-overlay">From Campus to Corporate</div>
        </div>
        <div className="card" style={{ transform: 'scale(0)' }}>
          <img className="image" src="/assets/stock_images/03 — Career Sprint.png" alt="Career Sprint" />
          <div className="card-title-overlay">Career Sprint</div>
        </div>
        <div className="card" style={{ transform: 'scale(0)' }}>
          <img className="image" src="/assets/stock_images/04 — Proof of Work.png" alt="Proof of Work" />
          <div className="card-title-overlay">Proof of Work</div>
        </div>
        <div className="card" style={{ transform: 'scale(0)' }}>
          <img className="image" src="/assets/stock_images/05 — Talent Readiness Engine.png" alt="Talent Readiness Engine" />
          <div className="card-title-overlay">Talent Readiness Engine</div>
        </div>
        <div className="card" style={{ transform: 'scale(0)' }}>
          <img className="image" src="/assets/stock_images/06 — Build Your Tribe.png" alt="Build Your Tribe" />
          <div className="card-title-overlay">Build Your Tribe</div>
        </div>
        <div className="card" style={{ transform: 'scale(0)' }}>
          <img className="image" src="/assets/stock_images/07 — Real Work, Real Impact.png" alt="Real Work, Real Impact" />
          <div className="card-title-overlay">Real Work, Real Impact</div>
        </div>
        <div className="card" style={{ transform: 'scale(0)' }}>
          <img className="image" src="/assets/stock_images/08 — The Opportunity.png" alt="The Opportunity" />
          <div className="card-title-overlay">The Opportunity</div>
        </div>
        <div className="card" style={{ transform: 'scale(0)' }}>
          <img className="image" src="/assets/stock_images/09 — Built on Ownership.png" alt="Built on Ownership" />
          <div className="card-title-overlay">Built on Ownership</div>
        </div>
        <div className="card" style={{ transform: 'scale(0)' }}>
          <img className="image" src="/assets/stock_images/10 — Campus Energy.png" alt="Campus Energy" />
          <div className="card-title-overlay">Campus Energy</div>
        </div>
        <div className="card" style={{ transform: 'scale(0)' }}>
          <img className="image" src="/assets/stock_images/11 — Ant of Giving.png" alt="Ant of Giving" />
          <div className="card-title-overlay">Ant of Giving</div>
        </div>
        <div className="card" style={{ transform: 'scale(0)' }}>
          <img className="image" src="/assets/stock_images/12 — Future-Proof Talent.png" alt="Future-Proof Talent" />
          <div className="card-title-overlay">Future-Proof Talent</div>
        </div>
      </div>
    </section>
  );
}
