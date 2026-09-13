import React from "react";
import { ShieldCheck, Cpu, Database, Blocks } from "lucide-react";

export default function Navbar({ systemHealth }) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">VeriTrust</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50 uppercase tracking-wider">
                AI + Chain
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Multi-Agent Deepfake & Synthetic KYC Verification
            </p>
          </div>
        </div>

        {/* System Microservices Status Bar */}
        <div className="flex items-center space-x-2 sm:space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 hidden md:inline">Agents:</span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-200">FastAPI 8000</span>
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400 hidden md:inline">Gateway:</span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-200">Express 4000</span>
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <Blocks className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400 hidden md:inline">Chain:</span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span className="text-purple-300">EVM 31337</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
