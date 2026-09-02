import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsMarquee from './components/StatsMarquee';
import ImageMorphPage from './pages/ImageMorphPage';
import JourneyBoxExperience from './components/JourneyBoxExperience';
import ProofOfWorkSection from './components/ProofOfWorkSection';
import TalentProfileSection from './components/TalentProfileSection';
import StrongerSignalsSection from './components/StrongerSignalsSection';
import ContinuousLoopSection from './components/ContinuousLoopSection';
import HoverSignalsSection from './components/HoverSignalsSection';
import TalentStories from './components/TalentStories';
import StudentProfiles from './components/StudentProfiles';
import Enterprises from './components/Enterprises';
import MaskedHeading from './components/MaskedHeading';
import BounceCards from './components/BounceCards';
import FinalCTA from './components/FinalCTA';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';

export default function App() {
  const [splashComplete, setSplashComplete] = useState(false);

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
  }, []);

  useEffect(() => {
    if (!splashComplete) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
  }, [splashComplete]);

  return (
    <>
      {!splashComplete && (
        <SplashScreen onComplete={() => setSplashComplete(true)} />
      )}
      <Navbar />
      <Hero />
      <StatsMarquee />
      <JourneyBoxExperience />
      <ProofOfWorkSection />
      <TalentProfileSection />
      <StrongerSignalsSection />
      <ContinuousLoopSection />
      <ImageMorphPage />
      <HoverSignalsSection />
      <TalentStories />
      <StudentProfiles />
      <Enterprises />
      <MaskedHeading />
      <BounceCards />
      <FinalCTA />
      <ImageMorphPage />
      <ChatWidget />
      <Footer />
    </>
  );
}
