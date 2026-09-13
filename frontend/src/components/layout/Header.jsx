import React, { useState } from "react";
import {
  Shield,
  Activity,
  FileCheck2,
  History,
  Award,
  ChevronDown,
  Check,
  Building,
  Sparkles,
} from "lucide-react";

/**
 * Header — Spaced & Free Top Navigation Bar
 * Theme: Ember Pink & Emerald White on Obsidian Dark Purple
 * Features:
 * - Generous, airy horizontal and vertical whitespace
 * - Floating segmented navigation with ember-to-emerald luminous accents
 * - Clean status indicators & multi-tenant demo profile switcher
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
    <header className="sticky top-0 z-40 w-full border-b border-[#2b144d]/70 bg-[#090314]/85 backdrop-blur-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-20 flex items-center justify-between gap-6">
        
        {/* 1. Brand Identity (Spacious & Clean) */}
        <div
          onClick={() => setActiveView("dashboard")}
          className="flex items-center gap-4 cursor-pointer select-none group flex-shrink-0"
        >
          {/* Glowing Emblem */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/50 to-emerald-400/50 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-11 h-11 rounded-xl bg-[#0e061e] border border-rose-500/40 p-0.5 flex items-center justify-center text-rose-400 group-hover:text-emerald-300 transition-colors shadow-lg shadow-black/60">
              <Shield className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-bold text-white tracking-tight font-sans">
                VeriTrust<span className="text-rose-400">.AI</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-950/90 to-[#1a0c33] text-rose-200 border border-rose-500/30 uppercase tracking-wide">
                Major Project
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 -mt-0.5 hidden sm:flex items-center gap-2">
              <span className="text-emerald-100/90 font-medium">Divyansh Mishra</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Agentic KYC & Blockchain Consensus</span>
            </div>
          </div>
        </div>

        {/* 2. Spaced & Free Floating Navigation Switcher */}
        <nav className="hidden md:flex items-center gap-2 bg-[#140828]/90 p-1.5 rounded-2xl border border-[#351860]/80 shadow-xl shadow-black/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={item.disabled}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 select-none ${
                  isActive
                    ? "bg-gradient-to-r from-rose-500/25 via-purple-600/20 to-emerald-500/20 text-white font-semibold shadow-md shadow-rose-950/40 border border-rose-500/40"
                    : item.disabled
                    ? "text-slate-600 cursor-not-allowed opacity-40"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive ? "text-rose-400" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 3. Right Telemetry & Profile Section */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Live Cluster Pills (Spacious) */}
          <div className="hidden xl:flex items-center gap-3 text-[11px] font-mono">
            {/* Agents Microservice */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#140828]/80 border border-[#351860]/70 text-slate-200 shadow-sm">
              <span
                className={`w-2 h-2 rounded-full ${
                  isAgentOnline
                    ? "bg-rose-400 shadow-[0_0_8px_#f43f5e]"
                    : "bg-red-500"
                }`}
              />
              <span className="font-medium">Agents:</span>
              <span className={isAgentOnline ? "text-rose-300 font-semibold" : "text-red-400"}>
                {isAgentOnline ? "Tri-Cluster" : "Down"}
              </span>
            </div>

            {/* EVM Blockchain */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#140828]/80 border border-[#351860]/70 text-slate-200 shadow-sm">
              <span
                className={`w-2 h-2 rounded-full ${
                  isChainOnline
                    ? "bg-emerald-300 shadow-[0_0_8px_#34d399]"
                    : "bg-red-500"
                }`}
              />
              <span className="font-medium">EVM:</span>
              <span className={isChainOnline ? "text-emerald-200 font-semibold" : "text-red-400"}>
                {isChainOnline ? "8545 Active" : "Down"}
              </span>
            </div>
          </div>

          {/* User Auth Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#140828] hover:bg-[#1f0d3d] border border-[#351860] transition-all duration-200 text-xs font-mono text-slate-200 shadow-md shadow-black/40 hover:border-rose-500/40"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500 to-emerald-400 p-[1px]">
                <div className="w-full h-full rounded-[7px] bg-[#0c0517] flex items-center justify-center text-rose-300 text-[10px] font-bold">
                  {currentUser?.name?.charAt(0) || "U"}
                </div>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[11px] font-semibold text-white leading-tight">
                  {currentUser?.name || "Demo Officer"}
                </div>
                <div className="text-[9px] text-slate-400 truncate max-w-[110px]">
                  {currentUser?.role?.replace("_", " ") || "COMPLIANCE"}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-[#0f061e] border border-[#3e1c70] shadow-2xl p-2.5 z-50 text-xs font-mono space-y-1.5 backdrop-blur-2xl">
                <div className="px-3.5 py-2.5 border-b border-[#2d1452] text-[10px] text-slate-400">
                  <span className="text-rose-400/90 uppercase block font-bold tracking-wider">
                    ACTIVE SESSION
                  </span>
                  <div className="text-white font-semibold font-sans text-sm mt-0.5">
                    {currentUser?.name}
                  </div>
                  <div className="text-emerald-300 text-[11px]">{currentUser?.email}</div>
                  <div className="text-slate-400 text-[10px] flex items-center gap-1.5 mt-1">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span>{currentUser?.institution}</span>
                  </div>
                </div>

                <div className="px-3.5 pt-2 pb-1 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
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
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-gradient-to-r from-rose-950/70 to-[#1f0d3d] border border-rose-500/50 text-rose-200 shadow-sm"
                          : "hover:bg-[#1a0a33] text-slate-300"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-white text-xs">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.institution}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row (Spaced & Accessible) */}
      <div className="md:hidden border-t border-[#2b144d]/60 px-4 py-2.5 flex items-center justify-around bg-[#0c0517]/95 overflow-x-auto gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-rose-500/20 text-white font-semibold border border-rose-500/40"
                  : item.disabled
                  ? "text-slate-600 opacity-40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-rose-400" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
