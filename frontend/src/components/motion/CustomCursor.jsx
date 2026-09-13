import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";

/**
 * CustomCursor — High-fidelity cursor with glowing ring & fading particle trail.
 * Context-aware:
 * - Default: Electric Cyan (#00E5FF)
 * - Verified / Blockchain Hover: Emerald (#10B981)
 * - Deepfake-Risk / Critical Hover: Amber to Coral (#F59E0B -> #EF4444)
 */
export default function CustomCursor() {
  const [cursorType, setCursorType] = useState("default"); // "default" | "verified" | "risk"
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState([]);
  const trailRef = useRef([]);

  // Spring physics for the trailing follower ring
  const springConfig = { stiffness: 450, damping: 28, mass: 0.5 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  useEffect(() => {
    // Only activate for pointer devices (mouse), avoid mobile touch conflicts
    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let lastTime = 0;

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      cursorX.set(x);
      cursorY.set(y);
      if (!isVisible) setIsVisible(true);

      // Add a fading particle trail point throttled to ~40fps for high smoothness
      const now = performance.now();
      if (now - lastTime > 24) {
        lastTime = now;
        const newPoint = {
          id: Math.random(),
          x,
          y,
          createdAt: now,
        };
        trailRef.current = [newPoint, ...trailRef.current.slice(0, 10)];
        setTrail([...trailRef.current]);
      }

      // Check context under cursor
      const target = e.target.closest("[data-cursor]");
      if (target) {
        const val = target.getAttribute("data-cursor");
        if (val === "risk" || val === "critical") {
          setCursorType("risk");
        } else if (val === "verified" || val === "chain") {
          setCursorType("verified");
        } else {
          setCursorType("default");
        }
      } else {
        setCursorType("default");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      trailRef.current = [];
      setTrail([]);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Fade out trail points over time
    const interval = setInterval(() => {
      const now = performance.now();
      const filtered = trailRef.current.filter((p) => now - p.createdAt < 300);
      if (filtered.length !== trailRef.current.length) {
        trailRef.current = filtered;
        setTrail([...filtered]);
      }
    }, 50);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      clearInterval(interval);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  // Contextual color variables
  let mainColor = "rgb(0, 229, 255)";
  let glowColor = "rgba(0, 229, 255, 0.45)";
  let dotColor = "#00E5FF";

  if (cursorType === "verified") {
    mainColor = "rgb(16, 185, 129)";
    glowColor = "rgba(16, 185, 129, 0.5)";
    dotColor = "#10B981";
  } else if (cursorType === "risk") {
    mainColor = "rgb(245, 158, 11)";
    glowColor = "rgba(239, 68, 68, 0.55)";
    dotColor = "#EF4444";
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Fading Particle Trail */}
      {trail.map((p, idx) => {
        const age = (performance.now() - p.createdAt) / 300;
        const opacity = Math.max(0, 1 - age) * 0.45;
        const scale = Math.max(0.2, 1 - age * 0.8);
        return (
          <div
            key={p.id}
            className="fixed rounded-full pointer-events-none"
            style={{
              left: p.x - 3,
              top: p.y - 3,
              width: 6,
              height: 6,
              transform: `scale(${scale})`,
              backgroundColor: dotColor,
              opacity: opacity,
              boxShadow: `0 0 8px ${glowColor}`,
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
          />
        );
      })}

      {/* Outer Follower Ring */}
      <motion.div
        className="fixed rounded-full pointer-events-none border border-current"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          width: 32,
          height: 32,
          borderColor: mainColor,
          boxShadow: `0 0 16px ${glowColor}`,
          opacity: 0.85,
        }}
      />

      {/* Tiny Precision Center Dot */}
      <motion.div
        className="fixed rounded-full pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          width: 5,
          height: 5,
          backgroundColor: dotColor,
          boxShadow: `0 0 6px ${glowColor}`,
        }}
      />
    </div>
  );
}
