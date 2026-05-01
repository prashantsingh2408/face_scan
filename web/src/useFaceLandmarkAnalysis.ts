import { useEffect, useState } from "react";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { detectFaceLandmarks } from "./faceLandmarkerService";

export type FaceLandmarkAnalysis =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      landmarks: NormalizedLandmark[];
      imageWidth: number;
      imageHeight: number;
    };

/**
 * Runs MediaPipe Face Landmarker once per scan image so section previews can use real ROIs.
 */
export function useFaceLandmarkAnalysis(imageUrl: string | null, run: boolean): FaceLandmarkAnalysis {
  const [state, setState] = useState<FaceLandmarkAnalysis>({ status: "idle" });

  useEffect(() => {
    if (!run || !imageUrl) {
      setState({ status: "idle" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    detectFaceLandmarks(imageUrl)
      .then((r) => {
        if (cancelled) return;
        if (r) {
          setState({
            status: "ready",
            landmarks: r.landmarks,
            imageWidth: r.imageWidth,
            imageHeight: r.imageHeight,
          });
        } else {
          setState({
            status: "error",
            message: "No face detected in this image.",
          });
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "Face detection failed.";
        setState({ status: "error", message: msg });
      });

    return () => {
      cancelled = true;
    };
  }, [imageUrl, run]);

  return state;
}
