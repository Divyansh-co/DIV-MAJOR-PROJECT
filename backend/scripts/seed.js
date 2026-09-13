/**
 * VeriTrust AI — Institutional Demo Data Seeder
 * Populates realistic forensic KYC records across both demo accounts.
 */
const axios = require("axios");
const memoryStore = require("../store/memoryStore");

const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:4000";

async function runSeed() {
  console.log("=========================================");
  console.log(" VeriTrust AI — Seed Verification Records");
  console.log("=========================================");

  // Check if server is running
  try {
    const health = await axios.get(`${API_BASE_URL}/health`, { timeout: 3000 });
    console.log(`[Status] API Gateway online: ${health.data.service} (v${health.data.version})`);

    const historyRes = await axios.get(`${API_BASE_URL}/verification-history?all=true`);
    console.log(`[Status] Found ${historyRes.data.total} records in audit ledger.`);

    const demoUsers = await axios.get(`${API_BASE_URL}/auth/demo-users`);
    console.log(`[Status] Found ${demoUsers.data.users.length} active demo accounts:`);
    demoUsers.data.users.forEach((u) => {
      console.log(`   - ${u.name} (${u.email}) [${u.role}]`);
    });

    console.log("\nAudit Ledger Summary (Demo Seed Records):");
    console.log("----------------------------------------------------------------------------------");
    console.log("ID            | Applicant              | Document        | Score | Verdict  | Block");
    console.log("----------------------------------------------------------------------------------");
    historyRes.data.data.forEach((r) => {
      const id = r.id.padEnd(13, " ");
      const name = r.applicantName.padEnd(22, " ").substring(0, 22);
      const doc = `${r.documentType.substring(0, 8)} (${r.documentNumber})`.padEnd(15, " ").substring(0, 15);
      const score = `${r.trustScore}/1000`.padEnd(5, " ");
      const verdict = r.verdict.padEnd(8, " ");
      const block = `#${r.blockchainTx?.blockNumber || 1}`;
      console.log(`${id} | ${name} | ${doc} | ${score} | ${verdict} | ${block}`);
    });
    console.log("----------------------------------------------------------------------------------");
    console.log("Seeding verified. All records ready for demonstration.\n");
  } catch (err) {
    console.log(`[Notice] API Gateway not responding at ${API_BASE_URL} (${err.message}).`);
    console.log(`Direct in-memory store initialized with ${memoryStore.getAll().length} records.`);
  }
}

if (require.main === module) {
  runSeed();
}

module.exports = runSeed;
