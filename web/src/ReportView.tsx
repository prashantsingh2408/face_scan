import { useCallback, useRef, useState } from "react";
import { getPixelCropForSection } from "./faceRegionCrops";
import { IconInfo, sectionIcon } from "./icons";
import { FeatureComparisonBlock } from "./FeatureComparisonBlock";
import { FEATURE_COMPARISON } from "./featureComparisonCopy";
import { overlayLegendForSection } from "./landmarkDrawing";
import { LandmarkCropCanvas } from "./LandmarkCropCanvas";
import { SCAN_REGION_HINT, SECTION_SCAN_REGION } from "./sectionScanRegions";
import type { FaceLandmarkAnalysis } from "./useFaceLandmarkAnalysis";
import { ImprovementPlaybookView, isImprovementPlaybook } from "./improvementPlaybook";
import { GroqRecommendationsBlock } from "./GroqRecommendationsBlock";

const SECTION_ORDER: { key: string; title: string }[] = [
  { key: "overall_face_shape_geometry", title: "Face shape & geometry" },
  { key: "skin_type", title: "Skin type & balance" },
  { key: "blemishes_imperfections", title: "Blemishes & texture" },
  { key: "dark_circles_under_eye", title: "Dark circles & eyes" },
  { key: "fat_density_volume", title: "Volume & contour" },
  { key: "collagen_elasticity_signals", title: "Firmness & elasticity" },
  { key: "skin_appearance", title: "Glow & tone" },
  { key: "lines_wrinkles", title: "Lines & wrinkles" },
  { key: "eyebrows", title: "Eyebrows" },
  { key: "lips", title: "Lips" },
  { key: "teeth_smile", title: "Teeth & smile" },
  { key: "cheeks_jaw_lines", title: "Cheeks & jaw" },
  { key: "expressions", title: "Expressions" },
  { key: "scan_process", title: "Scan process" },
  { key: "improvement_playbook", title: "Improvement playbook" },
  { key: "guidance_projection", title: "Guidance" },
  { key: "tracking_goals", title: "Tracking" },
  { key: "source_image", title: "Technical" },
];

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "number") {
    if (Number.isInteger(v)) return String(v);
    return v.toFixed(2).replace(/\.?0+$/, "") || "0";
  }
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.map((x) => formatValue(x)).join(" · ");
  return "";
}

function humanKey(k: string): string {
  return k
    .split("_")
    .map((w) => (w.length ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function isRatioObject(v: object): v is Record<string, number> {
  const o = v as Record<string, unknown>;
  const vals = Object.values(o);
  if (vals.length === 0) return false;
  return vals.every(
    (x) => typeof x === "number" && x >= 0 && x <= 1 && Number.isFinite(x),
  );
}

function RatioBars({ data }: { data: Record<string, number> }) {
  return (
    <div className="ratio-bars" aria-label="Contributions">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="ratio-row">
          <span className="ratio-label">{humanKey(k)}</span>
          <div className="ratio-track" role="presentation">
            <div className="ratio-fill" style={{ width: `${Math.round(v * 100)}%` }} />
          </div>
          <span className="ratio-pct">{Math.round(v * 100)}%</span>
        </div>
      ))}
    </div>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <ul className="chip-list">
      {items.map((t) => (
        <li key={t} className="chip">
          {t}
        </li>
      ))}
    </ul>
  );
}

function Rows({ data, depth }: { data: Record<string, unknown>; depth: number }) {
  const entries = Object.entries(data).filter(([k]) => k !== "disclaimer");
  if (entries.length === 0) return null;
  return (
    <div className={`report-rows depth-${depth}`}>
      {entries.map(([k, v]) => {
        if (typeof v === "object" && v !== null && !Array.isArray(v)) {
          if (isRatioObject(v)) {
            return (
              <div key={k} className="report-subblock">
                <div className="report-subtitle">{humanKey(k)}</div>
                <RatioBars data={v} />
              </div>
            );
          }
          return (
            <div key={k} className="report-subblock">
              <div className="report-subtitle">{humanKey(k)}</div>
              <Rows data={v as Record<string, unknown>} depth={depth + 1} />
            </div>
          );
        }
        if (Array.isArray(v) && v.every((x) => typeof x === "string")) {
          return (
            <div key={k} className="kv-row kv-row--block">
              <span className="kv-label">{humanKey(k)}</span>
              <ChipList items={v as string[]} />
            </div>
          );
        }
        return (
          <div key={k} className="kv-row">
            <span className="kv-label">{humanKey(k)}</span>
            <span className="kv-value">{formatValue(v)}</span>
          </div>
        );
      })}
    </div>
  );
}

type Report = Record<string, unknown>;

function SectionPhotoRegion({
  src,
  sectionKey,
  faceAnalysis,
}: {
  src: string;
  sectionKey: string;
  faceAnalysis: FaceLandmarkAnalysis;
}) {
  const cfg = SECTION_SCAN_REGION[sectionKey];
  if (!cfg) return null;

  const mlBox =
    faceAnalysis.status === "ready"
      ? getPixelCropForSection(
          sectionKey,
          faceAnalysis.landmarks,
          faceAnalysis.imageWidth,
          faceAnalysis.imageHeight,
        )
      : null;

  const useMlCrop = Boolean(mlBox);
  const hint =
    faceAnalysis.status === "ready" && useMlCrop
      ? "Crop aligned with MediaPipe Face Landmarker (on-device, no upload to a crop server)."
      : faceAnalysis.status === "error"
        ? `${faceAnalysis.message} Showing approximate framing instead.`
        : faceAnalysis.status === "loading"
          ? "Loading face model — preview below updates to landmark crop when ready."
          : SCAN_REGION_HINT;

  const overlayLegend =
    faceAnalysis.status === "ready" && useMlCrop ? overlayLegendForSection(sectionKey) : null;

  return (
    <figure className="report-region-crop">
      <figcaption className="report-region-crop-caption">{cfg.caption}</figcaption>
      {useMlCrop && mlBox && faceAnalysis.status === "ready" ? (
        <LandmarkCropCanvas
          src={src}
          box={mlBox}
          label={cfg.alt}
          sectionKey={sectionKey}
          landmarks={faceAnalysis.landmarks}
          imageWidth={faceAnalysis.imageWidth}
          imageHeight={faceAnalysis.imageHeight}
        />
      ) : (
        <div
          className="report-region-crop-frame report-region-crop-frame--dynamic"
          style={{ aspectRatio: cfg.aspectRatio, maxHeight: cfg.maxHeight }}
        >
          <img
            src={src}
            alt={cfg.alt}
            className="report-region-crop-img"
            style={{
              objectPosition: cfg.objectPosition,
              height: `${cfg.imgHeightPct}%`,
            }}
            decoding="async"
          />
        </div>
      )}
      <p className="report-region-crop-hint">{hint}</p>
      {overlayLegend ? <p className="report-overlay-legend">{overlayLegend}</p> : null}
    </figure>
  );
}

function SectionPhotoToolbar({
  sectionKey,
  src,
  isOpen,
  onToggle,
  faceAnalysis,
}: {
  sectionKey: string;
  src: string;
  isOpen: boolean;
  onToggle: () => void;
  faceAnalysis: FaceLandmarkAnalysis;
}) {
  const cfg = SECTION_SCAN_REGION[sectionKey];
  if (!cfg) return null;
  return (
    <div className="report-section-region-toolbar">
      <button type="button" className="btn-report-region" onClick={onToggle} aria-expanded={isOpen}>
        {isOpen ? "Hide photo preview" : `View ${cfg.buttonFocus} in photo`}
      </button>
      {isOpen ? (
        <SectionPhotoRegion src={src} sectionKey={sectionKey} faceAnalysis={faceAnalysis} />
      ) : null}
    </div>
  );
}

export function ReportView({
  report,
  scanImageUrl = null,
  faceAnalysis = { status: "idle" },
}: {
  report: Report;
  /** Same image used for the scan (e.g. object URL); used for section-specific crops. */
  scanImageUrl?: string | null;
  /** MediaPipe Face Landmarker output for accurate per-section crops. */
  faceAnalysis?: FaceLandmarkAnalysis;
}) {
  const sectionListRef = useRef<HTMLDivElement>(null);
  const [regionOpen, setRegionOpen] = useState<Record<string, boolean>>({});
  const toggleRegion = useCallback((key: string) => {
    setRegionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const expandAllSections = useCallback(() => {
    sectionListRef.current?.querySelectorAll("details.report-section").forEach((el) => {
      (el as HTMLDetailsElement).open = true;
    });
  }, []);

  const collapseAllSections = useCallback(() => {
    sectionListRef.current?.querySelectorAll("details.report-section").forEach((el) => {
      (el as HTMLDetailsElement).open = false;
    });
  }, []);

  const disclaimer = typeof report.disclaimer === "string" ? report.disclaimer : null;

  const regionToolbar = (key: string) =>
    scanImageUrl && SECTION_SCAN_REGION[key] ? (
      <SectionPhotoToolbar
        sectionKey={key}
        src={scanImageUrl}
        isOpen={!!regionOpen[key]}
        onToggle={() => toggleRegion(key)}
        faceAnalysis={faceAnalysis}
      />
    ) : null;

  return (
    <div className="report-root">
      {faceAnalysis.status === "loading" && (
        <p className="report-face-ai-banner" role="status" aria-live="polite">
          <span className="spinner spinner--inline" aria-hidden />
          Detecting your face for accurate photo crops — previews work now and sharpen when ready.
        </p>
      )}
      <div className="report-section-toolbar" role="toolbar" aria-label="Report sections">
        <button type="button" className="btn-report-outline" onClick={expandAllSections}>
          Expand all sections
        </button>
        <button type="button" className="btn-report-outline" onClick={collapseAllSections}>
          Collapse all
        </button>
      </div>
      <div className="report-section-list" ref={sectionListRef}>
        {disclaimer && (
          <div className="report-disclaimer report-disclaimer--full" role="note">
            <span className="report-disclaimer-icon" aria-hidden>
              <IconInfo size={20} />
            </span>
            <span>{disclaimer}</span>
          </div>
        )}
        {SECTION_ORDER.map(({ key, title }, i) => {
          const block = report[key];
          if (block === undefined || block === null) return null;
          const defaultOpen = key === "improvement_playbook" || i < 1;
          if (typeof block !== "object" || Array.isArray(block)) {
            return (
              <details key={key} className="report-section" open={defaultOpen}>
                <summary className="report-section-summary">
                  <span className="section-icon" aria-hidden>
                    {sectionIcon(key)}
                  </span>
                  <span className="section-title">{title}</span>
                </summary>
                <div className="report-section-body">
                  {regionToolbar(key)}
                  <p className="section-lead">{formatValue(block)}</p>
                </div>
              </details>
            );
          }
          return (
            <details key={key} className="report-section" open={defaultOpen}>
              <summary className="report-section-summary">
                <span className="section-icon" aria-hidden>
                  {sectionIcon(key)}
                </span>
                <span className="section-title">{title}</span>
              </summary>
              <div className="report-section-body">
                {regionToolbar(key)}
                {isImprovementPlaybook(block) ? (
                  <>
                    <ImprovementPlaybookView data={block} />
                    <GroqRecommendationsBlock report={report} />
                  </>
                ) : (
                  <>
                    {FEATURE_COMPARISON[key] ? (
                      <FeatureComparisonBlock sectionKey={key} scanImageUrl={scanImageUrl} report={report} />
                    ) : null}
                    <Rows data={block as Record<string, unknown>} depth={0} />
                  </>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
