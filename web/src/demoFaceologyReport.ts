/** Default Faceology template report (mirrors server `report_placeholder.py`). Used when API omits `faceology_report` (old process or cache). */

export const DEFAULT_FACEOLOGY_REPORT: Record<string, unknown> = {
  disclaimer:
    "Demo report: numeric fields mirror common ordinal scales (POH grade, IGA acne, Fitzpatrick phototype, Glogau) for clarity — still illustrative until models measure your photo.",
  rating_standards_links: [
    {
      label: "Periorbital hyperpigmentation classification — Fatin et al., Skin Res Technol (2020)",
      url: "https://doi.org/10.1111/srt.12831",
    },
    {
      label: "What causes dark circles under the eyes? — Freitag & Cestari, J Cosmet Dermatol (2007)",
      url: "https://doi.org/10.1111/j.1473-2165.2007.00324.x",
    },
    {
      label: "Fitzpatrick sun-reactive skin types I–VI — Arch Dermatol (1988)",
      url: "https://doi.org/10.1001/archderm.1988.01670300158022",
    },
    {
      label: "Investigator Global Assessment (IGA) for acne — NCBI Bookshelf overview",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK519508/",
    },
    {
      label: "Glogau photoaging scale — Semin Cutan Med Surg (1996)",
      url: "https://doi.org/10.1016/S1085-5629(96)80034-2",
    },
  ],
  source_image: {
    format: "—",
    bytes: 0,
    sha256_prefix: "—",
    note: "Populated from your upload when the API returns image metadata.",
  },
  overall_face_shape_geometry: {
    face_shape: {
      classification: "Oval (illustrative)",
      confidence: "low",
      alternates_considered: ["Round", "Heart"],
    },
    symmetry: {
      left_right_balance: "moderate",
      jaw_alignment_note: "Slight asymmetry at mandible angle (common).",
    },
    bone_structure: {
      cheekbone_prominence: "moderate",
      jawline_definition: "defined",
      forehead_height_width: "balanced",
    },
    proportions_golden_ratio: {
      eye_width_ratio: "within typical range (illustrative)",
      inter_feature_distances: "not measured in dev build",
    },
  },
  skin_type: {
    primary: "Combination (illustrative)",
    t_zone_vs_u_zone: "Oilier T-zone; cheeks closer to normal.",
    oiliness_shine: { level: "mild", distribution: "T-zone" },
    dehydration_vs_dryness: {
      assessment: "Possible mild dehydration with surface oil (typical combo pattern).",
      note: "Refine with questionnaire + TEWL proxy when sensors/models exist.",
    },
    fitzpatrick_phototype: {
      roman_numeral_estimate: "IV",
      sunburn_and_tan_behavior: "Burns minimally, tans readily.",
      reference:
        "Fitzpatrick L. Sun-reactive skin types I–VI. Arch Dermatol 1988;124(6):869-871.",
      read_standard: "https://doi.org/10.1001/archderm.1988.01670300158022",
      reliability_note: "Phototype cannot be validated from one selfie — clinician / questionnaire preferred.",
    },
  },
  blemishes_imperfections: {
    acne: {
      types_suspected: ["papules", "comedones"],
      severity_word: "mild",
      investigators_global_assessment_0_to_5: 2,
      iga_label: "Mild",
      iga_reference:
        "IGA (Investigator Global Assessment) 0–5 — standard acne trial endpoint (FDA / consensus outcomes).",
      read_standard: "https://www.ncbi.nlm.nih.gov/books/NBK519508/",
    },
    pigmentation: ["post-inflammatory marks (possible)", "freckles (sun-exposed)"],
    redness_inflammation: "mild diffuse redness on cheeks (illustrative)",
    texture: { roughness: "low", pores: "moderate on nose", scarring: "none obvious" },
  },
  dark_circles_under_eye: {
    severity: "mild (illustrative)",
    severity_numeric: {
      periorbital_hyperpigmentation_grade_0_to_4: 1,
      grade_anchor_text:
        "Mild: slight duskiness limited to thin skin over infraorbital rim.",
      shadow_darkening_index_0_to_10: 3.5,
      shadow_index_note:
        "0 = none · 10 = severe appearance on this demo rubric (not densitometry or AIRS photonumeric units).",
    },
    color_contribution: { brown_pigment: 0.35, blue_vascular: 0.45, mixed: 0.2 },
    color_contribution_percent: {
      brown_melanin: 35,
      blue_vascular: 45,
      mixed_overlap: 20,
      sums_to_100_percent: true,
      note: "Partition explains pigment vs vascular emphasis for discussion; clinical dermoscopy separates patterns — demo only.",
    },
    associated: ["fine under-eye lines"],
    literature_notes: [
      "POH clinical grades (0–4 style anchors) summarize intensity/extension for teaching; trials may use photonumeric scales.",
      "Fatin AM et al. Skin Research and Technology 2020;26(4):564-570. https://doi.org/10.1111/srt.12831",
      "Photonumeric infraorbital research scales exist; this app does not compute AIRS-style scores from pixels yet.",
    ],
    read_primary_study: "https://doi.org/10.1111/srt.12831",
  },
  fat_density_volume: {
    subcutaneous_distribution: "mid-face volume within typical range (visual estimate)",
    overall_facial_fat: "balanced",
    caveat: "True fat-pad metrics are not inferred from a single 2D photo in dev.",
  },
  collagen_elasticity_signals: {
    firmness_proxy: "moderate (placeholder)",
    sagging_visual: "low",
    note: "Not a clinical pinch test; appearance-only proxy when models ship.",
    photoaging_glogau: {
      stage_I_to_IV: "II",
      stage_description: "Wrinkles in motion (early-moderate).",
      reference:
        "Glogau RG. Aesthetic and anatomic analysis of the aging skin. Semin Cutan Med Surg 1996;15(3):134-138.",
      read_standard: "https://doi.org/10.1016/S1085-5629(96)80034-2",
      caution: "Stage from a single neutral photo is indicative only.",
    },
  },
  skin_appearance: {
    glow_radiance: "matte with mild highlight on T-zone",
    tone_uniformity: "mostly even with mild cheek redness",
  },
  lines_wrinkles: {
    forehead_horizontal: "few fine lines",
    under_eyes: "fine lines present",
    crow_feet: "mild",
    nasolabial: "soft groove, shallow",
    glabellar: "not prominent at rest",
    marionette: "minimal",
    perioral: "not assessed (needs expression set)",
  },
  eyebrows: {
    shape_uniformity: "arched, mild asymmetry",
    density: "moderate",
    edges: "generally defined",
    position: "within typical orbital relation (visual)",
  },
  lips: {
    volume_shape: "balanced upper/lower (visual)",
    condition: "mild dryness possible",
    vertical_lines: "minimal",
  },
  teeth_smile: {
    visibility_alignment: "not assessed (requires open-mouth / dental capture)",
    whitening_level: "not assessed",
    gum_health: "not assessed",
    smile_dynamics: "not assessed",
  },
  cheeks_jaw_lines: {
    cheek_fullness: "moderate / apple cheek present",
    jawline_definition: "moderate",
    jowls_double_chin: "not prominent in this pose",
    contour_transition: "smooth mid-to-lower face",
  },
  expressions: {
    dynamic_analysis: "not run (upload a short multi-angle video in a future build)",
    resting_vs_smile: "not captured in single frame",
    muscle_activity: "not measured",
  },
  scan_process: {
    video_multi_angle: "pending — current dev flow uses one still image",
    report_depth: "template + literature-cited ordinal scales (demo assignments until CV measures)",
    three_d_model: "pending — mesh export after reconstruction pipeline",
  },
  improvement_playbook: {
    disclaimer:
      "Educational suggestions only — not medical diagnosis or prescriptions. Patch-test new products; stop if irritation occurs; consult a dermatologist for acne, pigment disorders, or before retinoids if pregnant.",
    summary:
      "Demo priorities based on this scan’s themes: combination skin, mild under-eye shadow, cheek redness, and T-zone pores — adjust with your clinician or aesthetician.",
    focus_areas: [
      {
        title: "Under-eye shadow & fine lines",
        priority: "medium",
        based_on: ["dark_circles_under_eye", "lines_wrinkles"],
        habits: [
          "Use broad-spectrum SPF daily; UV drives pigment and collagen loss.",
          "Pat moisturizers — avoid dragging thin under-eye skin.",
          "Prioritize sleep and hydration; salt/alcohol can worsen puffiness for some people.",
        ],
        tools: [
          { item: "UV sunglasses", use: "reduce squinting + periorbital UV" },
          { item: "cool compress / eye mask", use: "short-term de-puff (cosmetic)" },
          { item: "humidifier (dry climates)", use: "reduce surface dehydration overnight" },
        ],
        topical_actives: [
          {
            name: "Vitamin C (stable derivatives or L-ascorbic)",
            role: "brightness / antioxidant over weeks",
            caution: "Can sting; AM under SPF; introduce slowly.",
          },
          {
            name: "Niacinamide",
            role: "barrier support + tone smoothing",
            caution: "Generally mild; rare irritation at high %.",
          },
          {
            name: "Retinoid (night, non-prescription or Rx)",
            role: "fine-line smoothing over months",
            caution: "Start 1–2×/week; avoid if pregnant without clinician OK.",
          },
        ],
        avoid_note: "Heavy fragrance or essential oils stacked near eyes often irritate.",
      },
      {
        title: "Combination skin balance (T-zone oil, cheek dryness signals)",
        priority: "higher",
        based_on: ["skin_type", "skin_appearance"],
        habits: [
          "Cleanse gently once at night; skip harsh scrubbing on oily zones.",
          "Layer lighter gel on T-zone, richer cream on cheeks if needed (multi-moisturizer strategy).",
          "Reapply SPF when outdoors — blot oil first instead of stripping with alcohol wipes.",
        ],
        tools: [
          { item: "oil-blotting papers", use: "reduce shine without stripping barrier" },
          { item: "soft microfiber face towel", use: "pat dry — avoid rough terry on cheeks" },
        ],
        topical_actives: [
          {
            name: "Salicylic acid (BHA) — short-contact or low %",
            role: "pores / T-zone clarity",
            caution: "Can dry cheeks — spot-use or buffer with moisturizer.",
          },
          {
            name: "Ceramides / glycerin / panthenol moisturizers",
            role: "barrier repair on cheeks",
            caution: "Choose non-comedogenic if you clog easily.",
          },
          {
            name: "Azelaic acid",
            role: "redness + uneven tone support",
            caution: "Tingling possible; introduce gradually.",
          },
        ],
        avoid_note: "High-alcohol astringents all-over often worsen combo-pattern dehydration.",
      },
      {
        title: "Cheek redness & mild blemish marks",
        priority: "medium",
        based_on: ["blemishes_imperfections", "skin_appearance"],
        habits: [
          "Introduce one active at a time for 2–3 weeks before judging tolerance.",
          "Use lukewarm water; finish with cool rinse if heat triggers flushing.",
        ],
        tools: [
          { item: "LED red-light home mask (optional)", use: "cosmetic calming claims vary by device" },
          { item: "hypoallergenic pillowcase swap", use: "reduce friction if acne-prone" },
        ],
        topical_actives: [
          {
            name: "SPF (mineral or hybrid)",
            role: "prevent PIH darkening",
            caution: "Reapply 2h outdoors; rub in evenly for even protection.",
          },
        ],
        avoid_note:
          "Physical exfoliants on inflamed bumps increase PIH risk — prefer chemical exfoliation sparingly.",
      },
    ],
  },
  guidance_projection: {
    improvements: ["Consistent SPF", "Barrier-focused moisturizer for combo skin"],
    future_image_projection: "not generated in dev",
    personalized_routine: "not wired to LLM in dev",
  },
  tracking_goals: {
    weekly_photo_compare: "available after accounts + storage land",
    product_suggestions: "not wired in dev",
  },
};

function cloneReport<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

/** Older API payloads may omit newer sections; fill playbook from default template. */
function withImprovementPlaybookFallback(
  report: Record<string, unknown>,
  base: Record<string, unknown>,
): Record<string, unknown> {
  if (report.improvement_playbook != null) return report;
  return { ...report, improvement_playbook: base.improvement_playbook };
}

function withRatingStandardsLinksFallback(
  report: Record<string, unknown>,
  base: Record<string, unknown>,
): Record<string, unknown> {
  if (report.rating_standards_links != null) return report;
  return { ...report, rating_standards_links: base.rating_standards_links };
}

function mergeReportDefaults(report: Record<string, unknown>, base: Record<string, unknown>): Record<string, unknown> {
  return withRatingStandardsLinksFallback(withImprovementPlaybookFallback(report, base), base);
}

export function resolveFaceologyReport(results: unknown): Record<string, unknown> {
  const base = cloneReport(DEFAULT_FACEOLOGY_REPORT);
  if (!results || typeof results !== "object") return base;
  const r = results as Record<string, unknown>;
  const fr = r.faceology_report;
  if (fr && typeof fr === "object" && !Array.isArray(fr)) {
    const report = fr as Record<string, unknown>;
    if (report.overall_face_shape_geometry != null) {
      const img = report.source_image;
      if (typeof img === "object" && img !== null) {
        return mergeReportDefaults({ ...report }, base);
      }
      return mergeReportDefaults({ ...report, source_image: base.source_image }, base);
    }
  }
  const legacyImg = r.image;
  if (legacyImg && typeof legacyImg === "object") {
    base.source_image = { ...(legacyImg as object), note: "from legacy API shape" };
  }
  return base;
}
