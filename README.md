# VeriTrust AI — Multi-Agent Deepfake & Synthetic Identity KYC Verification

**Live Demo:** [https://div-veritrust-ai.vercel.app](https://div-veritrust-ai.vercel.app)

## The Problem

KYC (Know Your Customer) verification is one of the most exploited weak points in digital banking and fintech onboarding today. As deepfake generation tools have become cheaper and more accessible, fraudsters are no longer just forging documents — they're generating fake faces, cloned voices, and synthetic identities that can pass traditional liveness checks.

Most existing KYC systems rely on a single verification layer (usually document OCR + a basic face match) and store results in a centralized database that can be silently altered after the fact. That leaves two gaps:

1. No system cross-checks multiple independent signals before deciding if an identity is real.
2. Once a verification decision is made, there's no tamper-proof way to prove it wasn't changed later — which matters a lot for compliance audits.

VeriTrust AI is my attempt at addressing both gaps in one system.

## What It Does

VeriTrust AI runs identity verification through three independent AI agents, each specializing in a different type of fraud signal, and then anchors the final decision on a blockchain so it can never be silently altered.

**The three agents:**

- **Document Forgery Agent** — analyzes uploaded ID documents for tampering signs like DPI/resolution inconsistencies across regions, font irregularities, and metadata mismatches.
- **Liveness & Deepfake Agent** — analyzes a short video/selfie clip for deepfake tells: blink pattern irregularities, unnatural facial boundary artifacts, and frame-to-frame inconsistencies.
- **Behavioral Trust Agent** — looks at session-level signals (typing cadence, mouse movement entropy, device/IP consistency) to catch bot-driven or scripted verification attempts.

An orchestrator layer runs all three agents concurrently, combines their scores through a weighted voting system, and produces a final verdict — **Verified**, **Flagged**, or **Rejected** — along with a human-readable reasoning trail explaining exactly which signals contributed to the decision.

That verdict, along with a cryptographic hash of the evidence (not the raw personal data), is then written to a smart contract on-chain. This means:

- No one — not even an admin — can quietly change a verdict after the fact.
- A verified identity can be issued as a reusable credential, so a second institution could trust an existing verification without re-running the entire process from scratch.

## Why Blockchain (and Not Just a Database)

This was a deliberate design decision, not decoration. A regular database can be edited without a trace. For a KYC system, that's a real compliance risk — regulators need to know a "Verified" record wasn't quietly changed to cover up fraud, or vice versa. Writing the verdict hash on-chain makes tampering detectable, and makes the verification portable across institutions without repeating the process.

**Flow:** User uploads a document + selfie clip → Backend forwards to the agents service → Orchestrator runs all 3 agents concurrently and produces a verdict + reasoning trail → Backend hashes the evidence and writes the verdict on-chain → Frontend displays the result with the on-chain transaction as proof.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, TailwindCSS, Framer Motion |
| Backend | Node.js, Express, ethers.js |
| Agent Pipeline | Python, FastAPI, OpenCV |
| Blockchain | Solidity, Hardhat (local dev) / Sepolia testnet |
| Deployment | Docker Compose (local), Vercel (frontend), Render/Railway (backend + agents) |


## Project Status

This is a final-year engineering project, currently in active development. The core pipeline (agents → orchestration → blockchain write) is functional; UI polish and testnet deployment are ongoing.

## What I'd Improve With More Time

- Swap the current lightweight heuristic-based forgery/liveness checks for a fine-tuned deep learning model trained on a labeled deepfake dataset.
- Add multi-institution demo support to actually show the reusable credential being trusted by a second "bank" instance.
- Add rate-limiting and anti-replay protection on the verification endpoint.

## Author

Built by Divyansh as a final-year B.Tech project, exploring how agentic AI systems and blockchain can work together to solve a real trust problem in digital identity verification.
