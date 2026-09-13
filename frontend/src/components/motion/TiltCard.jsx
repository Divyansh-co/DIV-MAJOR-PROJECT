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

  // Border glow tone based on prop (Default: Hot Pink #ff2a6d)
  let borderGlowRgb = "255, 42, 109";
  if (glowColor === "emerald") borderGlowRgb = "52, 211, 153";
  if (glowColor === "white" || glowColor === "emeraldWhite") borderGlowRgb = "236, 253, 245";
  if (glowColor === "risk") borderGlowRgb = "255, 42, 109";

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
          mousePos.active ? "shadow-2xl shadow-[#ff2a6d]/20" : "shadow-lg"
        } ${className}`}
      >
        {/* Living Border Gradient (tracks cursor position along the edge) */}
        <div
          className="absolute -inset-[1px] rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            opacity: mousePos.active ? 1 : 0.45,
            background: mousePos.active
              ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(${borderGlowRgb}, 0.5), rgba(${borderGlowRgb}, 0.12) 40%, #20162b 80%)`
              : "linear-gradient(135deg, #251a33 0%, #130d1c 100%)",
          }}
        />

        {/* Card Surface: Pitch Onyx/Obsidian (#0d0a14) with 90% opacity + glassmorphism backdrop-blur */}
        <div className="relative rounded-2xl bg-[#0d0a14]/90 backdrop-blur-xl border border-[#241a30]/80 p-6 overflow-hidden h-full">
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
