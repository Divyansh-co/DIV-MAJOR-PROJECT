import React, { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, ShieldCheck, AlertTriangle, XCircle, Database, Sparkles, CheckCircle2, Lock } from "lucide-react";

/**
 * ConsensusConvergenceNode — Bespoke Neural Consensus & EVM Convergence Visualization
 * Renders an animated SVG topological flow where three autonomous forensic agent nodes
 * converge their cryptographic signal streams into a centralized consensus arbiter,
 * which then anchors an immutable SHA-256 root into the Ethereum smart contract.
 */
export default function ConsensusConvergenceNode({
  trustScore = 945,
  verdict = "VERIFIED",
  agentBreakdown,
  identityHash,
  blockchainTx,
}) {
  const [activeHoverNode, setActiveHoverNode] = useState(null);

  const docAgent = agentBreakdown?.DocumentForgeryAgent;
  const liveAgent = agentBreakdown?.LivenessDeepfakeAgent;
  const behAgent = agentBreakdown?.BehavioralTrustAgent;

  const isVerified = verdict === "VERIFIED";
  const isFlagged = verdict === "FLAGGED";
  const isRejected = verdict === "REJECTED";

  const nodes = [
    {
      id: "doc",
      title: "Document Optics Node",
      agent: "DocumentForgeryAgent",
      weight: "35%",
      y: 65,
      accent: "#06b6d4",
      bgGradient: "from-cyan-500/20 to-cyan-950/40",
      border: "border-cyan-500/50",
      scoreLabel: `Forgery: ${docAgent?.raw_metric_score ?? 0.04}`,
      status: docAgent?.is_authentic !== false ? "PASS" : "FLAGGED",
      metricKey: "Laplacian & ELA Splicing",
      detail: `${docAgent?.signals?.laplacian_variance_ratio ?? "48.8"}x Sharpness • ${docAgent?.signals?.ela_max_patch_diff ?? "1.407"} ELA Diff`,
    },
    {
      id: "live",
      title: "Biometric Vision Node",
      agent: "LivenessDeepfakeAgent",
      weight: "40%",
      y: 160,
      accent: "#a855f7",
      bgGradient: "from-purple-500/20 to-purple-950/40",
      border: "border-purple-500/50",
      scoreLabel: `Deepfake: ${liveAgent?.raw_metric_score ?? 0.04}`,
      status: liveAgent?.is_authentic !== false ? "PASS" : "FLAGGED",
      metricKey: "2D FFT & Blink Kinematics",
      detail: `${liveAgent?.signals?.fft_high_freq_ratio ?? "0.399"} FFT Ratio • ${liveAgent?.signals?.blink_dip_ratio ?? "0.670"} Blink Dip`,
    },
    {
      id: "beh",
      title: "Motor Telemetry Node",
      agent: "BehavioralTrustAgent",
      weight: "25%",
      y: 255,
      accent: "#10b981",
      bgGradient: "from-emerald-500/20 to-emerald-950/40",
      border: "border-emerald-500/50",
      scoreLabel: `Trust: ${behAgent?.raw_metric_score ?? 0.97}`,
      status: behAgent?.is_authentic !== false ? "PASS" : "FLAGGED",
      metricKey: "Keystroke CV & Mouse Entropy",
      detail: `${behAgent?.signals?.typing_coef_variation ?? "0.22"} Keystroke CV • ${behAgent?.signals?.mouse_entropy_bits ?? "2.52"}b Entropy`,
    },
  ];

  return (
    <div className="relative rounded-3xl border border-[#2b144d]/80 bg-gradient-to-br from-[#0d041a] via-[#080212] to-[#120624] p-6 sm:p-7 shadow-2xl overflow-hidden">
      {/* Dynamic Background Noise / Grid */}
      <div className="absolute inset-0 bg-grid-mesh opacity-25 pointer-events-none" />
      <div className="absolute -left-12 -top-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#24103e] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/30 to-purple-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300 shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold font-heading text-white tracking-wide">
                Autonomous Neural Consensus & EVM Convergence Topology
              </h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 hidden sm:inline">
                Live Arbitrated
              </span>
            </div>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Three-stream adversarial inference converging via weighted voting into a single zero-PII cryptographic root
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono shrink-0">
          <span className="text-slate-400">Arbiter State:</span>
          <span
            className={`px-3 py-1 rounded-full font-bold border ${
              isVerified
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/60"
                : isFlagged
                ? "bg-amber-950/80 text-amber-300 border-amber-700/60"
                : "bg-rose-950/80 text-rose-300 border-rose-700/60"
            }`}
          >
            {verdict}
          </span>
        </div>
      </div>

      {/* Main SVG Convergence Canvas */}
      <div className="relative z-10 w-full mt-6">
        <svg
          viewBox="0 0 880 320"
          className="w-full h-auto max-h-[380px] overflow-visible select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Conduit Gradient Definitions */}
            <linearGradient id="streamDocGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="streamLiveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="streamBehGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
            </linearGradient>

            {/* Core Radial Glows */}
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isVerified ? "#10b981" : isFlagged ? "#f59e0b" : "#f43f5e"} stopOpacity="0.35" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.0" />
            </radialGradient>

            {/* Pulsing Dash Pattern Filters */}
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Animated Curved Energy Conduits (Bezier curves converging to (520, 160)) */}
          {/* Path 1: Document Node -> Arbiter */}
          <path
            d="M 230 65 C 370 65, 420 160, 520 160"
            fill="none"
            stroke="#1b0c30"
            strokeWidth="5"
          />
          <path
            d="M 230 65 C 370 65, 420 160, 520 160"
            fill="none"
            stroke="url(#streamDocGrad)"
            strokeWidth="2.5"
            strokeDasharray="8 8"
            className="animate-[dash_12s_linear_infinite]"
            filter="url(#glowFilter)"
            opacity={activeHoverNode === "doc" ? 1 : 0.75}
          />

          {/* Path 2: Biometric Node -> Arbiter */}
          <path
            d="M 230 160 C 370 160, 420 160, 520 160"
            fill="none"
            stroke="#1b0c30"
            strokeWidth="5"
          />
          <path
            d="M 230 160 C 370 160, 420 160, 520 160"
            fill="none"
            stroke="url(#streamLiveGrad)"
            strokeWidth="3.5"
            strokeDasharray="6 6"
            className="animate-[dash_8s_linear_infinite]"
            filter="url(#glowFilter)"
            opacity={activeHoverNode === "live" ? 1 : 0.9}
          />

          {/* Path 3: Behavioral Node -> Arbiter */}
          <path
            d="M 230 255 C 370 255, 420 160, 520 160"
            fill="none"
            stroke="#1b0c30"
            strokeWidth="5"
          />
          <path
            d="M 230 255 C 370 255, 420 160, 520 160"
            fill="none"
            stroke="url(#streamBehGrad)"
            strokeWidth="2.5"
            strokeDasharray="8 8"
            className="animate-[dash_14s_linear_infinite]"
            filter="url(#glowFilter)"
            opacity={activeHoverNode === "beh" ? 1 : 0.75}
          />

          {/* Outbound Anchor Beam from Arbiter (520, 160) to EVM Ledger Terminal (750, 160) */}
          <path
            d="M 580 160 L 730 160"
            fill="none"
            stroke="#1f0f35"
            strokeWidth="6"
          />
          <path
            d="M 580 160 L 730 160"
            fill="none"
            stroke={isVerified ? "#10b981" : isFlagged ? "#f59e0b" : "#f43f5e"}
            strokeWidth="3"
            strokeDasharray="4 4"
            className="animate-[dash_6s_linear_infinite]"
            filter="url(#glowFilter)"
          />

          {/* 1. LEFT ORBITAL AGENT NODES (3 Interactive Stations) */}
          {nodes.map((node) => {
            const isHovered = activeHoverNode === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(0, ${node.y - 36})`}
                onMouseEnter={() => setActiveHoverNode(node.id)}
                onMouseLeave={() => setActiveHoverNode(null)}
                className="cursor-pointer"
              >
                {/* Node Backing Box */}
                <rect
                  x="10"
                  y="0"
                  width="220"
                  height="72"
                  rx="14"
                  fill="#0b0416"
                  stroke={isHovered ? node.accent : "#29134a"}
                  strokeWidth={isHovered ? "2" : "1.2"}
                  className="transition-all duration-300"
                />

                {/* Node Status Dot */}
                <circle
                  cx="32"
                  cy="24"
                  r="6"
                  fill={node.status === "PASS" ? "#10b981" : "#f43f5e"}
                  className={node.status === "PASS" ? "animate-pulse" : ""}
                />

                {/* Node Title & Weight */}
                <text x="46" y="27" fill="#ffffff" fontSize="12" fontWeight="700" fontFamily="'Space Grotesk', sans-serif">
                  {node.title}
                </text>
                <text x="180" y="27" fill={node.accent} fontSize="10" fontWeight="600" fontFamily="'JetBrains Mono', monospace">
                  {node.weight}
                </text>

                {/* Node Metrics */}
                <text x="24" y="47" fill="#94a3b8" fontSize="10" fontFamily="'JetBrains Mono', monospace">
                  {node.metricKey}
                </text>
                <text x="24" y="60" fill="#cbd5e1" fontSize="9" fontFamily="'JetBrains Mono', monospace">
                  {node.detail}
                </text>

                {/* Port Anchor Pip */}
                <circle
                  cx="230"
                  cy="36"
                  r="5"
                  fill={node.accent}
                  stroke="#06020c"
                  strokeWidth="2"
                />
              </g>
            );
          })}

          {/* 2. CENTRAL CONSENSUS ARBITER CORE (X: 520, Y: 160) */}
          <g transform="translate(520, 160)">
            {/* Ambient Aura */}
            <circle cx="0" cy="0" r="75" fill="url(#coreGlow)" />

            {/* Outer Rotating Gyro Ring */}
            <circle
              cx="0"
              cy="0"
              r="58"
              fill="none"
              stroke="#3b1b63"
              strokeWidth="1.5"
              strokeDasharray="12 6"
              className="animate-[spin_24s_linear_infinite]"
            />

            {/* Inner Hexagonal Shield */}
            <circle
              cx="0"
              cy="0"
              r="48"
              fill="#0d041c"
              stroke={isVerified ? "#10b981" : isFlagged ? "#f59e0b" : "#f43f5e"}
              strokeWidth="2.5"
              filter="url(#glowFilter)"
            />

            {/* Center Content */}
            <text
              x="0"
              y="-12"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="9"
              fontWeight="600"
              fontFamily="'JetBrains Mono', monospace"
              letterSpacing="0.08em"
            >
              COMPOSITE
            </text>
            <text
              x="0"
              y="12"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="20"
              fontWeight="800"
              fontFamily="'JetBrains Mono', monospace"
            >
              {trustScore}
            </text>
            <text
              x="0"
              y="28"
              textAnchor="middle"
              fill={isVerified ? "#34d399" : isFlagged ? "#fbbf24" : "#fb7185"}
              fontSize="10"
              fontWeight="700"
              fontFamily="'Space Grotesk', sans-serif"
            >
              {isVerified ? "GRADE AAA" : isFlagged ? "REVIEW" : "REJECT"}
            </text>

            {/* Input Junction Pips */}
            <circle cx="-48" cy="0" r="4" fill="#f43f5e" stroke="#000" strokeWidth="1.5" />
            <circle cx="48" cy="0" r="4" fill="#10b981" stroke="#000" strokeWidth="1.5" />
          </g>

          {/* 3. RIGHT ANCHOR: ON-CHAIN EVM SMART CONTRACT DOCK (X: 730, Y: 160) */}
          <g transform="translate(730, 115)">
            <rect
              x="0"
              y="0"
              width="140"
              height="90"
              rx="14"
              fill="#0a0316"
              stroke="#10b981"
              strokeWidth="1.5"
              filter="url(#glowFilter)"
            />

            <text x="14" y="24" fill="#10b981" fontSize="10" fontWeight="700" fontFamily="'Space Grotesk', sans-serif">
              HARDHAT EVM ANCHOR
            </text>
            <text x="14" y="40" fill="#94a3b8" fontSize="9" fontFamily="'JetBrains Mono', monospace">
              Preimage Identity:
            </text>
            <text x="14" y="54" fill="#ecfdf5" fontSize="10" fontWeight="600" fontFamily="'JetBrains Mono', monospace">
              {identityHash ? `${identityHash.slice(0, 10)}...` : "0x8fa901c..."}
            </text>
            <text x="14" y="74" fill="#64748b" fontSize="9" fontFamily="'JetBrains Mono', monospace">
              Block #{blockchainTx?.blockNumber || 106} • Confirmed
            </text>
          </g>
        </svg>
      </div>

      {/* Footer Formula Explainer Strip */}
      <div className="relative z-10 mt-4 pt-3 border-t border-[#24103e] flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Arbiter Formula:</span>
          <code className="text-[11px] text-slate-300 px-2 py-0.5 rounded bg-[#130726] border border-[#2b144d]">
            Score = (1.0 - Doc)×0.35 + (1.0 - Live)×0.40 + (Beh)×0.25
          </code>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero-PII SHA-256 state anchoring active</span>
        </div>
      </div>
    </div>
  );
}
