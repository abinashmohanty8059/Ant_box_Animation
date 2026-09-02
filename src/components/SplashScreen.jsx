import { useEffect, useRef } from 'react';
import splashVideo from '../assets/splash_screen.mp4';

export default function SplashScreen({ onComplete }) {
  const overlayRef = useRef(null);

  const handleEnded = () => {
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  useEffect(() => {
    // Safety fallback timer if video fails to trigger onEnded on some browsers
    const timer = setTimeout(() => {
      handleEnded();
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={overlayRef}
      className="splash-overlay"
      aria-label="AntBox Brand Splash Intro"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <video
        className="splash-video"
        src={splashVideo}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
}
