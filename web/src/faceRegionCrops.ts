/**
 * Maps MediaPipe Face Landmarker topology (478 pts) to report-section crops.
 * Indices align with FaceLandmarker.FACE_LANDMARKS_* in @mediapipe/tasks-vision.
 */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type NormBox = { x: number; y: number; w: number; h: number };
export type PixelBox = { sx: number; sy: number; sw: number; sh: number };

const LEFT_EYE = [
  263, 249, 390, 373, 374, 380, 381, 382, 362, 466, 388, 387, 386, 385, 384, 398,
];
const RIGHT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 246, 161, 160, 159, 158, 157, 173];
const LEFT_BROW = [276, 283, 282, 295, 285, 300, 293, 334, 296, 336];
const RIGHT_BROW = [46, 53, 52, 65, 55, 70, 63, 105, 66, 107];
const LIPS: number[] = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 185, 40, 39, 37, 0, 267, 269, 270, 409, 78,
  95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 191, 80, 81, 82, 13, 312, 311, 310, 415,
];

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function bboxAllLandmarks(lm: NormalizedLandmark[]): NormBox {
  let minX = 1;
  let minY = 1;
  let maxX = 0;
  let maxY = 0;
  for (const p of lm) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function bboxIndices(lm: NormalizedLandmark[], indices: readonly number[]): NormBox | null {
  let minX = 1;
  let minY = 1;
  let maxX = 0;
  let maxY = 0;
  let n = 0;
  for (const i of indices) {
    const p = lm[i];
    if (!p) continue;
    n++;
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  if (n < 3) return null;
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

/** Pad box symmetrically (ratios of w/h), then clamp to [0,1]. */
function padBox(b: NormBox, padWX: number, padHY: number): NormBox {
  const px = b.w * padWX;
  const py = b.h * padHY;
  const x = clamp01(b.x - px);
  const y = clamp01(b.y - py);
  const xr = clamp01(b.x + b.w + px);
  const yb = clamp01(b.y + b.h + py);
  return { x, y, w: Math.max(0.02, xr - x), h: Math.max(0.02, yb - y) };
}

function normToPixels(b: NormBox, iw: number, ih: number): PixelBox {
  let sx = Math.floor(b.x * iw);
  let sy = Math.floor(b.y * ih);
  let sw = Math.max(2, Math.ceil(b.w * iw));
  let sh = Math.max(2, Math.ceil(b.h * ih));
  sx = clamp(sx, 0, Math.max(0, iw - 1));
  sy = clamp(sy, 0, Math.max(0, ih - 1));
  sw = Math.min(sw, iw - sx);
  sh = Math.min(sh, ih - sy);
  return { sx, sy, sw: Math.max(2, sw), sh: Math.max(2, sh) };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function fitPixelBox(box: PixelBox, iw: number, ih: number): PixelBox {
  let { sx, sy, sw, sh } = box;
  if (sx + sw > iw) sw = iw - sx;
  if (sy + sh > ih) sh = ih - sy;
  if (sw < 2 || sh < 2) return { sx: 0, sy: 0, sw: iw, sh: ih };
  return { sx, sy, sw, sh };
}

/**
 * Returns pixel crop for a report section from the first detected face.
 */
export function getPixelCropForSection(
  sectionKey: string,
  landmarks: NormalizedLandmark[],
  imageWidth: number,
  imageHeight: number,
): PixelBox | null {
  const ff = padBox(bboxAllLandmarks(landmarks), 0.04, 0.04);
  if (ff.w < 0.03 || ff.h < 0.03) return null;

  let n: NormBox;

  switch (sectionKey) {
    case "dark_circles_under_eye": {
      const le = bboxIndices(landmarks, LEFT_EYE);
      const re = bboxIndices(landmarks, RIGHT_EYE);
      if (!le || !re) return null;
      const eyeY = Math.min(le.y, re.y);
      const eyeB = Math.max(le.y + le.h, re.y + re.h);
      const eyeL = Math.min(le.x, re.x);
      const eyeR = Math.max(le.x + le.w, re.x + re.w);
      const ew = eyeR - eyeL;
      const eh = eyeB - eyeY;
      n = padBox(
        {
          x: eyeL - ew * 0.1,
          y: eyeY,
          w: ew * 1.2,
          h: Math.min(1 - eyeY, eh * 2.1),
        },
        0.02,
        0.06,
      );
      break;
    }
    case "eyebrows": {
      const b = bboxIndices(landmarks, [...LEFT_BROW, ...RIGHT_BROW]);
      if (!b) return null;
      n = padBox(b, 0.12, 0.18);
      break;
    }
    case "lips": {
      const b = bboxIndices(landmarks, LIPS);
      if (!b) return null;
      n = padBox(b, 0.1, 0.14);
      break;
    }
    case "teeth_smile": {
      const lip = bboxIndices(landmarks, LIPS);
      if (!lip) return null;
      n = padBox(
        {
          x: lip.x - lip.w * 0.08,
          y: lip.y,
          w: lip.w * 1.16,
          h: Math.min(1 - lip.y, lip.h * 2.15),
        },
        0.04,
        0.08,
      );
      break;
    }
    case "cheeks_jaw_lines": {
      n = padBox(
        {
          x: ff.x,
          y: ff.y + ff.h * 0.32,
          w: ff.w,
          h: ff.h * 0.68,
        },
        0.02,
        0.03,
      );
      break;
    }
    case "lines_wrinkles": {
      n = padBox(
        {
          x: ff.x,
          y: ff.y,
          w: ff.w,
          h: ff.h * 0.58,
        },
        0.03,
        0.05,
      );
      break;
    }
    case "fat_density_volume": {
      n = padBox(
        {
          x: ff.x,
          y: ff.y + ff.h * 0.2,
          w: ff.w,
          h: ff.h * 0.58,
        },
        0.02,
        0.03,
      );
      break;
    }
    case "skin_type":
    case "blemishes_imperfections":
    case "skin_appearance":
    case "collagen_elasticity_signals": {
      n = padBox(
        {
          x: ff.x,
          y: ff.y + ff.h * 0.06,
          w: ff.w,
          h: ff.h * 0.82,
        },
        0.03,
        0.03,
      );
      break;
    }
    case "overall_face_shape_geometry":
    case "expressions":
    case "scan_process":
    case "improvement_playbook":
    case "guidance_projection":
    case "tracking_goals":
    case "source_image":
      n = padBox(ff, 0.02, 0.02);
      break;
    default:
      n = padBox(ff, 0.03, 0.03);
  }

  const px = normToPixels(n, imageWidth, imageHeight);
  return fitPixelBox(px, imageWidth, imageHeight);
}

/** Exported for canvas overlays (same topology as MediaPipe). */
export const LANDMARK_LEFT_EYE_INDICES = LEFT_EYE;
export const LANDMARK_RIGHT_EYE_INDICES = RIGHT_EYE;
export const LANDMARK_LEFT_BROW_INDICES = LEFT_BROW;
export const LANDMARK_RIGHT_BROW_INDICES = RIGHT_BROW;
export const LANDMARK_LIPS_INDICES = LIPS;
