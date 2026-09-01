import { useMemo } from 'react';

const DEFAULT_IMAGES = [
  '/assets/stock_images/01 — The Colony.png',
  '/assets/stock_images/02 — From Campus to Corporate.png',
  '/assets/stock_images/03 — Career Sprint.png',
  '/assets/stock_images/04 — Proof of Work.png',
  '/assets/stock_images/05 — Talent Readiness Engine.png',
  '/assets/stock_images/06 — Build Your Tribe.png',
  '/assets/stock_images/07 — Real Work, Real Impact.png',
  '/assets/stock_images/08 — The Opportunity.png',
  '/assets/stock_images/09 — Built on Ownership.png',
  '/assets/stock_images/10 — Campus Energy.png',
  '/assets/stock_images/11 — Ant of Giving.png',
  '/assets/stock_images/12 — Future-Proof Talent.png',
];

export default function ImageStreamHero({
  images = DEFAULT_IMAGES,
  speed = 16,
  cardCount = 10,
}) {
  // Generate left and right rail cards with staggered negative delays
  const { leftRail, rightRail } = useMemo(() => {
    const half = Math.floor(cardCount / 2);
    const step = speed / half;

    const left = Array.from({ length: half }, (_, i) => ({
      id: `l-${i}`,
      img: images[i % images.length],
      delay: -i * step,
    }));

    const right = Array.from({ length: half }, (_, i) => ({
      id: `r-${i}`,
      img: images[(i + half) % images.length],
      delay: -i * step - step * 0.5, // offset right rail slightly
    }));

    return { leftRail: left, rightRail: right };
  }, [images, speed, cardCount]);

  return (
    <div className="image-stream-hero" aria-hidden="true">
      <div className="stream-viewport">
        {/* Left Perspective Rail */}
        <div className="stream-rail stream-rail--left">
          {leftRail.map((card) => (
            <div
              key={card.id}
              className="stream-card"
              style={{
                animationDuration: `${speed}s`,
                animationDelay: `${card.delay}s`,
              }}
            >
              <img src={card.img} alt="" className="stream-img" loading="lazy" />
            </div>
          ))}
        </div>

        {/* Right Perspective Rail */}
        <div className="stream-rail stream-rail--right">
          {rightRail.map((card) => (
            <div
              key={card.id}
              className="stream-card"
              style={{
                animationDuration: `${speed}s`,
                animationDelay: `${card.delay}s`,
              }}
            >
              <img src={card.img} alt="" className="stream-img" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
