import { useEffect, useRef, useState } from 'react';

export default function TrueFocus({
  sentence = 'Thinking outside the box',
  manualMode = false,
  blurAmount = 5,
  borderColor = '#7C3AED',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className = '',
  style = {},
}) {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const wordRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (manualMode) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    const activeWord = wordRefs.current[currentIndex];
    const container = containerRef.current;
    if (activeWord && container) {
      const rect = activeWord.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();

      setFocusRect({
        x: rect.left - parentRect.left,
        y: rect.top - parentRect.top,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [currentIndex, words]);

  return (
    <div
      ref={containerRef}
      className={`true-focus-container ${className}`}
      style={{ position: 'relative', display: 'inline-block', ...style }}
    >
      {/* Animated Purple Corner Bracket Frame */}
      <div
        className="true-focus-box"
        style={{
          position: 'absolute',
          left: `${focusRect.x}px`,
          top: `${focusRect.y}px`,
          width: `${focusRect.width}px`,
          height: `${focusRect.height}px`,
          transition: `all ${animationDuration}s cubic-bezier(0.25, 1, 0.5, 1)`,
          pointerEvents: 'none',
          boxSizing: 'border-box',
          zIndex: 2,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            width: '10px',
            height: '10px',
            borderTop: `2px solid ${borderColor}`,
            borderLeft: `2px solid ${borderColor}`,
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '10px',
            height: '10px',
            borderTop: `2px solid ${borderColor}`,
            borderRight: `2px solid ${borderColor}`,
          }}
        />
        <span
          style={{
            position: 'absolute',
            bottom: '-5px',
            left: '-5px',
            width: '10px',
            height: '10px',
            borderBottom: `2px solid ${borderColor}`,
            borderLeft: `2px solid ${borderColor}`,
          }}
        />
        <span
          style={{
            position: 'absolute',
            bottom: '-5px',
            right: '-5px',
            width: '10px',
            height: '10px',
            borderBottom: `2px solid ${borderColor}`,
            borderRight: `2px solid ${borderColor}`,
          }}
        />
      </div>

      {/* Words */}
      <div className="true-focus-words" style={{ display: 'inline-flex', gap: '0.45em', alignItems: 'center' }}>
        {words.map((word, idx) => {
          const isFocused = idx === currentIndex;
          return (
            <span
              key={idx}
              ref={(el) => (wordRefs.current[idx] = el)}
              className={`true-focus-word ${isFocused ? 'is-focused' : ''}`}
              style={{
                display: 'inline-block',
                filter: isFocused ? 'blur(0px)' : `blur(${blurAmount}px)`,
                opacity: isFocused ? 1 : 0.4,
                transition: `filter ${animationDuration}s ease, opacity ${animationDuration}s ease`,
                fontFamily: 'inherit',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                color: 'inherit',
                cursor: manualMode ? 'pointer' : 'default',
              }}
              onClick={() => manualMode && setCurrentIndex(idx)}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
}
