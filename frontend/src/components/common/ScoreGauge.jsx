import React from "react";
import { motion } from "framer-motion";

/**
 * ScoreGauge — Precision SVG radial gauge for 0-1000 Trust Score.
 * Includes animated arc, institutional grade badges, and soft backglow.
 */
export default function ScoreGauge({ score = 0, size = 180 }) {
  const normalizedScore = Math.min(1000, Math.max(0, Number(score) || 0));
  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Use a 270-degree arc for instrument feel
  const arcLength = circumference * 0.75;
  const progress = (normalizedScore / 1000) * arcLength;

  let color = "#00E5FF";
  let glowColor = "rgba(0, 229, 255, 0.4)";
  let grade = "STANDARD CONFIDENCE";

  if (normalizedScore >= 850) {
    color = "#10B981";
    glowColor = "rgba(16, 185, 129, 0.45)";
    grade = "INSTITUTIONAL GRADE AAA";
  } else if (normalizedScore >= 650) {
    color = "#00E5FF";
    glowColor = "rgba(0, 229, 255, 0.45)";
    grade = "STANDARD CONFIDENCE";
  } else if (normalizedScore >= 400) {
    color = "#F59E0B";
    glowColor = "rgba(245, 158, 11, 0.45)";
    grade = "ELEVATED RISK LEVEL";
  } else {
    color = "#EF4444";
    glowColor = "rgba(239, 68, 68, 0.5)";
    grade = "CRITICAL FRAUD DETECTED";
  }

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 180 180"
          className="transform -rotate-135 origin-center"
        >
          {/* Background Track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="#1E2A44"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <motion.circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={arcLength}
            animate={{ strokeDashoffset: arcLength - progress }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-white"
          >
            {normalizedScore}
          </motion.span>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
            / 1000 TRUST
          </span>
        </div>
      </div>

      {/* Grade Label */}
      <div className="mt-1 text-center">
        <span
          className="inline-block text-[10px] font-mono font-semibold tracking-wider px-2.5 py-0.5 rounded-full border"
          style={{
            borderColor: `${color}40`,
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          {grade}
        </span>
      </div>
    </div>
  );
}
