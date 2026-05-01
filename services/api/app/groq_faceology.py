"""Groq LLM: educational routine + product-type suggestions (no brands, not medical)."""

from __future__ import annotations

import json
import os
import re
from typing import Any

from fastapi import HTTPException
from pydantic import BaseModel, Field

_MAX_REPORT_JSON = 14_000

_SYSTEM = """You are a skincare education assistant for a face-analysis demo app called Face scan.
You do NOT diagnose disease or prescribe drugs. You give general, conservative routine guidance and TYPES of over-the-counter products (never specific brand names, never prices, never store links).

The user message contains a JSON "faceology_report" with skin/face fields (may be demo/placeholder data). Tailor suggestions to themes in that JSON; if values look like placeholders, say so briefly in the summary.

Return ONLY a single JSON object, no markdown fences, with this exact structure and string keys:
{
  "summary": "2-4 sentences in plain language",
  "routine_tips": ["short actionable tips", "..."],
  "product_directions": [
    {
      "category": "e.g. Sun protection, Moisturizer, Cleanser, Eye area, Treatment serum",
      "product_type": "what kind of product (no brand)",
      "ingredient_examples": ["optional ingredient keywords", "e.g. niacinamide"],
      "why": "one sentence linked to the report",
      "patch_test_note": "e.g. patch-test new actives" or ""
    }
  ],
  "avoid": ["over-washing, harsh physical scrubs on inflamed areas, etc."],
  "disclaimer": "Fixed line: Educational only, not medical advice. Patch-test; stop if irritation; see a dermatologist for diagnosis or prescription options."
}

Use 3-6 product_directions. ingredient_examples can be empty arrays. Be cautious with retinoids, acids, and pregnancy — mention clinician if relevant."""


class ProductDirection(BaseModel):
    category: str = ""
    product_type: str = ""
    ingredient_examples: list[str] = Field(default_factory=list)
    why: str = ""
    patch_test_note: str = ""


class FaceologyGroqResult(BaseModel):
    summary: str = ""
    routine_tips: list[str] = Field(default_factory=list)
    product_directions: list[ProductDirection] = Field(default_factory=list)
    avoid: list[str] = Field(default_factory=list)
    disclaimer: str = ""
    model: str = ""


def _parse_json_object(raw: str) -> dict[str, Any]:
    text = raw.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```\s*$", "", text)
    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Groq did not return valid JSON: {e}; snippet={text[:320]!r}",
        ) from e
    if not isinstance(data, dict):
        raise HTTPException(status_code=502, detail="Groq JSON must be an object.")
    return data


def _coerce_str_list(v: Any) -> list[str]:
    if v is None:
        return []
    if isinstance(v, str):
        return [v.strip()] if v.strip() else []
    if isinstance(v, list):
        return [str(x).strip() for x in v if str(x).strip()]
    return [str(v).strip()]


def _normalize_product_directions(raw: Any) -> list[ProductDirection]:
    if not isinstance(raw, list):
        return []
    out: list[ProductDirection] = []
    for item in raw[:12]:
        if not isinstance(item, dict):
            continue
        ing = item.get("ingredient_examples")
        if not isinstance(ing, list):
            ing = _coerce_str_list(ing)
        else:
            ing = [str(x).strip() for x in ing if str(x).strip()]
        try:
            out.append(
                ProductDirection(
                    category=str(item.get("category") or "").strip(),
                    product_type=str(item.get("product_type") or "").strip(),
                    ingredient_examples=ing,
                    why=str(item.get("why") or "").strip(),
                    patch_test_note=str(item.get("patch_test_note") or "").strip(),
                )
            )
        except Exception:
            continue
    return out


def generate_faceology_groq_recommendations(faceology_report: dict[str, Any]) -> FaceologyGroqResult:
    key = (os.getenv("GROQ_API_KEY") or "").strip()
    if not key:
        raise HTTPException(
            status_code=503,
            detail="GROQ_API_KEY is not set. Add it to the API environment (same as HackLens hackathon-search-llm) to enable AI recommendations.",
        )
    try:
        from groq import Groq
    except ImportError as e:
        raise HTTPException(
            status_code=503,
            detail="groq package is not installed. Run: pip install groq",
        ) from e

    model = (os.getenv("GROQ_MODEL") or "llama-3.3-70b-versatile").strip()
    client = Groq(api_key=key)

    blob = json.dumps(faceology_report, ensure_ascii=False)
    if len(blob) > _MAX_REPORT_JSON:
        blob = blob[:_MAX_REPORT_JSON] + "\n…[truncated]"

    try:
        completion = client.chat.completions.create(
            model=model,
            temperature=0.25,
            max_tokens=1400,
            messages=[
                {"role": "system", "content": _SYSTEM},
                {
                    "role": "user",
                    "content": f"faceology_report JSON:\n{blob}",
                },
            ],
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Groq request failed: {e!s}") from e

    choice = completion.choices[0].message.content
    if not choice or not choice.strip():
        raise HTTPException(status_code=502, detail="Empty Groq response.")

    parsed = _parse_json_object(choice)
    result = FaceologyGroqResult(
        summary=str(parsed.get("summary") or "").strip(),
        routine_tips=_coerce_str_list(parsed.get("routine_tips")),
        product_directions=_normalize_product_directions(parsed.get("product_directions")),
        avoid=_coerce_str_list(parsed.get("avoid")),
        disclaimer=str(parsed.get("disclaimer") or "").strip(),
        model=model,
    )
    if not result.summary and not result.product_directions:
        raise HTTPException(status_code=502, detail="Groq returned an unusable payload.")
    return result
