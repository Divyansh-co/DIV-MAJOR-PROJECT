const crypto = require("crypto");
const memoryStore = require("../store/memoryStore");

const JWT_SECRET = process.env.JWT_SECRET || "veritrust-super-secure-production-jwt-secret-2026";

/**
 * Creates a standard signed HMAC-SHA256 JWT token for an authenticated user.
 */
function signUserToken(user, expiresInSeconds = 86400 * 7) {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role || "OFFICER",
    institution: user.institution || "VeriTrust Identity Network",
    iat: now,
    exp: now + expiresInSeconds
  };

  const b64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
  const b64Payload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${b64Header}.${b64Payload}`)
    .digest("base64url");

  return `${b64Header}.${b64Payload}.${signature}`;
}

/**
 * Validates and decodes a signed HMAC-SHA256 JWT user token.
 */
function verifyUserToken(token) {
  if (!token || typeof token !== "string") {
    throw new Error("Missing or malformed token");
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT token format");
  }

  const [b64Header, b64Payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${b64Header}.${b64Payload}`)
    .digest("base64url");

  if (signature !== expectedSignature) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(Buffer.from(b64Payload, "base64url").toString("utf-8"));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp < now) {
    throw new Error("Token has expired");
  }

  return payload;
}

/**
 * Express middleware requiring authentication.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "UNAUTHORIZED",
      message: "Authentication required. Please provide a valid Bearer token in the Authorization header."
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyUserToken(token);
    const user = memoryStore.getUserById(decoded.sub);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "USER_NOT_FOUND",
        message: "User session expired or user account not recognized."
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "INVALID_TOKEN",
      message: err.message || "Invalid or expired authentication token."
    });
  }
}

/**
 * Express middleware with optional authentication.
 * Attaches req.user if a valid token is present; falls back to default demo officer if omitted.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = verifyUserToken(token);
      const user = memoryStore.getUserById(decoded.sub);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (_) {
      // Fall through to default fallback
    }
  }

  // Default to primary demo user if no token provided so unauthenticated requests still function smoothly
  const defaultUser = memoryStore.getUserByEmail("officer@veritrust.ai");
  req.user = defaultUser || {
    id: "usr_officer_sarah",
    name: "Sarah Chen",
    email: "officer@veritrust.ai",
    role: "COMPLIANCE_OFFICER",
    institution: "VeriTrust Global Security"
  };
  next();
}

module.exports = {
  signUserToken,
  verifyUserToken,
  requireAuth,
  optionalAuth
};
