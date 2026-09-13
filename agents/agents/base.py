from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AgentResult(BaseModel):
    agent_name: str
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Normalized authenticity confidence (1.0 = highly authentic, 0.0 = fraudulent)")
    raw_metric_score: float = Field(..., ge=0.0, le=1.0, description="Primary metric: forgery_score, deepfake_probability, or behavioral_trust_score")
    metric_name: str = Field(..., description="Name of the primary metric")
    is_authentic: bool
    risk_level: str = Field(..., description="LOW, MEDIUM, HIGH, or CRITICAL")
    flags: List[str] = Field(default_factory=list, description="Specific forensic or anomaly flags identified")
    signals: Dict[str, Any] = Field(default_factory=dict, description="Detailed quantitative sensor indicators")
    summary: str


class BaseAgent(ABC):
    def __init__(self, name: str, version: str = "2.0.0"):
        self.name = name
        self.version = version

    @abstractmethod
    def analyze(self, input_data: Dict[str, Any]) -> AgentResult:
        """
        Execute forensic analysis on input data and return structured AgentResult.
        """
        pass
