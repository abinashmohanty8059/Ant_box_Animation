import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsMarquee from './components/StatsMarquee';
import JourneyPipeline from './components/JourneyPipeline';
import TalentStories from './components/TalentStories';
import StudentProfiles from './components/StudentProfiles';
import Enterprises from './components/Enterprises';
import WhyAntBox from './components/WhyAntBox';
import MaskedHeading from './components/MaskedHeading';
import BounceCards from './components/BounceCards';
import FinalCTA from './components/FinalCTA';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import ImageMorphPage from './pages/ImageMorphPage';

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    // Initialize Lenis Smooth Scroll globally for the active viewport
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), /* Ease out expo */
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05
    });

    window.lenis = lenis;

    // Connect ScrollTrigger to Lenis scroll events
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Custom requestAnimationFrame loop for Lenis
    let rafId;
    function scrollLoop(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(scrollLoop);
    }
    rafId = requestAnimationFrame(scrollLoop);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
    };
  }, [path]); // Re-run when path changes to sync layout heights and ScrollTriggers

  if (path === '/image-morph') {
    return <ImageMorphPage />;
  }

  return (
    <>
      <Navbar />
      <Hero />
      <StatsMarquee />
      <JourneyPipeline />
      <TalentStories />
      <StudentProfiles />
      <Enterprises />
      <WhyAntBox />
      <MaskedHeading />
      <BounceCards />
      <FinalCTA />
      <ChatWidget />
      <Footer />

      {import.meta.env.DEV && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 99999,
          background: 'rgba(124, 58, 237, 0.95)',
          borderRadius: '9999px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.25)',
          backdropFilter: 'blur(8px)',
        }}>
          <a href="/image-morph" style={{
            display: 'block',
            padding: '10px 20px',
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif'
          }}>
            IMAGE MORPH DEMO →
          </a>
        </div>
      )}
    </>
  );
}
