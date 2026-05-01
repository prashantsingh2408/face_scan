"""Chat about scan results via Groq (optional; requires GROQ_API_KEY)."""

from typing import Any, Literal

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.groq_chat import chat_face_report

router = APIRouter()


class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., max_length=4000)


class FaceChatRequest(BaseModel):
    messages: list[ChatTurn] = Field(..., max_length=30)
    faceology_report: dict[str, Any]


class FaceChatResponse(BaseModel):
    reply: str
    model: str


@router.post("/chat/face-report", response_model=FaceChatResponse)
def face_report_chat(body: FaceChatRequest) -> FaceChatResponse:
    """Multi-turn chat grounded in the current faceology_report JSON."""
    payload = [t.model_dump() for t in body.messages]
    reply, model = chat_face_report(payload, body.faceology_report)
    return FaceChatResponse(reply=reply, model=model)
