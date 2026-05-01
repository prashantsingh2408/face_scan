"""Groq chat grounded in faceology_report JSON (educational only)."""

from __future__ import annotations

import json
import os
from typing import Any

from fastapi import HTTPException

_MAX_REPORT_JSON = 12_000
_MAX_MSG_CHARS = 3_500
_MAX_TURNS = 22  # user+assistant pairs-ish

_SYSTEM = """You are the chat assistant for the Face scan demo app.
Ground every answer in the JSON report attached below as "faceology_report". If something is not in that JSON, say you don't have that detail from this scan rather than guessing numbers or diagnoses.
Rules:
- Educational skincare / appearance guidance only — not medical diagnosis or prescriptions.
- No brand names, prices, or purchase links; product types and ingredient families are OK.
- Be concise unless the user asks for more depth (aim for a short readable reply, optional bullets).
- If values look like demo placeholders, mention that limitations briefly when relevant."""


def chat_face_report(messages: list[dict[str, Any]], faceology_report: dict[str, Any]) -> tuple[str, str]:
    key = (os.getenv("GROQ_API_KEY") or "").strip()
    if not key:
        raise HTTPException(
            status_code=503,
            detail="GROQ_API_KEY is not set. Add it to services/api/.env to enable chat.",
        )
    try:
        from groq import Groq
    except ImportError as e:
        raise HTTPException(status_code=503, detail="groq package is not installed.") from e

    if not messages:
        raise HTTPException(status_code=400, detail="messages must not be empty.")

    model = (os.getenv("GROQ_MODEL") or "llama-3.3-70b-versatile").strip()
    client = Groq(api_key=key)

    blob = json.dumps(faceology_report, ensure_ascii=False)
    if len(blob) > _MAX_REPORT_JSON:
        blob = blob[:_MAX_REPORT_JSON] + "\n…[truncated]"

    sys_content = f"{_SYSTEM}\n\n--- faceology_report (JSON) ---\n{blob}"

    api_messages: list[dict[str, str]] = [{"role": "system", "content": sys_content}]

    trimmed = messages[-_MAX_TURNS:]
    for m in trimmed:
        if not isinstance(m, dict):
            continue
        role = m.get("role")
        content = m.get("content")
        if role not in ("user", "assistant"):
            continue
        if not isinstance(content, str) or not content.strip():
            continue
        text = content.strip()[:_MAX_MSG_CHARS]
        api_messages.append({"role": role, "content": text})

    if len(api_messages) < 2:
        raise HTTPException(status_code=400, detail="Need at least one user message with non-empty content.")

    try:
        completion = client.chat.completions.create(
            model=model,
            temperature=0.35,
            max_tokens=900,
            messages=api_messages,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Groq request failed: {e!s}") from e

    choice = completion.choices[0].message.content
    reply = (choice or "").strip()
    if not reply:
        raise HTTPException(status_code=502, detail="Empty model reply.")
    return reply, model
