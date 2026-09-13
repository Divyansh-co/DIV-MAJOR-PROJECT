/**
 * VeriTrust AI — Blockchain Tamper-Detection Demonstration Script
 * Demonstrates how an immutable smart contract record permanently exposes
 * fraudulent attempts to modify verification verdicts, trust scores, or credentials.
 */

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

async function main() {
  console.log("================================================================================");
  console.log(" VERITRUST AI: SMART CONTRACT TAMPER-DETECTION AUDIT TEST");
  console.log("================================================================================\n");

  // 1. Connect to Local Hardhat EVM Chain
  const RPC_URL = "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = await provider.getSigner(0);

  // Load contract configuration from /shared/contract-config.json
  const configPath = path.join(__dirname, "../shared/contract-config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error(`Shared contract config not found at: ${configPath}`);
  }
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const contract = new ethers.Contract(config.contractAddress, config.abi, signer);

  console.log(`[Chain] Connected to Hardhat EVM (Chain ID: 31337)`);
  console.log(`[Chain] Smart Contract: ${config.contractAddress}`);
  console.log(`[Chain] Backend Verifier Wallet: ${await signer.getAddress()}\n`);

  // 2. Setup a Realistic Fraudulent Verification Case on-chain
  // A known deepfake attacker submitted fake credentials
  const applicantName = "Attacker_Deepfake_007";
  const docType = "PASSPORT";
  const docNum = "BAD-992100";
  const reasoningTrail = "LivenessDeepfakeAgent detected GAN spectral anomalies (0.46) and lack of voluntary blink kinematics.";

  // Compute cryptographic preimage hash (SHA-256)
  const preimage = `DOC:${docType}:${docNum}:raw_data::TRAIL:${reasoningTrail}`;
  const identityHash = "0x" + crypto.createHash("sha256").update(preimage).digest("hex");

  const trueTrustScore = 320; // 32.0%
  const trueVerdict = "REJECTED";
  const verifierAgent = "LivenessDeepfakeAgent";

  console.log("--------------------------------------------------------------------------------");
  console.log("STEP 1: Anchoring Legitimate AI Decision to Smart Contract");
  console.log("--------------------------------------------------------------------------------");
  console.log(`Applicant: ${applicantName}`);
  console.log(`Identity Hash: ${identityHash}`);
  console.log(`True Multi-Agent Score: ${trueTrustScore}/1000`);
  console.log(`True Verdict: ${trueVerdict}`);
  console.log(`Verifier Agent: ${verifierAgent}`);

  // Check if already anchored
  const alreadyExists = await contract.hasVerification(identityHash);
  if (!alreadyExists) {
    const tx = await contract.recordVerification(identityHash, trueTrustScore, trueVerdict, verifierAgent);
    const receipt = await tx.wait(1);
    console.log(`[Anchor] Confirmed in Block #${receipt.blockNumber} (Tx: ${receipt.hash})\n`);
  } else {
    console.log(`[Anchor] Record already anchored on-chain.\n`);
  }

  // 3. Attack Simulation: Tampering with Off-Chain Record
  console.log("--------------------------------------------------------------------------------");
  console.log("STEP 2: Simulating Malicious Tampering by Rogue Off-Chain Database Administrator");
  console.log("--------------------------------------------------------------------------------");
  console.log("An insider or hacker modifies the off-chain SQL/NoSQL database to forge approval:");
  
  const tamperedRecord = {
    identityHash: identityHash,
    claimedTrustScore: 990,      // FORGED from 320 -> 990
    claimedVerdict: "VERIFIED",  // FORGED from REJECTED -> VERIFIED
    claimedVerifier: "ExecutiveOverride"
  };

  console.log(`[TAMPER ATTEMPT] Claimed Verdict:     ${tamperedRecord.claimedVerdict}`);
  console.log(`[TAMPER ATTEMPT] Claimed Trust Score: ${tamperedRecord.claimedTrustScore}/1000\n`);

  // 4. Verifying against the On-Chain Smart Contract Truth
  console.log("--------------------------------------------------------------------------------");
  console.log("STEP 3: Querying Smart Contract to Expose Mismatch");
  console.log("--------------------------------------------------------------------------------");
  
  const onChainData = await contract.getVerification(identityHash);
  const onChainTruth = {
    identityHash: onChainData[0],
    trustScore: Number(onChainData[1]),
    verdict: onChainData[2],
    timestamp: new Date(Number(onChainData[3]) * 1000).toISOString(),
    verifierAgent: onChainData[4],
    verifierWallet: onChainData[5]
  };

  console.log(`[ON-CHAIN TRUTH] Contract Verdict:     ${onChainTruth.verdict}`);
  console.log(`[ON-CHAIN TRUTH] Contract Trust Score: ${onChainTruth.trustScore}/1000`);
  console.log(`[ON-CHAIN TRUTH] Anchored At:          ${onChainTruth.timestamp}`);
  console.log(`[ON-CHAIN TRUTH] Signer Wallet:        ${onChainTruth.verifierWallet}\n`);

  // 5. Tamper Detection Analysis & Output
  console.log("--------------------------------------------------------------------------------");
  console.log("STEP 4: Tamper Detection Audit Results");
  console.log("--------------------------------------------------------------------------------");

  let tamperDetected = false;

  if (tamperedRecord.claimedVerdict !== onChainTruth.verdict) {
    console.log(`❌ [TAMPER DETECTED] Verdict Mismatch!`);
    console.log(`   - Off-Chain Claim:  '${tamperedRecord.claimedVerdict}'`);
    console.log(`   - On-Chain Reality: '${onChainTruth.verdict}'`);
    tamperDetected = true;
  }

  if (tamperedRecord.claimedTrustScore !== onChainTruth.trustScore) {
    console.log(`❌ [TAMPER DETECTED] Trust Score Mismatch!`);
    console.log(`   - Off-Chain Claim:  ${tamperedRecord.claimedTrustScore}/1000`);
    console.log(`   - On-Chain Reality: ${onChainTruth.trustScore}/1000 (Delta: ${tamperedRecord.claimedTrustScore - onChainTruth.trustScore} pts)`);
    tamperDetected = true;
  }

  if (tamperDetected) {
    console.log(`\n🚨 AUDIT VERDICT: FRAUD PREVENTED.`);
    console.log(`   The smart contract's immutable ledger successfully refuted the manipulated claim.`);
    console.log(`   Any second institution checking IdentityVerification.sol would immediately reject the applicant.`);
  } else {
    console.log(`\n✅ AUDIT VERDICT: Record matches on-chain truth.`);
  }

  console.log("================================================================================\n");
}

main().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
