import React from "react";
import { GraduationCap, ExternalLink } from "lucide-react";

/**
 * Watermark — Prominent Institutional Creator & Academic Badge
 * Theme: Ember Pink & Emerald White on Obsidian Dark Purple
 */
export default function Watermark() {
  return (
    <aside
      aria-label="Academic Project Attribution"
      className="fixed bottom-4 right-4 z-50 select-none print:hidden pointer-events-auto"
    >
      <div className="relative group transition-all duration-300 transform hover:-translate-y-0.5">
        {/* Ambient Glow Aura */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500/40 via-purple-600/30 to-emerald-400/40 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#0d051c]/95 backdrop-blur-xl border border-rose-500/40 shadow-2xl shadow-black/80">
          {/* Pulsing Academic Cap Icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-emerald-400/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-inner">
            <GraduationCap className="w-4 h-4 text-rose-300 animate-pulse" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-emerald-200 to-white uppercase">
                Major Project
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-200 border border-rose-700/60">
                2026
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
              <span className="text-emerald-50">Divyansh Mishra</span>
              <span className="text-slate-500 text-[10px]">•</span>
              <a
                href="https://github.com/Divyansh-co/DIV-MAJOR-PROJECT"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-rose-400 hover:text-emerald-300 flex items-center gap-0.5 transition-colors"
                title="View GitHub Repository"
              >
                <span>GitHub</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
