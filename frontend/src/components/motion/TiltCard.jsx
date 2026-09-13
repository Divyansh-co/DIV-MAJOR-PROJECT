import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

/**
 * TiltCard — Institutional card container featuring:
 * - 3D parallax micro-tilt following cursor with spring physics
 * - Living gradient border tracking cursor along edges
 * - High-grade glassmorphism surface (#111B2E at 75-80% opacity, backdrop-blur)
 * - Restrained, elegant cybersecurity posture
 */
export default function TiltCard({
  children,
  className = "",
  glowColor = "cyan", // "cyan" | "emerald" | "risk" | "none"
  maxTilt = 6, // degrees
  dataCursor,
  onClick,
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });

  // Spring physics for buttery 60fps rotational tilt
  const rotateX = useSpring(0, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 22 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y, active: true });

    // Calculate normalized -1 to +1 range
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    // Apply restrained micro-tilt
    rotateY.set(normX * maxTilt);
    rotateX.set(-normY * maxTilt);
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, active: false }));
    rotateX.set(0);
    rotateY.set(0);
  };

  // Border glow tone based on prop
  let borderGlowRgb = "0, 229, 255";
  if (glowColor === "emerald") borderGlowRgb = "16, 185, 129";
  if (glowColor === "risk") borderGlowRgb = "239, 68, 68";

  return (
    <div
      style={{ perspective: 1000 }}
      className="relative rounded-2xl group"
      onClick={onClick}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        data-cursor={dataCursor}
        className={`relative rounded-2xl transition-shadow duration-300 ${
          mousePos.active ? "shadow-2xl" : "shadow-lg"
        } ${className}`}
      >
        {/* Living Border Gradient (tracks cursor position along the edge) */}
        <div
          className="absolute -inset-[1px] rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            opacity: mousePos.active ? 1 : 0.4,
            background: mousePos.active
              ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(${borderGlowRgb}, 0.55), rgba(${borderGlowRgb}, 0.1) 40%, #1E2A44 80%)`
              : "linear-gradient(135deg, #1E2A44 0%, #0F1C2E 100%)",
          }}
        />

        {/* Card Surface: #111B2E with 78% opacity + glassmorphism backdrop-blur */}
        <div className="relative rounded-2xl bg-[#111B2E]/80 backdrop-blur-xl border border-[#1E2A44]/60 p-6 overflow-hidden h-full">
          {/* Subtle cursor spotlight inside the card */}
          {mousePos.active && glowColor !== "none" && (
            <div
              className="absolute pointer-events-none rounded-full blur-2xl transition-opacity duration-300"
              style={{
                left: mousePos.x - 120,
                top: mousePos.y - 120,
                width: 240,
                height: 240,
                background: `radial-gradient(circle, rgba(${borderGlowRgb}, 0.08) 0%, transparent 70%)`,
              }}
            />
          )}

          {/* Children container with 3D depth */}
          <div style={{ transform: "translateZ(10px)" }} className="relative z-10">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
