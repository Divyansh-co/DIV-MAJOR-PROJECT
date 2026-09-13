# VeriTrust AI — Production Deployment Guide

This guide details how to deploy each component of the VeriTrust AI platform to production infrastructure:
- **Frontend**: Vercel
- **Backend Gateway**: Render or Railway
- **Agents Microservice**: Render or Railway
- **Smart Contract**: Ethereum Sepolia Testnet

---

## 1. Smart Contract Deployment (Ethereum Sepolia)

### Step 1: Configure Hardhat for Sepolia
In `blockchain/hardhat.config.js`, configure the Sepolia network:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

### Step 2: Deploy & Verify
```bash
cd blockchain
# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract on Etherscan
npx hardhat verify --network sepolia <DEPLOYED_CONTRACT_ADDRESS>
```
*Save the resulting contract address (e.g. `0x712a...`) for the backend gateway environment variable.*

---

## 2. Python Agents Microservice (Render / Railway)

The agents service is a lightweight CPU-optimized FastAPI application using OpenCV and YuNet ONNX.

### Deploying on Render / Railway:
1. **Repository Root**: Connect GitHub repository.
2. **Root Directory**: `agents`
3. **Runtime**: Python 3.10+
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Environment Variables:
| Variable | Value |
|---|---|
| `PORT` | `8000` (auto-set by Render/Railway) |
| `HOST` | `0.0.0.0` |
| `DEBUG` | `false` |
| `YUNET_MODEL_PATH` | `models/face_detection_yunet_2023mar.onnx` |

*Take note of the public service URL (e.g. `https://veritrust-agents.up.railway.app`).*

---

## 3. Node.js API Gateway (Render / Railway)

The gateway orchestrates agent requests, performs SHA-256 preimage hashing, signs verifiable credentials, and commits transactions to the Sepolia smart contract.

### Deploying on Render / Railway:
1. **Root Directory**: `backend`
2. **Runtime**: Node.js 18+
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`

### Environment Variables:
| Variable | Value | Notes |
|---|---|---|
| `PORT` | `4000` | Platform assigned |
| `NODE_ENV` | `production` | Enables production mode |
| `JWT_SECRET` | `generate-a-strong-random-hex-secret` | Used to sign user session tokens & VCs |
| `AGENTS_SERVICE_URL` | `https://veritrust-agents.up.railway.app` | URL from Step 2 |
| `EVM_RPC_URL` | `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY` | Alchemy or Infura Sepolia RPC |
| `VERIFICATION_CONTRACT_ADDRESS` | `0x...` | Deployed address from Step 1 |
| `BACKEND_SIGNER_PRIVATE_KEY` | `0x...` | Wallet private key with testnet Sepolia ETH |

*Take note of the backend URL (e.g. `https://veritrust-api.up.railway.app`).*

---

## 4. Frontend Deployment (Vercel)

The React + Vite frontend is a static single-page application.

### Deploying on Vercel:
1. **Import Project**: Connect your GitHub repository to Vercel.
2. **Root Directory**: Select `frontend`.
3. **Framework Preset**: `Vite`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### Environment Variables:
| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://veritrust-api.up.railway.app` |

---

## 5. Environment Mapping Reference

```
┌───────────────────────────────┬─────────────────────────┬──────────────────────────────────────────┐
│ Component                     │ Local Development       │ Production (Sepolia + Cloud)             │
├───────────────────────────────┼─────────────────────────┼──────────────────────────────────────────┤
│ EVM_RPC_URL                   │ http://127.0.0.1:8545   │ https://eth-sepolia.g.alchemy.com/v2/... │
│ VERIFICATION_CONTRACT_ADDRESS │ 0x5FbDB...aa3           │ 0xYourSepoliaContractAddress             │
│ AGENTS_SERVICE_URL            │ http://127.0.0.1:8000   │ https://veritrust-agents.up.railway.app  │
│ VITE_API_URL                  │ http://127.0.0.1:4000   │ https://veritrust-api.up.railway.app     │
└───────────────────────────────┴─────────────────────────┴──────────────────────────────────────────┘
```
