import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AmbientCanvas from "./components/motion/AmbientCanvas";
import CustomCursor from "./components/motion/CustomCursor";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import DashboardView from "./views/DashboardView";
import VerifyFlowView from "./views/VerifyFlowView";
import ResultView from "./views/ResultView";
import HistoryView from "./views/HistoryView";
import CredentialView from "./views/CredentialView";
import ErrorCard from "./components/common/ErrorCard";
import Watermark from "./components/common/Watermark";
import {
  verifyIdentity,
  getVerificationHistory,
  checkBackendHealth,
  getDemoUsers,
  login,
  getMe,
} from "./services/api";

export default function App() {
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard" | "verify" | "result" | "history" | "credential"
  const [history, setHistory] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [selectedCredentialHash, setSelectedCredentialHash] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Authentication State (Default: Div Mishra, Compliance Lead)
  const [currentUser, setCurrentUser] = useState({
    id: "usr_officer_div",
    name: "Div Mishra",
    email: "div.mishra@veritrust.ai",
    role: "COMPLIANCE_LEAD",
    institution: "VeriTrust Global Security",
  });
  const [demoUsers, setDemoUsers] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [healthData, demoUsersData] = await Promise.allSettled([
        checkBackendHealth(),
        getDemoUsers(),
      ]);

      if (healthData.status === "fulfilled") {
        setSystemHealth(healthData.value);
      }

      if (demoUsersData.status === "fulfilled" && demoUsersData.value.users) {
        setDemoUsers(demoUsersData.value.users);
      }

      // Load initial history for current user
      await loadUserHistory(currentUser.id);
    } catch (err) {
      // Graceful fallback for demo
    }
  };

  const loadUserHistory = async (userId) => {
    try {
      const historyData = await getVerificationHistory(userId, true);
      if (historyData?.data) {
        setHistory(historyData.data);
        if (historyData.data.length > 0 && !activeReport) {
          setActiveReport(historyData.data[0]);
        }
      }
    } catch (err) {
      // Historical query fallback
    }
  };

  const handleSwitchUser = async (user) => {
    setCurrentUser(user);
    try {
      await login(user.email, "password123");
    } catch (_) {
      // Demo fallback
    }
    await loadUserHistory(user.id);
  };

  const handleVerifyComplete = async (formData) => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await verifyIdentity(formData);
      if (response && response.data) {
        setActiveReport(response.data);
        setHistory((prev) => [
          response.data,
          ...prev.filter((item) => item.id !== response.data.id),
        ]);
        setActiveView("result");
      }
    } catch (err) {
      const errData = err.response?.data;
      setErrorMessage(
        errData || {
          error: "VERIFICATION_FAILURE",
          message: err.message || "Failed to execute multi-agent verification pipeline.",
          remediation: "Check backend and agents service logs for details.",
        }
      );
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectRecordFromHistory = (record) => {
    setActiveReport(record);
    setActiveView("result");
  };

  const handleViewCredential = (hash) => {
    setSelectedCredentialHash(hash);
    setActiveView("credential");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08070b] text-slate-100 relative selection:bg-[#ff2a6d]/30 selection:text-[#ff2a6d]">
      {/* 1. Custom Ambient Canvas Background */}
      <AmbientCanvas />

      {/* 2. Custom Context-Aware Follower Cursor */}
      <CustomCursor />

      {/* 3. Institutional Top Navigation */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        systemHealth={systemHealth}
        hasActiveReport={Boolean(activeReport)}
        currentUser={currentUser}
        demoUsers={demoUsers}
        onSwitchUser={handleSwitchUser}
      />

      {/* 4. Global Error Alert Panel */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full relative z-20">
          <ErrorCard
            error={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />
        </div>
      )}

      {/* 5. Main Content Area with Spring Page Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {activeView === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <DashboardView
                systemHealth={systemHealth}
                history={history}
                onStartVerify={() => setActiveView("verify")}
                onSelectRecord={handleSelectRecordFromHistory}
              />
            </motion.div>
          )}

          {activeView === "verify" && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <VerifyFlowView
                onVerifyComplete={handleVerifyComplete}
                isAnalyzing={isAnalyzing}
              />
            </motion.div>
          )}

          {activeView === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <ResultView
                report={activeReport}
                onViewCredential={handleViewCredential}
                onNewVerification={() => setActiveView("verify")}
              />
            </motion.div>
          )}

          {activeView === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <HistoryView
                history={history}
                onSelectRecord={handleSelectRecordFromHistory}
                onViewCredential={handleViewCredential}
                onStartVerify={() => setActiveView("verify")}
              />
            </motion.div>
          )}

          {activeView === "credential" && (
            <motion.div
              key="credential"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <CredentialView
                history={history}
                identityHash={selectedCredentialHash || activeReport?.identityHash}
                activeReport={activeReport}
                onStartVerify={() => setActiveView("verify")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 6. Institutional Security Posture Footer */}
      <Footer />

      {/* 7. Persistent Academic Watermark */}
      <Watermark />
    </div>
  );
}
