import axios from "axios";
import { standaloneApi } from "./standaloneService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 6000,
});

// Attach Authorization Bearer token from localStorage if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("veritrust_auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("veritrust_auth_token", token);
  } else {
    localStorage.removeItem("veritrust_auth_token");
  }
};

export const getStoredAuthToken = () => {
  return localStorage.getItem("veritrust_auth_token");
};

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------
export const login = async (email, password) => {
  try {
    const res = await apiClient.post("/auth/login", { email, password });
    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res.data;
  } catch (err) {
    // In standalone web mode, simulate immediate successful login
    const mockToken = `mock_token_${Date.now()}`;
    setAuthToken(mockToken);
    return { token: mockToken, user: { email, name: "Div Mishra" } };
  }
};

export const register = async (userData) => {
  try {
    const res = await apiClient.post("/auth/register", userData);
    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res.data;
  } catch (err) {
    const mockToken = `mock_token_${Date.now()}`;
    setAuthToken(mockToken);
    return { token: mockToken, user: userData };
  }
};

export const getMe = async () => {
  try {
    const res = await apiClient.get("/auth/me");
    return res.data;
  } catch (err) {
    return {
      user: {
        id: "usr_officer_div",
        name: "Div Mishra",
        email: "div.mishra@veritrust.ai",
        role: "COMPLIANCE_LEAD",
        institution: "VeriTrust Global Security",
      },
    };
  }
};

export const getDemoUsers = async () => {
  try {
    const res = await apiClient.get("/auth/demo-users");
    return res.data;
  } catch (err) {
    return await standaloneApi.getDemoUsers();
  }
};

export const logout = () => {
  setAuthToken(null);
};

// -------------------------------------------------------------
// Health & Telemetry
// -------------------------------------------------------------
export const checkBackendHealth = async () => {
  try {
    const res = await apiClient.get("/health");
    return res.data;
  } catch (err) {
    return await standaloneApi.checkHealth();
  }
};

// -------------------------------------------------------------
// KYC & Verification Pipeline
// -------------------------------------------------------------
export const verifyIdentity = async (payload) => {
  try {
    const res = await apiClient.post("/verify-identity", payload);
    return res.data;
  } catch (err) {
    return await standaloneApi.executeVerification(payload);
  }
};

export const getVerificationById = async (id) => {
  try {
    const res = await apiClient.get(`/verification/${encodeURIComponent(id)}`);
    return res.data;
  } catch (err) {
    return await standaloneApi.getVerificationById(id);
  }
};

export const getVerificationHistory = async (userId = null, viewAll = false) => {
  try {
    const params = {};
    if (userId) params.userId = userId;
    if (viewAll) params.all = "true";
    const res = await apiClient.get("/verification-history", { params });
    return res.data;
  } catch (err) {
    return await standaloneApi.getHistory(userId, viewAll);
  }
};

// -------------------------------------------------------------
// Reusable Credential Endpoints
// -------------------------------------------------------------
export const getCredential = async (identityHash) => {
  try {
    const res = await apiClient.get(`/credential/${encodeURIComponent(identityHash)}`);
    return res.data;
  } catch (err) {
    return await standaloneApi.getCredential(identityHash);
  }
};

export const verifyCredentialToken = async (token) => {
  try {
    const res = await apiClient.post("/credential/verify", { token });
    return res.data;
  } catch (err) {
    return await standaloneApi.verifyCredentialToken(token);
  }
};

