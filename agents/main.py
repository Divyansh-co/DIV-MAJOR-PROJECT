from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional

from pipeline import MultiAgentPipeline, PipelineAssessment
from agents.base import AgentResult

app = FastAPI(
    title="VeriTrust AI - Multi-Agent Microservice",
    description="Autonomous multi-agent adversarial detection cluster for deepfakes, document forgery, and synthetic identities in KYC verification.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = MultiAgentPipeline()


class KYCVerificationPayload(BaseModel):
    applicant_name: str
    document_type: str = Field(default="PASSPORT", description="PASSPORT, NATIONAL_ID, DRIVERS_LICENSE")
    document_number: str
    document_data: Optional[str] = None
    document_image: Optional[str] = None
    selfie_data: Optional[str] = None
    video_frames: Optional[List[str]] = None
    ip_address: Optional[str] = "127.0.0.1"
    device_fingerprint: Optional[Any] = "desktop-web-client"
    typing_cadence: Optional[List[float]] = None
    mouse_events: Optional[List[Any]] = None
    session_duration: Optional[float] = None
    attempts_24h: Optional[int] = 1
    # Test vector simulation flags
    simulate_forgery: bool = False
    simulate_deepfake: bool = False
    simulate_synthetic: bool = False


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "veritrust-agents",
        "version": "2.0.0",
        "active_agents": [
            "DocumentForgeryAgent",
            "LivenessDeepfakeAgent",
            "BehavioralTrustAgent"
        ],
        "models_loaded": {
            "yunet_onnx": pipeline.liveness_agent.detector is not None,
            "opencv_version": "5.0.0"
        },
        "weights": pipeline.weights
    }


@app.get("/agents")
async def list_agents():
    return {
        "ensemble": {
            "weights": pipeline.weights,
            "agents": [
                {
                    "name": pipeline.doc_agent.name,
                    "version": pipeline.doc_agent.version,
                    "role": "Uses OpenCV to check regional sharpness, font baselines, ELA recompression, and edge tampering.",
                    "weight": pipeline.weights.get("document_forgery", 0.35),
                    "metric": "forgery_score"
                },
                {
                    "name": pipeline.liveness_agent.name,
                    "version": pipeline.liveness_agent.version,
                    "role": "Uses pretrained YuNet ONNX face & landmark detection to inspect blinks, FFT spectral roll-off, and temporal flow.",
                    "weight": pipeline.weights.get("liveness_deepfake", 0.40),
                    "metric": "deepfake_probability"
                },
                {
                    "name": pipeline.behavioral_agent.name,
                    "version": pipeline.behavioral_agent.version,
                    "role": "Evaluates keystroke rhythm CV, cursor Shannon entropy, session velocity, and browser automation flags.",
                    "weight": pipeline.weights.get("behavioral_trust", 0.25),
                    "metric": "behavioral_trust_score"
                }
            ]
        }
    }


@app.post("/analyze", response_model=PipelineAssessment)
async def analyze_kyc(payload: KYCVerificationPayload):
    """
    Primary endpoint called by the Node.js API Gateway.
    Executes all 3 agents concurrently (async) and synthesizes a consensus verdict
    with a complete human-readable reasoning trail.
    """
    try:
        assessment = await pipeline.run_async(payload.model_dump())
        return assessment
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Agent orchestrator failure: {str(e)}")


@app.post("/agents/{agent_name}/analyze", response_model=AgentResult)
async def analyze_single_agent(agent_name: str, payload: Dict[str, Any]):
    agents_map = {
        "documentforgery": pipeline.doc_agent,
        "livenessdeepfake": pipeline.liveness_agent,
        "behavioraltrust": pipeline.behavioral_agent,
    }
    normalized = agent_name.lower().replace("_", "").replace("-", "")
    if normalized not in agents_map:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_name}' not found.")

    return agents_map[normalized].analyze(payload)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
