import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, AlertTriangle, FileText, ChevronDown, ChevronUp } from "lucide-react";

export default function VerdictCard({ report }) {
  const [showTrail, setShowTrail] = useState(false);

  if (!report) return null;

  const { trustScore, verdict, explanation, applicantName, documentType, documentNumber, reasoningTrail } = report;

  const getVerdictStyle = () => {
    switch (verdict) {
      case "VERIFIED":
        return {
          bg: "bg-emerald-950/40",
          border: "border-emerald-500/40",
          text: "text-emerald-400",
          glow: "glow-emerald",
          icon: ShieldCheck,
          label: "VERIFIED AUTHENTIC",
        };
      case "REJECTED":
      case "FLAGGED_DEEPFAKE":
        return {
          bg: "bg-rose-950/40",
          border: "border-rose-500/50",
          text: "text-rose-400",
          glow: "glow-rose",
          icon: ShieldAlert,
          label: "REJECTED: FRAUD DETECTED",
        };
      case "FLAGGED":
      case "FLAGGED_FORGERY":
      default:
        return {
          bg: "bg-amber-950/40",
          border: "border-amber-500/50",
          text: "text-amber-400",
          glow: "glow-cyan",
          icon: AlertTriangle,
          label: "FLAGGED: AUDIT REQUIRED",
        };
    }
  };

  const style = getVerdictStyle();
  const Icon = style.icon;
  const scorePercent = (trustScore / 10).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-panel rounded-2xl p-6 border ${style.border} ${style.bg} ${style.glow} transition-all space-y-4`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Verdict Badge and Explanation */}
        <div className="flex items-start space-x-4">
          <div className={`p-3.5 rounded-2xl bg-slate-900/90 border ${style.border} shrink-0`}>
            <Icon className={`w-8 h-8 ${style.text}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-slate-900 border ${style.border} ${style.text}`}>
                {style.label}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {report.id}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1.5">{applicantName}</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              {explanation}
            </p>
            <div className="flex items-center space-x-3 mt-3 text-xs text-slate-400 font-mono">
              <span>Doc: <strong className="text-slate-200">{documentType}</strong></span>
              <span>•</span>
              <span>Ref: <strong className="text-slate-200">{documentNumber}</strong></span>
            </div>
          </div>
        </div>

        {/* Aggregate Trust Score Display */}
        <div className="flex items-center space-x-4 self-start md:self-auto bg-slate-900/80 p-4 rounded-xl border border-slate-800 shrink-0">
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
              Composite Trust Score
            </span>
            <div className="flex items-baseline justify-end space-x-1 mt-0.5">
              <span className={`text-3xl font-extrabold font-mono ${style.text}`}>
                {scorePercent}%
              </span>
              <span className="text-xs text-slate-500 font-mono">/ 100%</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">
              {trustScore} / 1000 pts
            </span>
          </div>

          <div className="w-14 h-14 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={style.text}
                strokeDasharray={`${scorePercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-mono font-bold text-white">
              {Math.round(trustScore / 10)}
            </span>
          </div>
        </div>
      </div>

      {/* Human-Readable Reasoning Trail Accordion */}
      {reasoningTrail && (
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowTrail(!showTrail)}
            className="flex items-center justify-between w-full text-xs font-mono py-2 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-slate-300 border border-slate-800 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Multi-Agent Forensic Reasoning Trail</span>
            </span>
            {showTrail ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {showTrail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 p-4 rounded-xl bg-slate-950/90 border border-slate-800 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed max-h-96 whitespace-pre-wrap selection:bg-cyan-500/40"
            >
              {reasoningTrail}
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
