import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Search,
  Filter,
  ArrowRight,
  Database,
  Calendar,
  Eye,
  FileCheck,
  Shield,
  Layers,
  ChevronRight,
  Award,
} from "lucide-react";
import TiltCard from "../components/motion/TiltCard";
import StatusBadge from "../components/common/StatusBadge";
import MagneticButton from "../components/motion/MagneticButton";

/**
 * HistoryView — High-Density Institutional Audit Ledger Table
 * Complete verification trail with real-time filters, search, and detail inspection.
 */
export default function HistoryView({
  history,
  onSelectRecord,
  onViewCredential,
  onStartVerify,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("ALL");
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Filter history
  const filtered = (history || []).filter((item) => {
    const matchesVerdict =
      verdictFilter === "ALL" || (item.verdict && item.verdict.toUpperCase() === verdictFilter);
    const matchesSearch =
      !searchTerm ||
      item.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.identityHash?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesVerdict && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header & Search / Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E2A44]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Layers className="w-3.5 h-3.5" />
            <span>IMMUTABLE AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Verification Audit Ledger
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Cryptographically anchored KYC consensus records indexed across the local EVM cluster.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <MagneticButton
            variant="primary"
            onClick={onStartVerify}
            className="px-4 py-2 text-xs"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            New Verification
          </MagneticButton>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0B1526]/80 p-3 rounded-2xl border border-[#1E2A44]">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, or hash..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#070D18] border border-[#1E2A44] text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Verdict Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "VERIFIED", "FLAGGED", "REJECTED"].map((v) => {
            const isActive = verdictFilter === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setVerdictFilter(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all select-none ${
                  isActive
                    ? "bg-[#14233C] text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0E1B30]"
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main High-Density Table */}
      <div className="rounded-2xl bg-[#0B1526]/80 border border-[#1E2A44] overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#080E1A] border-b border-[#1E2A44] text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Applicant Subject</th>
                <th className="py-3.5 px-4 font-semibold">Document & Type</th>
                <th className="py-3.5 px-4 font-semibold">Trust Score</th>
                <th className="py-3.5 px-4 font-semibold">Primary Verifier</th>
                <th className="py-3.5 px-4 font-semibold">Block Anchor</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1E2A44]/60 text-slate-300">
              {filtered.length > 0 ? (
                filtered.map((item) => {
                  const isVerified = item.verdict === "VERIFIED";
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#111F36]/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedRecord(item)}
                    >
                      <td className="py-3 px-4">
                        <StatusBadge status={item.verdict} size="sm" />
                      </td>

                      <td className="py-3 px-4 font-sans font-semibold text-white">
                        {item.applicantName}
                        <div className="text-[10px] text-slate-500 font-mono font-normal">
                          ID: {item.id}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-200">{item.documentType}</div>
                        <div className="text-[10px] text-slate-500">{item.documentNumber}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            item.trustScore >= 800
                              ? "text-emerald-400"
                              : item.trustScore >= 500
                              ? "text-amber-400"
                              : "text-rose-400"
                          }`}
                        >
                          {item.trustScore}/1000
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {item.verifierAgent || "MultiAgentOrchestrator"}
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-emerald-400 flex items-center gap-1">
                          <Database className="w-3 h-3" />
                          <span>Block #{item.blockchainTx?.blockNumber || 1}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                          {item.identityHash || "0x..."}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectRecord(item);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950/80 hover:text-cyan-300 text-slate-300 border border-slate-700 hover:border-cyan-600 transition-colors text-[10px]"
                          >
                            Inspect
                          </button>
                          {isVerified && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewCredential(item.identityHash);
                              }}
                              className="px-2 py-1 rounded bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 text-[10px]"
                              title="View Credential"
                            >
                              <Award className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No verification records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Quick Inspection Drawer / Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="w-full max-w-xl rounded-2xl bg-[#0D182B] border border-[#1E2A44] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2A44]">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedRecord.applicantName}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    Record ID: {selectedRecord.id}
                  </div>
                </div>
                <StatusBadge status={selectedRecord.verdict} size="sm" />
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#070D18] border border-[#1E2A44]">
                  <span className="text-slate-500 block text-[10px]">PREIMAGE IDENTITY HASH</span>
                  <span className="text-cyan-300 text-[11px] break-all select-all">
                    {selectedRecord.identityHash}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-[#070D18] border border-[#1E2A44]">
                    <span className="text-slate-500 block text-[10px]">DOCUMENT TYPE</span>
                    <span className="text-slate-200">
                      {selectedRecord.documentType} ({selectedRecord.documentNumber})
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#070D18] border border-[#1E2A44]">
                    <span className="text-slate-500 block text-[10px]">TRUST SCORE</span>
                    <span className="text-emerald-400 font-bold">
                      {selectedRecord.trustScore} / 1000
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#070D18] border border-[#1E2A44]">
                  <span className="text-slate-500 block text-[10px] mb-1">REASONING SUMMARY</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedRecord.reasoningTrail?.split("\n")[0] || "Verification processed."}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1E2A44] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectRecord(selectedRecord);
                      setSelectedRecord(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-800 text-xs font-mono text-cyan-300 hover:bg-cyan-900 transition-colors flex items-center gap-1.5"
                  >
                    Open Full Result View <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
