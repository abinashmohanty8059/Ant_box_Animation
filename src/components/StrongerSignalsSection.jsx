import { useRef } from 'react';
import ScrollReveal from './ui/ScrollReveal';
import ImageStreamHero from './ui/ImageStreamHero';

export default function StrongerSignalsSection() {
  const containerRef = useRef(null);

  return (
    <section ref={containerRef} id="stronger-signals" aria-label="Companies Need Stronger Signals">
      
      {/* 3D Perspective Image Corridor Background */}
      <div className="ss-image-corridor">
        <ImageStreamHero speed={16} cardCount={12} />
      </div>

      {/* Center Readability Vignette Layer */}
      <div className="ss-center-readability" />

      {/* Foreground Centered Editorial Typography */}
      <div className="ss-content">
        <h2 className="ss-statement">
          <ScrollReveal
            baseOpacity={0.15}
            enableBlur={true}
            baseRotation={1}
            blurStrength={3}
            wordAnimationEnd="bottom 45%"
          >
            {"Companies don't need\nmore resumes. They need"}
          </ScrollReveal>
          <br />
          <span className="ss-purple-italic">
            <ScrollReveal
              baseOpacity={0.15}
              enableBlur={true}
              baseRotation={1}
              blurStrength={3}
              wordAnimationEnd="bottom 42%"
            >
              stronger signals.
            </ScrollReveal>
          </span>
        </h2>
      </div>

    </section>
  );
}
