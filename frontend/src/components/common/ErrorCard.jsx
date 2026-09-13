import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, XCircle, RefreshCw, X, ShieldAlert, Cpu, Database } from "lucide-react";

/**
 * ErrorCard — High-grade institutional error panel
 * Formats errors with category icons, explanation, remediation steps, and retry actions.
 */
export default function ErrorCard({ error, onDismiss, onRetry }) {
  if (!error) return null;

  const errorCode = typeof error === "object" ? error.error || error.code || "PIPELINE_ERROR" : "PIPELINE_ERROR";
  const errorMessage = typeof error === "object" ? error.message || error.details || "An unexpected error occurred." : String(error);
  const remediation = typeof error === "object" ? error.remediation : null;

  let Icon = AlertTriangle;
  let borderColor = "border-rose-800/80";
  let bgColor = "bg-rose-950/70";
  let glowColor = "rgba(239, 68, 68, 0.3)";

  if (errorCode.includes("BLOCKCHAIN")) {
    Icon = Database;
    borderColor = "border-amber-700/80";
    bgColor = "bg-amber-950/70";
    glowColor = "rgba(245, 158, 11, 0.3)";
  } else if (errorCode.includes("AGENT")) {
    Icon = Cpu;
    borderColor = "border-purple-700/80";
    bgColor = "bg-purple-950/70";
    glowColor = "rgba(168, 85, 247, 0.3)";
  } else if (errorCode.includes("FILE") || errorCode.includes("BIOMETRIC") || errorCode.includes("INPUT")) {
    Icon = ShieldAlert;
    borderColor = "border-rose-700/80";
    bgColor = "bg-rose-950/70";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`rounded-2xl p-4 sm:p-5 border ${borderColor} ${bgColor} backdrop-blur-xl shadow-2xl relative overflow-hidden text-xs font-mono`}
      style={{ boxShadow: `0 8px 30px -4px ${glowColor}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-4 h-4 text-rose-300" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tracking-wide uppercase font-sans text-sm">
                System Advisory
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 border border-rose-600/50 text-rose-300 font-semibold">
                {errorCode}
              </span>
            </div>
            <p className="text-slate-200 text-xs font-light leading-relaxed">
              {errorMessage}
            </p>
            {remediation && (
              <div className="pt-2 text-[11px] text-slate-300/90 flex items-center gap-1.5">
                <span className="text-cyan-400 font-bold">Suggested Remediation:</span>
                <span>{remediation}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-2.5 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-slate-200 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
            >
              <RefreshCw className="w-3 h-3 text-cyan-400" /> Retry
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
