import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const NODES_DATA = [
  {
    id: 'academia',
    title: 'ACADEMIA',
    desc: 'Origin of foundational knowledge.',
    posClass: 'cl-node--top',
    progressTarget: 0.0,
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 6 2 6 2s6 0 6-2v-5" />
      </svg>
    ),
  },
  {
    id: 'students',
    title: 'STUDENTS',
    desc: 'Generators of verifiable output.',
    posClass: 'cl-node--right',
    progressTarget: 0.2,
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'enterprise',
    title: 'ENTERPRISE',
    desc: 'Consumers of verified talent.',
    posClass: 'cl-node--bottom-right',
    progressTarget: 0.4,
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
      </svg>
    ),
  },
  {
    id: 'evidence',
    title: 'EVIDENCE',
    desc: 'Cryptographically secured artifacts.',
    posClass: 'cl-node--bottom-left',
    progressTarget: 0.6,
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: 'real-work',
    title: 'REAL WORK',
    desc: 'Projects, commits, and research.',
    posClass: 'cl-node--left',
    progressTarget: 0.8,
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

export default function ContinuousLoopSection() {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const activePathRef = useRef(null);

  useGSAP(() => {
    const section = containerRef.current;
    const activePath = activePathRef.current;
    if (!section || !activePath) return;

    const pathLength = activePath.getTotalLength();
    gsap.set(activePath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const eyebrow   = section.querySelector('.cl-eyebrow');
    const heading   = section.querySelector('.cl-heading');
    const antBoxCenter = section.querySelector('.cl-center-antbox');
    const nodeEls   = section.querySelectorAll('.cl-node-card');

    // Master Pinned ScrollTrigger Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: 'top top',
        end: '+=250%', // Pinned scroll duration for breathing room
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          // Animate single continuous active path
          const currentOffset = pathLength * (1 - p);
          gsap.set(activePath, { strokeDashoffset: currentOffset });

          // Check node activation as passing signal hits each progress target
          NODES_DATA.forEach((nodeData, idx) => {
            const nodeEl = nodeEls[idx];
            if (!nodeEl) return;

            // Activate node if scroll progress reaches or passes target
            if (p >= nodeData.progressTarget && p < nodeData.progressTarget + 0.22) {
              nodeEl.classList.add('cl-node--active');
            } else {
              nodeEl.classList.remove('cl-node--active');
            }
          });

          // Center AntBox pulse on loop completion
          if (antBoxCenter) {
            if (p > 0.15) {
              antBoxCenter.classList.add('cl-center--active');
            } else {
              antBoxCenter.classList.remove('cl-center--active');
            }
          }
        },
      },
    });

    // Phase 1: Intro Heading Reveal
    if (eyebrow) {
      tl.fromTo(eyebrow, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
    }
    if (heading) {
      tl.fromTo(heading, { opacity: 0, y: 25, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, '-=0.3');
    }

    // Phase 2: Center ANTBOX Core Appears
    if (antBoxCenter) {
      tl.fromTo(
        antBoxCenter,
        { scale: 0.82, opacity: 0, filter: 'blur(6px)', y: 20 },
        { scale: 1, opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.2'
      );
    }

    // Phase 3: Nodes Staggered Entrance
    if (nodeEls.length > 0) {
      tl.fromTo(
        nodeEls,
        { opacity: 0, scale: 0.88, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power2.out' },
        '-=0.4'
      );
    }

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="continuous-loop" aria-label="The Continuous Ecosystem Loop">
      <div className="cl-viewport">
        
        {/* Top Centered Editorial Heading */}
        <header className="cl-header">
          <p className="cl-eyebrow">02 // THE ECOSYSTEM</p>
          <h2 className="cl-heading">
            <span>THE CONTINUOUS</span>
            <span>LOOP</span>
          </h2>
        </header>

        {/* Circular Ecosystem Orbit Diagram Container */}
        <div className="cl-diagram-wrap">
          
          {/* EXACTLY ONE CONTINUOUS SVG PATH */}
          <svg className="cl-orbit-svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
            {/* Background Inactive Track */}
            <path
              ref={pathRef}
              d="M 500 90 A 210 210 0 1 1 499.99 90 Z"
              fill="none"
              stroke="rgba(124, 58, 237, 0.12)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Single Active Travelling Signal Stroke */}
            <path
              ref={activePathRef}
              d="M 500 90 A 210 210 0 1 1 499.99 90 Z"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Central ANTBOX Anchor Element */}
          <div className="cl-center-antbox">
            <div className="cl-center-inner">
              <span className="cl-center-logo">ANTBOX</span>
              <span className="cl-center-sub">CORE ENGINE</span>
            </div>
            <div className="cl-center-pulse-ring" />
          </div>

          {/* Five Ecosystem Node Cards */}
          {NODES_DATA.map((node) => (
            <div key={node.id} className={`cl-node-card ${node.posClass}`}>
              <div className="cl-node-icon">{node.icon}</div>
              <div className="cl-node-content">
                <h3 className="cl-node-title">{node.title}</h3>
                <p className="cl-node-desc">{node.desc}</p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
