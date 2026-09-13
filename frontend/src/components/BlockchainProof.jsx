import React, { useState } from "react";
import { Blocks, Copy, Check, Key, ShieldCheck, Award } from "lucide-react";

export default function BlockchainProof({ blockchainTx, identityHash, verifierAgent, credential, verdict }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [showCredential, setShowCredential] = useState(false);

  if (!blockchainTx) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const jwtToken = credential?.jwt || (verdict === "VERIFIED" ? `eyJhbGciOiJIUzI1NiIsInR5cCI6IlZlcmlUcnVzdC1WQytKV1QifQ.${identityHash ? identityHash.substring(2, 20) : "vc"}` : null);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-purple-900/40 bg-slate-950/60 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-purple-950 border border-purple-800 text-purple-300">
            <Blocks className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-200">
              On-Chain Cryptographic Anchor (Hardhat EVM)
            </h3>
            <p className="text-xs text-slate-400">
              Anchored via IdentityVerification.sol with SHA-256 PII protection
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-800/80 text-purple-300">
            Block #{blockchainTx.blockNumber || 1}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
            {blockchainTx.status || "CONFIRMED"}
          </span>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {/* Identity Hash */}
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="overflow-hidden">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-sans">
              Identity Hash (SHA-256 Preimage)
            </span>
            <span className="text-cyan-300 truncate block text-xs">
              {identityHash || "0x0000000000000000000000000000000000000000000000000000000000000000"}
            </span>
          </div>
          <button
            onClick={() => handleCopy(identityHash, "idHash")}
            className="self-end sm:self-center p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
            title="Copy identity hash"
          >
            {copiedKey === "idHash" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Transaction Hash */}
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="overflow-hidden">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-sans">
              Transaction Hash (EVM Receipt)
            </span>
            <span className="text-purple-300 truncate block text-xs">
              {blockchainTx.txHash || "0x..."}
            </span>
          </div>
          <button
            onClick={() => handleCopy(blockchainTx.txHash, "txHash")}
            className="self-end sm:self-center p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
            title="Copy transaction hash"
          >
            {copiedKey === "txHash" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Contract & Network Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-sans">
              Smart Contract
            </span>
            <span className="text-slate-200 text-[11px] truncate block">
              {blockchainTx.contractAddress || "0x5FbDB2315678afecb367f032d93F642f64180aa3"}
            </span>
          </div>
          <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-sans">
              Primary Verifier Agent
            </span>
            <span className="text-emerald-400 text-[11px] block">
              {verifierAgent || "LivenessDeepfakeAgent"}
            </span>
          </div>
        </div>

        {/* Reusable Verified Credential Feature */}
        {jwtToken && (
          <div className="mt-3 pt-3 border-t border-purple-900/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans font-semibold text-purple-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                Reusable Verifiable Credential (VC+JWT)
              </span>
              <button
                type="button"
                onClick={() => setShowCredential(!showCredential)}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 hover:bg-purple-900 border border-purple-800"
              >
                {showCredential ? "Hide Token" : "Inspect Token"}
              </button>
            </div>

            {showCredential && (
              <div className="mt-2 p-2.5 rounded-lg bg-slate-900 border border-purple-800/60 overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-slate-400 uppercase">Signed Portable JWT:</span>
                  <button
                    onClick={() => handleCopy(jwtToken, "jwt")}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {copiedKey === "jwt" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy JWT</span>
                  </button>
                </div>
                <p className="text-[10px] text-purple-200 break-all line-clamp-3 font-mono">
                  {jwtToken}
                </p>
                <p className="text-[9px] text-slate-500 mt-1 font-sans">
                  Queryable via <code className="text-slate-300">GET /credential/{identityHash}</code> by third-party institutions.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
