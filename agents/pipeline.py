import asyncio
from datetime import datetime
from typing import Any, Dict, List
from pydantic import BaseModel, Field

from config import (
    WEIGHTS,
    VERIFIED_THRESHOLD,
    FLAGGED_THRESHOLD,
    CRITICAL_DEEPFAKE_PROBABILITY,
    CRITICAL_FORGERY_SCORE,
    CRITICAL_BEHAVIORAL_TRUST_MIN,
)
from agents.document_forgery import DocumentForgeryAgent
from agents.liveness_deepfake import LivenessDeepfakeAgent
from agents.behavioral_trust import BehavioralTrustAgent
from agents.base import AgentResult


class PipelineAssessment(BaseModel):
    trust_score: int = Field(..., ge=0, le=1000, description="Composite Trust Score out of 1000 (0 to 1000)")
    verdict: str = Field(..., description="VERIFIED, FLAGGED, or REJECTED")
    forgery_score: float = Field(..., ge=0.0, le=1.0, description="Forgery probability from DocumentForgeryAgent")
    deepfake_probability: float = Field(..., ge=0.0, le=1.0, description="Deepfake probability from LivenessDeepfakeAgent")
    behavioral_trust_score: float = Field(..., ge=0.0, le=1.0, description="Trust score from BehavioralTrustAgent")
    reasoning_trail: str = Field(..., description="Comprehensive human-readable audit narrative")
    explanation: str = Field(..., description="Executive one-sentence decision summary")
    agent_results: Dict[str, AgentResult]
    weights: Dict[str, float]
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")


class MultiAgentPipeline:
    """
    Concurrent multi-agent orchestrator.
    Dispatches inspection tasks asynchronously across DocumentForgeryAgent,
    LivenessDeepfakeAgent, and BehavioralTrustAgent using a thread pool for CPU-bound OpenCV tasks.
    """

    def __init__(self):
        self.doc_agent = DocumentForgeryAgent()
        self.liveness_agent = LivenessDeepfakeAgent()
        self.behavioral_agent = BehavioralTrustAgent()
        self.weights = WEIGHTS

    async def run_async(self, input_payload: Dict[str, Any]) -> PipelineAssessment:
        # Execute all 3 agents concurrently in separate worker threads
        doc_task = asyncio.to_thread(self.doc_agent.analyze, input_payload)
        liveness_task = asyncio.to_thread(self.liveness_agent.analyze, input_payload)
        behavioral_task = asyncio.to_thread(self.behavioral_agent.analyze, input_payload)

        doc_result, liveness_result, behavioral_result = await asyncio.gather(
            doc_task, liveness_task, behavioral_task
        )

        return self._synthesize_consensus(
            input_payload, doc_result, liveness_result, behavioral_result
        )

    def run(self, input_payload: Dict[str, Any]) -> PipelineAssessment:
        """Synchronous wrapper for pipeline execution."""
        return asyncio.run(self.run_async(input_payload))

    # -------------------------------------------------------------------------
    # Consensus Synthesis & Reasoning Trail
    # -------------------------------------------------------------------------
    def _synthesize_consensus(
        self,
        payload: Dict[str, Any],
        doc_res: AgentResult,
        liveness_res: AgentResult,
        behavioral_res: AgentResult,
    ) -> PipelineAssessment:
        # Extract primary metrics
        forgery_score = doc_res.raw_metric_score
        deepfake_prob = liveness_res.raw_metric_score
        behavioral_trust = behavioral_res.raw_metric_score

        # Normalized authenticity components (1.0 = optimal, 0.0 = fraudulent)
        doc_auth = 1.0 - forgery_score
        liveness_auth = 1.0 - deepfake_prob
        behavioral_auth = behavioral_trust

        # Weighted voting formula
        w_doc = self.weights.get("document_forgery", 0.35)
        w_live = self.weights.get("liveness_deepfake", 0.40)
        w_beh = self.weights.get("behavioral_trust", 0.25)

        raw_composite = (doc_auth * w_doc) + (liveness_auth * w_live) + (behavioral_auth * w_beh)
        trust_score = int(round(raw_composite * 1000))
        trust_score = min(1000, max(0, trust_score))

        # Collect critical red flags
        all_flags: List[str] = doc_res.flags + liveness_res.flags + behavioral_res.flags
        has_critical_forgery = forgery_score >= CRITICAL_FORGERY_SCORE
        has_critical_deepfake = deepfake_prob >= CRITICAL_DEEPFAKE_PROBABILITY
        has_critical_bot = behavioral_trust <= CRITICAL_BEHAVIORAL_TRUST_MIN

        # Determine final categorical verdict: VERIFIED / FLAGGED / REJECTED
        if has_critical_deepfake:
            verdict = "REJECTED"
            explanation = "Identity verification REJECTED: High-confidence synthetic deepfake attack detected in biometric feed."
        elif has_critical_forgery:
            verdict = "REJECTED"
            explanation = "Identity verification REJECTED: Critical physical/digital document tampering and splicing artifacts detected."
        elif has_critical_bot and ("AUTOMATION_FRAMEWORK_DETECTED" in " ".join(behavioral_res.flags) or trust_score < FLAGGED_THRESHOLD):
            verdict = "REJECTED"
            explanation = "Identity verification REJECTED: Automated bot script execution and synthetic identity fraud signature detected."
        elif trust_score < FLAGGED_THRESHOLD:
            verdict = "REJECTED"
            explanation = f"Identity verification REJECTED: Composite trust score ({trust_score}/1000) falls below absolute security floor."
        elif trust_score < VERIFIED_THRESHOLD or len(all_flags) > 0:
            verdict = "FLAGGED"
            explanation = f"Identity verification FLAGGED for human compliance audit: Borderline trust score ({trust_score}/1000) with active forensic flags."
        else:
            verdict = "VERIFIED"
            explanation = f"Identity verification VERIFIED: High composite trust ({trust_score}/1000) with all biometric, document, and behavioral signals verified."

        # Generate human-readable reasoning trail
        reasoning_trail = self._build_reasoning_trail(
            applicant_name=payload.get("applicant_name", "Unknown Applicant"),
            document_type=payload.get("document_type", "PASSPORT"),
            trust_score=trust_score,
            verdict=verdict,
            doc_res=doc_res,
            liveness_res=liveness_res,
            behavioral_res=behavioral_res,
            weights={"doc": w_doc, "live": w_live, "beh": w_beh},
        )

        return PipelineAssessment(
            trust_score=trust_score,
            verdict=verdict,
            forgery_score=forgery_score,
            deepfake_probability=deepfake_prob,
            behavioral_trust_score=behavioral_trust,
            reasoning_trail=reasoning_trail,
            explanation=explanation,
            agent_results={
                "DocumentForgeryAgent": doc_res,
                "LivenessDeepfakeAgent": liveness_res,
                "BehavioralTrustAgent": behavioral_res,
            },
            weights=self.weights,
        )

    # -------------------------------------------------------------------------
    # Comprehensive Human-Readable Audit Trail Builder
    # -------------------------------------------------------------------------
    def _build_reasoning_trail(
        self,
        applicant_name: str,
        document_type: str,
        trust_score: int,
        verdict: str,
        doc_res: AgentResult,
        liveness_res: AgentResult,
        behavioral_res: AgentResult,
        weights: Dict[str, float],
    ) -> str:
        lines: List[str] = []
        lines.append(f"VERITRUST AI ORCHESTRATION AUDIT TRAIL")
        lines.append(f"================================================================================")
        lines.append(f"Applicant: {applicant_name} | Credential: {document_type}")
        lines.append(f"Timestamp: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}")
        lines.append(f"FINAL DECISION: [{verdict}] — Composite Trust Score: {trust_score}/1000 ({trust_score/10:.1f}%)")
        lines.append(f"--------------------------------------------------------------------------------\n")

        # 1. Document Forgery Agent Analysis
        lines.append(f"1. DOCUMENT FORGERY AGENT (Weight: {weights['doc']*100:.0f}%)")
        lines.append(f"   • Status: {'PASS' if doc_res.is_authentic else 'FLAGGED'} (Risk Level: {doc_res.risk_level})")
        lines.append(f"   • Forgery Index: {doc_res.raw_metric_score:.4f} | Authenticity Confidence: {doc_res.confidence_score*100:.1f}%")
        lines.append(f"   • Forensic Indicators:")
        lines.append(f"     - Laplacian Sharpness Ratio: {doc_res.signals.get('laplacian_variance_ratio', 'N/A')}x (Mean: {doc_res.signals.get('laplacian_mean_sharpness', 'N/A')})")
        lines.append(f"     - Max Font Baseline Jitter: {doc_res.signals.get('max_baseline_jitter_px', 'N/A')} px ({doc_res.signals.get('text_lines_analyzed', 0)} lines analyzed)")
        lines.append(f"     - Splicing Boundary Contours: {doc_res.signals.get('edge_splicing_contours', 0)} detected")
        lines.append(f"     - ELA Compression Error Ratio: {doc_res.signals.get('ela_quadrant_ratio', 'N/A')}x (Max Error: {doc_res.signals.get('ela_max_error', 'N/A')})")
        if doc_res.flags:
            lines.append(f"   • Identified Anomalies:")
            for flag in doc_res.flags:
                lines.append(f"     [!] {flag}")
        else:
            lines.append(f"   • Identified Anomalies: None. No pixel-level splicing, font kerning defects, or ELA anomalies found.")
        lines.append("")

        # 2. Liveness Deepfake Agent Analysis
        lines.append(f"2. LIVENESS & DEEPFAKE AGENT (Weight: {weights['live']*100:.0f}%)")
        lines.append(f"   • Status: {'PASS' if liveness_res.is_authentic else 'FLAGGED'} (Risk Level: {liveness_res.risk_level})")
        lines.append(f"   • Deepfake Probability: {liveness_res.raw_metric_score:.4f} | Model Detection Confidence: {liveness_res.signals.get('model_confidence', 0.90)*100:.1f}%")
        lines.append(f"   • Biometric Indicators:")
        lines.append(f"     - Frames Inspected: {liveness_res.signals.get('frames_analyzed', 0)} temporal video frames")
        lines.append(f"     - Eyelid Kinematic Blink Dip Ratio: {liveness_res.signals.get('blink_dip_ratio', 'N/A')} (Mean Openness: {liveness_res.signals.get('mean_eyelid_openness', 'N/A')})")
        lines.append(f"     - 2D FFT High-Frequency Energy Ratio: {liveness_res.signals.get('fft_high_freq_ratio', 'N/A')} (Threshold: {0.45})")
        lines.append(f"     - Temporal Optical Flow Acceleration: {liveness_res.signals.get('optical_flow_acceleration', 'N/A')} px/s²")
        lines.append(f"     - Facial Contour Boundary Gradient Ratio: {liveness_res.signals.get('boundary_gradient_ratio', 'N/A')}x")
        if liveness_res.flags:
            lines.append(f"   • Identified Anomalies:")
            for flag in liveness_res.flags:
                lines.append(f"     [!] {flag}")
        else:
            lines.append(f"   • Identified Anomalies: None. Voluntary blink kinematics, natural facial spectral roll-off, and coherent temporal optical flow confirmed.")
        lines.append("")

        # 3. Behavioral Trust Agent Analysis
        lines.append(f"3. BEHAVIORAL TRUST AGENT (Weight: {weights['beh']*100:.0f}%)")
        lines.append(f"   • Status: {'PASS' if behavioral_res.is_authentic else 'FLAGGED'} (Risk Level: {behavioral_res.risk_level})")
        lines.append(f"   • Behavioral Trust Score: {behavioral_res.raw_metric_score:.4f} | Interaction Risk: {behavioral_res.risk_level}")
        lines.append(f"   • Telemetry Indicators:")
        lines.append(f"     - Keystroke Rhythm CV: {behavioral_res.signals.get('typing_coef_variation', 'N/A')} (Mean Interval: {behavioral_res.signals.get('typing_mean_interval_ms', 'N/A')} ms)")
        lines.append(f"     - Cursor Trajectory Shannon Entropy: {behavioral_res.signals.get('mouse_entropy_bits', 'N/A')} bits (Samples: {behavioral_res.signals.get('sample_points_count', 0)})")
        lines.append(f"     - Session Elapsed Duration: {behavioral_res.signals.get('session_duration_sec', 'N/A')} seconds")
        lines.append(f"     - Repeat Submissions (24h): {behavioral_res.signals.get('attempts_24h', 1)} attempt(s)")
        if behavioral_res.flags:
            lines.append(f"   • Identified Anomalies:")
            for flag in behavioral_res.flags:
                lines.append(f"     [!] {flag}")
        else:
            lines.append(f"   • Identified Anomalies: None. Human-typical motor entropy, organic typing intervals, and authentic browser telemetry confirmed.")
        lines.append("")

        # 4. Consensus & Decision Synthesis
        lines.append(f"4. CONSENSUS SYNTHESIS & RISK ALLOCATION")
        lines.append(f"   • Weighted Formula: (1.0 - {doc_res.raw_metric_score:.2f})×{weights['doc']} + (1.0 - {liveness_res.raw_metric_score:.2f})×{weights['live']} + ({behavioral_res.raw_metric_score:.2f})×{weights['beh']} = {trust_score/1000:.3f}")
        if verdict == "VERIFIED":
            lines.append(f"   • Rationale: All 3 autonomous agents reported authentic signals with zero critical flags. Trust score {trust_score} exceeds the required {VERIFIED_THRESHOLD} threshold. Credential is approved for blockchain anchoring.")
        elif verdict == "FLAGGED":
            lines.append(f"   • Rationale: Non-critical anomalies detected across inspection points. While not an overt attack, compliance protocol mandates secondary human review.")
        else:
            lines.append(f"   • Rationale: High-risk anomaly detected exceeding security tolerance thresholds. Application is REJECTED to prevent synthetic identity onboarding.")
        lines.append(f"================================================================================")

        return "\n".join(lines)
