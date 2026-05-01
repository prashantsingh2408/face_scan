import { useEffect, useRef } from "react";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { PixelBox } from "./faceRegionCrops";
import {
  drawConnectionOverlay,
  drawUnderEyeBands,
  getSectionOverlayPlan,
} from "./landmarkDrawing";

const MAX_DISPLAY_WIDTH = 720;

type Props = {
  src: string;
  box: PixelBox;
  /** Short label for canvas accessibility */
  label: string;
  sectionKey: string;
  landmarks: NormalizedLandmark[];
  imageWidth: number;
  imageHeight: number;
};

export function LandmarkCropCanvas({
  src,
  box,
  label,
  sectionKey,
  landmarks,
  imageWidth,
  imageHeight,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const scale = Math.min(1, MAX_DISPLAY_WIDTH / box.sw);
      const dw = Math.max(2, Math.floor(box.sw * scale));
      const dh = Math.max(2, Math.floor(box.sh * scale));
      canvas.width = dw;
      canvas.height = dh;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, box.sx, box.sy, box.sw, box.sh, 0, 0, dw, dh);

      const plan = getSectionOverlayPlan(sectionKey);
      if (plan) {
        if (plan.underEyeBands) {
          drawUnderEyeBands(ctx, landmarks, imageWidth, imageHeight, box, dw, dh);
        }
        drawConnectionOverlay(
          ctx,
          landmarks,
          plan.connections,
          imageWidth,
          imageHeight,
          box,
          dw,
          dh,
          plan.stroke,
          plan.strokeWidthFactor,
        );
      }
    };
    img.src = src;
  }, [src, box, sectionKey, landmarks, imageWidth, imageHeight]);

  return (
    <canvas
      ref={ref}
      className="report-landmark-crop-canvas"
      role="img"
      aria-label={label}
    />
  );
}
