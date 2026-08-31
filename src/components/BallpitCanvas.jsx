import { useEffect, useRef } from 'react';

export default function BallpitCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const hero = canvas.parentElement;
    if (!hero) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    /* ── Configuration ───────────────────────────────────────── */
    const COUNT = 100;
    const GRAVITY = 0.01;   /* Acceleration downward */
    const FRICTION = 0.9975;  /* Decay factor */
    const WALL_BOUNCE = 0.95;   /* Energy retention on walls */
    const BALL_BOUNCE = 0.85;   /* Coefficient of restitution between balls */
    const REPEL_R = 160;    /* Mouse repel radius */
    const REPEL_F = 0.95;   /* Mouse repel force */

    /* ── State ───────────────────────────────────────────────── */
    let balls = [];
    let width = 0;
    let height = 0;
    let mouseX = -9999;
    let mouseY = -9999;

    const ballThemes = [
      { start: '#c084fc', end: '#7c3aed', shadow: '#5b21b6' }, /* Purple Theme */
      { start: '#f472b6', end: '#db2777', shadow: '#9d174d' }, /* Pink/Accent Theme */
      { start: '#a78bfa', end: '#8b5cf6', shadow: '#6d28d9' }, /* Violet Theme */
      { start: '#ffffff', end: '#d4d4d8', shadow: '#a1a1aa' }, /* Neutral White */
      { start: '#e4e4e7', end: '#a1a1aa', shadow: '#71717a' }  /* Neutral Gray */
    ];

    function resize() {
      width = hero.offsetWidth;
      height = hero.offsetHeight;

      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* Keep balls inside the resized boundary */
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        b.x = Math.max(b.r, Math.min(width - b.r, b.x));
        b.y = Math.max(b.r, Math.min(height - b.r, b.y));
      }
    }

    function createBalls() {
      const minR = width < 600 ? 8 : 12;
      const maxR = width < 600 ? 16 : 24;

      balls = [];
      for (let i = 0; i < COUNT; i++) {
        const r = minR + Math.random() * (maxR - minR);
        const theme = ballThemes[Math.floor(Math.random() * ballThemes.length)];

        balls.push({
          x: r + Math.random() * (width - r * 2),
          y: r + Math.random() * (height - r * 5), /* spawn in upper half */
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 2,
          r: r,
          mass: r * r, /* Mass proportional to circle area */
          theme: theme
        });
      }
    }

    function updatePhysics() {
      let i, j, b;

      /* 1. Apply gravity, friction, drag, and move */
      for (i = 0; i < COUNT; i++) {
        b = balls[i];
        b.vy += GRAVITY;
        b.vx *= FRICTION;
        b.vy *= FRICTION;
        b.x += b.vx;
        b.y += b.vy;

        /* Boundary check & bounce */
        if (b.x - b.r < 0) {
          b.x = b.r;
          b.vx = -b.vx * WALL_BOUNCE;
        } else if (b.x + b.r > width) {
          b.x = width - b.r;
          b.vx = -b.vx * WALL_BOUNCE;
        }

        if (b.y - b.r < 0) {
          b.y = b.r;
          b.vy = -b.vy * WALL_BOUNCE;
        } else if (b.y + b.r > height) {
          b.y = height - b.r;
          b.vy = -b.vy * WALL_BOUNCE;
          /* Extra friction when sliding on the floor */
          b.vx *= 0.98;
        }

        /* Mouse Repulsion */
        const dx = b.x - mouseX;
        const dy = b.y - mouseY;
        const distSq = dx * dx + dy * dy;
        if (distSq < REPEL_R * REPEL_R && distSq > 0.1) {
          const dist = Math.sqrt(distSq);
          const force = (REPEL_R - dist) / REPEL_R * REPEL_F;
          b.vx += (dx / dist) * force;
          b.vy += (dy / dist) * force;
        }
      }

      /* 2. Resolve Ball-to-Ball Collisions */
      for (i = 0; i < COUNT; i++) {
        const a = balls[i];
        for (j = i + 1; j < COUNT; j++) {
          const b2 = balls[j];
          const cdx = b2.x - a.x;
          const cdy = b2.y - a.y;
          const cDistSq = cdx * cdx + cdy * cdy;
          const minDist = a.r + b2.r;

          if (cDistSq < minDist * minDist) {
            const cDist = Math.sqrt(cDistSq);
            if (cDist === 0) continue;

            const overlap = minDist - cDist;
            const nx = cdx / cDist;
            const ny = cdy / cDist;

            /* Positional correction (resolve overlapping) */
            const totalMass = a.mass + b2.mass;
            a.x -= nx * overlap * (b2.mass / totalMass);
            a.y -= ny * overlap * (b2.mass / totalMass);
            b2.x += nx * overlap * (a.mass / totalMass);
            b2.y += ny * overlap * (a.mass / totalMass);

            /* Dynamic momentum resolution (impulse model) */
            const rvx = a.vx - b2.vx;
            const rvy = a.vy - b2.vy;
            const velAlongNormal = rvx * nx + rvy * ny;

            if (velAlongNormal > 0) { /* Moving toward each other */
              const impulse = (1 + BALL_BOUNCE) * velAlongNormal / (1 / a.mass + 1 / b2.mass);
              a.vx -= (impulse / a.mass) * nx;
              a.vy -= (impulse / a.mass) * ny;
              b2.vx += (impulse / b2.mass) * nx;
              b2.vy += (impulse / b2.mass) * ny;
            }
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < COUNT; i++) {
        const b = balls[i];

        /* Radial gradient for 3D sphere highlight */
        const grad = ctx.createRadialGradient(
          b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.05,
          b.x, b.y, b.r
        );
        grad.addColorStop(0, b.theme.start);
        grad.addColorStop(0.7, b.theme.end);
        grad.addColorStop(1, b.theme.shadow);

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    let animationFrameId = null;
    let isLooping = false;

    function loop() {
      if (!isLooping) return;
      updatePhysics();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    }

    function handleMouseMove(e) {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }

    function handleMouseLeave() {
      mouseX = -9999;
      mouseY = -9999;
    }

    function handleTouchMove(e) {
      if (e.touches.length > 0) {
        const rect = hero.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
      }
    }

    function handleTouchEnd() {
      mouseX = -9999;
      mouseY = -9999;
    }

    let rTimer;
    function handleResize() {
      clearTimeout(rTimer);
      rTimer = setTimeout(() => {
        resize();
      }, 150);
    }

    // Set initial canvas dimension and draw balls
    resize();
    createBalls();

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        if (!isLooping) {
          isLooping = true;
          animationFrameId = requestAnimationFrame(loop);
        }
      } else {
        isLooping = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    }, { threshold: 0.05 });

    observer.observe(hero);

    // Bind event listeners
    hero.addEventListener('mousemove', handleMouseMove, { passive: true });
    hero.addEventListener('mouseleave', handleMouseLeave);
    hero.addEventListener('touchmove', handleTouchMove, { passive: true });
    hero.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', handleResize, { passive: true });

    // Clean up
    return () => {
      observer.disconnect();
      isLooping = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
      hero.removeEventListener('touchmove', handleTouchMove);
      hero.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      clearTimeout(rTimer);
    };
  }, []);

  return (
    <canvas ref={canvasRef} id="ballpitCanvas" aria-hidden="true"></canvas>
  );
}
