import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  wordAnimationEnd = 'bottom 40%',
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);

  // Parse string content into words and line breaks
  const wordsData = useMemo(() => {
    if (typeof children !== 'string') {
      return [];
    }
    return children.split(/(\s+)/).map((segment, index) => {
      const isSpace = /^\s+$/.test(segment);
      const hasNewline = segment.includes('\n');
      return {
        id: index,
        text: segment,
        isSpace,
        hasNewline,
      };
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Accessibility check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const wordEls = el.querySelectorAll('.scroll-reveal-word');
    if (wordEls.length === 0) return;

    // Scoped GSAP Context — ONLY cleans up ScrollTriggers created by THIS component
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: wordAnimationEnd,
          scrub: 0.8,
        },
      });

      wordEls.forEach((word) => {
        tl.fromTo(
          word,
          {
            opacity: baseOpacity,
            filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
            rotate: baseRotation,
            transformOrigin: 'left center',
          },
          {
            opacity: 1,
            filter: enableBlur ? 'blur(0px)' : 'none',
            rotate: 0,
            duration: 1,
            ease: 'power2.out',
          },
          0
        );
      });
    }, containerRef);

    // CLEANUP: Only revert this context, NEVER call global ScrollTrigger.kill()!
    return () => {
      ctx.revert();
    };
  }, [enableBlur, baseOpacity, baseRotation, blurStrength, wordAnimationEnd]);

  if (typeof children !== 'string') {
    return <div className={`scroll-reveal ${className}`} style={style}>{children}</div>;
  }

  return (
    <span
      ref={containerRef}
      className={`scroll-reveal ${className}`}
      style={{
        display: 'inline-block',
        ...style,
      }}
    >
      {wordsData.map((item) => {
        if (item.hasNewline) {
          return <br key={item.id} />;
        }
        if (item.isSpace) {
          return ' ';
        }
        return (
          <span
            key={item.id}
            className="scroll-reveal-word"
            style={{
              display: 'inline-block',
              willChange: 'opacity, filter, transform',
            }}
          >
            {item.text}
          </span>
        );
      })}
    </span>
  );
}
