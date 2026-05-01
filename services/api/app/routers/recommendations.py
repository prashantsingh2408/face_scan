"""AI recommendations via Groq (optional; requires GROQ_API_KEY)."""

from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.groq_faceology import FaceologyGroqResult, generate_faceology_groq_recommendations

router = APIRouter()


class FaceologyRecommendRequest(BaseModel):
    faceology_report: dict[str, Any] = Field(
        ...,
        description="Full merged Faceology report object (same shape as results.faceology_report).",
    )


@router.post("/recommendations/faceology", response_model=FaceologyGroqResult)
def faceology_ai_recommendations(body: FaceologyRecommendRequest) -> FaceologyGroqResult:
    """Return Groq-generated routine tips and product *types* / ingredient hints — no brands."""
    return generate_faceology_groq_recommendations(body.faceology_report)
