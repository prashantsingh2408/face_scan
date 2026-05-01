"""Structured demo report aligned with Faceology Face Scan template.

Scores are placeholders for UI/dev until real CV/ML pipelines populate fields.
Ordinal rubrics (POH grade, IGA, Fitzpatrick, Glogau) cite common dermatology references for transparency.
"""

from __future__ import annotations

from app.metric_standards import (
    FITZPATRICK_ANCHORS,
    FITZPATRICK_REF,
    GLOGAU_REF,
    GLOGAU_STAGES,
    IGA_ACNE_ANCHORS,
    IGA_REF,
    INFRAORBITAL_SCALE_NOTE,
    POH_CLINICAL_GRADE_ANCHORS,
    POH_LITERATURE,
    RATING_STANDARD_LINKS,
)


def build_demo_face_report(image: dict) -> dict:
    """Return nested dict matching product template sections."""
    _ph_grade = 1
    return {
        "disclaimer": (
            "Demo report: sections follow the Face scan product template. "
            "Numeric fields mirror published ordinal scales (POH grade, IGA acne, Fitzpatrick phototype, Glogau photoaging) "
            "for clarity — values are still illustrative until models densitometry-measure your photo."
        ),
        "rating_standards_links": [dict(x) for x in RATING_STANDARD_LINKS],
        "source_image": image,
        "overall_face_shape_geometry": {
            "face_shape": {
                "classification": "Oval",
                "confidence": "low",
                "alternates_considered": ["Round", "Heart"],
            },
            "symmetry": {
                "left_right_balance": "moderate",
                "jaw_alignment_note": "Slight asymmetry at mandible angle (common).",
            },
            "bone_structure": {
                "cheekbone_prominence": "moderate",
                "jawline_definition": "defined",
                "forehead_height_width": "balanced",
            },
            "proportions_golden_ratio": {
                "eye_width_ratio": "within typical range (illustrative)",
                "inter_feature_distances": "not measured in dev build",
            },
        },
        "skin_type": {
            "primary": "Combination",
            "t_zone_vs_u_zone": "Oilier T-zone; cheeks closer to normal.",
            "oiliness_shine": {"level": "mild", "distribution": "T-zone"},
            "dehydration_vs_dryness": {
                "assessment": "Possible mild dehydration with surface oil (typical combo pattern).",
                "note": "Refine with questionnaire + TEWL proxy when sensors/models exist.",
            },
            "fitzpatrick_phototype": {
                "roman_numeral_estimate": "IV",
                "sunburn_and_tan_behavior": FITZPATRICK_ANCHORS["IV"],
                "reference": FITZPATRICK_REF,
                "read_standard": "https://doi.org/10.1001/archderm.1988.01670300158022",
                "reliability_note": "Phototype cannot be validated from one selfie — clinician / questionnaire preferred.",
            },
        },
        "blemishes_imperfections": {
            "acne": {
                "types_suspected": ["papules", "comedones"],
                "severity_word": "mild",
                "investigators_global_assessment_0_to_5": 2,
                "iga_label": IGA_ACNE_ANCHORS[2],
                "iga_reference": IGA_REF,
                "read_standard": "https://www.ncbi.nlm.nih.gov/books/NBK519508/",
            },
            "pigmentation": ["post-inflammatory marks (possible)", "freckles (sun-exposed)"],
            "redness_inflammation": "mild diffuse redness on cheeks",
            "texture": {"roughness": "low", "pores": "moderate on nose", "scarring": "none obvious"},
        },
        "dark_circles_under_eye": {
            "severity": "mild",
            "severity_numeric": {
                "periorbital_hyperpigmentation_grade_0_to_4": _ph_grade,
                "grade_anchor_text": POH_CLINICAL_GRADE_ANCHORS[_ph_grade],
                "shadow_darkening_index_0_to_10": 3.5,
                "shadow_index_note": (
                    "0 = none · 10 = severe appearance on this demo rubric (not densitometry or AIRS photonumeric units)."
                ),
            },
            "color_contribution": {"brown_pigment": 0.35, "blue_vascular": 0.45, "mixed": 0.2},
            "color_contribution_percent": {
                "brown_melanin": 35,
                "blue_vascular": 45,
                "mixed_overlap": 20,
                "sums_to_100_percent": True,
                "note": (
                    "Partition explains pigment vs vascular emphasis for discussion; "
                    "clinical dermoscopy separates patterns — demo only."
                ),
            },
            "associated": ["fine under-eye lines"],
            "literature_notes": [
                "POH clinical grades (0–4 style anchors) summarize intensity/extension for teaching; trials may use photonumeric scales.",
                *POH_LITERATURE,
                INFRAORBITAL_SCALE_NOTE,
            ],
            "read_primary_study": "https://doi.org/10.1111/srt.12831",
        },
        "fat_density_volume": {
            "subcutaneous_distribution": "mid-face volume within typical range (visual estimate)",
            "overall_facial_fat": "balanced",
            "caveat": "True fat-pad metrics are not inferred from a single 2D photo in dev.",
        },
        "collagen_elasticity_signals": {
            "firmness_proxy": "moderate (placeholder)",
            "sagging_visual": "low",
            "note": "Not a clinical pinch test; appearance-only proxy when models ship.",
            "photoaging_glogau": {
                "stage_I_to_IV": "II",
                "stage_description": GLOGAU_STAGES["II"],
                "reference": GLOGAU_REF,
                "read_standard": "https://doi.org/10.1016/S1085-5629(96)80034-2",
                "caution": "Stage from a single neutral photo is indicative only.",
            },
        },
        "skin_appearance": {
            "glow_radiance": "matte with mild highlight on T-zone",
            "tone_uniformity": "mostly even with mild cheek redness",
        },
        "lines_wrinkles": {
            "forehead_horizontal": "few fine lines",
            "under_eyes": "fine lines present",
            "crow_feet": "mild",
            "nasolabial": "soft groove, shallow",
            "glabellar": "not prominent at rest",
            "marionette": "minimal",
            "perioral": "not assessed (needs expression set)",
        },
        "eyebrows": {
            "shape_uniformity": "arched, mild asymmetry",
            "density": "moderate",
            "edges": "generally defined",
            "position": "within typical orbital relation (visual)",
        },
        "lips": {
            "volume_shape": "balanced upper/lower (visual)",
            "condition": "mild dryness possible",
            "vertical_lines": "minimal",
        },
        "teeth_smile": {
            "visibility_alignment": "not assessed (requires open-mouth / dental capture)",
            "whitening_level": "not assessed",
            "gum_health": "not assessed",
            "smile_dynamics": "not assessed",
        },
        "cheeks_jaw_lines": {
            "cheek_fullness": "moderate / apple cheek present",
            "jawline_definition": "moderate",
            "jowls_double_chin": "not prominent in this pose",
            "contour_transition": "smooth mid-to-lower face",
        },
        "expressions": {
            "dynamic_analysis": "not run (upload a short multi-angle video in a future build)",
            "resting_vs_smile": "not captured in single frame",
            "muscle_activity": "not measured",
        },
        "scan_process": {
            "video_multi_angle": "pending — current dev flow uses one still image",
            "report_depth": "template + literature-cited ordinal scales (demo assignments until CV measures)",
            "three_d_model": "pending — mesh export after reconstruction pipeline",
        },
        "improvement_playbook": {
            "disclaimer": (
                "Educational suggestions only — not medical diagnosis or prescriptions. "
                "Patch-test new products; stop if irritation occurs; consult a dermatologist for acne, "
                "pigment disorders, or before retinoids if pregnant."
            ),
            "summary": (
                "Demo priorities based on this scan’s themes: combination skin, mild under-eye shadow, "
                "cheek redness, and T-zone pores — adjust with your clinician or aesthetician."
            ),
            "focus_areas": [
                {
                    "title": "Under-eye shadow & fine lines",
                    "priority": "medium",
                    "based_on": ["dark_circles_under_eye", "lines_wrinkles"],
                    "habits": [
                        "Use broad-spectrum SPF daily; UV drives pigment and collagen loss.",
                        "Pat moisturizers — avoid dragging thin under-eye skin.",
                        "Prioritize sleep and hydration; salt/alcohol can worsen puffiness for some people.",
                    ],
                    "tools": [
                        {"item": "UV sunglasses", "use": "reduce squinting + periorbital UV"},
                        {"item": "cool compress / eye mask", "use": "short-term de-puff (cosmetic)"},
                        {"item": "humidifier (dry climates)", "use": "reduce surface dehydration overnight"},
                    ],
                    "topical_actives": [
                        {
                            "name": "Vitamin C (stable derivatives or L-ascorbic)",
                            "role": "brightness / antioxidant over weeks",
                            "caution": "Can sting; AM under SPF; introduce slowly.",
                        },
                        {
                            "name": "Niacinamide",
                            "role": "barrier support + tone smoothing",
                            "caution": "Generally mild; rare irritation at high %.",
                        },
                        {
                            "name": "Retinoid (night, non-prescription or Rx)",
                            "role": "fine-line smoothing over months",
                            "caution": "Start 1–2×/week; avoid if pregnant without clinician OK.",
                        },
                    ],
                    "avoid_note": "Heavy fragrance or essential oils stacked near eyes often irritate.",
                },
                {
                    "title": "Combination skin balance (T-zone oil, cheek dryness signals)",
                    "priority": "higher",
                    "based_on": ["skin_type", "skin_appearance"],
                    "habits": [
                        "Cleanse gently once at night; skip harsh scrubbing on oily zones.",
                        "Layer lighter gel on T-zone, richer cream on cheeks if needed (multi-moisturizer strategy).",
                        "Reapply SPF when outdoors — blot oil first instead of stripping with alcohol wipes.",
                    ],
                    "tools": [
                        {"item": "oil-blotting papers", "use": "reduce shine without stripping barrier"},
                        {"item": "soft microfiber face towel", "use": "pat dry — avoid rough terry on cheeks"},
                    ],
                    "topical_actives": [
                        {
                            "name": "Salicylic acid (BHA) — short-contact or low %",
                            "role": "pores / T-zone clarity",
                            "caution": "Can dry cheeks — spot-use or buffer with moisturizer.",
                        },
                        {
                            "name": "Ceramides / glycerin / panthenol moisturizers",
                            "role": "barrier repair on cheeks",
                            "caution": "Choose non-comedogenic if you clog easily.",
                        },
                        {
                            "name": "Azelaic acid",
                            "role": "redness + uneven tone support",
                            "caution": "Tingling possible; introduce gradually.",
                        },
                    ],
                    "avoid_note": "High-alcohol astringents all-over often worsen combo-pattern dehydration.",
                },
                {
                    "title": "Cheek redness & mild blemish marks",
                    "priority": "medium",
                    "based_on": ["blemishes_imperfections", "skin_appearance"],
                    "habits": [
                        "Introduce one active at a time for 2–3 weeks before judging tolerance.",
                        "Use lukewarm water; finish with cool rinse if heat triggers flushing.",
                    ],
                    "tools": [
                        {"item": "LED red-light home mask (optional)", "use": "cosmetic calming claims vary by device"},
                        {"item": "hypoallergenic pillowcase swap", "use": "reduce friction if acne-prone"},
                    ],
                    "topical_actives": [
                        {
                            "name": "SPF (mineral or hybrid)",
                            "role": "prevent PIH darkening",
                            "caution": "Reapply 2h outdoors; rub in evenly for even protection.",
                        },
                    ],
                    "avoid_note": "Physical exfoliants on inflamed bumps increase PIH risk — prefer chemical exfoliation sparingly.",
                },
            ],
        },
        "guidance_projection": {
            "improvements": ["Consistent SPF", "Barrier-focused moisturizer for combo skin"],
            "future_image_projection": "not generated in dev",
            "personalized_routine": "not wired to LLM in dev",
        },
        "tracking_goals": {
            "weekly_photo_compare": "available after accounts + storage land",
            "product_suggestions": "not wired in dev",
        },
    }
