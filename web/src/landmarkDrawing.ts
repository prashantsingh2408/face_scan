/**
 * Draws AI landmark guides on cropped preview canvases (MediaPipe topology).
 */
import { FaceLandmarker } from "@mediapipe/tasks-vision";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { PixelBox } from "./faceRegionCrops";
import {
  LANDMARK_LEFT_EYE_INDICES,
  LANDMARK_RIGHT_EYE_INDICES,
} from "./faceRegionCrops";

type Connection = { start: number; end: number };

export type SectionOverlayPlan = {
  connections: Connection[];
  /** Extra fill under eyes for dark-circle section */
  underEyeBands: boolean;
  stroke: string;
  /** Multiplier for base stroke width */
  strokeWidthFactor: number;
};

function mapToCanvas(
  lm: NormalizedLandmark,
  iw: number,
  ih: number,
  crop: PixelBox,
  cw: number,
  ch: number,
): { x: number; y: number } {
  return {
    x: (lm.x * iw - crop.sx) * (cw / crop.sw),
    y: (lm.y * ih - crop.sy) * (ch / crop.sh),
  };
}

function bboxNormFromIndices(lm: NormalizedLandmark[], indices: readonly number[]) {
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

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

/** Warm translucent bands + dashed outline under each eye (dark-circle emphasis). */
export function drawUnderEyeBands(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  iw: number,
  ih: number,
  crop: PixelBox,
  cw: number,
  ch: number,
) {
  const lw = Math.max(1.25, cw / 220);

  for (const indices of [LANDMARK_LEFT_EYE_INDICES, LANDMARK_RIGHT_EYE_INDICES]) {
    const b = bboxNormFromIndices(landmarks, indices);
    if (!b) continue;

    const topLeft = {
      x: (b.x * iw - crop.sx) * (cw / crop.sw),
      y: (b.y * ih - crop.sy) * (ch / crop.sh),
    };
    const wPx = b.w * iw * (cw / crop.sw);
    const hPx = b.h * ih * (ch / crop.sh);

    const bx = topLeft.x - wPx * 0.06;
    const by = topLeft.y + hPx * 0.22;
    const bw = wPx * 1.12;
    const bh = hPx * 1.15;
    const r = Math.min(14, bw * 0.12);

    ctx.beginPath();
    roundRectPath(ctx, bx, by, bw, bh, r);
    ctx.fillStyle = "rgba(255, 210, 130, 0.16)";
    ctx.fill();

    ctx.beginPath();
    roundRectPath(ctx, bx, by, bw, bh, r);
    ctx.strokeStyle = "rgba(255, 235, 190, 0.82)";
    ctx.lineWidth = lw;
    ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

export function drawConnectionOverlay(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  connections: Connection[],
  iw: number,
  ih: number,
  crop: PixelBox,
  cw: number,
  ch: number,
  stroke: string,
  strokeWidthFactor: number,
) {
  const base = Math.max(1.5, Math.min(4.5, cw / 160));
  const lw = base * strokeWidthFactor;

  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const { start, end } of connections) {
    const a = landmarks[start];
    const b = landmarks[end];
    if (!a || !b) continue;
    const pa = mapToCanvas(a, iw, ih, crop, cw, ch);
    const pb = mapToCanvas(b, iw, ih, crop, cw, ch);
    ctx.beginPath();
    ctx.moveTo(pa.x, pa.y);
    ctx.lineTo(pb.x, pb.y);
    ctx.stroke();
  }
  ctx.restore();
}

export function getSectionOverlayPlan(sectionKey: string): SectionOverlayPlan | null {
  switch (sectionKey) {
    case "dark_circles_under_eye":
      return {
        connections: [
          ...FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
          ...FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
        ],
        underEyeBands: true,
        stroke: "rgba(115, 225, 255, 0.92)",
        strokeWidthFactor: 1.05,
      };
    case "eyebrows":
      return {
        connections: [
          ...FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
          ...FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
        ],
        underEyeBands: false,
        stroke: "rgba(205, 175, 255, 0.9)",
        strokeWidthFactor: 1,
      };
    case "lips":
      return {
        connections: [...FaceLandmarker.FACE_LANDMARKS_LIPS],
        underEyeBands: false,
        stroke: "rgba(255, 130, 175, 0.88)",
        strokeWidthFactor: 1,
      };
    case "teeth_smile":
      return {
        connections: [...FaceLandmarker.FACE_LANDMARKS_LIPS],
        underEyeBands: false,
        stroke: "rgba(255, 245, 160, 0.88)",
        strokeWidthFactor: 1,
      };
    case "lines_wrinkles":
      return {
        connections: [
          ...FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
          ...FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
          ...FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
          ...FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
        ],
        underEyeBands: false,
        stroke: "rgba(165, 205, 255, 0.62)",
        strokeWidthFactor: 0.88,
      };
    case "overall_face_shape_geometry":
    case "expressions":
    case "improvement_playbook":
      return {
        connections: [...FaceLandmarker.FACE_LANDMARKS_FACE_OVAL],
        underEyeBands: false,
        stroke: "rgba(125, 185, 255, 0.42)",
        strokeWidthFactor: 0.72,
      };
    default:
      return null;
  }
}

export function overlayLegendForSection(sectionKey: string): string | null {
  switch (sectionKey) {
    case "dark_circles_under_eye":
      return "Cyan lines: AI eyelid outline. Warm tint + dashed box: under-eye band highlighted for this reading.";
    case "eyebrows":
      return "Purple lines trace eyebrow landmarks from your photo.";
    case "lips":
      return "Pink lines outline lip contours detected in your photo.";
    case "teeth_smile":
      return "Yellow lines follow the mouth contour (smile zone).";
    case "lines_wrinkles":
      return "Light lines mark eyes and brows — areas often checked for lines.";
    case "overall_face_shape_geometry":
    case "expressions":
      return "Soft outline follows face oval landmarks.";
    case "improvement_playbook":
      return "Face oval reference while you map habits and products to different zones.";
    default:
      return null;
  }
}
