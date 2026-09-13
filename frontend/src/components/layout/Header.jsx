import React, { useState } from "react";
import {
  Shield,
  Cpu,
  Database,
  Activity,
  FileCheck2,
  History,
  Award,
  User,
  ChevronDown,
  Check,
  Building,
} from "lucide-react";

/**
 * Header — Institutional Top Navigation Bar
 * Features:
 * - View Navigation
 * - Cluster telemetry status pills (Agents, Hardhat EVM)
 * - User Authentication Profile & Demo Tenant Switcher
 */
export default function Header({
  activeView,
  setActiveView,
  systemHealth,
  hasActiveReport,
  currentUser,
  demoUsers,
  onSwitchUser,
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isAgentOnline = systemHealth?.agentsMicroservice?.connected ?? true;
  const isChainOnline = systemHealth?.blockchain?.connected ?? true;

  const navItems = [
    { id: "dashboard", label: "Command Center", icon: Activity },
    { id: "verify", label: "Verify Identity", icon: Shield },
    { id: "result", label: "Result & Proof", icon: FileCheck2, disabled: !hasActiveReport },
    { id: "history", label: "Audit Ledger", icon: History },
    { id: "credential", label: "Credential Vault", icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E2A44]/80 bg-[#060B14]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand Identity */}
        <div
          onClick={() => setActiveView("dashboard")}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 p-[1px] shadow-lg shadow-cyan-950/50">
            <div className="w-full h-full rounded-[11px] bg-[#060B14] flex items-center justify-center text-cyan-400 group-hover:text-white transition-colors">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">
                VeriTrust<span className="text-cyan-400">.AI</span>
              </span>
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 uppercase">
                Consensus v1.2
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 -mt-0.5 hidden sm:block">
              Multi-Agent Deepfake & On-Chain KYC
            </div>
          </div>
        </div>

        {/* View Navigation Switcher */}
        <nav className="flex items-center gap-1 bg-[#0B1526]/90 p-1 rounded-xl border border-[#1E2A44]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={item.disabled}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 select-none ${
                  isActive
                    ? "bg-[#111E36] text-cyan-300 shadow-sm border border-cyan-500/30"
                    : item.disabled
                    ? "text-slate-600 cursor-not-allowed opacity-50"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0E1B30]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Telemetry + User Switcher */}
        <div className="flex items-center gap-3">
          {/* Live Cluster Status (Desktop only) */}
          <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D182B] border border-[#1E2A44] text-slate-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  isAgentOnline ? "bg-cyan-400 pulse-radar" : "bg-rose-500"
                }`}
              />
              <span>Agents: {isAgentOnline ? "Active" : "Down"}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D182B] border border-[#1E2A44] text-slate-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  isChainOnline ? "bg-emerald-400 pulse-radar" : "bg-rose-500"
                }`}
              />
              <span>EVM: {isChainOnline ? "8545" : "Down"}</span>
            </div>
          </div>

          {/* User Auth Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D182B] hover:bg-[#112038] border border-[#1E2A44] transition-colors text-xs font-mono text-slate-200"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300 text-[10px] font-bold">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[11px] font-semibold text-white leading-tight">
                  {currentUser?.name || "Demo Officer"}
                </div>
                <div className="text-[9px] text-slate-400 truncate max-w-[110px]">
                  {currentUser?.role?.replace("_", " ") || "COMPLIANCE"}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0D182B] border border-[#1E2A44] shadow-2xl p-2 z-50 text-xs font-mono space-y-1">
                <div className="px-3 py-2 border-b border-[#1E2A44] text-[10px] text-slate-400">
                  <span className="text-slate-500 uppercase block font-bold">ACTIVE SESSION</span>
                  <div className="text-white font-semibold font-sans text-xs">
                    {currentUser?.name}
                  </div>
                  <div className="text-cyan-400 text-[10px]">{currentUser?.email}</div>
                  <div className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
                    <Building className="w-2.5 h-2.5" />
                    <span>{currentUser?.institution}</span>
                  </div>
                </div>

                <div className="px-3 py-1.5 text-[10px] text-slate-500 uppercase font-bold">
                  SWITCH DEMO PERSPECTIVE
                </div>

                {demoUsers?.map((u) => {
                  const isSelected = currentUser?.email === u.email;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        onSwitchUser(u);
                        setUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-cyan-950/70 border border-cyan-800 text-cyan-300"
                          : "hover:bg-[#111F36] text-slate-300"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-white text-[11px]">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.institution}</div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
