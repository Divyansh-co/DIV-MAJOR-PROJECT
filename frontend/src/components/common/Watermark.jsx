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
        {/* Subtle Ambient Glow */}
        <div className="absolute -inset-0.5 bg-[#ff2a6d]/20 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0d0a14]/95 backdrop-blur-xl border border-[#261d33] shadow-2xl hover:border-[#ff2a6d]/50 transition-colors">
          {/* Glowing Hot Pink Status Dot (Matched to Screenshot) */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff2a6d] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff2a6d] shadow-[0_0_8px_#ff2a6d]" />
          </span>

          <span className="text-[10px] font-semibold tracking-wider text-[#7e8194] uppercase font-sans">
            BUILT BY
          </span>

          <span className="text-xs font-bold text-white tracking-tight">
            Divyansh Mishra
          </span>

          <span className="text-[#322b40] font-mono text-xs">|</span>

          <a
            href="https://github.com/Divyansh-co/DIV-MAJOR-PROJECT"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-emerald-400 hover:text-[#ff2a6d] flex items-center gap-1 transition-colors"
            title="View Project on GitHub"
          >
            <span>Project</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>
        </div>
      </div>
    </aside>
  );
}
