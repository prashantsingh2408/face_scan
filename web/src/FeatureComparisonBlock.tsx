import {
  FEATURE_COMPARISON,
  inferFaceArchetype,
  readFaceShapeClassification,
  type ComparisonVariant,
} from "./featureComparisonCopy";
import {
  SketchFaceShapeTrio,
  SketchLinesZones,
  SketchLipProfiles,
  SketchSkinGlowSpectrum,
  SketchUnderEyeReference,
} from "./ReferenceFaceSketches";

function ReferenceSketch({ variant, shapeHighlight }: { variant: ComparisonVariant; shapeHighlight: string }) {
  switch (variant) {
    case "under_eye":
      return <SketchUnderEyeReference />;
    case "face_shape":
      return <SketchFaceShapeTrio highlight={inferFaceArchetype(shapeHighlight)} />;
    case "lips":
      return <SketchLipProfiles />;
    case "skin_tone":
      return <SketchSkinGlowSpectrum />;
    case "lines":
      return <SketchLinesZones />;
    default:
      return null;
  }
}

export function FeatureComparisonBlock({
  sectionKey,
  scanImageUrl,
  report,
}: {
  sectionKey: string;
  scanImageUrl: string | null;
  report: Record<string, unknown>;
}) {
  const cfg = FEATURE_COMPARISON[sectionKey];
  if (!cfg) return null;

  const shapeLabel =
    sectionKey === "overall_face_shape_geometry" ? readFaceShapeClassification(report) : undefined;

  return (
    <section className="feature-compare" aria-labelledby={`feature-compare-${sectionKey}`}>
      <h4 id={`feature-compare-${sectionKey}`} className="feature-compare-title">
        {cfg.title}
      </h4>
      <div className="feature-compare-grid">
        {scanImageUrl ? (
          <div className="feature-compare-your">
            <span className="feature-compare-label">Your scan</span>
            <div className="feature-compare-thumb-wrap">
              <img src={scanImageUrl} alt="" className="feature-compare-thumb" decoding="async" />
            </div>
          </div>
        ) : null}
        <div className="feature-compare-ref-column">
          <span className="feature-compare-label">Typical reference (diagram)</span>
          <div className="feature-compare-sketch">
            <ReferenceSketch variant={cfg.variant} shapeHighlight={shapeLabel ?? ""} />
          </div>
          {shapeLabel && cfg.variant === "face_shape" ? (
            <p className="feature-compare-shape-hint">
              Report suggests: <strong>{shapeLabel}</strong> — closest archetype is highlighted.
            </p>
          ) : null}
        </div>
        <ul className="feature-compare-bullets">
          {cfg.bullets.map((t, idx) => (
            <li key={idx}>{t}</li>
          ))}
        </ul>
      </div>
      <p className="feature-compare-disclaimer">
        Diagrams are educational simplifications, not population statistics or medical benchmarks.
      </p>
    </section>
  );
}
