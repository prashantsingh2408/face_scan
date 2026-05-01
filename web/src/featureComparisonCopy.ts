/** Educational copy: compare user signals to abstract “typical face” patterns — not medical norms. */

export type ComparisonVariant = "under_eye" | "face_shape" | "lips" | "skin_tone" | "lines";

export type FeatureComparisonConfig = {
  title: string;
  bullets: string[];
  variant: ComparisonVariant;
};

export const FEATURE_COMPARISON: Partial<Record<string, FeatureComparisonConfig>> = {
  dark_circles_under_eye: {
    title: "Your under-eye area vs a typical pattern",
    bullets: [
      "Most front-facing portraits show some depth under the eyes from cheek shape and lighting — not only dark pigment.",
      "The sketch highlights where people commonly notice shadows; your crop shows your real photo in that zone.",
      "Compare intensity across several photos (different light) before judging a single snapshot.",
    ],
    variant: "under_eye",
  },
  overall_face_shape_geometry: {
    title: "Your outline next to common shape archetypes",
    bullets: [
      "These outlines are simplified archetypes (oval, round, square, heart) — real faces usually blend traits.",
      "Use them to orient labels like “oval” in your report; they are not exact measurements.",
      "Hair, angle, and lens distance change how “shape” reads in a photo.",
    ],
    variant: "face_shape",
  },
  lips: {
    title: "Your mouth vs neutral lip proportions",
    bullets: [
      "The diagrams contrast fuller vs narrower silhouettes — many faces sit between the two.",
      "Cameras can flatten depth; subtle volume differences are easier to see in profile or video.",
      "Dryness and fine vertical lines are common and often lighting-dependent.",
    ],
    variant: "lips",
  },
  skin_appearance: {
    title: "Glow & tone: why we show a matte ↔ luminous bar",
    bullets: [
      "The gradient is not a meter or a clinical score — it is only a visual anchor for everyday words (flat/matte finish vs reflective glow). Your photo does not measure oil or hydration.",
      "Real takeaway for this scan is the text fields under this section (glow radiance, tone uniformity). The bar helps interpret those phrases; lighting and camera angle change shine far more than skincare in one still.",
      "Undertone and redness are easy to misread from a single JPEG; compare several photos in different light if you track changes over time.",
    ],
    variant: "skin_tone",
  },
  lines_wrinkles: {
    title: "Expression lines vs resting anatomy",
    bullets: [
      "Forehead and crow’s-feet lines often deepen when smiling — a single still may miss that.",
      "The sketch marks zones where lines are commonly assessed; depth varies with age and sun exposure.",
      "Compare expression-neutral vs smiling shots when tracking changes over time.",
    ],
    variant: "lines",
  },
};

export function inferFaceArchetype(classification: string | undefined): "oval" | "round" | "square" | "heart" | "neutral" {
  if (!classification) return "neutral";
  const c = classification.toLowerCase();
  if (c.includes("oval")) return "oval";
  if (c.includes("round")) return "round";
  if (c.includes("square")) return "square";
  if (c.includes("heart")) return "heart";
  if (c.includes("oblong") || c.includes("long")) return "oval";
  return "neutral";
}

export function readFaceShapeClassification(report: Record<string, unknown>): string | undefined {
  const geo = report.overall_face_shape_geometry;
  if (!geo || typeof geo !== "object" || Array.isArray(geo)) return undefined;
  const fs = (geo as Record<string, unknown>).face_shape;
  if (!fs || typeof fs !== "object") return undefined;
  const cl = (fs as Record<string, unknown>).classification;
  return typeof cl === "string" ? cl : undefined;
}

export function readSkinAppearanceGlow(report: Record<string, unknown>): {
  glow_radiance?: string;
  tone_uniformity?: string;
} {
  const sa = report.skin_appearance;
  if (!sa || typeof sa !== "object" || Array.isArray(sa)) return {};
  const o = sa as Record<string, unknown>;
  return {
    glow_radiance: typeof o.glow_radiance === "string" ? o.glow_radiance : undefined,
    tone_uniformity: typeof o.tone_uniformity === "string" ? o.tone_uniformity : undefined,
  };
}

/**
 * Rough 0–100 position (left = matte, right = luminous) from report wording only — illustrative, not measured.
 */
export function inferGlowSpectrumHint(glowRadiance: string | undefined): number | null {
  if (!glowRadiance?.trim()) return null;
  const s = glowRadiance.toLowerCase();
  const luminous =
    /\bluminous\b|\bdewy\b|\bglowy\b|\breflective\b|\bglossy\b|\boily-looking\b|\bshine\b/.test(s);
  const matte = /\bmatte\b|\bflat\b|\bdull\b/.test(s);
  if (luminous && matte) return 52;
  if (luminous) return 84;
  if (matte) {
    if (/highlight|sheen|t-zone|t zone|forehead/.test(s)) return 36;
    return 24;
  }
  if (/highlight|sheen|specular|gleam/.test(s)) return 58;
  return null;
}
