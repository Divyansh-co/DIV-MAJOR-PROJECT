import React from "react";
import { motion } from "framer-motion";

/**
 * ScoreGauge — Precision SVG radial gauge for 0-1000 Trust Score.
 * Includes animated arc, contextual verdict-grade harmonization, and soft backglow.
 */
export default function ScoreGauge({ score = 0, verdict = "VERIFIED", size = 180 }) {
  const normalizedScore = Math.min(1000, Math.max(0, Number(score) || 0));
  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Use a 270-degree arc for instrument feel
  const arcLength = circumference * 0.75;
  const progress = (normalizedScore / 1000) * arcLength;

  // Harmonized Color & Grade Logic based on both Score and Consensus Verdict
  let color = "#34d399";
  let glowColor = "rgba(52, 211, 153, 0.45)";
  let grade = "STANDARD PASS • VERIFIED";

  if (verdict === "VERIFIED") {
    if (normalizedScore >= 850) {
      color = "#34d399";
      glowColor = "rgba(52, 211, 153, 0.5)";
      grade = "INSTITUTIONAL GRADE AAA • VERIFIED";
    } else {
      color = "#10b981";
      glowColor = "rgba(16, 185, 129, 0.45)";
      grade = "STANDARD PASS • VERIFIED";
    }
  } else if (verdict === "FLAGGED") {
    color = "#f59e0b";
    glowColor = "rgba(245, 158, 11, 0.5)";
    if (normalizedScore >= 850) {
      grade = "TRUST SCORE: AAA — FLAGGED FOR MANDATORY SECONDARY REVIEW";
    } else if (normalizedScore >= 650) {
      grade = "MODERATE SCORE — FLAGGED FOR SECONDARY REVIEW";
    } else {
      grade = "ELEVATED RISK — FLAGGED FOR FORENSIC REVIEW";
    }
  } else if (verdict === "REJECTED") {
    color = "#f43f5e";
    glowColor = "rgba(244, 63, 94, 0.55)";
    if (normalizedScore >= 800) {
      grade = "SCORE VOIDED — FRAUD OVERRIDE REJECTED";
    } else if (normalizedScore >= 400) {
      grade = "HIGH SYNTHETIC RISK — VERIFICATION REJECTED";
    } else {
      grade = "CRITICAL FRAUD DETECTED — VERIFICATION REJECTED";
    }
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

          {/* Active Progress Arc */}
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
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 10px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold font-mono tracking-tight text-white"
          >
            {normalizedScore}
          </motion.span>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 -mt-1 uppercase">
            / 1000
          </span>
          <span
            className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full mt-1.5 border"
            style={{
              backgroundColor: `${color}18`,
              borderColor: `${color}44`,
              color: color,
            }}
          >
            {verdict}
          </span>
        </div>
      </div>

      {/* Grade Label */}
      <div className="mt-2 text-center max-w-[240px]">
        <span
          className="text-[10px] font-mono font-bold tracking-wider uppercase inline-block leading-tight px-2 py-1 rounded bg-black/40 border"
          style={{
            color: color,
            borderColor: `${color}33`,
          }}
        >
          {grade}
        </span>
      </div>
    </div>
  );
}
