import React, { useEffect, useRef } from "react";

/**
 * AmbientCanvas — Obsidian Dark Purple Cosmos with Ember Pink & Emerald White
 * High-performance HTML5 canvas animation layer:
 * - Obsidian Dark Purple cosmic background depth
 * - Radiant Ember Pink (AI intuition) & Emerald White (cryptographic integrity) nodes
 * - Silky dual-tone gradient constellation connections
 * - Periodic soft harmonic consensus shockwaves
 * - Adaptive node scaling (fluid 60fps on both desktop and mobile)
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
      radius: isMobile ? 110 : 180,
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
      const count = isMobile ? 16 : Math.min(52, Math.max(30, Math.floor((width * height) / 26000)));

      for (let i = 0; i < count; i++) {
        // Distribute between Ember Pink (~55%) and Emerald White (~45%)
        const isEmber = Math.random() < 0.55;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (isMobile ? 0.22 : 0.38),
          vy: (Math.random() - 0.5) * (isMobile ? 0.22 : 0.38),
          baseRadius: isMobile ? 1.3 : Math.random() * 1.8 + 1.2,
          radius: 1.5,
          alpha: Math.random() * 0.45 + 0.35,
          // Ember Pink (244, 63, 94) vs Emerald White (236, 253, 245 / 52, 211, 153)
          color: isEmber ? "244, 63, 94" : "236, 253, 245",
          glowColor: isEmber ? "251, 113, 133" : "52, 211, 153",
          isEmber,
          highlight: 0,
        });
      }
    }

    initNodes();

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Deep Obsidian Purple Atmospheric Radial Wash
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        40,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, "rgba(28, 13, 56, 0.45)");
      bgGrad.addColorStop(0.5, "rgba(16, 7, 33, 0.25)");
      bgGrad.addColorStop(1, "rgba(6, 2, 12, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Periodic Neural Consensus Wave Pulses (Alternating Ember Pink & Emerald White)
      const waveInterval = isMobile ? 11000 : 7500;
      if (time - lastWaveTime > waveInterval) {
        lastWaveTime = time;
        const isEmberWave = Math.random() > 0.4;
        waves.push({
          x: width * 0.5 + (Math.random() - 0.5) * (width * 0.35),
          y: height * 0.45 + (Math.random() - 0.5) * (height * 0.3),
          radius: 10,
          maxRadius: Math.max(width, height) * 0.85,
          alpha: 0.32,
          color: isEmberWave ? "244, 63, 94" : "52, 211, 153",
          speed: isMobile ? 1.5 : 1.9,
        });
      }

      // Draw Expanding Waves
      for (let w = waves.length - 1; w >= 0; w--) {
        const wave = waves[w];
        wave.radius += wave.speed;
        wave.alpha = Math.max(0, 0.32 * (1 - wave.radius / wave.maxRadius));

        if (wave.radius >= wave.maxRadius || wave.alpha <= 0.008) {
          waves.splice(w, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${wave.color}, ${wave.alpha * 0.75})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Update Node Physics
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
            const force = (1 - dist / mouse.radius) * 0.018;
            n.vx += (dx / dist) * force;
            n.vy += (dy / dist) * force;
            n.highlight = Math.min(1, n.highlight + 0.09);
          } else {
            n.highlight = Math.max(0, n.highlight - 0.02);
          }
        } else {
          n.highlight = Math.max(0, n.highlight - 0.02);
        }

        const currentSpeed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (currentSpeed > 0.85) {
          n.vx = (n.vx / currentSpeed) * 0.85;
          n.vy = (n.vy / currentSpeed) * 0.85;
        }
      }

      // Constellation Lines (Desktop only for 60fps)
      if (!isMobile) {
        const MAX_DIST = 118;
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MAX_DIST) {
              const proximityAlpha = (1 - dist / MAX_DIST) * 0.18;
              const extraAlpha = Math.max(a.highlight, b.highlight) * 0.32;
              const totalAlpha = proximityAlpha + extraAlpha;

              // Dual-tone gradient stroke between nodes
              const lineGrad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
              lineGrad.addColorStop(0, `rgba(${a.color}, ${totalAlpha})`);
              lineGrad.addColorStop(1, `rgba(${b.color}, ${totalAlpha})`);

              ctx.strokeStyle = lineGrad;
              ctx.lineWidth = 0.75;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }

        // Draw Interactive Line to Cursor
        if (mouse.isActive) {
          for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            const dx = n.x - mouse.x;
            const dy = n.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius * 0.85) {
              const lineAlpha = (1 - dist / (mouse.radius * 0.85)) * 0.3;
              ctx.strokeStyle = `rgba(${n.color}, ${lineAlpha})`;
              ctx.lineWidth = 0.9;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
            }
          }
        }
      }

      // Render Individual Nodes with Ambient Halos
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const currentAlpha = Math.min(1, n.alpha + n.highlight * 0.55);
        const radius = n.baseRadius + n.highlight * 1.3;

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color}, ${currentAlpha})`;
        ctx.fill();

        // Glowing outer halo
        if (n.highlight > 0.08) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${n.glowColor}, ${n.highlight * 0.22})`;
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
      className="fixed inset-0 pointer-events-none z-0 opacity-85"
      style={{ willChange: "transform" }}
    />
  );
}
