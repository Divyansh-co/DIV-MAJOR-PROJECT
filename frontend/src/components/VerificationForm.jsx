import React, { useState } from "react";
import { UserCheck, ShieldAlert, Sparkles, FileText, Camera, Fingerprint, ArrowRight } from "lucide-react";

export default function VerificationForm({ onVerify, isAnalyzing }) {
  const [formData, setFormData] = useState({
    applicant_name: "Dr. Aris Thorne",
    document_type: "PASSPORT",
    document_number: "US94810294",
    simulate_forgery: false,
    simulate_deepfake: false,
    simulate_synthetic: false,
  });

  const [activeScenario, setActiveScenario] = useState("legit");

  const applyPreset = (type) => {
    setActiveScenario(type);
    if (type === "legit") {
      setFormData({
        applicant_name: "Dr. Aris Thorne",
        document_type: "PASSPORT",
        document_number: "US94810294",
        simulate_forgery: false,
        simulate_deepfake: false,
        simulate_synthetic: false,
      });
    } else if (type === "deepfake") {
      setFormData({
        applicant_name: "Julian Sterling (Deepfake)",
        document_type: "PASSPORT",
        document_number: "UK88204911",
        simulate_forgery: false,
        simulate_deepfake: true,
        simulate_synthetic: false,
      });
    } else if (type === "forgery") {
      setFormData({
        applicant_name: "Viktor Petrov (Tampered)",
        document_type: "NATIONAL_ID",
        document_number: "ID-5541098X",
        simulate_forgery: true,
        simulate_deepfake: false,
        simulate_synthetic: false,
      });
    } else if (type === "synthetic") {
      setFormData({
        applicant_name: "A.I. Generated Bot 04",
        document_type: "DRIVERS_LICENSE",
        document_number: "DL-9012399",
        simulate_forgery: false,
        simulate_deepfake: false,
        simulate_synthetic: true,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(formData);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            KYC Identity Verification
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch applicant document and biometrics to autonomous inspection agents
          </p>
        </div>

        {/* Quick test scenarios */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => applyPreset("legit")}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeScenario === "legit"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Legitimate
          </button>
          <button
            type="button"
            onClick={() => applyPreset("deepfake")}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeScenario === "deepfake"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Deepfake Attack
          </button>
          <button
            type="button"
            onClick={() => applyPreset("forgery")}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeScenario === "forgery"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Forged Document
          </button>
          <button
            type="button"
            onClick={() => applyPreset("synthetic")}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeScenario === "synthetic"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Synthetic Profile
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Applicant Full Name
            </label>
            <input
              type="text"
              value={formData.applicant_name}
              onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Document Type
            </label>
            <select
              value={formData.document_type}
              onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono"
            >
              <option value="PASSPORT">Passport (MRZ-compliant)</option>
              <option value="NATIONAL_ID">National Identity Card</option>
              <option value="DRIVERS_LICENSE">Driver's License (AAMVA)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Document Number
            </label>
            <input
              type="text"
              value={formData.document_number}
              onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono"
              required
            />
          </div>
        </div>

        {/* Diagnostic pipeline overrides */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Active Test Injection Flags:
          </span>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.simulate_deepfake}
                onChange={(e) => setFormData({ ...formData, simulate_deepfake: e.target.checked })}
                className="rounded border-slate-700 text-rose-500 focus:ring-rose-500/30 bg-slate-800"
              />
              <span className="text-slate-300">Simulate Deepfake Video</span>
            </label>
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.simulate_forgery}
                onChange={(e) => setFormData({ ...formData, simulate_forgery: e.target.checked })}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/30 bg-slate-800"
              />
              <span className="text-slate-300">Simulate Doc Tampering</span>
            </label>
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.simulate_synthetic}
                onChange={(e) => setFormData({ ...formData, simulate_synthetic: e.target.checked })}
                className="rounded border-slate-700 text-purple-500 focus:ring-purple-500/30 bg-slate-800"
              />
              <span className="text-slate-300">Simulate Synthetic Telemetry</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full relative overflow-hidden group bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Multi-Agent Pipeline Executing...</span>
            </>
          ) : (
            <>
              <span>Run Autonomous Verification & Anchor to Chain</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
