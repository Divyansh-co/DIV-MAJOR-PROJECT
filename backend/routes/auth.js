const express = require("express");
const router = express.Router();
const memoryStore = require("../store/memoryStore");
const { signUserToken, requireAuth } = require("../middleware/auth");

/**
 * POST /auth/login
 * Standard authentication for KYC officers and analysts
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "MISSING_CREDENTIALS",
      message: "Both email and password are required."
    });
  }

  const user = memoryStore.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: "INVALID_CREDENTIALS",
      message: "No user found with the provided email address."
    });
  }

  const passwordHash = memoryStore.hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return res.status(401).json({
      success: false,
      error: "INVALID_CREDENTIALS",
      message: "Incorrect password."
    });
  }

  const token = signUserToken(user);
  const { passwordHash: _, ...safeUser } = user;

  return res.json({
    success: true,
    message: `Authenticated as ${user.name} (${user.role})`,
    token,
    user: safeUser
  });
});

/**
 * POST /auth/register
 * New compliance officer or risk analyst registration
 */
router.post("/register", (req, res) => {
  const { name, email, password, role, institution } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "MISSING_FIELDS",
      message: "Name, email, and password are required for account creation."
    });
  }

  if (memoryStore.getUserByEmail(email)) {
    return res.status(409).json({
      success: false,
      error: "USER_EXISTS",
      message: "An account with this email address already exists."
    });
  }

  const newUser = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: memoryStore.hashPassword(password),
    role: role || "COMPLIANCE_OFFICER",
    institution: institution || "Financial Security Partner",
    createdAt: new Date().toISOString()
  };

  const saved = memoryStore.saveUser(newUser);
  const token = signUserToken(saved);
  const { passwordHash: _, ...safeUser } = saved;

  return res.status(201).json({
    success: true,
    message: "Account registered successfully.",
    token,
    user: safeUser
  });
});

/**
 * GET /auth/me
 * Retrieves current authenticated user session
 */
router.get("/me", requireAuth, (req, res) => {
  const { passwordHash: _, ...safeUser } = req.user;
  return res.json({
    success: true,
    user: safeUser
  });
});

/**
 * GET /auth/demo-users
 * Returns list of public demo officer accounts for live demo switching
 */
router.get("/demo-users", (req, res) => {
  const list = Array.from(memoryStore.users.values()).map(({ passwordHash: _, ...u }) => u);
  return res.json({
    success: true,
    users: list
  });
});

module.exports = router;
