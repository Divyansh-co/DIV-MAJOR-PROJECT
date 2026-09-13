import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Download,
} from "lucide-react";

/**
 * Header — Clean, Spaced Top Navigation Bar
 * Theme: Obsidian Black & Vibrant Hot Pink (#ff2a6d)
 * Matched to reference design:
 * - VT logo box with hot pink border and text
 * - "VeriTrust IDENTITY PLATFORM" branding
 * - Rounded solid hot pink active tab pill with glow
 * - Circular "DM" avatar with Divyansh Mishra / Compliance Lead
 * - PWA native installable action button
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
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const isAgentOnline = systemHealth?.agentsMicroservice?.connected ?? true;
  const isChainOnline = systemHealth?.blockchain?.connected ?? true;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "verify", label: "Verify Identity", icon: Shield },
    { id: "result", label: "Result & Proof", icon: FileCheck2, disabled: !hasActiveReport },
    { id: "history", label: "History", icon: History },
    { id: "credential", label: "Credential Vault", icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#20182b]/80 bg-[#08070b]/90 backdrop-blur-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-20 flex items-center justify-between gap-6">
        
        {/* 1. Brand Identity (Matched to Reference Screenshot: LD LLD Practice DESIGN PLATFORM) */}
        <div
          onClick={() => setActiveView("dashboard")}
          className="flex items-center gap-3.5 cursor-pointer select-none group flex-shrink-0"
        >
          {/* Box Logo with Hot Pink Border */}
          <div className="relative w-10 h-10 rounded-xl bg-[#0e0a16] border border-[#ff2a6d]/70 flex items-center justify-center text-[#ff2a6d] font-mono font-bold text-sm shadow-[0_0_15px_rgba(255,42,109,0.25)] group-hover:border-[#ff2a6d] group-hover:shadow-[0_0_20px_rgba(255,42,109,0.45)] transition-all">
            VT
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white tracking-tight font-heading">
              VeriTrust
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#ff2a6d] uppercase">
              IDENTITY PLATFORM
            </span>
          </div>
        </div>

        {/* 2. Sleek Center Navigation with Hot Pink Solid Active Pill (Matched to Screenshot) */}
        <nav className="hidden md:flex items-center gap-2 bg-[#0e0a16]/80 p-1.5 rounded-full border border-[#221a30]/80 shadow-2xl relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={item.disabled}
                onClick={() => setActiveView(item.id)}
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all duration-200 select-none ${
                  isActive
                    ? "text-white font-bold z-10"
                    : item.disabled
                    ? "text-slate-600 cursor-not-allowed opacity-35"
                    : "text-[#9ca3af] hover:text-white"
                }`}
              >
                {/* Active Hot Pink Glowing Pill Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#ff2a6d] to-[#ff416c] rounded-full shadow-[0_0_20px_rgba(255,42,109,0.45)] -z-0"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </span>
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

          {/* PWA Install Button */}
          {deferredPrompt && !isAppInstalled && (
            <button
              type="button"
              onClick={handleInstallApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ff2a6d] to-[#ff416c] text-white text-xs font-semibold shadow-[0_0_12px_rgba(255,42,109,0.35)] hover:brightness-110 transition-all select-none"
              title="Install VeriTrust AI as Desktop or Mobile Web App"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* User Auth Profile Dropdown (Matched to Screenshot DM circular avatar) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#0e0a16] hover:bg-[#191024] border border-[#261d33] transition-all duration-200 text-xs text-slate-200 shadow-md hover:border-[#ff2a6d]/50"
            >
              {/* Circular Pink Accent Avatar */}
              <div className="w-8 h-8 rounded-full border border-[#ff2a6d]/80 bg-[#190c1e] flex items-center justify-center text-[#ff2a6d] font-mono font-bold text-xs shadow-[0_0_10px_rgba(255,42,109,0.3)]">
                DM
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-white leading-tight">
                  {currentUser?.name || "Divyansh Mishra"}
                </div>
                <div className="text-[10px] text-[#8e92a4] truncate max-w-[120px]">
                  {currentUser?.role === "COMPLIANCE_OFFICER" || currentUser?.role === "COMPLIANCE_LEAD"
                    ? "Compliance Lead"
                    : currentUser?.role?.replace("_", " ") || "Compliance Lead"}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-[#8e92a4] transition-transform duration-200" />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-[#0d0915] border border-[#2b1f3d] shadow-2xl p-2.5 z-50 text-xs font-mono space-y-1.5 backdrop-blur-2xl">
                <div className="px-3.5 py-2.5 border-b border-[#221830] text-[10px] text-slate-400">
                  <span className="text-[#ff2a6d] uppercase block font-bold tracking-wider">
                    ACTIVE SESSION
                  </span>
                  <div className="text-white font-semibold font-sans text-sm mt-0.5">
                    {currentUser?.name || "Divyansh Mishra"}
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
