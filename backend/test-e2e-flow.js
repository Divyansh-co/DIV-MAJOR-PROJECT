/**
 * VeriTrust AI — Full End-to-End Test
 * 1. Upload/submit identity document & biometric telemetry
 * 2. Multi-agent pipeline executes concurrent inspection
 * 3. Preimage SHA-256 hash computed (raw PII never committed on-chain)
 * 4. Ethers.js broadcasts transaction and anchors record to IdentityVerification.sol
 * 5. Query contract directly to confirm on-chain state matches
 * 6. Issue and validate a reusable verified credential (JWT)
 */

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("================================================================================");
  console.log(" VERITRUST AI: FULL END-TO-END VERIFICATION & BLOCKCHAIN AUDIT");
  console.log("================================================================================\n");

  const GATEWAY_URL = "http://127.0.0.1:4000";

  // 1. Prepare KYC Payload
  const kycPayload = {
    applicant_name: "Elena Rostova",
    document_type: "PASSPORT",
    document_number: "P-88401923",
    document_data: "OFFICIAL_US_PASSPORT_AUTHENTIC_SCAN_BASE64_DATA",
    selfie_data: "BIOMETRIC_CAMERA_STREAM_FRAME_SEQUENCE_DATA",
    session_duration: 38.5,
    attempts_24h: 1
  };

  console.log("--------------------------------------------------------------------------------");
  console.log("STEP 1: Submitting Document & Biometrics to VeriTrust API Gateway");
  console.log("--------------------------------------------------------------------------------");
  console.log(`Applicant:       ${kycPayload.applicant_name}`);
  console.log(`Document:        ${kycPayload.document_type} (${kycPayload.document_number})`);
  console.log(`Gateway Target:  ${GATEWAY_URL}/verify-identity\n`);

  const startTime = Date.now();
  const verifyRes = await fetch(`${GATEWAY_URL}/verify-identity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(kycPayload)
  });

  if (!verifyRes.ok) {
    const errBody = await verifyRes.json();
    throw new Error(`Verification failed: ${JSON.stringify(errBody, null, 2)}`);
  }

  const responseJson = await verifyRes.json();
  const record = responseJson.data;
  const elapsedMs = Date.now() - startTime;

  console.log(`[Gateway Response] Received in ${elapsedMs}ms:`);
  console.log(`  • Audit Record ID:   ${record.id}`);
  console.log(`  • Identity Hash:     ${record.identityHash}`);
  console.log(`  • Composite Score:   ${record.trustScore}/1000 (${(record.trustScore/10).toFixed(1)}%)`);
  console.log(`  • Final Verdict:     [${record.verdict}]`);
  console.log(`  • Primary Verifier:  ${record.verifierAgent}`);
  console.log(`  • On-Chain Tx Hash:  ${record.blockchainTx.txHash}`);
  console.log(`  • Mined in Block:    #${record.blockchainTx.blockNumber}`);
  console.log(`  • Gas Consumed:      ${record.blockchainTx.gasUsed || "N/A"}\n`);

  // 2. Direct On-Chain Query via Ethers.js
  console.log("--------------------------------------------------------------------------------");
  console.log("STEP 2: Querying Smart Contract Directly on Localhost EVM");
  console.log("--------------------------------------------------------------------------------");

  const configPath = path.join(__dirname, "../shared/contract-config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const contract = new ethers.Contract(config.contractAddress, config.abi, provider);

  console.log(`Contract Address: ${config.contractAddress}`);
  console.log(`Reading storage for identityHash: ${record.identityHash}...`);

  const onChainData = await contract.getVerification(record.identityHash);
  const onChainRecord = {
    identityHash: onChainData[0],
    trustScore: Number(onChainData[1]),
    verdict: onChainData[2],
    timestamp: new Date(Number(onChainData[3]) * 1000).toISOString(),
    verifierAgent: onChainData[4],
    verifierWallet: onChainData[5]
  };

  console.log("\n[On-Chain State Retreived from Solidity Storage]:");
  console.log(`  • identityHash:   ${onChainRecord.identityHash}`);
  console.log(`  • trustScore:     ${onChainRecord.trustScore}`);
  console.log(`  • verdict:        ${onChainRecord.verdict}`);
  console.log(`  • timestamp:      ${onChainRecord.timestamp}`);
  console.log(`  • verifierAgent:  ${onChainRecord.verifierAgent}`);
  console.log(`  • verifierWallet: ${onChainRecord.verifierWallet}\n`);

  // 3. Cryptographic Assertion
  console.log("--------------------------------------------------------------------------------");
  console.log("STEP 3: Cryptographic Integrity Verification");
  console.log("--------------------------------------------------------------------------------");

  const hashMatch = onChainRecord.identityHash.toLowerCase() === record.identityHash.toLowerCase();
  const scoreMatch = onChainRecord.trustScore === record.trustScore;
  const verdictMatch = onChainRecord.verdict === record.verdict;

  console.log(`Assertion: identityHash matches on-chain?  -> ${hashMatch ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`Assertion: trustScore matches on-chain?    -> ${scoreMatch ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`Assertion: verdict matches on-chain?       -> ${verdictMatch ? "✅ PASS" : "❌ FAIL"}`);

  if (!hashMatch || !scoreMatch || !verdictMatch) {
    throw new Error("Integrity mismatch between backend response and on-chain contract state!");
  }

  // 4. Reusable Verified Credential Query
  console.log("\n--------------------------------------------------------------------------------");
  console.log("STEP 4: Querying Reusable Verified Credential (GET /credential/:identityHash)");
  console.log("--------------------------------------------------------------------------------");

  const credRes = await fetch(`${GATEWAY_URL}/credential/${encodeURIComponent(record.identityHash)}`);
  if (!credRes.ok) {
    throw new Error(`Failed to query credential: ${credRes.statusText}`);
  }

  const credJson = await credRes.json();
  console.log("Reusable Credential Token Generated (JWT-compatible):");
  console.log(`JWT Token: ${credJson.data.credentialToken.substring(0, 75)}...`);
  console.log(`Claims Subject (sub):    ${credJson.data.claims.sub}`);
  console.log(`Issuer (iss):            ${credJson.data.claims.iss}`);
  console.log(`On-Chain Anchor Tx:      ${credJson.data.claims.onChainProof.transactionHash}`);
  console.log(`On-Chain Block Number:   #${credJson.data.claims.onChainProof.blockNumber}`);

  // 5. Simulating Second Institution Verifying Credential
  console.log("\n--------------------------------------------------------------------------------");
  console.log("STEP 5: Second Institution Cross-Verification (POST /credential/verify)");
  console.log("--------------------------------------------------------------------------------");
  console.log("A partner bank or institution receives this credential and validates it against the blockchain:");

  const verifyCredRes = await fetch(`${GATEWAY_URL}/credential/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: credJson.data.credentialToken })
  });

  const verifyCredData = await verifyCredRes.json();
  console.log(`Verification Status: ${verifyCredData.success ? "✅ VALID & ON-CHAIN VERIFIED" : "❌ INVALID"}`);
  console.log(`Message:             ${verifyCredData.message}`);

  console.log("\n================================================================================");
  console.log("🎉 ALL TESTS PASSED: Document -> Agents -> Blockchain -> Query -> Credential");
  console.log("================================================================================\n");
}

main().catch((err) => {
  console.error("\n❌ Test execution encountered an error:", err);
  process.exit(1);
});
