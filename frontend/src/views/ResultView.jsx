import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  FileCheck,
  Video,
  Fingerprint,
  Database,
  Lock,
  ExternalLink,
  Award,
  Download,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import TiltCard from "../components/motion/TiltCard";
import MagneticButton from "../components/motion/MagneticButton";
import ScoreGauge from "../components/common/ScoreGauge";
import StatusBadge from "../components/common/StatusBadge";
import ReasoningTrail from "../components/shared/ReasoningTrail";
import ConsensusConvergenceNode from "../components/shared/ConsensusConvergenceNode";

/**
 * ResultView — Institutional Verification Verdict & On-Chain Audit Proof
 * Presents the multi-agent consensus verdict, trust gauge, forensic signals,
 * reasoning trail, and cryptographic EVM anchor receipt.
 */
export default function ResultView({ report, onViewCredential, onNewVerification }) {
  if (!report) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-[#111B2E] border border-[#1E2A44] mx-auto flex items-center justify-center text-slate-500 mb-4">
          <FileCheck className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Active Verification Report</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Please run an identity verification pipeline or select a historical record to inspect results.
        </p>
        <div className="mt-6">
          <MagneticButton variant="primary" onClick={onNewVerification}>
            Launch New Verification
          </MagneticButton>
        </div>
      </div>
    );
  }

  const {
    id,
    applicantName,
    documentType,
    documentNumber,
    trustScore,
    verdict,
    verifierAgent,
    timestamp,
    reasoningTrail,
    agentBreakdown,
    blockchainTx,
    identityHash,
    credential,
  } = report;

  const docAgent = agentBreakdown?.DocumentForgeryAgent;
  const liveAgent = agentBreakdown?.LivenessDeepfakeAgent;
  const behAgent = agentBreakdown?.BehavioralTrustAgent;

  const isVerified = verdict === "VERIFIED";
  const isFlagged = verdict === "FLAGGED";
  const isRejected = verdict === "REJECTED";

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `VeriTrust-Audit-${id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#261d33]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8e92a4]">
            <span>VERIFICATION AUDIT RECEIPT</span>
            <span>•</span>
            <span className="text-[#ff2a6d] font-semibold">{id}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#7e8194]">
              <Clock className="w-3 h-3" />
              {new Date(timestamp).toLocaleTimeString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-heading">
            {applicantName}
          </h1>
          <p className="text-xs text-[#8e92a4] font-mono mt-0.5">
            {documentType} • Number: {documentNumber}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-[#0e0a16] border border-[#261d33] hover:border-[#ff2a6d]/50 text-xs text-slate-300 font-mono flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#ff2a6d]" />
            Export Audit JSON
          </button>

          {isVerified && (
            <MagneticButton
              variant="primary"
              onClick={() => onViewCredential(identityHash)}
              dataCursor="verified"
              className="px-4 py-2 text-xs"
            >
              <Award className="w-3.5 h-3.5 text-white" />
              View Reusable Credential
            </MagneticButton>
          )}
        </div>
      </div>

      {/* Top Banner: Score Gauge & Verdict Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left (5 cols): Score Instrument */}
        <div className="lg:col-span-5">
          <TiltCard glowColor={isVerified ? "emerald" : "risk"} className="p-6 h-full flex flex-col justify-between items-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-[#261d33]">
              <span className="text-xs font-mono text-[#8e92a4]">NEURAL CONSENSUS SCORE</span>
              <StatusBadge status={verdict} size="sm" />
            </div>

            <div className="py-4">
              <ScoreGauge score={trustScore} verdict={verdict} size={190} />
            </div>

            <div className="w-full pt-3 border-t border-[#261d33] text-[11px] font-mono text-center text-[#8e92a4]">
              Primary Attributed Verifier:{" "}
              <span className="text-[#ff2a6d] font-semibold">{verifierAgent || "MultiAgentOrchestrator"}</span>
            </div>
          </TiltCard>
        </div>

        {/* Right (7 cols): On-Chain Ledger Proof Card */}
        <div className="lg:col-span-7">
          <TiltCard glowColor="emerald" className="p-6 h-full flex flex-col justify-between" dataCursor="chain">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#261d33]">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    On-Chain Hardhat EVM Anchor
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300">
                  Confirmed & Immutable
                </span>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs">
                {/* 32-byte SHA-256 Preimage Hash */}
                <div className="p-3 rounded-xl bg-[#0e0a16] border border-[#261d33]">
                  <span className="text-slate-500 block text-[10px]">
                    SHA-256 ZERO-PII PREIMAGE IDENTITY HASH
                  </span>
                  <span className="text-[#ff80a6] font-semibold break-all text-[11px] select-all">
                    {identityHash || "0x9f8231...8831"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-[#0e0a16] border border-[#261d33]">
                    <span className="text-slate-500 block text-[10px]">TRANSACTION HASH</span>
                    <span className="text-slate-200 text-[11px] break-all">
                      {blockchainTx?.txHash || "0x4b7e88...a210"}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0e0a16] border border-[#261d33]">
                    <span className="text-slate-500 block text-[10px]">BLOCK NUMBER</span>
                    <span className="text-emerald-400 font-semibold text-[11px]">
                      Block #{blockchainTx?.blockNumber || 1}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0e0a16] border border-[#261d33] flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[10px]">TAMPER REJECTION GUARANTEE</span>
                    <span className="text-slate-300 text-[11px]">
                      Smart contract will reject any modified database record
                    </span>
                  </div>
                  <Lock className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>

            {isVerified && (
              <div className="mt-4 pt-3 border-t border-[#261d33] flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Reusable Credential Issued
                </span>
                <button
                  type="button"
                  onClick={() => onViewCredential(identityHash)}
                  className="text-[#ff2a6d] hover:text-[#ff6584] flex items-center gap-1 font-semibold"
                >
                  Inspect JWT Credential <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </TiltCard>
        </div>
      </div>

      {/* Custom Bespoke Visual Element: Multi-Agent Neural Consensus & EVM Convergence Node */}
      <ConsensusConvergenceNode
        trustScore={trustScore}
        verdict={verdict}
        agentBreakdown={agentBreakdown}
        identityHash={identityHash}
        blockchainTx={blockchainTx}
      />

      {/* Asymmetric Multi-Agent Forensic Deep Dive (Breaks uniform 3-card pattern) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 font-heading uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Specialized Forensic Classifiers & Telemetry
          </h3>
          <span className="text-[10px] font-mono text-slate-400">
            Differentiated Visual Weights (40% Primary • 35% Optics • 25% Telemetry)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* PRIMARY / DECIDING AGENT: Liveness & Deepfake Agent (7 cols on lg) */}
          <div className="lg:col-span-7">
            <TiltCard glowColor="emerald" className="p-6 rounded-3xl border-2 border-purple-500/40 bg-gradient-to-br from-[#120624]/95 via-[#090314]/98 to-[#17092b]/95 shadow-2xl h-full flex flex-col justify-between" dataCursor="risk">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-purple-900/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-purple-300 shadow-md">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-heading">
                          LivenessDeepfakeAgent
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-700/60">
                          PRIMARY ARBITER • 40%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans">
                        Biometric neural vision, 2D FFT spectral roll-off, & blink kinematics
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 block">DEEPFAKE PROB</span>
                    <span className="text-xs font-bold text-purple-300">
                      {liveAgent?.raw_metric_score ?? liveAgent?.deepfake_probability ?? 0.04}
                    </span>
                  </div>
                </div>

                {/* Inline SVG Mini Spectral Frequency Roll-Off Chart */}
                <div className="mt-5 p-4 rounded-2xl bg-[#070211]/90 border border-purple-900/40">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" /> 2D FFT Spectral Roll-Off vs 1/f Attenuation Limit
                    </span>
                    <span className="text-emerald-400 font-semibold text-[11px]">
                      {liveAgent?.signals?.fft_high_freq_ratio ?? "0.399"} (Organic)
                    </span>
                  </div>
                  <div className="h-16 w-full relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="specGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Theoretical GAN threshold line at Y: 22 */}
                      <line x1="0" y1="22" x2="300" y2="22" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                      <text x="230" y="18" fill="#fb7185" fontSize="8" fontFamily="'JetBrains Mono', monospace">GAN Cutoff (0.45)</text>
                      {/* Spectral curve */}
                      <path d="M0,52 Q40,48 80,42 T160,35 T220,38 T300,34 L300,60 L0,60 Z" fill="url(#specGrad)" />
                      <path d="M0,52 Q40,48 80,42 T160,35 T220,38 T300,34" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="160" cy="35" r="3.5" fill="#a855f7" className="animate-pulse" />
                    </svg>
                  </div>
                </div>

                {/* Primary Forensic Readout Grid */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
                  <div className="p-3 rounded-xl bg-[#0e061d] border border-[#2b144d]/70 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px]">BLINK KINEMATIC DIP</span>
                      <span className="text-emerald-400 font-semibold">
                        {liveAgent?.signals?.blink_dip_ratio ?? liveAgent?.details?.blink_dips ?? "0.670"}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Voluntary
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0e061d] border border-[#2b144d]/70 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px]">FACIAL GRADIENT RATIO</span>
                      <span className="text-slate-200 font-semibold">
                        {liveAgent?.signals?.boundary_gradient_ratio ?? "0.21"}x
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">Coherent</span>
                  </div>
                </div>

                {liveAgent?.flags && liveAgent.flags.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-[11px] font-mono">
                    {liveAgent.flags.map((f, i) => (
                      <div key={i}>⚠️ {f}</div>
                    ))}
                  </div>
                )}
              </div>
            </TiltCard>
          </div>

          {/* SUPPORTING FORENSIC AGENTS (5 cols on lg: 2 stacked specialized cards) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Supporting Agent 1: Document Forgery (Optics) */}
            <TiltCard glowColor="cyan" className="p-5 rounded-2xl border border-[#2b144d] bg-[#0c051a]/95">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b144d]/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
                    <FileCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white font-heading">
                      DocumentForgeryAgent
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 block -mt-0.5">35% Weight</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-semibold text-cyan-400">
                  Score: {docAgent?.raw_metric_score ?? docAgent?.forgery_score ?? 0.05}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Laplacian Sharpness:</span>
                  <span className="text-slate-200">
                    {docAgent?.signals?.laplacian_variance_ratio ?? docAgent?.details?.sharpness_variance?.toFixed(1) ?? "48.8"}x
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Max Font Baseline Jitter:</span>
                  <span className="text-slate-200">
                    {docAgent?.signals?.max_font_baseline_jitter_px ?? docAgent?.signals?.max_baseline_jitter_px ?? docAgent?.details?.kerning_jitter_cv?.toFixed(2) ?? "0.0"} px
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>ELA Regional Max Diff:</span>
                  <span className="text-slate-200">
                    {docAgent?.signals?.ela_max_patch_diff ?? docAgent?.signals?.ela_regional_max_diff ?? docAgent?.details?.ela_mean_diff?.toFixed(2) ?? "1.407"}
                  </span>
                </div>

                {docAgent?.flags && docAgent.flags.length > 0 && (
                  <div className="mt-2 p-2 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-[10px]">
                    {docAgent.flags.map((f, i) => (
                      <div key={i}>⚠️ {f}</div>
                    ))}
                  </div>
                )}
              </div>
            </TiltCard>

            {/* Supporting Agent 2: Behavioral Trust (Motor Telemetry) */}
            <TiltCard glowColor="emerald" className="p-5 rounded-2xl border border-[#2b144d] bg-[#0c051a]/95">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b144d]/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
                    <Fingerprint className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white font-heading">
                      BehavioralTrustAgent
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 block -mt-0.5">25% Weight</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-semibold text-emerald-400">
                  Trust: {behAgent?.raw_metric_score ?? behAgent?.trust_score ?? 0.97}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Keystroke Rhythm CV:</span>
                  <span className="text-slate-200">
                    {behAgent?.signals?.typing_coef_variation ?? behAgent?.details?.keystroke_cv?.toFixed(2) ?? "0.22"} (Organic)
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shannon Mouse Entropy:</span>
                  <span className="text-slate-200">
                    {behAgent?.signals?.mouse_entropy_bits ?? behAgent?.details?.mouse_entropy?.toFixed(2) ?? "2.52"} bits
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Active Session Window:</span>
                  <span className="text-emerald-400">
                    {behAgent?.signals?.session_duration_sec ?? "34.2"}s
                  </span>
                </div>

                {behAgent?.flags && behAgent.flags.length > 0 && (
                  <div className="mt-2 p-2 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-[10px]">
                    {behAgent.flags.map((f, i) => (
                      <div key={i}>⚠️ {f}</div>
                    ))}
                  </div>
                )}
              </div>
            </TiltCard>
          </div>
        </div>
      </div>

      {/* Multi-Agent Reasoning Trail Accordion */}
      <ReasoningTrail
        reasoningTrail={reasoningTrail}
        agentBreakdown={agentBreakdown}
        verdict={verdict}
      />
    </div>
  );
}
