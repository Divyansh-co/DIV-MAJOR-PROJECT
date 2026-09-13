import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Cpu, Terminal, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

/**
 * ReasoningTrail — Displays the multi-agent consensus log,
 * natural language synthesis, and granular forensic alerts.
 */
export default function ReasoningTrail({ reasoningTrail, agentBreakdown, verdict }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showRawJson, setShowRawJson] = useState(false);

  // Parse reasoning trail lines into structured items
  const lines = (reasoningTrail || "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return (
    <div className="rounded-xl bg-[#0B1424]/90 border border-[#1E2A44] overflow-hidden">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-3.5 flex items-center justify-between cursor-pointer bg-[#0D182B] hover:bg-[#111F36] transition-colors border-b border-[#1E2A44]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-950/70 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              Multi-Agent Neural Reasoning Trail
              <span className="text-[10px] font-mono text-cyan-400 font-normal px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
                Consensus Arbiter
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-light">
              Autonomous forensic deliberation & flag telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowRawJson(!showRawJson);
            }}
            className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1"
          >
            <Terminal className="w-3 h-3 text-cyan-400" />
            {showRawJson ? "Formatted View" : "Raw JSON"}
          </button>
          <div className="text-slate-400">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Body Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="p-5 space-y-4"
          >
            {showRawJson ? (
              <div className="bg-[#060B14] p-4 rounded-lg border border-[#1E2A44] overflow-x-auto text-xs font-mono text-cyan-300/90 leading-relaxed max-h-96">
                <pre>{JSON.stringify({ verdict, reasoningTrail, agentBreakdown }, null, 2)}</pre>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {lines.length > 0 ? (
                  lines.map((line, idx) => {
                    const isAlert = line.includes("FLAG") || line.includes("REJECT") || line.includes("TAMPER") || line.includes("DEEPFAKE");
                    const isSuccess = line.includes("VERIFIED") || line.includes("PASS") || line.includes("AUTHENTIC");

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className={`flex items-start gap-3 p-2.5 rounded-lg border ${
                          isAlert
                            ? "bg-rose-950/20 border-rose-900/40 text-rose-300"
                            : isSuccess
                            ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-300"
                            : "bg-[#0E1B30]/60 border-[#1E2A44]/60 text-slate-300"
                        }`}
                      >
                        <span className="mt-0.5 shrink-0">
                          {isAlert ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          ) : isSuccess ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block mt-1" />
                          )}
                        </span>
                        <div className="flex-1 font-light leading-relaxed">
                          {line}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-slate-500 italic p-3 text-center">
                    No reasoning log available for this record.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
