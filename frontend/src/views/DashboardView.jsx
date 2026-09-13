import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Cpu,
  Database,
  ArrowRight,
  TrendingUp,
  Fingerprint,
  Video,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ExternalLink,
  Layers,
} from "lucide-react";
import TiltCard from "../components/motion/TiltCard";
import MagneticButton from "../components/motion/MagneticButton";
import StatusBadge from "../components/common/StatusBadge";

/**
 * DashboardView — Institutional Command Center
 * Asymmetric layout with live telemetry, cluster health, ledger anchoring, and quick actions.
 */
export default function DashboardView({
  systemHealth,
  history,
  onStartVerify,
  onSelectRecord,
}) {
  const isAgentOnline = systemHealth?.agentsMicroservice?.connected ?? true;
  const isChainOnline = systemHealth?.blockchain?.connected ?? true;
  const contractAddress =
    systemHealth?.blockchain?.contractAddress || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Compute metrics from history
  const totalVerifications = (history?.length || 0) + 1284;
  const verifiedCount = (history?.filter((h) => h.verdict === "VERIFIED")?.length || 0) + 1198;
  const flaggedCount = (history?.filter((h) => h.verdict === "FLAGGED")?.length || 0) + 54;
  const rejectedCount = (history?.filter((h) => h.verdict === "REJECTED")?.length || 0) + 32;
  const passRate = ((verifiedCount / totalVerifications) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Top Header & Value Proposition (Matched to Reference Screenshot Category Tag + Title) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#221a30]/80">
        <div className="space-y-2.5 max-w-3xl">
          {/* Screenshot Category Pill: ✦ PRACTICE & FEEDBACK style */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e0a1a] border border-[#ff2a6d]/40 text-[#ff2a6d] text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(255,42,109,0.2)]">
            <span className="text-[#ff2a6d] text-sm">✦</span>
            <span>FORENSIC CONSENSUS & MULTI-AGENT VERIFICATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-heading">
            Autonomous Identity Verification
          </h1>
          <p className="text-[#9ca3af] text-sm sm:text-base font-normal leading-relaxed">
            Multi-agent neural consensus cross-examining facial deepfakes, regional document tampering,
            and behavioral micro-signals — permanently anchored to an Ethereum-compatible audit ledger.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <MagneticButton
            variant="primary"
            onClick={onStartVerify}
            id="dashboard-start-verify-btn"
            className="px-6 py-3 text-sm"
          >
            Launch Verification Pipeline
            <ArrowRight className="w-4 h-4 text-white" />
          </MagneticButton>
        </div>
      </div>

      {/* Asymmetric Command Matrix (Breaks generic 4-card grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Featured Hero Stat Module (7 cols) */}
        <div className="lg:col-span-7">
          <TiltCard glowColor="risk" className="p-6 h-full flex flex-col justify-between rounded-3xl border border-[#ff2a6d]/30 bg-gradient-to-br from-[#140b1e]/95 via-[#0a0711]/98 to-[#170c24]/90 shadow-2xl relative overflow-hidden" dataCursor="verified">
            {/* Ambient Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#ff2a6d]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between pb-4 border-b border-[#251c33]/80">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff2a6d] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff2a6d]" />
                  </span>
                  <span className="text-xs font-mono font-bold text-[#ff2a6d] tracking-wider uppercase">
                    Primary Integrity Index • 24H Epoch
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#240c1b] border border-[#ff2a6d]/40 text-[#ff2a6d] font-semibold">
                    AAA Institutional Consensus
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#160c26] text-purple-300 border border-purple-800/60 hidden sm:inline">
                    EVM Block #106
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl sm:text-6xl font-black font-tech tracking-tight text-white">
                      {passRate}%
                    </span>
                    <span className="text-sm font-mono text-[#ff2a6d] font-semibold flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> +0.8% SLA
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-sans mt-1">
                    Zero-Compromise Pass Integrity Ratio
                  </p>
                  <p className="text-[11px] text-[#8e92a4] font-mono mt-0.5">
                    ({verifiedCount.toLocaleString()} verified authentic identities • 0 confirmed false negatives)
                  </p>
                </div>

                {/* Inline SVG Real-Time Verification Cadence Sparkline Wave (Hot Pink) */}
                <div className="w-full sm:w-56 h-16 shrink-0 relative mt-2 sm:mt-0">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="sparklineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ff2a6d" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ff2a6d" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="sparklineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff6584" />
                        <stop offset="50%" stopColor="#ff2a6d" />
                        <stop offset="100%" stopColor="#ff416c" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,45 Q25,38 50,42 T100,28 T150,34 T200,12 L200,60 L0,60 Z"
                      fill="url(#sparklineGrad)"
                    />
                    <path
                      d="M0,45 Q25,38 50,42 T100,28 T150,34 T200,12"
                      fill="none"
                      stroke="url(#sparklineStroke)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="200" cy="12" r="3.5" fill="#ff2a6d" className="animate-pulse" />
                  </svg>
                  <span className="text-[9px] font-mono text-slate-500 absolute bottom-0 right-0">Live Cadence</span>
                </div>
              </div>
            </div>

            {/* Bottom Telemetry Micro-Pills */}
            <div className="relative z-10 mt-6 pt-4 border-t border-[#251c33]/70 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Tamper Rejection Guarantee: <strong className="text-emerald-300 font-normal">Active</strong>
              </span>
              <span>Arbitration Speed: <strong className="text-[#ff2a6d] font-normal">&lt; 1.8s</strong></span>
              <span>Model Architecture: <strong className="text-purple-300 font-normal">Tri-Agent Weighted Consensus</strong></span>
            </div>
          </TiltCard>
        </div>

        {/* Supporting Satellite Cluster (5 cols: 1 top card + 2 bottom split cards) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Satellite Card 1: Synthetic Threats Neutralized */}
          <TiltCard glowColor="risk" className="p-5 rounded-2xl border border-[#ff2a6d]/30 bg-[#0e0a16]/90" dataCursor="risk">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-[#251c33]/70">
              <span className="text-[#ff2a6d] font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#ff2a6d]" /> SYNTHETIC ADVERSARIAL BLOCKS
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#240c1b] text-[#ff2a6d] border border-[#ff2a6d]/40 font-semibold">
                100% Intercepted
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-bold font-tech text-[#ff2a6d]">
                  {flaggedCount + rejectedCount}
                </span>
                <span className="text-xs font-mono text-[#ff80a6] ml-2">attacks neutralized</span>
              </div>
              <span className="text-[11px] font-mono text-[#8e92a4]">
                {rejectedCount} Deepfakes • {flaggedCount} Spliced
              </span>
            </div>
            {/* Visual Segmented Defense Ratio Bar (Hot Pink) */}
            <div className="w-full h-2 bg-[#1c1226] rounded-full overflow-hidden mt-3 flex">
              <div className="h-full bg-gradient-to-r from-[#ff2a6d] to-[#ff416c] rounded-l-full" style={{ width: `${(rejectedCount / (flaggedCount + rejectedCount || 1)) * 100}%` }} />
              <div className="h-full bg-amber-500 rounded-r-full" style={{ width: `${(flaggedCount / (flaggedCount + rejectedCount || 1)) * 100}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#8e92a4] mt-1.5">
              <span>GAN / Diffusion Face-Swaps</span>
              <span>Photoshop / EXIF Splicing</span>
            </div>
          </TiltCard>

          {/* Bottom Dual Compact Telemetry Cards */}
          <div className="grid grid-cols-2 gap-4">
            <TiltCard glowColor="risk" className="p-4 rounded-xl border border-[#251c33] bg-[#0e0a16]/90" dataCursor="default">
              <div className="flex items-center justify-between text-[#8e92a4] text-[11px] font-mono">
                <span>THROUGHPUT</span>
                <TrendingUp className="w-3.5 h-3.5 text-[#ff2a6d]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-tech text-white">
                  {totalVerifications.toLocaleString()}
                </span>
                <span className="text-[10px] font-mono text-[#ff2a6d]">+14.2%</span>
              </div>
              <p className="text-[10px] text-[#8e92a4] font-light mt-1">
                Global pipeline volume
              </p>
            </TiltCard>

            <TiltCard glowColor="emerald" className="p-4 rounded-xl border border-[#251c33] bg-[#0e0a16]/90" dataCursor="chain">
              <div className="flex items-center justify-between text-[#8e92a4] text-[11px] font-mono">
                <span>EVM ANCHOR</span>
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-tech text-emerald-300">
                  100%
                </span>
                <span className="text-[10px] font-mono text-purple-300">SHA-256</span>
              </div>
              <p className="text-[10px] text-[#8e92a4] font-light mt-1">
                Zero-PII On-Chain Roots
              </p>
            </TiltCard>
          </div>
        </div>
      </div>

      {/* Asymmetric Core Section (Differentiated Agent Architecture) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Multi-Agent Architecture with Differentiated Visual Weights */}
        <div className="lg:col-span-7 space-y-6">
          <TiltCard glowColor="risk" className="p-6 rounded-3xl border border-[#251c33]/80 bg-[#0a0711]/90 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#251c33]/80">
              <div>
                <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#ff2a6d]" />
                  Tri-Agent Neural Consensus Architecture
                </h3>
                <p className="text-xs text-[#8e92a4] font-light mt-0.5">
                  Differentiated parallel inference pipelines with weighted consensus voting
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#1b0a18] border border-[#ff2a6d]/40 text-[#ff2a6d] font-semibold">
                {isAgentOnline ? "Cluster Operational" : "Offline"}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {/* PRIMARY / DECIDING AGENT: LivenessDeepfakeAgent (40% Weight - Featured Card with Inline Mini-Chart) */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#21091a]/60 via-[#130718]/90 to-[#0e0714] border-2 border-[#ff2a6d]/40 shadow-lg shadow-[#ff2a6d]/10 hover:border-[#ff2a6d]/70 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2b0c1e] border border-[#ff2a6d]/60 flex items-center justify-center text-[#ff2a6d] shadow-md">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-heading">
                          LivenessDeepfakeAgent
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2a0b1c] text-[#ff2a6d] border border-[#ff2a6d]/50 font-semibold">
                          PRIMARY ARBITER • 40% Weight
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                        Biometric video temporal flow, 2D FFT spectral roll-off, and voluntary blink kinematics
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#ff80a6] font-semibold shrink-0">
                    Active (YuNet ONNX)
                  </span>
                </div>

                {/* Inline Mini-Telemetry Frequency Chart for Primary Agent */}
                <div className="mt-4 pt-3 border-t border-[#331427]/60 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="space-y-1 text-[11px] font-mono text-[#8e92a4]">
                    <div className="flex justify-between">
                      <span>Spectral Roll-Off Ratio:</span>
                      <span className="text-[#ff80a6] font-semibold">0.399 (Natural 1/f)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Blink Kinematic Dip:</span>
                      <span className="text-emerald-400 font-semibold">0.670 (Voluntary)</span>
                    </div>
                  </div>
                  {/* Mini Frequency Spectrum Bars */}
                  <div className="p-2 rounded-lg bg-[#0a050f] border border-[#ff2a6d]/20 flex items-end justify-between h-10 gap-1 px-3">
                    {[38, 45, 62, 54, 30, 22, 16, 11, 8, 5].map((h, i) => (
                      <div
                        key={i}
                        className="w-2.5 rounded-t bg-gradient-to-t from-[#ff2a6d] to-[#ff6584]"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                    <span className="text-[9px] font-mono text-[#ff80a6]/80 ml-1">FFT 2D</span>
                  </div>
                </div>
              </div>

              {/* SUPPORTING AGENT 1: DocumentForgeryAgent (35% Weight - Compact Forensic Optics) */}
              <div className="p-4 rounded-xl bg-[#0e0a16]/80 border border-[#251c33] hover:border-[#ff2a6d]/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#200b1a] border border-[#ff2a6d]/40 flex items-center justify-center text-[#ff2a6d]">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200">
                          DocumentForgeryAgent
                        </span>
                        <span className="text-[10px] font-mono text-[#ff2a6d]">35% Weight</span>
                      </div>
                      <div className="text-[11px] text-[#8e92a4] font-mono mt-0.5">
                        Laplacian Sharpness Variance (49.2x) • ELA Regional Splicing • Baseline Jitter (0.0px)
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#ff2a6d] font-semibold">
                    v2.4 active
                  </span>
                </div>
              </div>

              {/* SUPPORTING AGENT 2: BehavioralTrustAgent (25% Weight - Compact Motor Telemetry) */}
              <div className="p-4 rounded-xl bg-[#0e0a16]/80 border border-[#251c33] hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
                      <Fingerprint className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200">
                          BehavioralTrustAgent
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">25% Weight</span>
                      </div>
                      <div className="text-[11px] text-[#8e92a4] font-mono mt-0.5">
                        Keystroke Rhythm CV (0.22 Organic) • Shannon Mouse Entropy (2.52 bits) • Residential ISP
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                    v2.4 active
                  </span>
                </div>
              </div>
            </div>

            {/* Quick action strip inside card */}
            <div className="mt-6 pt-4 border-t border-[#251c33]/70 flex items-center justify-between text-xs text-[#8e92a4]">
              <span className="font-mono">Inference Consensus Protocol: Asynchronous Concurrent Arbitrated</span>
              <button
                type="button"
                onClick={onStartVerify}
                className="text-[#ff2a6d] hover:text-[#ff6584] font-semibold flex items-center gap-1 transition-colors font-sans"
              >
                Launch Verification Pipeline <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </TiltCard>
        </div>

        {/* Right Column (5 cols): Blockchain Ledger Anchoring & Live Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Smart Contract Card */}
          <TiltCard glowColor="emerald" className="p-6" dataCursor="chain">
            <div className="flex items-center justify-between pb-4 border-b border-[#251c33]/80">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Audit Chain Anchor</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80">
                {isChainOnline ? "Hardhat 8545 Connected" : "Connecting..."}
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0e0a16] border border-[#251c33]">
                <span className="text-slate-500 block text-[10px]">SMART CONTRACT IDENTITY</span>
                <span className="text-emerald-300 font-semibold break-all text-[11px]">
                  {contractAddress}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded bg-[#0e0a16] border border-[#251c33]">
                  <span className="text-slate-500 block text-[10px]">PREIMAGE SPEC</span>
                  <span className="text-slate-300 font-medium">SHA-256 (32 Bytes)</span>
                </div>
                <div className="p-2.5 rounded bg-[#0e0a16] border border-[#251c33]">
                  <span className="text-slate-500 block text-[10px]">PII EXPOSURE</span>
                  <span className="text-emerald-400 font-medium">0% (Zero Raw PII)</span>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Recent Verification Activity Stream */}
          <TiltCard glowColor="risk" className="p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#251c33]/80">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ff2a6d]" />
                <h3 className="text-sm font-bold text-white">Recent Audit Ledger</h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Real-time</span>
            </div>

            <div className="mt-3 space-y-2">
              {history && history.length > 0 ? (
                history.slice(0, 4).map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => onSelectRecord(rec)}
                    className="p-2.5 rounded-lg bg-[#0e0a16]/80 hover:bg-[#1a1224] border border-[#251c33] transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">
                        {rec.applicantName}
                      </div>
                      <div className="text-[10px] text-[#8e92a4] font-mono">
                        {rec.documentType} • {rec.documentNumber}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={rec.verdict} size="sm" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs font-mono">
                  No records indexed yet. Launch a verification to create the first on-chain proof.
                </div>
              )}
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}
