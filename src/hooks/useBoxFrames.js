/**
 * useBoxFrames — shared 100-frame box animation hook
 *
 * Options:
 *   onAllLoaded   — called once when all frames have loaded
 *   maxFraction   — cap canvas width to (viewportWidth * maxFraction). Default 1.0 (full).
 *                   Use 0.65 for JourneyBoxExperience so the box doesn't swamp the timeline.
 */

import { useRef, useEffect } from 'react';

const TOTAL_FRAMES = 100;
const FRAME_DIR = '/frames/';

function pad3(n) { return String(n).padStart(3, '0'); }

// ── Module-level singleton frame cache ───────────────────────────────────────
const _frameCache = new Array(TOTAL_FRAMES).fill(null);
let _cacheLoaded = 0;
let _cacheReady = false;
const _cacheCallbacks = new Set();

function notifyCacheListeners() {
  _cacheCallbacks.forEach(cb => cb(_cacheLoaded));
}

function preloadFrameCache(onProgress) {
  if (typeof onProgress === 'function') {
    _cacheCallbacks.add(onProgress);
    onProgress(_cacheLoaded);
  }
  if (_cacheReady) {
    if (typeof onProgress === 'function') onProgress(TOTAL_FRAMES);
    return;
  }
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    if (_frameCache[i] && _frameCache[i].naturalWidth > 0) continue;
    let img = _frameCache[i];
    if (!img) { img = new Image(); _frameCache[i] = img; }
    if (img.src) continue;
    const handleLoad = () => {
      _cacheLoaded = _frameCache.filter(f => f && f.complete && f.naturalWidth > 0).length;
      if (_cacheLoaded >= TOTAL_FRAMES) _cacheReady = true;
      notifyCacheListeners();
    };
    img.onload = handleLoad;
    img.onerror = handleLoad;
    img.src = FRAME_DIR + pad3(i + 1) + '.png';
  }
  _cacheLoaded = _frameCache.filter(f => f && f.complete && f.naturalWidth > 0).length;
  if (_cacheLoaded >= TOTAL_FRAMES) { _cacheReady = true; notifyCacheListeners(); }
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useBoxFrames({ onAllLoaded, maxFraction = 1.0, zoomFactor = 1.0 } = {}) {
  const canvasRef = useRef(null);
  const loaderRef = useRef(null);
  const loaderBarRef = useRef(null);
  const dprRef = useRef(Math.min(window.devicePixelRatio || 1, 2));
  const frameWRef = useRef(0);
  const frameHRef = useRef(0);
  const currentIdxRef = useRef(0);
  const maxFractionRef = useRef(maxFraction);
  const zoomFactorRef = useRef(zoomFactor);

  useEffect(() => {
    maxFractionRef.current = maxFraction;
    zoomFactorRef.current = zoomFactor;
  }, [maxFraction, zoomFactor]);

  function resizeCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!frameWRef.current || !frameHRef.current) {
      const first = _frameCache.find(img => img && img.naturalWidth > 0);
      if (!first) return;
      frameWRef.current = first.naturalWidth;
      frameHRef.current = first.naturalHeight;
    }
    const dpr = dprRef.current;
    const aspect = frameWRef.current / frameHRef.current;
    // Cap width to maxFraction of viewport width
    const maxVw = window.innerWidth * maxFractionRef.current;
    const vh = window.innerHeight;
    let w, h;
    if (maxVw / vh > aspect) { h = vh; w = h * aspect; }
    else { w = maxVw; h = w / aspect; }
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFrameByIndex(currentIdxRef.current);
  }

  function drawFrameByIndex(index) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = _frameCache[index];
    if (!img || !img.complete || !img.naturalWidth) return;
    const dpr = dprRef.current;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    
    const zoom = zoomFactorRef.current;
    if (zoom <= 1.0) {
      ctx.drawImage(img, 0, 0, w, h);
    } else {
      const dw = w * zoom;
      const dh = h * zoom;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    }
    currentIdxRef.current = index;
  }

  function getFrameIndex(progress) {
    const raw = Math.round(progress * (TOTAL_FRAMES - 1));
    return raw < 0 ? 0 : raw > TOTAL_FRAMES - 1 ? TOTAL_FRAMES - 1 : raw;
  }

  function drawFrameAtProgress(progress) {
    const idx = getFrameIndex(Math.max(0, Math.min(1, progress)));
    drawFrameByIndex(idx);
  }

  useEffect(() => {
    let mounted = true;

    function handleCacheProgress(loaded) {
      if (!mounted) return;
      const loaderBar = loaderBarRef.current;
      if (loaderBar) loaderBar.style.width = ((loaded / TOTAL_FRAMES) * 100) + '%';
      if (loaded >= TOTAL_FRAMES) {
        const first = _frameCache.find(img => img && img.naturalWidth > 0);
        if (first && !frameWRef.current) {
          frameWRef.current = first.naturalWidth;
          frameHRef.current = first.naturalHeight;
        }
        resizeCanvas();
        drawFrameByIndex(currentIdxRef.current);
        const loader = loaderRef.current;
        if (loader) setTimeout(() => { if (mounted && loader) loader.classList.add('hidden'); }, 300);
        if (typeof onAllLoaded === 'function') onAllLoaded();
      } else {
        const first = _frameCache.find(img => img && img.naturalWidth > 0);
        if (first && !frameWRef.current) {
          frameWRef.current = first.naturalWidth;
          frameHRef.current = first.naturalHeight;
          resizeCanvas();
          drawFrameByIndex(0);
        }
      }
    }

    preloadFrameCache(handleCacheProgress);

    let resizeTimer;
    const handleResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resizeCanvas, 120); };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      mounted = false;
      _cacheCallbacks.delete(handleCacheProgress);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { canvasRef, loaderRef, loaderBarRef, drawFrameAtProgress, resizeCanvas };
}
