// In-memory audit log store for KYC verifications and multi-tenant user accounts
const crypto = require("crypto");

class MemoryStore {
  constructor() {
    this.verifications = new Map();
    this.users = new Map();
    this.seedUsers();
    this.seedInitialData();
  }

  /**
   * Pre-seeds standard demo accounts for institutional presentations
   */
  seedUsers() {
    const demoUsers = [
      {
        id: "usr_officer_div",
        name: "Div Mishra",
        email: "div.mishra@veritrust.ai",
        passwordHash: this.hashPassword("password123"),
        role: "COMPLIANCE_LEAD",
        institution: "VeriTrust Global Security",
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
      },
      {
        id: "usr_analyst_marcus",
        name: "Marcus Cole",
        email: "analyst@apexbank.com",
        passwordHash: this.hashPassword("password123"),
        role: "RISK_ANALYST",
        institution: "Apex Global Bank",
        createdAt: new Date(Date.now() - 86400000 * 14).toISOString()
      }
    ];

    for (const u of demoUsers) {
      this.users.set(u.id, u);
    }
  }

  hashPassword(password) {
    return crypto.createHash("sha256").update(`salt_veritrust_${password}`).digest("hex");
  }

  getUserById(id) {
    return this.users.get(id) || null;
  }

  getUserByEmail(email) {
    if (!email) return null;
    const lower = email.trim().toLowerCase();
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === lower) {
        return u;
      }
    }
    return null;
  }

  saveUser(user) {
    if (!user.id) {
      user.id = `usr_${crypto.randomBytes(6).toString("hex")}`;
    }
    this.users.set(user.id, user);
    return user;
  }

  /**
   * Pre-seeds 6 realistic verification records (mix of VERIFIED, FLAGGED, and REJECTED)
   */
  seedInitialData() {
    const seedRecords = [
      {
        id: "VERI-8921-A",
        userId: "usr_officer_div",
        applicantName: "Div Rostova",
        documentType: "PASSPORT",
        documentNumber: "P98234112",
        identityHash: "0x8fa901c2db6d13543b5ca901e18d6e9f02271ca7b824e03f9059f23ad1e4f48b",
        trustScore: 945,
        verdict: "VERIFIED",
        verifierAgent: "LivenessDeepfakeAgent",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        reasoningTrail: [
          "[DocumentForgeryAgent] Laplacian sharpness variance: 218.4 (Organic). No edge tampering artifacts detected. MRZ checksum verified.",
          "[LivenessDeepfakeAgent] YuNet face detection confidence: 0.988. 2D FFT spectral roll-off ratio: 0.12 (Natural). 3 blink kinematic dips confirmed.",
          "[BehavioralTrustAgent] Keystroke interval CV: 0.26. Shannon mouse entropy: 3.65 bits. Standard desktop device fingerprint.",
          "[ConsensusArbiter] UNANIMOUS_CONSENSUS: Identity meets Institutional AAA grade. Zero anomalous signals.",
          "[BlockchainLedger] Anchored on-chain in Block #104. SHA-256 Preimage 0x8fa901c... immutable."
        ].join("\n"),
        blockchainTx: {
          txHash: "0x3b1c9402e6fd9c5ba82910fae620583b638971ad485c28d712fa920e8b15d91a",
          blockNumber: 104,
          recordedOnChain: true
        },
        agentBreakdown: {
          DocumentForgeryAgent: {
            forgery_score: 0.04,
            raw_metric_score: 0.04,
            flags: [],
            details: { sharpness_variance: 218.4, ela_mean_diff: 1.82, kerning_jitter_cv: 0.03 }
          },
          LivenessDeepfakeAgent: {
            deepfake_probability: 0.08,
            raw_metric_score: 0.08,
            flags: [],
            details: { face_confidence: 0.988, spectral_ratio: 0.12, blink_dips: 3 }
          },
          BehavioralTrustAgent: {
            trust_score: 0.96,
            raw_metric_score: 0.96,
            flags: [],
            details: { keystroke_cv: 0.26, mouse_entropy: 3.65 }
          }
        }
      },
      {
        id: "VERI-4102-B",
        userId: "usr_officer_div",
        applicantName: "Div Thorne",
        documentType: "NATIONAL_ID",
        documentNumber: "USA-5510294",
        identityHash: "0xd42901a88bfe13459c0091e771ad624f115a901c771a2b3c4d5e6f7a8b9c0d1e",
        trustScore: 240,
        verdict: "REJECTED",
        verifierAgent: "LivenessDeepfakeAgent",
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        reasoningTrail: [
          "[DocumentForgeryAgent] Document layout conforms to standard dimensions. Plastic edge boundary regular.",
          "[LivenessDeepfakeAgent] CRITICAL: 2D FFT spectral high-frequency roll-off ratio: 0.84 (Classic GAN face-swap tell). Blink kinematics absent over 4.5s window.",
          "[BehavioralTrustAgent] Synthetic browser runtime flags detected. Mouse trajectory contains repeated angular micro-teleports.",
          "[ConsensusArbiter] FRAUD_REJECTION: Generative AI deepfake injection detected. Trust score depressed to 240/1000.",
          "[BlockchainLedger] Rejection recorded on-chain in Block #106 for permanent fraud deterrence."
        ].join("\n"),
        blockchainTx: {
          txHash: "0x892a014e7dc218b950ad02fe11c97a82b4513ad88f114c0022449018cae7d23a",
          blockNumber: 106,
          recordedOnChain: true
        },
        agentBreakdown: {
          DocumentForgeryAgent: {
            forgery_score: 0.18,
            raw_metric_score: 0.18,
            flags: [],
            details: { sharpness_variance: 164.0, ela_mean_diff: 3.10, kerning_jitter_cv: 0.05 }
          },
          LivenessDeepfakeAgent: {
            deepfake_probability: 0.88,
            raw_metric_score: 0.88,
            flags: ["GAN_SPECTRAL_ROLLOFF_ANOMALY", "KINEMATIC_BLINK_ABSENT"],
            details: { face_confidence: 0.941, spectral_ratio: 0.84, blink_dips: 0 }
          },
          BehavioralTrustAgent: {
            trust_score: 0.38,
            raw_metric_score: 0.38,
            flags: ["VIRTUAL_CAMERA_ARTIFACTS"],
            details: { keystroke_cv: 0.42, mouse_entropy: 1.82 }
          }
        }
      },
      {
        id: "VERI-6719-C",
        userId: "usr_officer_div",
        applicantName: "Div Reed",
        documentType: "DRIVERS_LICENSE",
        documentNumber: "DL-8831920",
        identityHash: "0x4522bc0a8e4649f1327059a9ab0e85ecace6bc3cd5ac0983b98b5be1cbb9fe11",
        trustScore: 520,
        verdict: "FLAGGED",
        verifierAgent: "DocumentForgeryAgent",
        timestamp: new Date(Date.now() - 3600000 * 9).toISOString(),
        reasoningTrail: [
          "[DocumentForgeryAgent] WARNING: Laplacian sharpness variance discrepancy between photo box and background (14.2x ratio). Error Level Analysis confirms JPEG resave boundary.",
          "[LivenessDeepfakeAgent] Face matches document photo with 0.86 metric distance. Natural head rotation observed.",
          "[BehavioralTrustAgent] Standard behavioral profile. Session completed in 42 seconds from residential ISP.",
          "[ConsensusArbiter] MANUAL_REVIEW_FLAG: Document photo splice artifact detected. Identity flagged for compliance review.",
          "[BlockchainLedger] FLAGGED state anchored on-chain in Block #108."
        ].join("\n"),
        blockchainTx: {
          txHash: "0x12ea9941a88b192837482910fae620583b638971ad485c28d712fa920e8b991b",
          blockNumber: 108,
          recordedOnChain: true
        },
        agentBreakdown: {
          DocumentForgeryAgent: {
            forgery_score: 0.62,
            raw_metric_score: 0.62,
            flags: ["REGIONAL_SHARPNESS_DISCREPANCY", "ELA_SPLICING_DETECTED"],
            details: { sharpness_variance: 42.1, ela_mean_diff: 9.40, kerning_jitter_cv: 0.08 }
          },
          LivenessDeepfakeAgent: {
            deepfake_probability: 0.22,
            raw_metric_score: 0.22,
            flags: [],
            details: { face_confidence: 0.962, spectral_ratio: 0.19, blink_dips: 2 }
          },
          BehavioralTrustAgent: {
            trust_score: 0.88,
            raw_metric_score: 0.88,
            flags: [],
            details: { keystroke_cv: 0.22, mouse_entropy: 3.12 }
          }
        }
      },
      {
        id: "VERI-9941-D",
        userId: "usr_analyst_marcus",
        applicantName: "Div Sterling",
        documentType: "PASSPORT",
        documentNumber: "GBR-9481023",
        identityHash: "0xc62448185b932d9777ee55e374b2b25a44ba4c7fcca80045dfa4d407d44c91c7",
        trustScore: 980,
        verdict: "VERIFIED",
        verifierAgent: "LivenessDeepfakeAgent",
        timestamp: new Date(Date.now() - 3600000 * 14).toISOString(),
        reasoningTrail: [
          "[DocumentForgeryAgent] High-res security microprint verified. Guilloche pattern unbroken across portrait edge.",
          "[LivenessDeepfakeAgent] YuNet landmarks coherent across 60 frames. Farneback optical flow velocity continuous.",
          "[BehavioralTrustAgent] Organic cursor physics. Keystroke interval standard deviation conforms to human typing.",
          "[ConsensusArbiter] UNANIMOUS_CONSENSUS: Grade AAA verification. Reusable W3C/JWT credential issued.",
          "[BlockchainLedger] Anchored on-chain in Block #112."
        ].join("\n"),
        blockchainTx: {
          txHash: "0x7a1bc993560eb19bef6b468b77428c9f4f359ebc294da263b854dd3017254682",
          blockNumber: 112,
          recordedOnChain: true
        },
        agentBreakdown: {
          DocumentForgeryAgent: {
            forgery_score: 0.02,
            raw_metric_score: 0.02,
            flags: [],
            details: { sharpness_variance: 242.0, ela_mean_diff: 1.15, kerning_jitter_cv: 0.02 }
          },
          LivenessDeepfakeAgent: {
            deepfake_probability: 0.05,
            raw_metric_score: 0.05,
            flags: [],
            details: { face_confidence: 0.994, spectral_ratio: 0.09, blink_dips: 4 }
          },
          BehavioralTrustAgent: {
            trust_score: 0.98,
            raw_metric_score: 0.98,
            flags: [],
            details: { keystroke_cv: 0.20, mouse_entropy: 3.88 }
          }
        }
      },
      {
        id: "VERI-3301-E",
        userId: "usr_officer_div",
        applicantName: "Div Sybil 0x94B",
        documentType: "NATIONAL_ID",
        documentNumber: "SYB-0004918",
        identityHash: "0x9188a104c8f921ea028374920182736451928374650192837465019283746501",
        trustScore: 180,
        verdict: "REJECTED",
        verifierAgent: "BehavioralTrustAgent",
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
        reasoningTrail: [
          "[DocumentForgeryAgent] Synthesized document texture detected; uniform color gradient without paper grain.",
          "[LivenessDeepfakeAgent] Static image loop detected; identical frame hash repeated 48 times.",
          "[BehavioralTrustAgent] CRITICAL: Shannon mouse entropy: 0.12 bits (Strictly linear bot cadence). Form filled in 120ms via script injection.",
          "[ConsensusArbiter] FRAUD_REJECTION: Automated Sybil attack blocked at perimeter.",
          "[BlockchainLedger] Permanent blacklist anchor committed in Block #115."
        ].join("\n"),
        blockchainTx: {
          txHash: "0x5501837492018273645192837465019283746501928374650192837465018291",
          blockNumber: 115,
          recordedOnChain: true
        },
        agentBreakdown: {
          DocumentForgeryAgent: {
            forgery_score: 0.74,
            raw_metric_score: 0.74,
            flags: ["SYNTHETIC_TEXTURE_GENERATED"],
            details: { sharpness_variance: 8.5, ela_mean_diff: 11.2, kerning_jitter_cv: 0.14 }
          },
          LivenessDeepfakeAgent: {
            deepfake_probability: 0.95,
            raw_metric_score: 0.95,
            flags: ["FRAME_DUPLICATION_LOOP"],
            details: { face_confidence: 0.88, spectral_ratio: 0.72, blink_dips: 0 }
          },
          BehavioralTrustAgent: {
            trust_score: 0.08,
            raw_metric_score: 0.08,
            flags: ["BOT_LINEAR_ENTROPY", "SCRIPT_INJECTION_CADENCE"],
            details: { keystroke_cv: 0.02, mouse_entropy: 0.12 }
          }
        }
      },
      {
        id: "VERI-5520-F",
        userId: "usr_analyst_marcus",
        applicantName: "David Kim",
        documentType: "DRIVERS_LICENSE",
        documentNumber: "DL-3991048",
        identityHash: "0x3344556677889900112233445566778899001122334455667788990011223344",
        trustScore: 680,
        verdict: "FLAGGED",
        verifierAgent: "DocumentForgeryAgent",
        timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
        reasoningTrail: [
          "[DocumentForgeryAgent] WARNING: Font baseline kerning jitter on expiry date field (CV: 0.11). Non-standard font glyph detected.",
          "[LivenessDeepfakeAgent] High liveness confidence. Natural pupil constriction under simulated lighting.",
          "[BehavioralTrustAgent] Normal behavioral telemetry. 1 prior verification attempt in last 24h.",
          "[ConsensusArbiter] REVIEW_FLAG: Typographic inconsistency requires secondary manual review.",
          "[BlockchainLedger] Status logged in Block #118."
        ].join("\n"),
        blockchainTx: {
          txHash: "0x9988776655443322110099887766554433221100998877665544332211009988",
          blockNumber: 118,
          recordedOnChain: true
        },
        agentBreakdown: {
          DocumentForgeryAgent: {
            forgery_score: 0.44,
            raw_metric_score: 0.44,
            flags: ["FONT_KERNING_JITTER_ANOMALY"],
            details: { sharpness_variance: 140.0, ela_mean_diff: 4.8, kerning_jitter_cv: 0.11 }
          },
          LivenessDeepfakeAgent: {
            deepfake_probability: 0.16,
            raw_metric_score: 0.16,
            flags: [],
            details: { face_confidence: 0.975, spectral_ratio: 0.14, blink_dips: 3 }
          },
          BehavioralTrustAgent: {
            trust_score: 0.82,
            raw_metric_score: 0.82,
            flags: [],
            details: { keystroke_cv: 0.24, mouse_entropy: 3.20 }
          }
        }
      }
    ];

    for (const record of seedRecords) {
      this.verifications.set(record.id, record);
    }
  }

  save(record) {
    if (!record.id) {
      record.id = `VERI-${Math.floor(1000 + Math.random() * 9000)}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
    }
    if (!record.userId) {
      record.userId = "usr_officer_sarah";
    }
    this.verifications.set(record.id, record);
    return record;
  }

  getById(id) {
    return this.verifications.get(id) || null;
  }

  getByHash(identityHash) {
    if (!identityHash) return null;
    const clean = identityHash.toLowerCase();
    for (const record of this.verifications.values()) {
      if (record.identityHash && record.identityHash.toLowerCase() === clean) {
        return record;
      }
    }
    return null;
  }

  getAll(userId = null) {
    const list = Array.from(this.verifications.values());
    const filtered = userId ? list.filter((r) => r.userId === userId) : list;
    return filtered.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

module.exports = new MemoryStore();
