import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";

/**
 * MagneticButton — Institutional CTA with:
 * - 40-60px magnetic pull toward cursor
 * - Proximity-driven glow intensification
 * - Hover scale 1.04 with rotating cyan->emerald border gradient
 * - Click ripple + tiny "blockchain node" particle burst from cursor
 */
export default function MagneticButton({
  children,
  onClick,
  disabled = false,
  variant = "primary", // "primary" | "secondary" | "danger"
  className = "",
  type = "button",
  dataCursor,
  id,
}) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [proximityGlow, setProximityGlow] = useState(0);
  const [burstParticles, setBurstParticles] = useState([]);
  const [ripples, setRipples] = useState([]);

  // Spring physics for restrained, organic magnetic movement
  const springX = useSpring(0, { stiffness: 220, damping: 20 });
  const springY = useSpring(0, { stiffness: 220, damping: 20 });

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.hypot(dx, dy);
      const RADIUS = 65; // 40-65px proximity zone

      if (distance < RADIUS) {
        // Magnetic pull toward cursor (max 10-12px displacement)
        const pull = (1 - distance / RADIUS) * 12;
        springX.set((dx / distance) * pull);
        springY.set((dy / distance) * pull);
        setProximityGlow(Math.min(1, (1 - distance / RADIUS) * 1.2));
      } else {
        springX.set(0);
        springY.set(0);
        setProximityGlow(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [disabled, springX, springY]);

  const handleClick = (e) => {
    if (disabled) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 1. Trigger ripple
    const rippleId = Date.now();
    setRipples((prev) => [...prev, { id: rippleId, x: clickX, y: clickY }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);

    // 2. Spawn 6-8 "blockchain node" particle burst
    const count = 7;
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const velocity = Math.random() * 28 + 18;
      newParticles.push({
        id: `${rippleId}-${i}`,
        x: clickX,
        y: clickY,
        tx: Math.cos(angle) * velocity,
        ty: Math.sin(angle) * velocity,
        isEmerald: i % 2 === 0,
      });
    }
    setBurstParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setBurstParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 500);

    if (onClick) onClick(e);
  };

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      className="relative inline-block select-none"
    >
      {/* Proximity Ambient Glow */}
      <div
        className="absolute -inset-1 rounded-xl blur-lg pointer-events-none transition-opacity duration-200"
        style={{
          background:
            variant === "danger"
              ? "radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0, 229, 255, 0.35) 0%, rgba(16, 185, 129, 0.25) 70%)",
          opacity: disabled ? 0 : Math.max(proximityGlow, isHovered ? 0.8 : 0),
        }}
      />

      <motion.button
        ref={buttonRef}
        id={id}
        type={type}
        disabled={disabled}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={disabled ? {} : { scale: 1.04 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        data-cursor={dataCursor || (variant === "danger" ? "risk" : "verified")}
        className={`relative overflow-hidden group rounded-xl px-5 py-2.5 font-medium text-sm tracking-wide transition-all duration-200 ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-slate-900/60 text-slate-500 border border-slate-800"
            : variant === "secondary"
            ? "bg-[#111B2E]/90 text-slate-200 hover:text-white border border-[#1E2A44] hover:border-cyan-500/40 shadow-sm"
            : variant === "danger"
            ? "bg-gradient-to-r from-amber-600 to-rose-600 text-white font-semibold border border-rose-500/40 shadow-lg"
            : "bg-[#0B1524] text-white font-semibold shadow-lg shadow-cyan-950/40"
        } ${className}`}
      >
        {/* Rotating Conic Border Gradient on Hover for Primary variant */}
        {variant === "primary" && !disabled && (
          <span className="absolute -inset-[2px] rounded-xl overflow-hidden pointer-events-none p-[1.5px]">
            <span
              className="absolute inset-[-100%] animate-rotate-border"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, #00E5FF 0%, #10B981 33%, #00E5FF 66%, #10B981 100%)",
              }}
            />
            {/* Inner fill mask */}
            <span className="absolute inset-[1.5px] rounded-[10px] bg-[#0A1424] -z-0" />
          </span>
        )}

        {/* Diagonal Cyan-to-Emerald overlay gradient */}
        {variant === "primary" && !disabled && (
          <span className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}

        {/* Content Container */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>

        {/* Click Ripples */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full pointer-events-none bg-cyan-400/30 animate-ping"
            style={{
              left: r.x - 15,
              top: r.y - 15,
              width: 30,
              height: 30,
              transformOrigin: "center",
            }}
          />
        ))}

        {/* Crystalline Blockchain Node Burst Particles */}
        {burstParticles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
            animate={{
              x: p.x + p.tx,
              y: p.y + p.ty,
              opacity: 0,
              scale: 0.2,
              rotate: 45,
            }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute pointer-events-none rounded-[1px]"
            style={{
              width: 5,
              height: 5,
              backgroundColor: p.isEmerald ? "#10B981" : "#00E5FF",
              boxShadow: `0 0 6px ${p.isEmerald ? "#10B981" : "#00E5FF"}`,
            }}
          />
        ))}
      </motion.button>
    </motion.div>
  );
}
