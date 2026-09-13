import React, { useEffect, useRef } from "react";

/**
 * AmbientCanvas — High-performance HTML5 canvas layer.
 * Adaptively scales for mobile devices:
 * - Desktop: 40-48 nodes with constellation lines, gentle cursor attraction, and periodic waves
 * - Mobile (<768px): 12-16 nodes with lightweight drift, zero constellation overhead for 60fps
 */
export default function AmbientCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isMobile = width < 768;

    // Mouse coordinates
    const mouse = {
      x: -1000,
      y: -1000,
      radius: isMobile ? 100 : 160,
      isActive: false,
    };

    const handleMouseMove = (e) => {
      if (isMobile) return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.isActive = false;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      isMobile = width < 768;
      initNodes();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    let nodes = [];
    let waves = [];
    let lastWaveTime = performance.now();

    function initNodes() {
      nodes = [];
      const count = isMobile ? 14 : Math.min(48, Math.max(26, Math.floor((width * height) / 28000)));

      for (let i = 0; i < count; i++) {
        const isEmerald = Math.random() > 0.72;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.35),
          vy: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.35),
          baseRadius: isMobile ? 1.2 : Math.random() * 1.6 + 1.2,
          radius: 1.5,
          alpha: Math.random() * 0.4 + 0.3,
          color: isEmerald ? "16, 185, 129" : "0, 229, 255",
          highlight: 0,
        });
      }
    }

    initNodes();

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Trigger periodic neural consensus waves (less frequent on mobile)
      const waveInterval = isMobile ? 12000 : 8500;
      if (time - lastWaveTime > waveInterval) {
        lastWaveTime = time;
        waves.push({
          x: width * 0.5 + (Math.random() - 0.5) * (width * 0.3),
          y: height * 0.4 + (Math.random() - 0.5) * (height * 0.25),
          radius: 10,
          maxRadius: Math.max(width, height) * 0.8,
          alpha: 0.28,
          speed: isMobile ? 1.4 : 1.8,
        });
      }

      // Draw pulse waves
      for (let w = waves.length - 1; w >= 0; w--) {
        const wave = waves[w];
        wave.radius += wave.speed;
        wave.alpha = Math.max(0, 0.28 * (1 - wave.radius / wave.maxRadius));

        if (wave.radius >= wave.maxRadius || wave.alpha <= 0.01) {
          waves.splice(w, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 229, 255, ${wave.alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        if (!isMobile && mouse.isActive) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 1) {
            const force = (1 - dist / mouse.radius) * 0.015;
            n.vx += (dx / dist) * force;
            n.vy += (dy / dist) * force;
            n.highlight = Math.min(1, n.highlight + 0.08);
          } else {
            n.highlight = Math.max(0, n.highlight - 0.02);
          }
        } else {
          n.highlight = Math.max(0, n.highlight - 0.02);
        }

        const currentSpeed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (currentSpeed > 0.8) {
          n.vx = (n.vx / currentSpeed) * 0.8;
          n.vy = (n.vy / currentSpeed) * 0.8;
        }
      }

      // Constellation connections (Desktop only to prevent mobile lag)
      if (!isMobile) {
        ctx.lineWidth = 0.65;
        const MAX_DIST = 110;
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MAX_DIST) {
              const proximityAlpha = (1 - dist / MAX_DIST) * 0.16;
              const extraAlpha = Math.max(a.highlight, b.highlight) * 0.28;
              ctx.strokeStyle = `rgba(0, 229, 255, ${proximityAlpha + extraAlpha})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }

        // Draw line to cursor if near
        if (mouse.isActive) {
          for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            const dx = n.x - mouse.x;
            const dy = n.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius * 0.8) {
              const lineAlpha = (1 - dist / (mouse.radius * 0.8)) * 0.25;
              ctx.strokeStyle = `rgba(0, 229, 255, ${lineAlpha})`;
              ctx.lineWidth = 0.75;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
            }
          }
        }
      }

      // Render individual nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const currentAlpha = Math.min(1, n.alpha + n.highlight * 0.6);
        const radius = n.baseRadius + n.highlight * 1.2;

        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color}, ${currentAlpha})`;
        ctx.fill();

        if (n.highlight > 0.1) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${n.color}, ${n.highlight * 0.18})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ willChange: "transform" }}
    />
  );
}
