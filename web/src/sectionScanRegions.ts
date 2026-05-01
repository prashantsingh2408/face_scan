/**
 * Approximate focal crops for each report section (straight-on portraits).
 * Replaced by API-driven boxes when geometry / landmarks exist.
 */
export type SectionScanRegion = {
  /** Shown on the button, e.g. "eyebrow area" */
  buttonFocus: string;
  caption: string;
  alt: string;
  objectPosition: string;
  imgHeightPct: number;
  aspectRatio: string;
  maxHeight: string;
};

export const SECTION_SCAN_REGION: Record<string, SectionScanRegion> = {
  overall_face_shape_geometry: {
    buttonFocus: "face shape",
    caption: "Face outline from your photo",
    alt: "Cropped view of your face for shape context",
    objectPosition: "50% 42%",
    imgHeightPct: 118,
    aspectRatio: "3 / 4",
    maxHeight: "min(200px, 34vw)",
  },
  skin_type: {
    buttonFocus: "skin area",
    caption: "Skin from your photo",
    alt: "Face skin area from your scan photo",
    objectPosition: "50% 48%",
    imgHeightPct: 145,
    aspectRatio: "5 / 4",
    maxHeight: "min(160px, 26vw)",
  },
  blemishes_imperfections: {
    buttonFocus: "skin texture",
    caption: "Skin texture from your photo",
    alt: "Zoomed facial skin from your scan photo",
    objectPosition: "50% 50%",
    imgHeightPct: 165,
    aspectRatio: "5 / 4",
    maxHeight: "min(168px, 28vw)",
  },
  dark_circles_under_eye: {
    buttonFocus: "under-eye area",
    caption: "Under-eye region from your photo",
    alt: "Zoomed under-eye area from your scan photo",
    objectPosition: "50% 42%",
    imgHeightPct: 260,
    aspectRatio: "2.2 / 1",
    maxHeight: "min(148px, 22vw)",
  },
  fat_density_volume: {
    buttonFocus: "contour & volume",
    caption: "Mid-face & contour from your photo",
    alt: "Facial volume and contour region from your scan photo",
    objectPosition: "50% 48%",
    imgHeightPct: 150,
    aspectRatio: "4 / 3",
    maxHeight: "min(160px, 26vw)",
  },
  collagen_elasticity_signals: {
    buttonFocus: "skin firmness area",
    caption: "Mid-face skin from your photo",
    alt: "Mid-face skin area from your scan photo",
    objectPosition: "50% 50%",
    imgHeightPct: 155,
    aspectRatio: "5 / 4",
    maxHeight: "min(158px, 26vw)",
  },
  skin_appearance: {
    buttonFocus: "glow & tone",
    caption: "Face tone from your photo",
    alt: "Facial tone and radiance region from your scan photo",
    objectPosition: "50% 48%",
    imgHeightPct: 148,
    aspectRatio: "5 / 4",
    maxHeight: "min(158px, 26vw)",
  },
  lines_wrinkles: {
    buttonFocus: "lines & wrinkles",
    caption: "Upper & mid-face from your photo",
    alt: "Forehead and mid-face area from your scan photo",
    objectPosition: "50% 38%",
    imgHeightPct: 175,
    aspectRatio: "5 / 4",
    maxHeight: "min(168px, 28vw)",
  },
  eyebrows: {
    buttonFocus: "eyebrow area",
    caption: "Brow region from your photo",
    alt: "Eyebrow area from your scan photo",
    objectPosition: "50% 34%",
    imgHeightPct: 210,
    aspectRatio: "2.3 / 1",
    maxHeight: "min(128px, 20vw)",
  },
  lips: {
    buttonFocus: "lip area",
    caption: "Mouth & lip area from your photo",
    alt: "Zoomed lip and mouth area from your scan photo",
    objectPosition: "50% 58%",
    imgHeightPct: 230,
    aspectRatio: "2.3 / 1",
    maxHeight: "min(132px, 20vw)",
  },
  teeth_smile: {
    buttonFocus: "smile & mouth",
    caption: "Lower face & smile zone from your photo",
    alt: "Mouth and smile area from your scan photo",
    objectPosition: "50% 56%",
    imgHeightPct: 200,
    aspectRatio: "2.2 / 1",
    maxHeight: "min(140px, 22vw)",
  },
  cheeks_jaw_lines: {
    buttonFocus: "cheeks & jaw",
    caption: "Cheeks & jaw from your photo",
    alt: "Cheek and jawline region from your scan photo",
    objectPosition: "50% 58%",
    imgHeightPct: 175,
    aspectRatio: "4 / 3",
    maxHeight: "min(168px, 28vw)",
  },
  expressions: {
    buttonFocus: "full face",
    caption: "Full face from your photo",
    alt: "Full face from your scan photo for expression context",
    objectPosition: "50% 45%",
    imgHeightPct: 125,
    aspectRatio: "3 / 4",
    maxHeight: "min(190px, 32vw)",
  },
  scan_process: {
    buttonFocus: "full image",
    caption: "Your scan image",
    alt: "Your uploaded scan photo",
    objectPosition: "50% 50%",
    imgHeightPct: 100,
    aspectRatio: "4 / 3",
    maxHeight: "min(180px, 30vw)",
  },
  improvement_playbook: {
    buttonFocus: "full face",
    caption: "Your face for routine context",
    alt: "Your face from the scan for improvement-plan context",
    objectPosition: "50% 45%",
    imgHeightPct: 125,
    aspectRatio: "3 / 4",
    maxHeight: "min(190px, 32vw)",
  },
  guidance_projection: {
    buttonFocus: "face overview",
    caption: "Face overview from your photo",
    alt: "Overview of your face from the scan photo",
    objectPosition: "50% 45%",
    imgHeightPct: 130,
    aspectRatio: "3 / 4",
    maxHeight: "min(180px, 30vw)",
  },
  tracking_goals: {
    buttonFocus: "face overview",
    caption: "Face overview from your photo",
    alt: "Overview of your face from the scan photo",
    objectPosition: "50% 45%",
    imgHeightPct: 130,
    aspectRatio: "3 / 4",
    maxHeight: "min(180px, 30vw)",
  },
  source_image: {
    buttonFocus: "full image",
    caption: "Your uploaded image",
    alt: "Full uploaded scan image",
    objectPosition: "50% 50%",
    imgHeightPct: 100,
    aspectRatio: "16 / 10",
    maxHeight: "min(160px, 28vw)",
  },
};

export const SCAN_REGION_HINT =
  "Approximate framing for a straight-on photo — API landmarks will refine this later.";
