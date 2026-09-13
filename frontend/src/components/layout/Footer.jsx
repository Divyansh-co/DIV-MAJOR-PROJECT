import React from "react";
import { ShieldCheck, Lock, Binary, Cpu } from "lucide-react";

/**
 * Footer — Institutional Security Posture & Cryptographic Ledger Footer
 */
export default function Footer() {
  return (
    <footer className="border-t border-[#1E2A44]/60 bg-[#060B14]/90 py-8 text-xs text-slate-400 font-mono mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">VeriTrust AI</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-cyan-400 font-medium">Major Project by Divyansh Mishra</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400">Institutional Identity & Synthetic Detection Mesh</span>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>YuNet ONNX + 2D FFT Spectral Roll-Off</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-PII SHA-256 On-Chain Anchor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Binary className="w-3.5 h-3.5 text-cyan-400" />
            <span>EVM Contract: 0x5FbD...aa3</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
