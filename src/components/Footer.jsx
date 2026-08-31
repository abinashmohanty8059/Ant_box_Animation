import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const section = containerRef.current;
    if (!section) return;

    const brandStrip = section.querySelector('#brandFooterStrip');
    const partAnt = section.querySelector('.part-ant');
    const partBox = section.querySelector('.part-box');

    if (brandStrip && partAnt && partBox) {
      const getStartTranslation = () => {
        return window.innerWidth < 768 ? '22vw' : '35vw';
      };

      // Set initial states
      gsap.set(partAnt, { x: () => `-${getStartTranslation()}` });
      gsap.set(partBox, { x: () => getStartTranslation() });

      // Animate ANT left-to-center
      gsap.to(partAnt, {
        x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: brandStrip,
          start: 'top bottom', // when strip top enters viewport bottom
          end: 'bottom bottom', // when strip bottom meets viewport bottom
          scrub: 1
        }
      });

      // Animate BOX right-to-center
      gsap.to(partBox, {
        x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: brandStrip,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1
        }
      });
    }
  }, { scope: containerRef });

  return (
    <footer ref={containerRef} id="footer" aria-label="Site footer">
      <div className="container">

        <div className="footer-inner">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/assets/namedlogo.png" alt="AntBox" />
            </div>
            <p className="footer-tagline">
              Future-proof talent infrastructure. Bridging campuses and
              corporations through validated skill ecosystems.
            </p>
            <div className="footer-socials" aria-label="Social links">
              <a href="#" className="social-btn" aria-label="LinkedIn">in</a>
              <a href="#" className="social-btn" aria-label="Twitter">𝕏</a>
              <a href="#" className="social-btn" aria-label="Email">✉</a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="footer-col-title">Platform</p>
            <ul className="footer-links" role="list">
              <li><a href="#students">For Students</a></li>
              <li><a href="#corporates">For Enterprises</a></li>
              <li><a href="#journey">Campus Journey</a></li>
              <li><a href="#why">Why AntBox</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="footer-col-title">Company</p>
            <ul className="footer-links" role="list">
              <li><a href="#">About</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 AntBox. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>

      </div>

      {/* Full-width animated brand footer */}
      <div className="brand-footer-strip" id="brandFooterStrip" aria-hidden="true">
        <div className="brand-footer-wordmark">
          <span className="wordmark-part part-ant">ANT</span>
          <span className="wordmark-part part-box">BOX</span>
        </div>
      </div>
    </footer>
  );
}
