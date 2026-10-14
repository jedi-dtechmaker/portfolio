import React, { useRef, useEffect, useCallback, useState } from 'react';

/**
 * InteractiveAvatar
 * Samples the user's custom Jedi avatar image (/jedi-hero.jpg) into high-performance
 * particles that dissolve and swirl when touched or hovered, and spring back into place.
 */
export default function InteractiveAvatar({ imageSrc = '/jedi-hero.jpg' }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animFrameRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Initialize particles from sampled pixels of the user's avatar image
  useEffect(() => {
    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      if (isCancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const size = 280;
      canvas.width = size;
      canvas.height = size;

      // Offscreen canvas to sample image pixels
      const offCanvas = document.createElement('canvas');
      offCanvas.width = size;
      offCanvas.height = size;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      // Draw avatar image onto offscreen canvas
      offCtx.drawImage(img, 0, 0, size, size);
      const imgData = offCtx.getImageData(0, 0, size, size);
      const pixels = imgData.data;

      const particles = [];
      const step = 4; // grid density: 70x70 = 4900 particles

      const centerX = size / 2;
      const centerY = size / 2;

      for (let y = 0; y < size; y += step) {
        for (let x = 0; x < size; x += step) {
          const index = (y * size + x) * 4;
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const a = pixels[index + 3];

          // Skip completely transparent pixels if any
          if (a > 15) {
            // Initial scatter animation fly-in
            const angle = Math.atan2(y - centerY, x - centerX);
            const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) + (Math.random() * 220 + 70);
            const spreadAngle = angle + (Math.random() - 0.5) * 1.4;

            particles.push({
              baseX: x,
              baseY: y,
              x: centerX + Math.cos(spreadAngle) * dist,
              y: centerY + Math.sin(spreadAngle) * dist,
              color: `rgb(${r},${g},${b})`,
              size: step * 0.98,
              density: Math.random() * 14 + 6
            });
          }
        }
      }

      particlesRef.current = particles;
      setLoaded(true);
    };

    img.onerror = (err) => {
      console.error('Failed to load avatar image in InteractiveAvatar', err);
    };

    return () => {
      isCancelled = true;
    };
  }, [imageSrc]);

  // Main animation physics loop
  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const isMobile = window.innerWidth <= 768;
      const radius = isMobile ? 70 : 55;
      const radiusSq = radius * radius;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;

        // Disperse / dissolve when mouse or touch gets near
        if (distSq < radiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const dirX = dx / dist;
          const dirY = dy / dist;
          const force = (radius - dist) / radius;

          // Dissolve push with natural drag and tangential swirl
          const swirlX = dirY;
          const swirlY = -dirX;
          const pushX = (dirX + swirlX * 1.5) * force * p.density * 2.0;
          const pushY = (dirY + swirlY * 1.5) * force * p.density * 2.0;

          p.x -= pushX;
          p.y -= pushY;
        } else {
          // Smooth spring return to original position
          const ease = p.density * 0.85;
          const homeDx = p.x - p.baseX;
          const homeDy = p.y - p.baseY;

          if (Math.abs(homeDx) < 0.35) {
            p.x = p.baseX;
          } else {
            p.x -= homeDx / ease;
          }

          if (Math.abs(homeDy) < 0.35) {
            p.y = p.baseY;
          } else {
            p.y -= homeDy / ease;
          }
        }

        // Draw particle
        const isDisplaced = (p.x - p.baseX) ** 2 + (p.y - p.baseY) ** 2 > 3;
        ctx.fillStyle = isDisplaced ? '#c084fc' : p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [loaded]);

  // Coordinate mapper from event to canvas dimensions
  const updateCoords = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    mouseRef.current.x = (clientX - rect.left) * scaleX;
    mouseRef.current.y = (clientY - rect.top) * scaleY;
  }, []);

  const handleMouseMove = useCallback((e) => {
    updateCoords(e.clientX, e.clientY);
  }, [updateCoords]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches && e.touches.length > 0) {
      updateCoords(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [updateCoords]);

  const handleTouchStart = useCallback((e) => {
    if (e.touches && e.touches.length > 0) {
      updateCoords(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [updateCoords]);

  // Tap ripple explosion trigger
  const handleTapExplode = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    if (!clientX || !clientY) return;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const tapX = (clientX - rect.left) * scaleX;
    const tapY = (clientY - rect.top) * scaleY;

    // Burst particles around tap
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dx = p.x - tapX;
      const dy = p.y - tapY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110 && dist > 0) {
        const force = (110 - dist) / 110;
        p.x += (dx / dist) * force * 35;
        p.y += (dy / dist) * force * 35;
      }
    }
  }, []);

  return (
    <div className="interactive-avatar-container">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseLeave}
        onTouchCancel={handleMouseLeave}
        onClick={handleTapExplode}
        className="interactive-avatar-canvas"
        title="Touch or hover over me to dissolve particles!"
      />
      {!loaded && (
        <div className="avatar-loading-placeholder">
          <span className="cursor-blink">// initializing neural particles...</span>
        </div>
      )}
    </div>
  );
}
