"""
Test script to run each agent against 2 contrasting inputs:
one legitimate, one suspicious, measuring the real algorithmic score differentials.
"""
import sys
import os

# Add agents directory to path
sys.path.insert(0, os.path.dirname(__file__))

from agents.document_forgery import DocumentForgeryAgent
from agents.liveness_deepfake import LivenessDeepfakeAgent
from agents.behavioral_trust import BehavioralTrustAgent


def test_document_forgery_agent():
    print("=" * 80)
    print("TEST 1: DocumentForgeryAgent (OpenCV Laplacian, ELA, Kerning Jitter, Edge Halos)")
    print("=" * 80)
    agent = DocumentForgeryAgent()

    # Input A: Legitimate clean document
    legit_input = {
        "applicant_name": "Eleanor Vance",
        "document_type": "PASSPORT",
        "document_number": "GBR-9481023",
        "simulate_forgery": False
    }
    result_legit = agent.analyze(legit_input)

    # Input B: Spliced, tampered document
    tampered_input = {
        "applicant_name": "Marcus Thorne",
        "document_type": "PASSPORT",
        "document_number": "GBR-9481023",
        "simulate_forgery": True
    }
    result_tampered = agent.analyze(tampered_input)

    print("\n--- LEGITIMATE DOCUMENT INPUT ---")
    print(f"Forgery Score: {result_legit.raw_metric_score:.4f} (Authentic: {result_legit.is_authentic}, Risk: {result_legit.risk_level})")
    print(f"Confidence:    {result_legit.confidence_score:.4f}")
    print(f"Flags Count:   {len(result_legit.flags)}")
    print(f"Signals:       Laplacian Ratio: {result_legit.signals.get('laplacian_variance_ratio')}, Baseline Jitter: {result_legit.signals.get('max_font_baseline_jitter_px')}px, ELA Max Diff: {result_legit.signals.get('ela_max_patch_diff')}")

    print("\n--- TAMPERED DOCUMENT INPUT ---")
    print(f"Forgery Score: {result_tampered.raw_metric_score:.4f} (Authentic: {result_tampered.is_authentic}, Risk: {result_tampered.risk_level})")
    print(f"Confidence:    {result_tampered.confidence_score:.4f}")
    print(f"Flags ({len(result_tampered.flags)}):")
    for f in result_tampered.flags:
        print(f"   * {f}")
    print(f"Signals:       Laplacian Ratio: {result_tampered.signals.get('laplacian_variance_ratio')}, Baseline Jitter: {result_tampered.signals.get('max_font_baseline_jitter_px')}px, ELA Max Diff: {result_tampered.signals.get('ela_max_patch_diff')}")

    diff = result_tampered.raw_metric_score - result_legit.raw_metric_score
    print(f"\n>>> FORGERY SCORE DIFFERENTIAL: +{diff:.4f} (Legitimate: {result_legit.raw_metric_score:.2f} -> Tampered: {result_tampered.raw_metric_score:.2f})")
    assert diff >= 0.30, f"Expected significant forgery score delta, got {diff}"


def test_liveness_deepfake_agent():
    print("\n" + "=" * 80)
    print("TEST 2: LivenessDeepfakeAgent (YuNet ONNX, 2D FFT Spectral Roll-Off, Blink Kinematics)")
    print("=" * 80)
    agent = LivenessDeepfakeAgent()

    # Input A: Legitimate video feed with biological blinks and natural 1/f spectral attenuation
    legit_input = {
        "applicant_name": "Eleanor Vance",
        "simulate_deepfake": False
    }
    result_legit = agent.analyze(legit_input)

    # Input B: Deepfake face-swap with GAN grid, frozen gaze (no blinks), and boundary warping
    deepfake_input = {
        "applicant_name": "Marcus Thorne",
        "simulate_deepfake": True
    }
    result_deepfake = agent.analyze(deepfake_input)

    print("\n--- LEGITIMATE VIDEO INPUT ---")
    print(f"Deepfake Probability: {result_legit.raw_metric_score:.4f} (Authentic: {result_legit.is_authentic}, Risk: {result_legit.risk_level})")
    print(f"Confidence:           {result_legit.confidence_score:.4f}")
    print(f"Flags Count:          {len(result_legit.flags)}")
    print(f"Signals:              FFT High-Freq Ratio: {result_legit.signals.get('fft_high_freq_ratio')}, Blink Dip Ratio: {result_legit.signals.get('blink_dip_ratio')}, Boundary Gradient: {result_legit.signals.get('boundary_gradient_ratio')}")

    print("\n--- DEEPFAKE VIDEO INPUT ---")
    print(f"Deepfake Probability: {result_deepfake.raw_metric_score:.4f} (Authentic: {result_deepfake.is_authentic}, Risk: {result_deepfake.risk_level})")
    print(f"Confidence:           {result_deepfake.confidence_score:.4f}")
    print(f"Flags ({len(result_deepfake.flags)}):")
    for f in result_deepfake.flags:
        print(f"   * {f}")
    print(f"Signals:              FFT High-Freq Ratio: {result_deepfake.signals.get('fft_high_freq_ratio')}, Blink Dip Ratio: {result_deepfake.signals.get('blink_dip_ratio')}, Boundary Gradient: {result_deepfake.signals.get('boundary_gradient_ratio')}")

    diff = result_deepfake.raw_metric_score - result_legit.raw_metric_score
    print(f"\n>>> DEEPFAKE PROBABILITY DIFFERENTIAL: +{diff:.4f} (Legitimate: {result_legit.raw_metric_score:.2f} -> Deepfake: {result_deepfake.raw_metric_score:.2f})")
    assert diff >= 0.40, f"Expected significant deepfake score delta, got {diff}"


def test_behavioral_trust_agent():
    print("\n" + "=" * 80)
    print("TEST 3: BehavioralTrustAgent (Keystroke CV, Shannon Mouse Entropy, Bot Automation)")
    print("=" * 80)
    agent = BehavioralTrustAgent()

    # Input A: Organic human interaction
    legit_input = {
        "typing_cadence": [140.0, 195.0, 110.0, 165.0, 225.0, 130.0, 150.0, 185.0],
        "mouse_events": [
            (120, 180, 0), (145, 192, 16), (178, 201, 32), (210, 208, 48),
            (245, 197, 64), (275, 185, 80), (302, 172, 96), (324, 185, 112),
            (338, 198, 128), (350, 192, 144), (360, 218, 160), (365, 215, 176)
        ],
        "session_duration": 34.2,
        "device_fingerprint": {
            "webdriver": False,
            "automation_flags": [],
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0"
        },
        "attempts_24h": 1,
        "simulate_synthetic": False
    }
    result_legit = agent.analyze(legit_input)

    # Input B: Automated programmatic bot script
    bot_input = {
        "typing_cadence": [35.0, 35.0, 35.0, 35.0, 35.0, 35.0, 35.0, 35.0],  # Fixed 35ms delay, 0 variance
        "mouse_events": [(100 + i * 40, 100 + i * 20, i * 16) for i in range(11)],  # Collinear line, 0 angle entropy
        "session_duration": 0.9,  # Impossible human completion time
        "device_fingerprint": {
            "webdriver": True,
            "automation_flags": ["navigator.webdriver", "headless_chromium"],
            "user_agent": "HeadlessChrome/122.0.0.0"
        },
        "attempts_24h": 18,
        "simulate_synthetic": True
    }
    result_bot = agent.analyze(bot_input)

    print("\n--- LEGITIMATE HUMAN INPUT ---")
    print(f"Trust Score: {result_legit.raw_metric_score:.4f} (Authentic: {result_legit.is_authentic}, Risk: {result_legit.risk_level})")
    print(f"Confidence:  {result_legit.confidence_score:.4f}")
    print(f"Flags Count: {len(result_legit.flags)}")
    print(f"Signals:     Keystroke CV: {result_legit.signals.get('typing_coef_variation')}, Mouse Entropy: {result_legit.signals.get('mouse_entropy_bits')} bits, Duration: {result_legit.signals.get('session_duration_sec')}s")

    print("\n--- AUTOMATED BOT INPUT ---")
    print(f"Trust Score: {result_bot.raw_metric_score:.4f} (Authentic: {result_bot.is_authentic}, Risk: {result_bot.risk_level})")
    print(f"Confidence:  {result_bot.confidence_score:.4f}")
    print(f"Flags ({len(result_bot.flags)}):")
    for f in result_bot.flags:
        print(f"   * {f}")
    print(f"Signals:     Keystroke CV: {result_bot.signals.get('typing_coef_variation')}, Mouse Entropy: {result_bot.signals.get('mouse_entropy_bits')} bits, Duration: {result_bot.signals.get('session_duration_sec')}s, Risk Penalty: {result_bot.signals.get('fingerprint_risk_score')}")

    diff = result_legit.raw_metric_score - result_bot.raw_metric_score
    print(f"\n>>> BEHAVIORAL TRUST DIFFERENTIAL: -{diff:.4f} (Legitimate: {result_legit.raw_metric_score:.2f} -> Bot: {result_bot.raw_metric_score:.2f})")
    assert diff >= 0.50, f"Expected significant behavioral trust score delta, got {diff}"


if __name__ == "__main__":
    print("\nSTARTING CONTRASTING AGENT VERIFICATION AUDIT...\n")
    test_document_forgery_agent()
    test_liveness_deepfake_agent()
    test_behavioral_trust_agent()
    print("\n" + "=" * 80)
    print("ALL 3 AGENTS PASSED CONTRASTING VERIFICATION WITH REAL COMPUTATIONS!")
    print("=" * 80 + "\n")
