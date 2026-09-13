const express = require("express");
const router = express.Router();
const agentClient = require("../services/agentClient");
const blockchainClient = require("../services/blockchainClient");
const memoryStore = require("../store/memoryStore");
const { optionalAuth } = require("../middleware/auth");

/**
 * Determines which agent contributed most to the final decision.
 */
function determinePrimaryVerifierAgent(agentResults, verdict) {
  if (!agentResults) return "MultiAgentOrchestrator";

  const doc = agentResults.DocumentForgeryAgent;
  const live = agentResults.LivenessDeepfakeAgent;
  const beh = agentResults.BehavioralTrustAgent;

  // In case of fraud or flag, attribute to the agent that raised the violation
  if (verdict === "REJECTED" || verdict === "FLAGGED") {
    if (live && (live.raw_metric_score >= 0.50 || (live.flags && live.flags.length > 0))) {
      return "LivenessDeepfakeAgent";
    }
    if (doc && (doc.raw_metric_score >= 0.35 || (doc.flags && doc.flags.length > 0))) {
      return "DocumentForgeryAgent";
    }
    if (beh && (beh.raw_metric_score <= 0.40 || (beh.flags && beh.flags.length > 0))) {
      return "BehavioralTrustAgent";
    }
  }

  // If verified, attribute to highest-weighted passing agent
  return "LivenessDeepfakeAgent";
}

/**
 * POST /verify-identity
 * Complete pipeline: Document Image & Biometrics -> Multi-Agent Pipeline -> SHA-256 Preimage Hash
 * -> Smart Contract Anchor on Hardhat EVM -> Reusable Verified Credential.
 */
router.post("/verify-identity", optionalAuth, async (req, res) => {
  try {
    const {
      applicant_name,
      applicantName,
      document_type,
      documentType,
      document_number,
      documentNumber,
      document_data,
      document_image,
      selfie_data,
      video_frames,
      ip_address,
      device_fingerprint,
      typing_cadence,
      mouse_events,
      session_duration,
      attempts_24h,
      simulate_forgery,
      simulate_deepfake,
      simulate_synthetic
    } = req.body;

    const name = (applicant_name || applicantName || "").trim();
    const docType = (document_type || documentType || "PASSPORT").toUpperCase();
    const docNum = (document_number || documentNumber || "").trim();

    // 1. Validate required text fields
    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        error: "INVALID_APPLICANT_NAME",
        message: "Applicant legal name is required and must contain at least 2 characters.",
        remediation: "Ensure the full name matches the uploaded government identification."
      });
    }

    if (!docNum || docNum.length < 3) {
      return res.status(400).json({
        success: false,
        error: "INVALID_DOCUMENT_NUMBER",
        message: "Document identifier is required and must contain at least 3 alphanumeric characters.",
        remediation: "Enter the official passport number, national ID code, or driver's license ID."
      });
    }

    const ALLOWED_DOC_TYPES = ["PASSPORT", "NATIONAL_ID", "DRIVERS_LICENSE"];
    if (!ALLOWED_DOC_TYPES.includes(docType)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_DOCUMENT_TYPE",
        message: `Unsupported document type '${docType}'. Must be one of: ${ALLOWED_DOC_TYPES.join(", ")}.`,
        remediation: "Select a valid document category from the dropdown."
      });
    }

    // 2. Validate uploaded document format if provided as Data URI
    const docPayload = document_data || document_image || "";
    if (docPayload.startsWith("data:")) {
      const mimeMatch = docPayload.match(/^data:([^;]+);base64,/);
      if (mimeMatch) {
        const mimeType = mimeMatch[1].toLowerCase();
        const validMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        if (!validMimes.includes(mimeType)) {
          return res.status(400).json({
            success: false,
            error: "UNSUPPORTED_FILE_TYPE",
            message: `Unsupported file format '${mimeType}'. Document forensics requires high-resolution image scans (JPEG, PNG, or WebP).`,
            remediation: "Convert your document to a clean PNG or JPEG image before re-uploading."
          });
        }
      }
    }

    // 3. Validate video frames if provided
    const frames = video_frames || req.body.frames;
    if (frames && Array.isArray(frames) && frames.length > 0 && frames.length < 2) {
      return res.status(400).json({
        success: false,
        error: "INSUFFICIENT_BIOMETRIC_FRAMES",
        message: "Biometric liveness detection requires at least 2 consecutive temporal frames for blink kinematics and optical flow continuity.",
        remediation: "Provide a multi-frame video sequence or capture a full 2-second clip."
      });
    }

    const normalizedPayload = {
      applicant_name: name,
      document_type: docType,
      document_number: docNum,
      document_data: docPayload || "mock-document-scan-base64",
      document_image: docPayload || "mock-document-scan-base64",
      selfie_data: selfie_data || "mock-selfie-frame-base64",
      video_frames: frames || ["frame_1", "frame_2", "frame_3", "frame_4"],
      ip_address: ip_address || req.ip || "127.0.0.1",
      device_fingerprint: device_fingerprint || req.headers["user-agent"] || "desktop-client",
      typing_cadence,
      mouse_events,
      session_duration: session_duration || 42,
      attempts_24h: attempts_24h || 1,
      simulate_forgery: Boolean(simulate_forgery),
      simulate_deepfake: Boolean(simulate_deepfake),
      simulate_synthetic: Boolean(simulate_synthetic)
    };

    // 4. Run Multi-Agent AI Pipeline (Python FastAPI microservice)
    let agentAssessment;
    try {
      agentAssessment = await agentClient.analyze(normalizedPayload);
    } catch (agentErr) {
      return res.status(502).json({
        success: false,
        error: "AGENT_CLUSTER_UNAVAILABLE",
        message: "The multi-agent detection cluster is temporarily unavailable or timed out.",
        details: agentErr.message,
        remediation: "Ensure the Python FastAPI microservice is running on port 8000."
      });
    }

    // 5. Compute cryptographic SHA-256 identity hash (Document Metadata + Reasoning Trail)
    const reasoningTrail = agentAssessment.reasoning_trail || agentAssessment.explanation || "";
    const identityHash = blockchainClient.computeIdentityHash(normalizedPayload, reasoningTrail);

    // 6. Determine primary contributing agent
    const verifierAgent = determinePrimaryVerifierAgent(
      agentAssessment.agent_results,
      agentAssessment.verdict
    );

    // 7. Anchor verification record to the Solidity smart contract via ethers.js
    let blockchainReceipt;
    try {
      blockchainReceipt = await blockchainClient.recordVerification(
        identityHash,
        agentAssessment.trust_score,
        agentAssessment.verdict,
        verifierAgent
      );
    } catch (chainErr) {
      return res.status(500).json({
        success: false,
        error: "BLOCKCHAIN_GATEWAY_UNAVAILABLE",
        message: "Failed to write verification consensus to the Ethereum smart contract.",
        details: chainErr.message,
        identityHash,
        trustScore: agentAssessment.trust_score,
        verdict: agentAssessment.verdict,
        remediation: "Check that the local Hardhat node or EVM RPC endpoint is active."
      });
    }

    // 8. Construct full verification report
    const record = {
      id: `VERI-${Math.floor(1000 + Math.random() * 9000)}-${identityHash.substring(2, 6).toUpperCase()}`,
      userId: req.user?.id || "usr_officer_sarah",
      applicantName: name,
      documentType: docType,
      documentNumber: docNum,
      identityHash,
      trustScore: agentAssessment.trust_score,
      verdict: agentAssessment.verdict,
      forgeryScore: agentAssessment.forgery_score,
      deepfakeProbability: agentAssessment.deepfake_probability,
      behavioralTrustScore: agentAssessment.behavioral_trust_score,
      verifierAgent,
      explanation: agentAssessment.explanation,
      reasoningTrail: agentAssessment.reasoning_trail,
      timestamp: new Date().toISOString(),
      blockchainTx: blockchainReceipt,
      agentBreakdown: agentAssessment.agent_results
    };

    // 9. If VERIFIED, issue a reusable verified credential (JWT)
    let credential = null;
    if (agentAssessment.verdict === "VERIFIED") {
      credential = blockchainClient.generateVerifiableCredential(record, blockchainReceipt);
      record.credential = credential;
    }

    // 10. Persist in memory store
    memoryStore.save(record);

    return res.status(201).json({
      success: true,
      message: `Identity verification completed with verdict: ${record.verdict}`,
      data: record
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "INTERNAL_PIPELINE_ERROR",
      message: "An unexpected error occurred during identity verification execution.",
      details: err.message
    });
  }
});

/**
 * GET /credential/:identityHash
 */
router.get("/credential/:identityHash", async (req, res) => {
  try {
    const { identityHash } = req.params;

    if (!identityHash || !identityHash.startsWith("0x")) {
      return res.status(400).json({
        success: false,
        error: "INVALID_HASH_FORMAT",
        message: "Invalid identityHash format: Must be a 32-byte hex string (0x...)."
      });
    }

    const onChainRecord = await blockchainClient.getVerification(identityHash);
    if (!onChainRecord) {
      return res.status(404).json({
        success: false,
        error: "CREDENTIAL_NOT_FOUND",
        message: `Identity hash ${identityHash} is not registered on the IdentityVerification smart contract.`
      });
    }

    if (onChainRecord.verdict !== "VERIFIED") {
      return res.status(403).json({
        success: false,
        error: "INELIGIBLE_FOR_CREDENTIAL",
        message: `Credential cannot be issued: On-chain status is '${onChainRecord.verdict}' (Trust Score: ${onChainRecord.trustScore}/1000). Only VERIFIED identities are eligible for reusable credentials.`,
        onChainRecord
      });
    }

    const cached = memoryStore.getByHash(identityHash);
    const applicantName = cached ? cached.applicantName : "Verified Sovereign Subject";
    const docType = cached ? cached.documentType : "PASSPORT";
    const docNum = cached ? cached.documentNumber : "ID-ONCHAIN";

    const recordForCredential = {
      id: cached ? cached.id : `VC-${identityHash.substring(2, 8).toUpperCase()}`,
      applicantName,
      documentType: docType,
      documentNumber: docNum,
      identityHash,
      trustScore: onChainRecord.trustScore,
      verdict: onChainRecord.verdict,
      verifierAgent: onChainRecord.verifierAgent
    };

    const onChainReceipt = {
      txHash: cached && cached.blockchainTx ? cached.blockchainTx.txHash : "ON_CHAIN_ANCHOR",
      blockNumber: cached && cached.blockchainTx ? cached.blockchainTx.blockNumber : 1,
      timestamp: new Date(onChainRecord.timestamp * 1000).toISOString()
    };

    const credential = blockchainClient.generateVerifiableCredential(recordForCredential, onChainReceipt);

    return res.json({
      success: true,
      message: "On-chain record verified. Reusable verified credential issued.",
      data: {
        identityHash,
        onChainStatus: onChainRecord,
        credentialToken: credential.jwt,
        claims: credential.claims
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "CREDENTIAL_QUERY_ERROR",
      message: "Failed to query reusable credential",
      details: err.message
    });
  }
});

/**
 * POST /credential/verify
 * Third-party institution verification endpoint
 */
router.post("/credential/verify", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        error: "MISSING_TOKEN",
        message: "Missing 'token' in request body."
      });
    }

    const verification = await blockchainClient.verifyCredentialToken(token);
    return res.json({
      success: true,
      message: "Credential cryptographically verified and confirmed against on-chain smart contract storage.",
      data: verification
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      verified: false,
      error: "CREDENTIAL_VERIFICATION_FAILED",
      reason: err.message
    });
  }
});

/**
 * GET /verification/:id
 */
router.get("/verification/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let record = memoryStore.getById(id);

    if (!record && id.startsWith("0x")) {
      record = memoryStore.getByHash(id);
    }

    if (!record) {
      if (id.startsWith("0x") && id.length === 66) {
        const onChainRecord = await blockchainClient.getVerification(id);
        if (onChainRecord) {
          return res.json({
            success: true,
            source: "SMART_CONTRACT_DIRECT",
            data: onChainRecord
          });
        }
      }

      return res.status(404).json({
        success: false,
        error: "NOT_FOUND",
        message: `Verification record '${id}' not found.`
      });
    }

    const onChainRecord = await blockchainClient.getVerification(record.identityHash);

    return res.json({
      success: true,
      data: {
        ...record,
        onChainRecord: onChainRecord || record.blockchainTx
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "LOOKUP_ERROR",
      message: err.message
    });
  }
});

/**
 * GET /verification-history
 * Returns verification records. Can be filtered by authenticated user or global scope.
 */
router.get("/verification-history", optionalAuth, (req, res) => {
  try {
    const requestedUserId = req.query.userId || req.query.user;
    const viewAll = req.query.all === "true";

    let targetUserId = null;
    if (!viewAll) {
      targetUserId = requestedUserId || req.user?.id || null;
    }

    const history = memoryStore.getAll(targetUserId);
    return res.json({
      success: true,
      total: history.length,
      userScope: targetUserId || "ALL_TENANTS",
      data: history
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "HISTORY_FETCH_ERROR",
      message: err.message
    });
  }
});

module.exports = router;
