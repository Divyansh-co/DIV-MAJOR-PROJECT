const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

class BlockchainClient {
  constructor() {
    this.rpcUrl = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
    this.contractAddress = process.env.CONTRACT_ADDRESS || null;
    this.contractAbi = null;
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isConnected = false;
    this.jwtSecret = process.env.JWT_SECRET || "veritrust-sec-anchor-98214-auth-key";

    this.init();
  }

  async init() {
    try {
      this.provider = new ethers.JsonRpcProvider(this.rpcUrl);

      // 1. Primary: load contract ABI and deployed address from /shared/contract-config.json
      const sharedConfigPath = path.join(__dirname, "../../shared/contract-config.json");
      const backendConfigPath = path.join(__dirname, "../config/IdentityVerification.json");

      if (fs.existsSync(sharedConfigPath)) {
        const sharedData = JSON.parse(fs.readFileSync(sharedConfigPath, "utf-8"));
        this.contractAddress = this.contractAddress || sharedData.contractAddress;
        this.contractAbi = sharedData.abi;
      } else if (fs.existsSync(backendConfigPath)) {
        const configData = JSON.parse(fs.readFileSync(backendConfigPath, "utf-8"));
        this.contractAddress = this.contractAddress || configData.contractAddress || configData.address;
        this.contractAbi = configData.abi;
      }

      // Test RPC provider connectivity with a short timeout
      const network = await Promise.race([
        this.provider.getNetwork(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("RPC Timeout after 2500ms")), 2500))
      ]);

      // Connect backend verifier wallet (default Account #0 from local Hardhat node)
      this.signer = await this.provider.getSigner(0);
      const signerAddress = await this.signer.getAddress();

      if (this.contractAddress && this.contractAbi) {
        this.contract = new ethers.Contract(this.contractAddress, this.contractAbi, this.signer);
      }

      this.isConnected = true;
      console.log(`[BlockchainClient] Successfully connected to EVM Chain ID: ${network.chainId} at ${this.rpcUrl}`);
      console.log(`[BlockchainClient] Backend Verifier Wallet: ${signerAddress}`);
      console.log(`[BlockchainClient] Contract bound at: ${this.contractAddress}`);
    } catch (err) {
      this.isConnected = false;
      console.warn(`[BlockchainClient] Local chain connection pending (${err.message}).`);
    }
  }

  /**
   * Hashes identity document metadata + complete reasoning trail using SHA-256
   * so raw PII is never committed to public or consortium ledgers.
   */
  computeIdentityHash(payload, reasoningTrail = "") {
    const docType = payload.document_type || payload.documentType || "PASSPORT";
    const docNum = payload.document_number || payload.documentNumber || "UNKNOWN";
    const rawDocData = payload.document_data || payload.document_image || "";
    
    // Combine document PII and full reasoning trail
    const preimage = `DOC:${docType}:${docNum}:${rawDocData}::TRAIL:${reasoningTrail}`;
    const hash = crypto.createHash("sha256").update(preimage).digest("hex");
    return "0x" + hash;
  }

  /**
   * Writes a new verification record to the IdentityVerification smart contract.
   * Handles gas estimation, wallet nonce, network timeouts, and duplicate prevention.
   */
  async recordVerification(identityHash, trustScore, verdict, verifierAgent = "DocumentForgeryAgent") {
    // Attempt re-init if previously disconnected
    if (!this.isConnected || !this.contract) {
      await this.init();
    }

    if (!this.isConnected || !this.contract) {
      throw new Error(
        `Blockchain node unreachable at ${this.rpcUrl}. Unable to anchor immutable verification record.`
      );
    }

    try {
      // Check if already exists on-chain to give clear, friendly error
      const alreadyExists = await this.contract.hasVerification(identityHash);
      if (alreadyExists) {
        const existing = await this.contract.getVerification(identityHash);
        return {
          txHash: "EXISTING_ON_CHAIN",
          blockNumber: 0,
          contractAddress: this.contractAddress,
          recordedOnChain: true,
          status: "ALREADY_ANCHORED",
          existingRecord: {
            identityHash: existing[0],
            trustScore: Number(existing[1]),
            verdict: existing[2],
            timestamp: Number(existing[3]),
            verifierAgent: existing[4],
            verifierWallet: existing[5]
          }
        };
      }

      // 1. Gas estimation with safety margin
      let estimatedGas;
      try {
        estimatedGas = await this.contract.recordVerification.estimateGas(
          identityHash,
          trustScore,
          verdict,
          verifierAgent
        );
      } catch (gasErr) {
        throw new Error(`Gas estimation failed for recordVerification: ${gasErr.message}`);
      }

      // 2. Submit transaction with 20% gas buffer
      const tx = await this.contract.recordVerification(
        identityHash,
        trustScore,
        verdict,
        verifierAgent,
        { gasLimit: (estimatedGas * 120n) / 100n }
      );

      console.log(`[BlockchainClient] Transaction submitted: ${tx.hash}. Awaiting confirmation...`);

      // 3. Wait for 1 confirmation
      const receipt = await tx.wait(1);

      if (receipt.status === 0) {
        throw new Error(`Transaction ${tx.hash} reverted on-chain by EVM consensus.`);
      }

      console.log(`[BlockchainClient] Confirmed in block #${receipt.blockNumber} (Gas used: ${receipt.gasUsed})`);

      return {
        txHash: receipt.hash,
        blockNumber: Number(receipt.blockNumber),
        contractAddress: this.contractAddress,
        recordedOnChain: true,
        verifierWallet: receipt.from,
        gasUsed: Number(receipt.gasUsed),
        status: "CONFIRMED"
      };
    } catch (err) {
      console.error("[BlockchainClient] Error recording verification:", err.message);
      throw new Error(`Failed to record verification on-chain: ${err.message}`);
    }
  }

  /**
   * Queries on-chain record by identityHash directly from smart contract storage
   */
  async getVerification(identityHash) {
    if (!this.isConnected || !this.contract) {
      await this.init();
    }

    if (!this.isConnected || !this.contract) {
      return null;
    }

    try {
      const exists = await this.contract.hasVerification(identityHash);
      if (!exists) {
        return null;
      }

      const record = await this.contract.getVerification(identityHash);
      return {
        identityHash: record[0],
        trustScore: Number(record[1]),
        verdict: record[2],
        timestamp: Number(record[3]),
        verifierAgent: record[4],
        verifierWallet: record[5],
        onChain: true
      };
    } catch (err) {
      console.warn(`[BlockchainClient] Error reading verification for ${identityHash}: ${err.message}`);
      return null;
    }
  }

  /**
   * Generates a reusable cryptographically signed VeriTrust Credential (JWT-compatible).
   * Encodes on-chain proof metadata so third-party institutions can verify instantly.
   */
  generateVerifiableCredential(record, onChainReceipt) {
    const header = {
      alg: "HS256",
      typ: "VeriTrust-VC+JWT"
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: "did:veritrust:authority:main",
      sub: record.identityHash,
      jti: record.id || `VC-${Date.now()}`,
      iat: now,
      exp: now + (365 * 24 * 60 * 60), // 1-year credential validity
      applicant: {
        name: record.applicantName,
        documentType: record.documentType,
        documentNumberMasked: this.maskDocNumber(record.documentNumber)
      },
      verification: {
        verdict: record.verdict,
        trustScore: record.trustScore,
        confidence: `${(record.trustScore / 10).toFixed(1)}%`,
        verifierAgent: record.verifierAgent || "DocumentForgeryAgent"
      },
      onChainProof: {
        contractAddress: this.contractAddress,
        chainId: 31337,
        transactionHash: onChainReceipt.txHash,
        blockNumber: onChainReceipt.blockNumber,
        anchoredAt: onChainReceipt.timestamp || new Date().toISOString()
      }
    };

    const b64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
    const b64Payload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = crypto
      .createHmac("sha256", this.jwtSecret)
      .update(`${b64Header}.${b64Payload}`)
      .digest("base64url");

    return {
      jwt: `${b64Header}.${b64Payload}.${signature}`,
      claims: payload
    };
  }

  /**
   * Validates a reusable credential token: checks cryptographic signature and verifies
   * that on-chain record matches the claim.
   */
  async verifyCredentialToken(token) {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid credential format: Must be standard JWT (header.payload.signature).");
    }

    const [b64Header, b64Payload, signature] = parts;

    // 1. Validate signature
    const expectedSig = crypto
      .createHmac("sha256", this.jwtSecret)
      .update(`${b64Header}.${b64Payload}`)
      .digest("base64url");

    if (signature !== expectedSig) {
      throw new Error("Cryptographic signature mismatch: Credential was tampered or forged!");
    }

    // 2. Decode claims
    const payload = JSON.parse(Buffer.from(b64Payload, "base64url").toString("utf-8"));

    // 3. Expiration check
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error(`Credential expired on ${new Date(payload.exp * 1000).toISOString()}`);
    }

    // 4. On-chain validation
    const onChainRecord = await this.getVerification(payload.sub);
    if (!onChainRecord) {
      throw new Error(`On-chain record for identity ${payload.sub} not found on smart contract.`);
    }

    if (onChainRecord.verdict !== payload.verification.verdict) {
      throw new Error(
        `On-chain tamper detected: Credential claims '${payload.verification.verdict}', but smart contract records '${onChainRecord.verdict}'!`
      );
    }

    if (onChainRecord.trustScore !== payload.verification.trustScore) {
      throw new Error(
        `On-chain tamper detected: Credential claims score '${payload.verification.trustScore}', but smart contract records '${onChainRecord.trustScore}'!`
      );
    }

    return {
      valid: true,
      onChainMatched: true,
      onChainRecord,
      claims: payload
    };
  }

  maskDocNumber(docNum) {
    if (!docNum || docNum.length <= 4) return "****";
    const prefix = docNum.substring(0, 2);
    const suffix = docNum.substring(docNum.length - 4);
    return `${prefix}${"*".repeat(Math.max(2, docNum.length - 6))}${suffix}`;
  }
}

module.exports = new BlockchainClient();
