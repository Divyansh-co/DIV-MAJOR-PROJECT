import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
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
  const res = await apiClient.post("/auth/login", { email, password });
  if (res.data?.token) {
    setAuthToken(res.data.token);
  }
  return res.data;
};

export const register = async (userData) => {
  const res = await apiClient.post("/auth/register", userData);
  if (res.data?.token) {
    setAuthToken(res.data.token);
  }
  return res.data;
};

export const getMe = async () => {
  const res = await apiClient.get("/auth/me");
  return res.data;
};

export const getDemoUsers = async () => {
  const res = await apiClient.get("/auth/demo-users");
  return res.data;
};

export const logout = () => {
  setAuthToken(null);
};

// -------------------------------------------------------------
// Health & Telemetry
// -------------------------------------------------------------
export const checkBackendHealth = async () => {
  const res = await apiClient.get("/health");
  return res.data;
};

// -------------------------------------------------------------
// KYC & Verification Pipeline
// -------------------------------------------------------------
export const verifyIdentity = async (payload) => {
  const res = await apiClient.post("/verify-identity", payload);
  return res.data;
};

export const getVerificationById = async (id) => {
  const res = await apiClient.get(`/verification/${encodeURIComponent(id)}`);
  return res.data;
};

export const getVerificationHistory = async (userId = null, viewAll = false) => {
  const params = {};
  if (userId) params.userId = userId;
  if (viewAll) params.all = "true";
  const res = await apiClient.get("/verification-history", { params });
  return res.data;
};

// -------------------------------------------------------------
// Reusable Credential Endpoints
// -------------------------------------------------------------
export const getCredential = async (identityHash) => {
  const res = await apiClient.get(`/credential/${encodeURIComponent(identityHash)}`);
  return res.data;
};

export const verifyCredentialToken = async (token) => {
  const res = await apiClient.post("/credential/verify", { token });
  return res.data;
};
