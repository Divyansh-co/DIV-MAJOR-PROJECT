// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IdentityVerification
 * @dev Anchors synthetic identity and deepfake KYC verification verdicts on-chain.
 * Only authorized backend verifier wallets can record verdicts to prevent tampering.
 */
contract IdentityVerification {
    address public owner;
    mapping(address => bool) public authorizedVerifiers;

    struct VerificationRecord {
        bytes32 identityHash;
        uint16 trustScore;      // 0 - 1000 (e.g. 960 = 96.0%)
        string verdict;         // "VERIFIED", "FLAGGED", "REJECTED"
        uint256 timestamp;
        string verifierAgent;   // Primary contributing agent (e.g. "DocumentForgeryAgent", "LivenessDeepfakeAgent")
        address verifierWallet; // Backend transaction signer
        bool exists;
    }

    // Mapping from identityHash to verification record
    mapping(bytes32 => VerificationRecord) private verifications;

    // Array of recorded identity hashes for audit trail enumeration
    bytes32[] public recordedIdentities;

    event VerificationRecorded(
        bytes32 indexed identityHash,
        uint16 trustScore,
        string verdict,
        uint256 timestamp,
        string verifierAgent,
        address indexed verifierWallet
    );

    event VerifierAuthorizationChanged(address indexed verifier, bool authorized);

    modifier onlyAuthorized() {
        require(msg.sender == owner || authorizedVerifiers[msg.sender], "Not authorized to record verification");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedVerifiers[msg.sender] = true;
    }

    /**
     * @notice Authorize or revoke a backend verifier wallet address.
     */
    function setAuthorizedVerifier(address _verifier, bool _status) external onlyOwner {
        require(_verifier != address(0), "Invalid verifier address");
        authorizedVerifiers[_verifier] = _status;
        emit VerifierAuthorizationChanged(_verifier, _status);
    }

    /**
     * @notice Write a new verification record. Only callable by authorized backend wallet.
     * @param _identityHash Cryptographic SHA-256 / keccak256 hash of document payload + reasoning trail.
     * @param _trustScore Aggregated multi-agent trust score (0 to 1000).
     * @param _verdict Categorical decision verdict (VERIFIED, FLAGGED, REJECTED).
     * @param _verifierAgent Primary agent that contributed most to the final decision.
     */
    function recordVerification(
        bytes32 _identityHash,
        uint16 _trustScore,
        string calldata _verdict,
        string calldata _verifierAgent
    ) external onlyAuthorized {
        require(_identityHash != bytes32(0), "Identity hash cannot be empty");
        require(!verifications[_identityHash].exists, "Verification record already exists for identity hash");

        verifications[_identityHash] = VerificationRecord({
            identityHash: _identityHash,
            trustScore: _trustScore,
            verdict: _verdict,
            timestamp: block.timestamp,
            verifierAgent: _verifierAgent,
            verifierWallet: msg.sender,
            exists: true
        });

        recordedIdentities.push(_identityHash);

        emit VerificationRecorded(
            _identityHash,
            _trustScore,
            _verdict,
            block.timestamp,
            _verifierAgent,
            msg.sender
        );
    }

    /**
     * @notice Read an existing verification record by its identity hash.
     * @param _identityHash The cryptographic hash of the identity.
     */
    function getVerification(bytes32 _identityHash)
        external
        view
        returns (
            bytes32 identityHash,
            uint16 trustScore,
            string memory verdict,
            uint256 timestamp,
            string memory verifierAgent,
            address verifierWallet
        )
    {
        VerificationRecord memory record = verifications[_identityHash];
        require(record.exists, "Verification record not found");

        return (
            record.identityHash,
            record.trustScore,
            record.verdict,
            record.timestamp,
            record.verifierAgent,
            record.verifierWallet
        );
    }

    /**
     * @notice Check if a verification record exists for a given identity hash.
     */
    function hasVerification(bytes32 _identityHash) external view returns (bool) {
        return verifications[_identityHash].exists;
    }

    /**
     * @notice Total number of anchored identity verifications.
     */
    function totalRecords() external view returns (uint256) {
        return recordedIdentities.length;
    }
}
