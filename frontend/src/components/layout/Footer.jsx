import React from "react";
import { ShieldCheck, Lock, Binary, Cpu } from "lucide-react";

/**
 * Footer — Institutional Security Posture & Cryptographic Ledger Footer
 */
export default function Footer() {
  return (
    <footer className="border-t border-[#2b144d]/70 bg-[#070312]/95 py-8 text-xs text-slate-300 font-mono mt-auto relative z-10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">VeriTrust AI</span>
          </div>
          <span className="text-purple-900 hidden sm:inline">|</span>
          <span className="text-rose-400 font-semibold">Major Project by Divyansh Mishra</span>
          <span className="text-purple-900 hidden sm:inline">|</span>
          <span className="text-slate-400">Institutional Identity & Synthetic Detection Mesh</span>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-rose-400" />
            <span>YuNet ONNX + 2D FFT Spectral Roll-Off</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-300" />
            <span>Zero-PII SHA-256 On-Chain Anchor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Binary className="w-3.5 h-3.5 text-rose-400" />
            <span>EVM Contract: 0x5FbD...aa3</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
