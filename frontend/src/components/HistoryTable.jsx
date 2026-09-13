import React from "react";
import { History, ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink } from "lucide-react";

export default function HistoryTable({ history, onSelectRecord, activeRecordId }) {
  const getBadge = (verdict) => {
    switch (verdict) {
      case "VERIFIED":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-800";
      case "FLAGGED_DEEPFAKE":
        return "bg-rose-950/80 text-rose-400 border-rose-800";
      case "FLAGGED_FORGERY":
        return "bg-amber-950/80 text-amber-400 border-amber-800";
      default:
        return "bg-yellow-950/80 text-yellow-400 border-yellow-800";
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Immutable Verification Audit Trail
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Total Records: {history.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono">
              <th className="py-3 px-3">Audit ID</th>
              <th className="py-3 px-3">Applicant</th>
              <th className="py-3 px-3">Document</th>
              <th className="py-3 px-3">Trust Score</th>
              <th className="py-3 px-3">Verdict</th>
              <th className="py-3 px-3">Timestamp</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {history.map((record) => {
              const isSelected = activeRecordId === record.id;

              return (
                <tr
                  key={record.id}
                  onClick={() => onSelectRecord(record)}
                  className={`hover:bg-slate-900/80 cursor-pointer transition-colors ${
                    isSelected ? "bg-cyan-950/20" : ""
                  }`}
                >
                  <td className="py-3 px-3 text-cyan-300 font-semibold">{record.id}</td>
                  <td className="py-3 px-3 text-slate-200 font-sans font-medium">
                    {record.applicantName}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {record.documentType} ({record.documentNumber})
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-200">
                      {(record.trustScore / 10).toFixed(1)}%
                    </span>
                    <span className="text-slate-500 text-[10px] ml-1">
                      ({record.trustScore}/1000)
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getBadge(
                        record.verdict
                      )}`}
                    >
                      {record.verdict}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {new Date(record.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="text-cyan-400 hover:text-cyan-300 font-sans font-semibold text-xs inline-flex items-center space-x-1">
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
