const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IdentityVerification Smart Contract", function () {
  let contract;
  let owner;
  let verifier;
  let unauthorizedUser;

  beforeEach(async function () {
    [owner, verifier, unauthorizedUser] = await ethers.getSigners();

    const IdentityVerification = await ethers.getContractFactory("IdentityVerification");
    contract = await IdentityVerification.deploy();
    await contract.waitForDeployment();

    // Authorize verifier wallet
    await contract.setAuthorizedVerifier(verifier.address, true);
  });

  it("should deploy with owner as authorized verifier", async function () {
    expect(await contract.owner()).to.equal(owner.address);
    expect(await contract.authorizedVerifiers(owner.address)).to.be.true;
    expect(await contract.authorizedVerifiers(verifier.address)).to.be.true;
    expect(await contract.authorizedVerifiers(unauthorizedUser.address)).to.be.false;
  });

  it("should record a new verification and emit an event", async function () {
    const rawPayload = "applicant-doc-12345:biometric-hash-xyz:reasoning-trail";
    const identityHash = ethers.keccak256(ethers.toUtf8Bytes(rawPayload));
    const trustScore = 960; // 96.0%
    const verdict = "VERIFIED";
    const verifierAgent = "DocumentForgeryAgent";

    const tx = await contract.connect(verifier).recordVerification(identityHash, trustScore, verdict, verifierAgent);
    await tx.wait();

    // Check verification exists
    expect(await contract.hasVerification(identityHash)).to.be.true;
    expect(await contract.totalRecords()).to.equal(1n);

    // Read record
    const record = await contract.getVerification(identityHash);
    expect(record.identityHash).to.equal(identityHash);
    expect(record.trustScore).to.equal(960);
    expect(record.verdict).to.equal("VERIFIED");
    expect(record.verifierAgent).to.equal(verifierAgent);
    expect(record.verifierWallet).to.equal(verifier.address);
    expect(record.timestamp).to.be.greaterThan(0);
  });

  it("should reject duplicate verification records for the same identityHash", async function () {
    const identityHash = ethers.keccak256(ethers.toUtf8Bytes("duplicate-check"));
    await contract.connect(verifier).recordVerification(identityHash, 800, "VERIFIED", "LivenessDeepfakeAgent");

    await expect(
      contract.connect(verifier).recordVerification(identityHash, 800, "VERIFIED", "LivenessDeepfakeAgent")
    ).to.be.revertedWith("Verification record already exists for identity hash");
  });

  it("should reject writes from unauthorized wallets", async function () {
    const identityHash = ethers.keccak256(ethers.toUtf8Bytes("unauthorized-attempt"));

    await expect(
      contract.connect(unauthorizedUser).recordVerification(identityHash, 500, "FLAGGED", "BehavioralTrustAgent")
    ).to.be.revertedWith("Not authorized to record verification");
  });

  it("should reject reading non-existent verification records", async function () {
    const nonExistentHash = ethers.keccak256(ethers.toUtf8Bytes("does-not-exist"));

    await expect(
      contract.getVerification(nonExistentHash)
    ).to.be.revertedWith("Verification record not found");
  });
});
