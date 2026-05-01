/** Abstract SVG references — not photographs of real individuals. */

export function SketchUnderEyeReference() {
  return (
    <svg
      className="feature-compare-svg"
      viewBox="0 0 220 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <ellipse cx="110" cy="62" rx="52" ry="58" stroke="rgba(180,195,220,0.55)" strokeWidth="1.8" />
      <ellipse cx="82" cy="52" rx="14" ry="8" stroke="rgba(115,225,255,0.45)" strokeWidth="1.3" />
      <ellipse cx="138" cy="52" rx="14" ry="8" stroke="rgba(115,225,255,0.45)" strokeWidth="1.3" />
      <path
        d="M58 68 Q82 78 110 74 Q138 78 162 68"
        stroke="rgba(180,195,220,0.35)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M66 72 Q82 96 98 88 Q106 84 110 82 Q114 84 122 88 Q138 96 154 72"
        fill="rgba(255,210,130,0.14)"
        stroke="rgba(255,225,170,0.55)"
        strokeWidth="1.4"
        strokeDasharray="4 3"
      />
      <text x="110" y="118" textAnchor="middle" fill="rgba(140,155,180,0.85)" fontSize="9" fontFamily="system-ui,sans-serif">
        Typical shadow / hollow zones (illustrative)
      </text>
    </svg>
  );
}

type ShapeKey = "oval" | "round" | "square" | "heart" | "neutral";

export function SketchFaceShapeTrio({ highlight }: { highlight: ShapeKey }) {
  const ring = (active: boolean) =>
    active ? "rgba(115,225,255,0.85)" : "rgba(120,135,160,0.25)";
  const fillFace = (active: boolean) =>
    active ? "rgba(61,139,253,0.08)" : "rgba(255,255,255,0.03)";

  const Oval = ({ x, active }: { x: number; active: boolean }) => (
    <g transform={`translate(${x}, 18)`}>
      <ellipse
        cx="34"
        cy="42"
        rx="26"
        ry="36"
        fill={fillFace(active)}
        stroke={ring(active)}
        strokeWidth={active ? 2 : 1.2}
      />
      <text x="34" y="94" textAnchor="middle" fill="rgba(150,165,190,0.9)" fontSize="8" fontFamily="system-ui,sans-serif">
        Oval
      </text>
    </g>
  );
  const Round = ({ x, active }: { x: number; active: boolean }) => (
    <g transform={`translate(${x}, 18)`}>
      <circle cx="34" cy="42" r="30" fill={fillFace(active)} stroke={ring(active)} strokeWidth={active ? 2 : 1.2} />
      <text x="34" y="94" textAnchor="middle" fill="rgba(150,165,190,0.9)" fontSize="8" fontFamily="system-ui,sans-serif">
        Round
      </text>
    </g>
  );
  const Square = ({ x, active }: { x: number; active: boolean }) => (
    <g transform={`translate(${x}, 14)`}>
      <rect
        x="8"
        y="10"
        width="52"
        height="64"
        rx="10"
        fill={fillFace(active)}
        stroke={ring(active)}
        strokeWidth={active ? 2 : 1.2}
      />
      <text x="34" y="94" textAnchor="middle" fill="rgba(150,165,190,0.9)" fontSize="8" fontFamily="system-ui,sans-serif">
        Square
      </text>
    </g>
  );
  const Heart = ({ x, active }: { x: number; active: boolean }) => (
    <g transform={`translate(${x}, 18)`}>
      <path
        d="M34 22 C18 12 6 28 14 42 L34 72 L54 42 C62 28 50 12 34 22Z"
        fill={fillFace(active)}
        stroke={ring(active)}
        strokeWidth={active ? 2 : 1.2}
      />
      <text x="34" y="94" textAnchor="middle" fill="rgba(150,165,190,0.9)" fontSize="8" fontFamily="system-ui,sans-serif">
        Heart
      </text>
    </g>
  );

  const h = highlight === "neutral" ? "oval" : highlight;

  return (
    <svg
      className="feature-compare-svg feature-compare-svg--wide"
      viewBox="0 0 320 108"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <Oval x={8} active={h === "oval"} />
      <Round x={88} active={h === "round"} />
      <Square x={168} active={h === "square"} />
      <Heart x={248} active={h === "heart"} />
    </svg>
  );
}

export function SketchLipProfiles() {
  return (
    <svg className="feature-compare-svg" viewBox="0 0 200 72" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <text x="48" y="14" textAnchor="middle" fill="rgba(150,165,190,0.85)" fontSize="8" fontFamily="system-ui,sans-serif">
        Narrower
      </text>
      <path
        d="M24 48 Q48 38 72 48 Q48 56 24 48Z"
        fill="rgba(255,130,175,0.06)"
        stroke="rgba(255,160,195,0.55)"
        strokeWidth="1.4"
      />
      <text x="152" y="14" textAnchor="middle" fill="rgba(150,165,190,0.85)" fontSize="8" fontFamily="system-ui,sans-serif">
        Fuller
      </text>
      <path
        d="M104 46 Q128 32 152 46 Q176 60 152 54 Q128 62 104 46Z"
        fill="rgba(255,130,175,0.08)"
        stroke="rgba(255,160,195,0.65)"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function SketchSkinGlowSpectrum() {
  return (
    <svg className="feature-compare-svg" viewBox="0 0 200 56" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="skinGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(90,95,110,0.9)" />
          <stop offset="50%" stopColor="rgba(140,155,185,0.55)" />
          <stop offset="100%" stopColor="rgba(230,235,255,0.35)" />
        </linearGradient>
      </defs>
      <rect x="10" y="18" width="180" height="18" rx="9" fill="url(#skinGlowGrad)" stroke="rgba(255,255,255,0.12)" />
      <text x="28" y="50" fill="rgba(150,165,190,0.85)" fontSize="8" fontFamily="system-ui,sans-serif">
        Matte
      </text>
      <text x="164" y="50" textAnchor="end" fill="rgba(150,165,190,0.85)" fontSize="8" fontFamily="system-ui,sans-serif">
        Luminous
      </text>
    </svg>
  );
}

export function SketchLinesZones() {
  return (
    <svg className="feature-compare-svg" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <ellipse cx="100" cy="56" rx="48" ry="52" stroke="rgba(165,205,255,0.35)" strokeWidth="1.3" fill="none" />
      <path d="M52 38 Q100 28 148 38" stroke="rgba(165,205,255,0.45)" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M62 52 Q72 58 62 64" stroke="rgba(165,205,255,0.45)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M138 52 Q128 58 138 64" stroke="rgba(165,205,255,0.45)" strokeWidth="1.3" strokeLinecap="round" />
      <text x="100" y="108" textAnchor="middle" fill="rgba(140,155,180,0.85)" fontSize="8" fontFamily="system-ui,sans-serif">
        Forehead · crow&apos;s-feet · folds (illustrative)
      </text>
    </svg>
  );
}
