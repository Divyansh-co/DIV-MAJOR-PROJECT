import React from "react";
import { motion } from "framer-motion";
import { FileSearch, ScanFace, Activity, CheckCircle2, AlertTriangle, ShieldX } from "lucide-react";

export default function AgentPipelineVisualizer({ isAnalyzing, agentResults }) {
  const agents = [
    {
      id: "DocumentForgeryAgent",
      name: "Document Forgery Agent",
      role: "Tampering & Font Kerning",
      weight: "40%",
      icon: FileSearch,
      accent: "cyan",
      result: agentResults ? agentResults.DocumentForgeryAgent : null,
    },
    {
      id: "LivenessDeepfakeAgent",
      name: "Liveness & Deepfake Agent",
      role: "GAN Artifacts & Corneal Jitter",
      weight: "40%",
      icon: ScanFace,
      accent: "blue",
      result: agentResults ? agentResults.LivenessDeepfakeAgent : null,
    },
    {
      id: "BehavioralTrustAgent",
      name: "Behavioral Trust Agent",
      role: "Device Fingerprint & Velocity",
      weight: "20%",
      icon: Activity,
      accent: "purple",
      result: agentResults ? agentResults.BehavioralTrustAgent : null,
    },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Multi-Agent Neural Inspection Cluster
          </h3>
          <p className="text-xs text-slate-400">
            Parallel inference pipelines running specialized adversarial classifiers
          </p>
        </div>
        <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
          FastAPI / Microservice
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          const res = agent.result;

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-xl p-4 border transition-all ${
                isAnalyzing
                  ? "bg-slate-900/90 border-cyan-500/40 shadow-md shadow-cyan-500/10"
                  : res
                  ? res.is_authentic || res.isAuthentic
                    ? "bg-slate-900/60 border-emerald-500/30"
                    : "bg-slate-900/60 border-rose-500/30"
                  : "bg-slate-900/40 border-slate-800"
              }`}
            >
              {/* Scanline animation while analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{agent.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">Weight: {agent.weight}</span>
                  </div>
                </div>

                {/* Status indicator */}
                {isAnalyzing ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse">
                    ANALYZING
                  </span>
                ) : res ? (
                  res.is_authentic || res.isAuthentic ? (
                    <span className="flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>PASS</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                      <ShieldX className="w-3 h-3" />
                      <span>FLAGGED</span>
                    </span>
                  )
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    READY
                  </span>
                )}
              </div>

              {/* Forensic Details */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/80">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400">Confidence Score</span>
                  <span className="font-mono font-bold text-slate-200">
                    {res ? `${Math.round((res.confidence_score || res.confidenceScore || 0) * 100)}%` : "--"}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      res
                        ? (res.confidence_score || res.confidenceScore) > 0.75
                          ? "bg-emerald-500"
                          : (res.confidence_score || res.confidenceScore) > 0.5
                          ? "bg-amber-500"
                          : "bg-rose-500"
                        : "bg-slate-700"
                    }`}
                    style={{
                      width: res
                        ? `${Math.round((res.confidence_score || res.confidenceScore || 0) * 100)}%`
                        : "0%",
                    }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                  {res ? res.summary : agent.role}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
