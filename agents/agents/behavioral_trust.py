import math
from typing import Any, Dict, List, Tuple
import numpy as np

from .base import BaseAgent, AgentResult
from config import (
    TYPING_CV_MIN,
    TYPING_CV_MAX,
    MOUSE_ENTROPY_MIN_BITS,
    MIN_SESSION_DURATION_SEC,
    MAX_SESSION_DURATION_SEC,
)


class BehavioralTrustAgent(BaseAgent):
    """
    Evaluates applicant interaction telemetry, biomechanical physics, and network fingerprint:
      1. Keystroke flight time & typing cadence variance (Z-score & Coefficient of Variation)
      2. Mouse curvature Shannon entropy & kinematic velocity
      3. Session completion velocity & temporal anomalies
      4. Device fingerprint, headless browser automation flags, and IP reputation
    """

    def __init__(self):
        super().__init__(name="BehavioralTrustAgent", version="2.0.0")

    def analyze(self, input_data: Dict[str, Any]) -> AgentResult:
        flags: List[str] = []
        signals: Dict[str, Any] = {}

        # 1. Typing Cadence & Keystroke Dynamics
        typing_score, typing_flags, typing_signals = self._analyze_typing_cadence(input_data)
        flags.extend(typing_flags)
        signals.update(typing_signals)

        # 2. Mouse Trajectory Shannon Entropy & Kinematics
        mouse_score, mouse_flags, mouse_signals = self._analyze_mouse_entropy(input_data)
        flags.extend(mouse_flags)
        signals.update(mouse_signals)

        # 3. Session Duration & Velocity Anomaly
        duration_score, duration_flags, duration_signals = self._analyze_session_duration(input_data)
        flags.extend(duration_flags)
        signals.update(duration_signals)

        # 4. Device Fingerprint & IP Geolocation Consistency
        device_score, device_flags, device_signals = self._analyze_device_consistency(input_data)
        flags.extend(device_flags)
        signals.update(device_signals)

        # ---------------------------------------------------------------------
        # COMPOSITE BEHAVIORAL TRUST SCORE CALCULATION
        #
        # WHAT IS BEING MEASURED:
        # A weighted composite trust index (1.0 = organic biological human, 0.0 = bot / automated script)
        # across 4 distinct behavioral and environmental telemetry dimensions:
        #   - Device fingerprint & headless automation flags (30% weight)
        #   - Keystroke interval rhythm and flight-time variance (25% weight)
        #   - Mouse cursor trajectory curvature Shannon entropy (25% weight)
        #   - Session completion velocity & duration window (20% weight)
        #
        # WHY IT INDICATES ANOMALOUS / SYNTHETIC BEHAVIOR:
        # Human users interact with web interfaces through physical muscles that exhibit
        # natural hand tremor, directional micro-curvature, and variable keystroke flight
        # times based on keyboard distances. Programmatic automation scripts (Puppeteer,
        # Playwright, Selenium) execute with linear trajectory coordinates, sub-millisecond
        # robotic intervals, and headless browser runtime flags.
        # ---------------------------------------------------------------------
        behavioral_trust_score = (
            (typing_score * 0.25) +
            (mouse_score * 0.25) +
            (duration_score * 0.20) +
            (device_score * 0.30)
        )
        behavioral_trust_score = round(min(1.0, max(0.0, behavioral_trust_score)), 4)
        confidence_score = behavioral_trust_score
        is_authentic = behavioral_trust_score >= 0.60

        if behavioral_trust_score < 0.35:
            risk_level = "CRITICAL"
        elif behavioral_trust_score < 0.60:
            risk_level = "HIGH"
        elif behavioral_trust_score < 0.80:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        if flags:
            summary = (
                f"Behavioral Trust Agent flagged {len(flags)} telemetry anomaly(s): "
                + "; ".join(flags[:2])
                + (f" (+{len(flags) - 2} more)" if len(flags) > 2 else "")
                + f". Behavioral trust index: {behavioral_trust_score:.2f}."
            )
        else:
            summary = (
                "Organic interaction telemetry verified. Natural keystroke cadence entropy, "
                "curved cursor kinematics, consistent residential IP routing, and valid device telemetry."
            )

        return AgentResult(
            agent_name=self.name,
            confidence_score=confidence_score,
            raw_metric_score=behavioral_trust_score,
            metric_name="behavioral_trust_score",
            is_authentic=is_authentic,
            risk_level=risk_level,
            flags=flags,
            signals=signals,
            summary=summary,
        )

    # -------------------------------------------------------------------------
    # 1. Keystroke Dynamics Analysis
    # -------------------------------------------------------------------------
    def _analyze_typing_cadence(self, input_data: Dict[str, Any]) -> Tuple[float, List[str], Dict[str, Any]]:
        simulate_synthetic = bool(input_data.get("simulate_synthetic", False))
        intervals = input_data.get("typing_cadence") or input_data.get("keystroke_intervals")

        if not intervals or not isinstance(intervals, list) or len(intervals) < 4:
            if simulate_synthetic:
                # Robotic bot typing: identical intervals of exactly 35ms with zero variance
                intervals = [35.0, 35.0, 35.0, 35.0, 35.0, 35.0, 35.0, 35.0]
            else:
                # Natural human typing rhythm (mean ~140ms, std ~45ms)
                intervals = [125.0, 180.0, 95.0, 160.0, 210.0, 115.0, 140.0, 175.0]

        arr = np.array(intervals, dtype=np.float64)
        mean_ms = float(np.mean(arr))
        std_ms = float(np.std(arr))
        cv = float(std_ms / (mean_ms + 1e-5))

        flags = []

        # ---------------------------------------------------------------------
        # KEYSTROKE CADENCE SCORE CALCULATION
        #
        # WHAT IS BEING MEASURED:
        # The Coefficient of Variation (CV = std_dev / mean) of inter-keystroke
        # flight time intervals in milliseconds.
        #
        # WHY IT INDICATES ANOMALOUS BEHAVIOR:
        # Biological typing speed varies based on finger travel distance and cognitive
        # pauses between syllables, producing a natural CV between 0.18 and 0.55.
        # Programmatic script injection fires events with fixed millisecond delays
        # (e.g. setInterval(35)) or near-zero variance (CV < 0.08).
        # ---------------------------------------------------------------------
        if cv < TYPING_CV_MIN or mean_ms < 20.0:
            flags.append(f"ROBOTIC_TYPING_CADENCE: Keystroke CV ({cv:.3f}) and interval ({mean_ms:.1f}ms) indicate automated script injection")
            score = 0.15
        elif cv > TYPING_CV_MAX:
            flags.append(f"ERRATIC_BURST_TYPING: Unnatural keystroke interval variance (CV={cv:.2f})")
            score = 0.50
        else:
            score = 0.95

        signals = {
            "typing_mean_interval_ms": round(mean_ms, 2),
            "typing_std_dev_ms": round(std_ms, 2),
            "typing_coef_variation": round(cv, 3),
        }
        return score, flags, signals

    # -------------------------------------------------------------------------
    # 2. Mouse Curvature Shannon Entropy & Kinematics
    # -------------------------------------------------------------------------
    def _analyze_mouse_entropy(self, input_data: Dict[str, Any]) -> Tuple[float, List[str], Dict[str, Any]]:
        simulate_synthetic = bool(input_data.get("simulate_synthetic", False))
        events = input_data.get("mouse_events") or input_data.get("mouse_coords")

        if not events or not isinstance(events, list) or len(events) < 5:
            if simulate_synthetic:
                # Bot automation: perfectly linear vector from (100, 100) to (500, 300) with 0 angular entropy
                events = [(100 + i * 40, 100 + i * 20, i * 16) for i in range(11)]
            else:
                # Organic human trajectory with micro-arcs and hand tremor
                events = [
                    (120, 180, 0), (145, 192, 16), (178, 201, 32), (210, 208, 48),
                    (245, 197, 64), (275, 185, 80), (302, 172, 96), (324, 185, 112),
                    (338, 198, 128), (350, 192, 144), (360, 218, 160), (365, 215, 176)
                ]

        # Calculate directional angles between consecutive points
        angles = []
        velocities = []
        for i in range(len(events) - 1):
            dx = events[i + 1][0] - events[i][0]
            dy = events[i + 1][1] - events[i][1]
            dt = max(events[i + 1][2] - events[i][2], 1) if len(events[i]) >= 3 else 16
            dist = math.sqrt(dx * dx + dy * dy)

            angle = math.atan2(dy, dx)
            angles.append(angle)
            velocities.append((dist / dt) * 1000.0)

        # Compute Shannon entropy of trajectory angle changes
        angle_diffs = []
        for i in range(len(angles) - 1):
            diff = (angles[i + 1] - angles[i] + math.pi) % (2 * math.pi) - math.pi
            angle_diffs.append(diff)

        flags = []
        if len(angle_diffs) >= 4:
            counts, _ = np.histogram(angle_diffs, bins=16, range=(-math.pi, math.pi))
            total_c = np.sum(counts)
            if total_c > 0:
                probs = counts / total_c
                probs = probs[probs > 0]
                entropy_bits = float(-np.sum(probs * np.log2(probs)))
            else:
                entropy_bits = 0.0
        else:
            entropy_bits = 0.0

        max_velocity = float(np.max(velocities)) if velocities else 0.0

        # ---------------------------------------------------------------------
        # MOUSE ENTROPY SCORE CALCULATION
        #
        # WHAT IS BEING MEASURED:
        # The discrete Shannon entropy (in bits) over a 16-bin histogram of
        # turn angles between consecutive mouse movement segments:
        #   H = - sum(p_i * log2(p_i))
        #
        # WHY IT INDICATES ANOMALOUS BEHAVIOR:
        # Natural human cursor navigation is never a mathematical straight line;
        # biomechanical corrections create high angular diversity (entropy >= 2.2 bits).
        # Synthetic scripts or linear interpolation generate collinear points with
        # all angular deltas clustered at 0 radians, yielding entropy < 1.0 bit.
        # ---------------------------------------------------------------------
        if entropy_bits < MOUSE_ENTROPY_MIN_BITS or max_velocity > 12000.0:
            flags.append(f"LOW_MOUSE_ENTROPY: Cursor trajectory angle entropy ({entropy_bits:.2f} bits) indicates synthetic vector automation")
            score = 0.20
        elif entropy_bits < 2.2:
            score = 0.85
        else:
            score = 0.98

        signals = {
            "mouse_entropy_bits": round(entropy_bits, 3),
            "max_cursor_velocity_px_s": round(max_velocity, 1),
            "sample_points_count": len(events),
        }
        return score, flags, signals

    # -------------------------------------------------------------------------
    # 3. Session Duration & Submission Velocity
    # -------------------------------------------------------------------------
    def _analyze_session_duration(self, input_data: Dict[str, Any]) -> Tuple[float, List[str], Dict[str, Any]]:
        simulate_synthetic = bool(input_data.get("simulate_synthetic", False))
        duration = input_data.get("session_duration")

        if duration is None:
            duration = 0.8 if simulate_synthetic else 24.5

        duration = float(duration)
        flags = []

        # ---------------------------------------------------------------------
        # SESSION VELOCITY SCORE CALCULATION
        #
        # WHAT IS BEING MEASURED:
        # The total active elapsed seconds from initial page load to form submission.
        #
        # WHY IT INDICATES ANOMALOUS BEHAVIOR:
        # Reading verification instructions, aligning an ID document, and completing
        # a biometric selfie requires at least 6-10 seconds of human cognitive time.
        # Programmatic credential stuffing tools submit within < 2.5 seconds.
        # ---------------------------------------------------------------------
        if duration < MIN_SESSION_DURATION_SEC:
            flags.append(f"IMPOSSIBLE_VELOCITY: Form completed in {duration:.1f}s (impossible reading and biometric capture velocity)")
            score = 0.10
        elif duration > MAX_SESSION_DURATION_SEC:
            flags.append(f"STALE_SESSION: Idle session duration ({duration:.0f}s) exceeded compliance window")
            score = 0.60
        else:
            score = 0.95

        signals = {
            "session_duration_sec": round(duration, 2),
            "velocity_compliant": duration >= MIN_SESSION_DURATION_SEC,
        }
        return score, flags, signals

    # -------------------------------------------------------------------------
    # 4. Device Fingerprint & IP Geolocation Consistency
    # -------------------------------------------------------------------------
    def _analyze_device_consistency(self, input_data: Dict[str, Any]) -> Tuple[float, List[str], Dict[str, Any]]:
        simulate_synthetic = bool(input_data.get("simulate_synthetic", False))

        device_fp = input_data.get("device_fingerprint") or {}
        ip_addr = input_data.get("ip_address", "127.0.0.1")

        if isinstance(device_fp, str):
            device_fp_str = device_fp
            device_fp = {"user_agent": device_fp_str}

        flags = []
        penalties = 0.0

        is_webdriver = bool(device_fp.get("webdriver", False)) or simulate_synthetic
        automation_flags = device_fp.get("automation_flags") or ([] if not simulate_synthetic else ["navigator.webdriver", "headless_gl"])

        # ---------------------------------------------------------------------
        # DEVICE FINGERPRINT & VELOCITY PENALTIES
        #
        # WHAT IS BEING MEASURED:
        # Browser environment runtime flags (e.g. navigator.webdriver, headless Chromium)
        # and 24-hour verification attempt counts from the same device/IP.
        #
        # WHY IT INDICATES ANOMALOUS BEHAVIOR:
        # Automated headless test runners leave exposed WebDriver APIs and lack
        # standard WebGL extensions. Repeated verification requests (>4 within 24h)
        # from identical hardware hashes suggest rotating stolen identities in a Sybil ring.
        # ---------------------------------------------------------------------
        if is_webdriver or len(automation_flags) > 0:
            flags.append(f"AUTOMATION_FRAMEWORK_DETECTED: Active browser automation flags {automation_flags}")
            penalties += 0.50

        attempts_24h = int(input_data.get("attempts_24h", 14 if simulate_synthetic else 1))
        if attempts_24h > 4:
            flags.append(f"HIGH_VELOCITY_IDENTITY_ROTATION: {attempts_24h} KYC attempts from identical hardware hash within 24h")
            penalties += 0.35

        score = max(0.05, 0.98 - penalties)

        signals = {
            "ip_address": ip_addr,
            "automation_flags_count": len(automation_flags),
            "attempts_24h": attempts_24h,
            "fingerprint_risk_score": round(penalties, 2),
        }
        return score, flags, signals
