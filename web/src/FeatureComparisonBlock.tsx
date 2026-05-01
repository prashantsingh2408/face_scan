import {
  FEATURE_COMPARISON,
  inferFaceArchetype,
  inferGlowSpectrumHint,
  readFaceShapeClassification,
  readSkinAppearanceGlow,
  type ComparisonVariant,
} from "./featureComparisonCopy";
import {
  SketchFaceShapeTrio,
  SketchLinesZones,
  SketchLipProfiles,
  SketchSkinGlowSpectrum,
  SketchUnderEyeReference,
} from "./ReferenceFaceSketches";

function ReferenceSketch({
  variant,
  shapeHighlight,
  glowHint,
}: {
  variant: ComparisonVariant;
  shapeHighlight: string;
  glowHint?: number | null;
}) {
  switch (variant) {
    case "under_eye":
      return <SketchUnderEyeReference />;
    case "face_shape":
      return <SketchFaceShapeTrio highlight={inferFaceArchetype(shapeHighlight)} />;
    case "lips":
      return <SketchLipProfiles />;
    case "skin_tone":
      return <SketchSkinGlowSpectrum markerPercent={glowHint ?? undefined} />;
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

  const skinGlow =
    sectionKey === "skin_appearance" ? readSkinAppearanceGlow(report) : { glow_radiance: undefined };
  const glowHint =
    sectionKey === "skin_appearance" ? inferGlowSpectrumHint(skinGlow.glow_radiance) : null;

  return (
    <section className="feature-compare" aria-labelledby={`feature-compare-${sectionKey}`}>
      <h4 id={`feature-compare-${sectionKey}`} className="feature-compare-title">
        {cfg.title}
      </h4>
      <p className="feature-compare-lead">Your metrics are listed below — this block is optional context.</p>
      <div className="feature-compare-visual-row">
        {scanImageUrl ? (
          <div className="feature-compare-your">
            <span className="feature-compare-label">Your scan</span>
            <div className="feature-compare-thumb-wrap">
              <img src={scanImageUrl} alt="" className="feature-compare-thumb" decoding="async" />
            </div>
          </div>
        ) : null}
        <div className="feature-compare-ref-column">
          <span className="feature-compare-label">
            {cfg.variant === "skin_tone"
              ? "Illustrative matte ↔ glow scale (not a numeric score)"
              : "Typical reference (diagram)"}
          </span>
          <div className="feature-compare-sketch">
            <ReferenceSketch
              variant={cfg.variant}
              shapeHighlight={shapeLabel ?? ""}
              glowHint={glowHint}
            />
          </div>
          {shapeLabel && cfg.variant === "face_shape" ? (
            <p className="feature-compare-shape-hint">
              Report suggests: <strong>{shapeLabel}</strong> — closest archetype is highlighted.
            </p>
          ) : null}
          {cfg.variant === "skin_tone" ? (
            <p className="feature-compare-glow-hint">
              {glowHint != null && skinGlow.glow_radiance ? (
                <>
                  Gold marker is a <strong>rough hint</strong> from your glow wording (“{skinGlow.glow_radiance}”), not a
                  sensor reading — angle and lighting change shine more than skincare in one photo.
                </>
              ) : skinGlow.glow_radiance ? (
                <>
                  No marker for this wording — use the <strong>glow radiance</strong> and <strong>tone uniformity</strong>{" "}
                  lines below. The bar only explains matte vs luminous vocabulary.
                </>
              ) : (
                <>
                  The scale explains matte vs luminous language; your scan metrics appear in the list below.
                </>
              )}
            </p>
          ) : null}
        </div>
      </div>
      <details className="feature-compare-details">
        <summary className="feature-compare-details-summary">About this diagram</summary>
        <ul className="feature-compare-bullets">
          {cfg.bullets.map((t, idx) => (
            <li key={idx}>{t}</li>
          ))}
        </ul>
        <p className="feature-compare-disclaimer">
          Diagrams are educational simplifications, not population statistics or medical benchmarks.
        </p>
      </details>
    </section>
  );
}
