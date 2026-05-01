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
    title: "Glow & tone vs what cameras usually capture",
    bullets: [
      "Even skin in photos often still shows mild redness or shine from light angle.",
      "Reference gradient suggests matte vs luminous extremes — most people are in between.",
      "One JPEG cannot capture true undertone the way multi-angle lighting studies can.",
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
