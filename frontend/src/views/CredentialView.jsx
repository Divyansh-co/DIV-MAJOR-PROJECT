import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Lock,
  Database,
  ExternalLink,
  QrCode,
  ArrowRight,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import TiltCard from "../components/motion/TiltCard";
import MagneticButton from "../components/motion/MagneticButton";
import StatusBadge from "../components/common/StatusBadge";
import { getCredential, verifyCredentialToken } from "../services/api";

/**
 * CredentialView — Reusable Verifiable Credential (VC) Vault
 * Institutional credential inspection and live third-party partner verification tester.
 */
export default function CredentialView({
  identityHash,
  activeReport,
  onStartVerify,
}) {
  const [credentialData, setCredentialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  // Third-party verification sandbox state
  const [partnerToken, setPartnerToken] = useState("");
  const [isVerifyingPartner, setIsVerifyingPartner] = useState(false);
  const [partnerVerificationResult, setPartnerVerificationResult] = useState(null);

  useEffect(() => {
    // If we have an identity hash, query the credential endpoint
    if (identityHash) {
      fetchCredential(identityHash);
    } else if (activeReport?.credential) {
      setCredentialData({
        identityHash: activeReport.identityHash,
        credentialToken: activeReport.credential.jwt,
        claims: activeReport.credential.claims,
      });
      setPartnerToken(activeReport.credential.jwt);
    }
  }, [identityHash, activeReport]);

  const fetchCredential = async (hash) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCredential(hash);
      if (res && res.data) {
        setCredentialData(res.data);
        setPartnerToken(res.data.credentialToken);
      }
    } catch (err) {
      console.error("Error fetching credential:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Could not retrieve credential. Make sure the identity is verified."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJwt = () => {
    if (!credentialData?.credentialToken) return;
    navigator.clipboard.writeText(credentialData.credentialToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestPartnerVerification = async () => {
    if (!partnerToken) return;
    setIsVerifyingPartner(true);
    setPartnerVerificationResult(null);
    try {
      const res = await verifyCredentialToken(partnerToken);
      setPartnerVerificationResult({
        success: true,
        data: res,
      });
    } catch (err) {
      setPartnerVerificationResult({
        success: false,
        error: err.response?.data?.error || err.message || "Credential verification failed",
        details: err.response?.data?.reason,
      });
    } finally {
      setIsVerifyingPartner(false);
    }
  };

  if (!identityHash && !activeReport?.credential && !credentialData) {
    return (
      <div className="text-center py-20 max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 mx-auto flex items-center justify-center text-emerald-400">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Reusable Verified Credential Vault</h2>
        <p className="text-xs text-slate-400 font-light leading-relaxed">
          Portable, cryptographically signed credentials are issued exclusively to applicants
          who have passed all multi-agent checks and anchored on the Ethereum audit chain.
        </p>
        <div className="pt-2">
          <MagneticButton variant="primary" onClick={onStartVerify}>
            Run Verification to Issue Credential
          </MagneticButton>
        </div>
      </div>
    );
  }

  const claims = credentialData?.claims || {};
  const subject = claims.credentialSubject || {};

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E2A44]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Award className="w-3.5 h-3.5" />
            <span>PORTABLE DECENTRALIZED IDENTITY CREDENTIAL (W3C / JWT)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Reusable Verified Credential
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Cross-institution trust token referencing immutable on-chain record:{" "}
            <span className="text-cyan-400">{credentialData?.identityHash || identityHash}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <MagneticButton
            variant="secondary"
            onClick={handleCopyJwt}
            className="px-4 py-2 text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Token
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" /> Copy JWT Token
              </>
            )}
          </MagneticButton>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left (6 cols): Digital Sovereign Credential Badge */}
        <div className="lg:col-span-6">
          <TiltCard glowColor="emerald" className="p-7" dataCursor="verified">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2A44]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-mono tracking-wide">
                    VERITRUST SOVEREIGN IDENTITY
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    EIP-712 / JWT Signed Standard
                  </div>
                </div>
              </div>
              <StatusBadge status="VERIFIED" size="sm" />
            </div>

            {/* Credential Content */}
            <div className="mt-6 space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">CREDENTIAL SUBJECT</span>
                  <span className="text-sm font-semibold text-white font-sans">
                    {subject.applicantName || activeReport?.applicantName || "Eleanor Vance"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">DOCUMENT TYPE</span>
                  <span className="text-slate-200">
                    {subject.documentType || activeReport?.documentType || "PASSPORT"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">DOCUMENT NUMBER</span>
                  <span className="text-slate-200">
                    {subject.documentNumber || activeReport?.documentNumber || "GBR-9481023"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">CONSENSUS TRUST SCORE</span>
                  <span className="text-emerald-400 font-bold">
                    {claims.trustScore || activeReport?.trustScore || 940} / 1000
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#080E1A] border border-[#1E2A44] space-y-2">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">ISSUER DID</span>
                  <span className="text-cyan-300 text-[11px] break-all">
                    {claims.iss || "did:veritrust:eth:0x5FbDB2315678afecb367f032d93F642f64180aa3"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">ON-CHAIN EVIDENCE ANCHOR</span>
                  <span className="text-emerald-300 text-[11px] break-all">
                    {claims.identityHash || credentialData?.identityHash || activeReport?.identityHash}
                  </span>
                </div>
              </div>

              {/* QR Code & Signature Strip */}
              <div className="pt-4 border-t border-[#1E2A44] flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>ALGORITHM: HMAC-SHA256 / secp256k1</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Valid for instant re-verification without KYC reprocessing
                  </div>
                </div>

                <div className="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Right (6 cols): Third-Party Verification Simulator Sandbox */}
        <div className="lg:col-span-6 space-y-6">
          <TiltCard glowColor="cyan" className="p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2A44]">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Partner Institution Verification Sandbox
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
                POST /credential/verify
              </span>
            </div>

            <p className="text-xs text-slate-400 font-light mt-3 leading-relaxed">
              Simulate an external financial institution (e.g. NeoBank, Crypto Exchange) verifying
              this token against our live Hardhat EVM smart contract in a single API call.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">
                  JWT CREDENTIAL TOKEN PAYLOAD
                </label>
                <textarea
                  rows={3}
                  value={partnerToken}
                  onChange={(e) => setPartnerToken(e.target.value)}
                  placeholder="Paste signed credential JWT here..."
                  className="w-full px-3 py-2 rounded-xl bg-[#080E1A] border border-[#1E2A44] text-[11px] font-mono text-cyan-300/90 focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex justify-end">
                <MagneticButton
                  variant="primary"
                  onClick={handleTestPartnerVerification}
                  disabled={isVerifyingPartner || !partnerToken}
                  className="px-4 py-2 text-xs"
                >
                  {isVerifyingPartner ? (
                    "Querying Smart Contract..."
                  ) : (
                    <>
                      <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" /> Test Verification Endpoint
                    </>
                  )}
                </MagneticButton>
              </div>

              {/* Partner Verification Response Display */}
              {partnerVerificationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-xl border font-mono text-xs ${
                    partnerVerificationResult.success
                      ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-300"
                      : "bg-rose-950/40 border-rose-700/60 text-rose-300"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1.5">
                    {partnerVerificationResult.success ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>200 OK — CREDENTIAL CRYPTOGRAPHICALLY VALID</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        <span>VERIFICATION REJECTED</span>
                      </>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-300 font-light leading-relaxed">
                    {partnerVerificationResult.success
                      ? partnerVerificationResult.data.message
                      : partnerVerificationResult.error}
                  </div>
                  {partnerVerificationResult.success && partnerVerificationResult.data?.data && (
                    <div className="mt-2 pt-2 border-t border-emerald-900/60 text-[10px] text-emerald-200">
                      On-Chain Match: Trust Score{" "}
                      {partnerVerificationResult.data.data.onChainRecord?.trustScore}/1000 • Verdict{" "}
                      {partnerVerificationResult.data.data.onChainRecord?.verdict}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}
