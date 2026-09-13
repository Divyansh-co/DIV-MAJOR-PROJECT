import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, AlertTriangle, XCircle, Clock, Loader2 } from "lucide-react";

/**
 * StatusBadge — Institutional status pill with morphing icon,
 * soft glow pulse, and spring animation.
 */
export default function StatusBadge({ status = "PENDING", size = "md", className = "" }) {
  const normalized = (status || "PENDING").toUpperCase();

  let config = {
    label: "Pending Review",
    bg: "bg-slate-900/80",
    border: "border-slate-700/60",
    text: "text-slate-300",
    glow: "rgba(148, 163, 184, 0.2)",
    icon: Clock,
    cursor: "default",
  };

  if (normalized === "VERIFIED" || normalized === "PASS") {
    config = {
      label: "IDENTITY VERIFIED",
      bg: "bg-emerald-950/60",
      border: "border-emerald-500/50",
      text: "text-emerald-300",
      glow: "rgba(16, 185, 129, 0.4)",
      icon: ShieldCheck,
      cursor: "verified",
    };
  } else if (normalized === "FLAGGED" || normalized === "SUSPICIOUS") {
    config = {
      label: "FLAGGED FOR REVIEW",
      bg: "bg-amber-950/60",
      border: "border-amber-500/50",
      text: "text-amber-300",
      glow: "rgba(245, 158, 11, 0.4)",
      icon: AlertTriangle,
      cursor: "risk",
    };
  } else if (normalized === "REJECTED" || normalized === "FRAUD") {
    config = {
      label: "REJECTED / FRAUD",
      bg: "bg-rose-950/60",
      border: "border-rose-500/50",
      text: "text-rose-300",
      glow: "rgba(239, 68, 68, 0.45)",
      icon: XCircle,
      cursor: "risk",
    };
  } else if (normalized === "PROCESSING" || normalized === "ANALYZING") {
    config = {
      label: "NEURAL CONSENSUS...",
      bg: "bg-cyan-950/60",
      border: "border-cyan-500/50",
      text: "text-cyan-300",
      glow: "rgba(0, 229, 255, 0.4)",
      icon: Loader2,
      cursor: "default",
    };
  }

  const IconComponent = config.icon;
  const isLarge = size === "lg";

  return (
    <motion.div
      data-cursor={config.cursor}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className={`inline-flex items-center gap-2 rounded-full font-mono tracking-wider transition-all duration-300 select-none ${
        config.bg
      } ${config.border} border ${config.text} ${
        isLarge ? "px-4 py-1.5 text-xs font-semibold" : "px-3 py-1 text-[11px]"
      } ${className}`}
      style={{
        boxShadow: `0 0 16px -2px ${config.glow}`,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={normalized}
          initial={{ rotate: -40, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 40, opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center"
        >
          <IconComponent
            className={`${isLarge ? "w-4 h-4" : "w-3.5 h-3.5"} ${
              normalized === "PROCESSING" || normalized === "ANALYZING"
                ? "animate-spin text-cyan-400"
                : ""
            }`}
          />
        </motion.span>
      </AnimatePresence>
      <span>{config.label}</span>
    </motion.div>
  );
}
