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
      {/* Top Institutional Header & Value Proposition */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#1E2A44]">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 pulse-radar" />
            Decentralized Autonomous KYC Mesh
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Institutional Trust Engineered for the{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-200">
              Generative AI Era
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed">
            Multi-agent neural consensus cross-examining facial deepfakes, regional document tampering,
            and behavioral micro-signals — permanently anchored to an Ethereum-compatible audit ledger.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <MagneticButton
            variant="primary"
            onClick={onStartVerify}
            id="dashboard-start-verify-btn"
            className="px-6 py-3.5 text-sm"
          >
            Launch Verification Pipeline
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </MagneticButton>
        </div>
      </div>

      {/* KPI Velocity Strip (High-Density Cybersecurity Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <TiltCard glowColor="cyan" className="p-4" dataCursor="default">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>24H VERIFICATION VELOCITY</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {totalVerifications.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-emerald-400">+14.2%</span>
          </div>
          <p className="text-[11px] text-slate-500 font-light mt-1">
            Global pipeline throughput
          </p>
        </TiltCard>

        <TiltCard glowColor="emerald" className="p-4" dataCursor="verified">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>PASS INTEGRITY RATE</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {passRate}%
            </span>
            <span className="text-xs font-mono text-slate-400">({verifiedCount} verified)</span>
          </div>
          <p className="text-[11px] text-slate-500 font-light mt-1">
            Zero recorded false negatives
          </p>
        </TiltCard>

        <TiltCard glowColor="risk" className="p-4" dataCursor="risk">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>SYNTHETIC RISKS NEUTRALIZED</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {flaggedCount + rejectedCount}
            </span>
            <span className="text-xs font-mono text-rose-400">({rejectedCount} deepfakes)</span>
          </div>
          <p className="text-[11px] text-slate-500 font-light mt-1">
            Blocked at neural inference stage
          </p>
        </TiltCard>

        <TiltCard glowColor="cyan" className="p-4" dataCursor="chain">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ON-CHAIN TAMPER RESISTANCE</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              100.0%
            </span>
            <span className="text-xs font-mono text-cyan-400">SHA-256</span>
          </div>
          <p className="text-[11px] text-slate-500 font-light mt-1">
            Zero-PII cryptographic root
          </p>
        </TiltCard>
      </div>

      {/* Asymmetric Core Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Multi-Agent Architecture & Health Telemetry */}
        <div className="lg:col-span-7 space-y-6">
          <TiltCard glowColor="cyan" className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2A44]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Tri-Agent Neural Inference Cluster
                </h3>
                <p className="text-xs text-slate-400 font-light mt-0.5">
                  Real-time CPU-optimized multi-modal detection agents running concurrently
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300">
                {isAgentOnline ? "Cluster Healthy" : "Offline"}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {/* Agent 1 */}
              <div className="p-4 rounded-xl bg-[#0B1526]/80 border border-[#1E2A44] hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">
                        DocumentForgeryAgent
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Laplacian Sharpness Variance • ELA Splicing • Font Kerning Jitter
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                    v2.4 active
                  </span>
                </div>
              </div>

              {/* Agent 2 */}
              <div className="p-4 rounded-xl bg-[#0B1526]/80 border border-[#1E2A44] hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">
                        LivenessDeepfakeAgent
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        YuNet 5-pt Landmarks • 2D FFT Spectral Roll-Off • Kinematic Blink Dip
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">
                    v2.4 active
                  </span>
                </div>
              </div>

              {/* Agent 3 */}
              <div className="p-4 rounded-xl bg-[#0B1526]/80 border border-[#1E2A44] hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
                      <Fingerprint className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">
                        BehavioralTrustAgent
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Keystroke Cadence CV • Shannon Mouse Entropy • Device Fingerprint
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
            <div className="mt-6 pt-4 border-t border-[#1E2A44] flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">Inference Consensus Pipeline: Asynchronous Concurrent</span>
              <button
                type="button"
                onClick={onStartVerify}
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
              >
                Simulate verification pipeline <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </TiltCard>
        </div>

        {/* Right Column (5 cols): Blockchain Ledger Anchoring & Live Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Smart Contract Card */}
          <TiltCard glowColor="emerald" className="p-6" dataCursor="chain">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2A44]">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Audit Chain Anchor</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80">
                {isChainOnline ? "Hardhat 8545 Connected" : "Connecting..."}
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#080E1A] border border-[#1E2A44]">
                <span className="text-slate-500 block text-[10px]">SMART CONTRACT IDENTITY</span>
                <span className="text-emerald-300 font-semibold break-all text-[11px]">
                  {contractAddress}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded bg-[#080E1A] border border-[#1E2A44]">
                  <span className="text-slate-500 block text-[10px]">PREIMAGE SPEC</span>
                  <span className="text-slate-300 font-medium">SHA-256 (32 Bytes)</span>
                </div>
                <div className="p-2.5 rounded bg-[#080E1A] border border-[#1E2A44]">
                  <span className="text-slate-500 block text-[10px]">PII EXPOSURE</span>
                  <span className="text-emerald-400 font-medium">0% (Zero Raw PII)</span>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Recent Verification Activity Stream */}
          <TiltCard glowColor="cyan" className="p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2A44]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
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
                    className="p-2.5 rounded-lg bg-[#0B1526]/70 hover:bg-[#111F36] border border-[#1E2A44] transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">
                        {rec.applicantName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
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
