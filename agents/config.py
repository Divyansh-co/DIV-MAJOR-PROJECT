import os
from typing import Dict

# Multi-Agent Ensemble Weights (Must sum to 1.0)
WEIGHTS: Dict[str, float] = {
    "document_forgery": float(os.getenv("WEIGHT_DOCUMENT_FORGERY", "0.35")),
    "liveness_deepfake": float(os.getenv("WEIGHT_LIVENESS_DEEPFAKE", "0.40")),
    "behavioral_trust": float(os.getenv("WEIGHT_BEHAVIORAL_TRUST", "0.25")),
}

# Decision Thresholds (Composite score out of 1000)
VERIFIED_THRESHOLD: int = int(os.getenv("VERIFIED_THRESHOLD", "750"))
FLAGGED_THRESHOLD: int = int(os.getenv("FLAGGED_THRESHOLD", "450"))

# Critical Veto Thresholds
CRITICAL_DEEPFAKE_PROBABILITY: float = 0.65
CRITICAL_FORGERY_SCORE: float = 0.65
CRITICAL_BEHAVIORAL_TRUST_MIN: float = 0.35

# Document Forgery Detection Parameters
ELA_QUALITY: int = 90
ELA_THRESHOLD: float = 12.0
LAPLACIAN_VAR_RATIO_TOLERANCE: float = 4.5
TEXT_BASELINE_JITTER_TOLERANCE: float = 8.5

# Liveness Deepfake Detection Parameters
FFT_SPECTRAL_HIGH_FREQ_CUTOFF: float = 0.45
OPTICAL_FLOW_JITTER_THRESHOLD: float = 0.14
MIN_BLINK_FRAMES: int = 1

# Behavioral Analysis Parameters
TYPING_CV_MIN: float = 0.08
TYPING_CV_MAX: float = 1.80
MOUSE_ENTROPY_MIN_BITS: float = 1.6
MIN_SESSION_DURATION_SEC: float = 3.0
MAX_SESSION_DURATION_SEC: float = 900.0
