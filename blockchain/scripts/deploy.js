const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`[Deploy] Deploying IdentityVerification with account: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`[Deploy] Account balance: ${hre.ethers.formatEther(balance)} ETH`);

  const IdentityVerification = await hre.ethers.getContractFactory("IdentityVerification");
  const contract = await IdentityVerification.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`[Deploy] IdentityVerification successfully deployed to: ${contractAddress}`);

  const contractArtifact = await hre.artifacts.readArtifact("IdentityVerification");

  const configPayload = {
    contractAddress: contractAddress,
    abi: contractArtifact.abi,
    network: hre.network.name,
    chainId: hre.network.config.chainId || 31337,
    deployer: deployer.address,
    deployedAt: new Date().toISOString()
  };

  // 1. Write to /shared/contract-config.json
  const sharedDir = path.join(__dirname, "../../shared");
  if (!fs.existsSync(sharedDir)) {
    fs.mkdirSync(sharedDir, { recursive: true });
  }
  const sharedConfigPath = path.join(sharedDir, "contract-config.json");
  fs.writeFileSync(sharedConfigPath, JSON.stringify(configPayload, null, 2));
  console.log(`[Deploy] Shared contract configuration written to: ${sharedConfigPath}`);

  // 2. Also write to backend/config for fallback
  const backendConfigDir = path.join(__dirname, "../../backend/config");
  if (!fs.existsSync(backendConfigDir)) {
    fs.mkdirSync(backendConfigDir, { recursive: true });
  }
  const backendConfigPath = path.join(backendConfigDir, "IdentityVerification.json");
  fs.writeFileSync(backendConfigPath, JSON.stringify(configPayload, null, 2));
  console.log(`[Deploy] Backend configuration written to: ${backendConfigPath}`);
}

main().catch((error) => {
  console.error("[Deploy] Error during deployment:", error);
  process.exitCode = 1;
});
