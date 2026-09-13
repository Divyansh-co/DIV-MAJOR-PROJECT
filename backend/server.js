require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const verificationRoutes = require("./routes/verification");
const agentClient = require("./services/agentClient");
const blockchainClient = require("./services/blockchainClient");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Standardized HTTP operational request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.url !== "/health") {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get("/health", async (req, res) => {
  const agentHealth = await agentClient.checkHealth();

  res.json({
    status: "online",
    service: "veritrust-backend-gateway",
    version: "1.2.0",
    blockchain: {
      connected: blockchainClient.isConnected,
      rpcUrl: blockchainClient.rpcUrl,
      contractAddress: blockchainClient.contractAddress || "not_deployed"
    },
    agentsMicroservice: {
      connected: agentHealth.online,
      url: agentClient.baseUrl,
      details: agentHealth.data || null
    }
  });
});

// Mount routes
app.use("/auth", authRoutes);
app.use("/", verificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "ENDPOINT_NOT_FOUND",
    message: `Route '${req.method} ${req.url}' not found on VeriTrust Gateway.`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[InternalError] ${err.message}`);
  res.status(500).json({
    success: false,
    error: "INTERNAL_SERVER_ERROR",
    message: err.message || "An unexpected server error occurred."
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` VeriTrust AI API Gateway v1.2.0`);
  console.log(` Listening on port: ${PORT}`);
  console.log(` Auth: /auth (JWT secp256k1/HS256)`);
  console.log(` Ready to verify identities & anchor records`);
  console.log(`=========================================`);
});
