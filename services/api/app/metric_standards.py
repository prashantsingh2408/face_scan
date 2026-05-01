"""Reference rubrics cited in scan reports (educational context only).

Values embedded in demo reports are placeholders until CV/ML measures pixels.
Sources reflect commonly cited dermatology / aesthetics literature — not live web scraping.
"""

from __future__ import annotations

# --- Periorbital hyperpigmentation (POH / “dark circles”) -----------------------------------------
# Clinical ordinal grades appear across multiple papers as 0–4 or similar; anchors summarized for UX.
POH_CLINICAL_GRADE_ANCHORS: dict[int, str] = {
    0: "No visible POH vs adjacent cheek skin under standardized viewing.",
    1: "Mild: slight duskiness limited to thin skin over infraorbital rim.",
    2: "Moderate: clearly darker band; mostly confined to orbital hollow.",
    3: "Marked: broad or intense shadow; may extend toward cheek junction.",
    4: "Severe: very pronounced discoloration / multifactorial shadowing across lid-cheek.",
}

POH_LITERATURE: list[str] = [
    "Fatin AM et al. Classification of periorbital hyperpigmentation (mixed vascular & pigment patterns). "
    "Skin Research and Technology 2020;26(4):564-570. https://doi.org/10.1111/srt.12831",
    "Freitag FM, Cestari TF. What causes dark circles under the eyes? J Cosmet Dermatol 2007;6(3):211-215.",
]

# Photonumeric infraorbital volume / shadow scales (e.g. Allergan AIRS) — research/clinic tools; not computed here.
INFRAORBITAL_SCALE_NOTE: str = (
    "Photonumeric grading scales for the infraorbital region are published for clinical trials "
    "(e.g. validated photonumeric scales in dermatologic surgery literature). "
    "This app does not perform photographic densitometry — numeric fields below are demo placeholders aligned "
    "to ordinal rubrics, not AIRS scores."
)

# --- Fitzpatrick skin phototype (sun-reactivity phenotype; not race) -------------------------------
FITZPATRICK_ANCHORS: dict[str, str] = {
    "I": "Always burns, never tans (pale white skin).",
    "II": "Usually burns, tans minimally.",
    "III": "Burns moderately, tans gradually.",
    "IV": "Burns minimally, tans readily.",
    "V": "Rarely burns, tans very easily.",
    "VI": "Never burns, deeply pigmented.",
}

FITZPATRICK_REF: str = (
    "Fitzpatrick L. The validity and practicality of sun-reactive skin types I through VI. "
    "Arch Dermatol 1988;124(6):869-871. (Widely reproduced phototype scale I–VI.)"
)

# --- Acne — Investigator’s Global Assessment (IGA) ------------------------------------------------
IGA_ACNE_ANCHORS: dict[int, str] = {
    0: "Clear",
    1: "Almost clear",
    2: "Mild",
    3: "Moderate",
    4: "Severe",
    5: "Very severe",
}

IGA_REF: str = (
    "IGA (Investigator Global Assessment) 0–5 acne severity — standard endpoint in acne trials "
    "(FDA / consensus acne vulgaris outcomes)."
)

# --- Photoaging — Glogau scale (brief) -------------------------------------------------------------
GLOGAU_STAGES: dict[str, str] = {
    "I": "No wrinkles (early photoaging); minimal pigment.",
    "II": "Wrinkles in motion (early-moderate).",
    "III": "Wrinkles at rest (advanced).",
    "IV": "Only wrinkles / yellow-gray coloration (severe).",
}

GLOGAU_REF: str = "Glogau RG. Aesthetic and anatomic analysis of the aging skin. Semin Cutan Med Surg 1996;15(3):134-138."

# --- Stable URLs for users (DOI / NCBI / journals) -------------------------------------------------
RATING_STANDARD_LINKS: list[dict[str, str]] = [
    {
        "label": "Periorbital hyperpigmentation classification — Fatin et al., Skin Res Technol (2020)",
        "url": "https://doi.org/10.1111/srt.12831",
    },
    {
        "label": "What causes dark circles under the eyes? — Freitag & Cestari, J Cosmet Dermatol (2007)",
        "url": "https://doi.org/10.1111/j.1473-2165.2007.00324.x",
    },
    {
        "label": "Fitzpatrick sun-reactive skin types I–VI — Arch Dermatol (1988)",
        "url": "https://doi.org/10.1001/archderm.1988.01670300158022",
    },
    {
        "label": "Investigator Global Assessment (IGA) for acne — NCBI Bookshelf overview",
        "url": "https://www.ncbi.nlm.nih.gov/books/NBK519508/",
    },
    {
        "label": "Glogau photoaging scale — Semin Cutan Med Surg (1996)",
        "url": "https://doi.org/10.1016/S1085-5629(96)80034-2",
    },
]
