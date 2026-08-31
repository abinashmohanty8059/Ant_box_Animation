import { useEffect, useRef, useState } from 'react';

const STUDENTS = [
  {
    id: 1,
    initials: 'PS',
    name: 'Priya Sharma',
    role: 'B.Tech Computer Science · 3rd Year',
    badge: 'Active Sprint',
    score: 88,
    skills: [
      { name: 'System Design', value: 92 },
      { name: 'Problem Solving', value: 85 },
      { name: 'Communication', value: 78 }
    ],
    avatarBg: null,
    scoreColor: null
  },
  {
    id: 2,
    initials: 'RM',
    name: 'Rohan Mehta',
    role: 'B.Des UX/UI Design · 3rd Year',
    badge: 'Validated',
    badgeStyle: { color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.15)' },
    score: 91,
    skills: [
      { name: 'User Research', value: 88, color: '#10b981' },
      { name: 'Interaction Design', value: 95, color: '#10b981' },
      { name: 'Prototyping', value: 90, color: '#10b981' }
    ],
    avatarBg: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    scoreColor: '#10b981'
  },
  {
    id: 3,
    initials: 'AG',
    name: 'Anjali Gupta',
    role: 'M.S. Data Science · 2nd Year',
    badge: 'Active Sprint',
    badgeStyle: { color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.15)' },
    score: 85,
    skills: [
      { name: 'Machine Learning', value: 89, color: '#f59e0b' },
      { name: 'Statistical Modeling', value: 82, color: '#f59e0b' },
      { name: 'Data Visualization', value: 84, color: '#f59e0b' }
    ],
    avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    scoreColor: '#f59e0b'
  },
  {
    id: 4,
    initials: 'KV',
    name: 'Kabir Verma',
    role: 'B.Tech Info Technology · 4th Year',
    badge: 'Hire Ready',
    badgeStyle: { color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.15)' },
    score: 93,
    skills: [
      { name: 'Software Engineering', value: 96, color: '#3b82f6' },
      { name: 'Cloud Architectures', value: 90, color: '#3b82f6' },
      { name: 'Team Collaboration', value: 92, color: '#3b82f6' }
    ],
    avatarBg: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    scoreColor: '#3b82f6'
  }
];

export default function StudentProfiles() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STUDENTS.length);
    }, 3000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Local Scroll Reveal Observer for Student Section
    const revealEls = container.querySelectorAll('.reveal-left, .reveal-right');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
          setTimeout(() => el.classList.add('visible'), delay);
          revealObs.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObs.observe(el));

    // 2. Start Automatic Deck Rotation
    if (!isPaused) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      revealObs.disconnect();
      stopTimer();
    };
  }, [isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleDotClick = (idx) => {
    setActiveIndex(idx);
    if (!isPaused) {
      startTimer();
    }
  };

  const getPositionClass = (idx) => {
    const pos = (idx - activeIndex + STUDENTS.length) % STUDENTS.length;
    if (pos === 0) return 'pos-1 active';
    if (pos === 1) return 'pos-2';
    if (pos === 2) return 'pos-3';
    return 'pos-4';
  };

  const isHighlighted = (panelId) => {
    if (panelId === 'panel-real-world') {
      return activeIndex === 0 || activeIndex === 3;
    }
    if (panelId === 'panel-performance') {
      return activeIndex === 1;
    }
    if (panelId === 'panel-career') {
      return activeIndex === 2;
    }
    return false;
  };

  return (
    <section ref={containerRef} id="students" aria-label="For Students">
      <div className="container">
        <div className="two-col">

          {/* Left: Stacked Card Experience */}
          <div className="reveal-left students-dash">
            <p className="section-eyebrow">Student Profiles</p>
            <h2 className="section-headline">
              Showcase your<br /><em className="accent-italic">readiness.</em>
            </h2>
            
            <div 
              className="student-card-deck" 
              id="studentDeck"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {STUDENTS.map((student, idx) => {
                const isActive = activeIndex === idx;
                const posClass = getPositionClass(idx);

                return (
                  <div key={student.id} className={`deck-card ${posClass}`} data-card={student.id}>
                    {/* Header */}
                    <div className="dash-header">
                      <div className="dash-user">
                        <div 
                          className="dash-avatar" 
                          style={student.avatarBg ? { background: student.avatarBg } : {}}
                        >
                          {student.initials}
                        </div>
                        <div>
                          <div className="dash-name">{student.name}</div>
                          <div className="dash-role">{student.role}</div>
                        </div>
                      </div>
                      <div className="dash-badge" style={student.badgeStyle || {}}>{student.badge}</div>
                    </div>

                    {/* Content: Readiness Score */}
                    <div className="score-card">
                      <div>
                        <div className="score-label">Overall Readiness Score</div>
                        <div className="score-number" style={student.scoreColor ? { color: student.scoreColor } : {}}>
                          {student.score}%
                        </div>
                      </div>
                      <svg className="score-ring" viewBox="0 0 36 36">
                        <circle className="ring-track" cx="18" cy="18" r="15.9155" />
                        <circle 
                          className="ring-fill" 
                          cx="18" 
                          cy="18" 
                          r="15.9155" 
                          style={{
                            stroke: student.scoreColor || 'var(--purple)',
                            strokeDasharray: `${student.score} 100`
                          }} 
                        />
                      </svg>
                    </div>

                    {/* Skills */}
                    <div className="skill-list">
                      {student.skills.map((skill, sIdx) => (
                        <div key={sIdx} className="skill-item">
                          <div className="skill-row">
                            <span className="skill-name">{skill.name}</span>
                            <span className="skill-pct">{skill.value}%</span>
                          </div>
                          <div className="skill-bar">
                            <div 
                              className="skill-bar-fill" 
                              style={{ 
                                backgroundColor: skill.color || 'var(--purple)',
                                width: isActive ? `${skill.value}%` : '0%'
                              }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Counter below the deck */}
            <div className="deck-pagination-container">
              <div className="deck-dots" id="deckDots">
                {STUDENTS.map((_, idx) => (
                  <span 
                    key={idx}
                    className={`deck-dot ${idx === activeIndex ? 'active' : ''}`}
                    data-index={idx + 1}
                    onClick={() => handleDotClick(idx)}
                  />
                ))}
              </div>
              <div className="deck-counter">
                <span id="deckCurrent">0{activeIndex + 1}</span> / <span id="deckTotal">0{STUDENTS.length}</span>
              </div>
            </div>

          </div>

          {/* Right: Content Panels (No emojis) */}
          <div className="reveal-right students-content">
            <p className="section-eyebrow">For Students</p>
            <h2 className="section-headline">
              Own your<br /><em className="accent-italic">career story.</em>
            </h2>

            <div className="students-info-panels">

              {/* Panel 1: Real-World Experience */}
              <div className={`info-panel ${isHighlighted('panel-real-world') ? 'highlighted' : ''}`} id="panel-real-world">
                <div className="info-panel-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor"
                      d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                  </svg>
                </div>
                <div className="info-panel-content">
                  <h3 className="info-panel-title">Real-World Experience</h3>
                  <p className="info-panel-body">Work that goes beyond the classroom. Students contribute to meaningful briefs
                    and practical challenges designed around how real teams actually work.</p>
                </div>
              </div>

              {/* Panel 2: Performance Validation */}
              <div className={`info-panel ${isHighlighted('panel-performance') ? 'highlighted' : ''}`} id="panel-performance">
                <div className="info-panel-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div className="info-panel-content">
                  <h3 className="info-panel-title">Performance Validation</h3>
                  <p className="info-panel-body">Signals built from demonstrated work. Readiness is informed by execution,
                    problem-solving, collaboration, and the quality of actual output—not just credentials.</p>
                </div>
              </div>

              {/* Panel 3: Career Readiness */}
              <div className={`info-panel ${isHighlighted('panel-career') ? 'highlighted' : ''}`} id="panel-career">
                <div className="info-panel-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor"
                      d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
                  </svg>
                </div>
                <div className="info-panel-content">
                  <h3 className="info-panel-title">Career Readiness</h3>
                  <p className="info-panel-body">Evidence that moves careers forward. Validated experience and proof of work
                    create stronger signals for opportunities and meaningful conversations with employers.</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
