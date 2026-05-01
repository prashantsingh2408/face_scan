/**
 * MediaPipe Face Landmarker (Google AI Edge) — runs in-browser for accurate ROI crops.
 * @see https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js
 */
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

const MP_VERSION = "0.10.21";
const WASM_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export type FaceLandmarkDetection = {
  landmarks: NormalizedLandmark[];
  imageWidth: number;
  imageHeight: number;
};

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

async function createLandmarker(delegate: "GPU" | "CPU"): Promise<FaceLandmarker> {
  const wasm = await FilesetResolver.forVisionTasks(WASM_BASE);
  return FaceLandmarker.createFromOptions(wasm, {
    baseOptions: {
      modelAssetPath: MODEL_URL,
      delegate,
    },
    runningMode: "IMAGE",
    numFaces: 1,
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false,
  });
}

async function getFaceLandmarker(): Promise<FaceLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      try {
        return await createLandmarker("GPU");
      } catch {
        return await createLandmarker("CPU");
      }
    })();
  }
  return landmarkerPromise;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image for face detection."));
    img.src = src;
  });
}

/** Runs Face Landmarker on the same image URL used for preview (blob or http). */
export async function detectFaceLandmarks(imageSrc: string): Promise<FaceLandmarkDetection | null> {
  const img = await loadImage(imageSrc);
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  if (w < 8 || h < 8) return null;

  const landmarker = await getFaceLandmarker();
  const result = landmarker.detect(img);
  const face = result.faceLandmarks[0];
  if (!face?.length) return null;

  return { landmarks: face, imageWidth: w, imageHeight: h };
}
