import { useCallback, useState } from "react";

type ProductDirection = {
  category: string;
  product_type: string;
  ingredient_examples: string[];
  why: string;
  patch_test_note: string;
};

type GroqFaceologyResponse = {
  summary: string;
  routine_tips: string[];
  product_directions: ProductDirection[];
  avoid: string[];
  disclaimer: string;
  model: string;
};

export function GroqRecommendationsBlock({ report }: { report: Record<string, unknown> }) {
  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ok"; data: GroqFaceologyResponse }
  >({ status: "idle" });

  const fetchIdeas = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/v1/recommendations/faceology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faceology_report: report }),
      });
      const text = await res.text();
      let body: unknown = null;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = null;
      }
      if (!res.ok) {
        const detail =
          body &&
          typeof body === "object" &&
          body !== null &&
          "detail" in body &&
          typeof (body as { detail: unknown }).detail === "string"
            ? (body as { detail: string }).detail
            : text || res.statusText;
        setState({ status: "error", message: detail });
        return;
      }
      const data = body as GroqFaceologyResponse;
      if (!data || typeof data.summary !== "string") {
        setState({ status: "error", message: "Unexpected response from recommendations API." });
        return;
      }
      setState({ status: "ok", data });
    } catch (e) {
      setState({
        status: "error",
        message: e instanceof Error ? e.message : "Network error.",
      });
    }
  }, [report]);

  return (
    <div className="groq-rec-root">
      <div className="groq-rec-head">
        <h3 className="groq-rec-title">AI ideas (Groq)</h3>
        <p className="groq-rec-lead">
          Optional: generate extra routine tips and <strong>types</strong> of products (no brands).
          Educational only — same limits as the rest of this app.
        </p>
        <button
          type="button"
          className="btn-report-outline groq-rec-btn"
          onClick={fetchIdeas}
          disabled={state.status === "loading"}
        >
          {state.status === "loading" ? (
            <>
              <span className="spinner spinner--inline" aria-hidden />
              Generating…
            </>
          ) : (
            "Generate AI suggestions"
          )}
        </button>
      </div>

      {state.status === "error" ? (
        <p className="groq-rec-error" role="alert">
          {state.message}
          {state.message.includes("GROQ_API_KEY") ? (
            <>
              {" "}
              Set <code>GROQ_API_KEY</code> on the API server (see{" "}
              <code>services/api/.env.example</code>) and restart.
            </>
          ) : null}
        </p>
      ) : null}

      {state.status === "ok" ? (
        <div className="groq-rec-body">
          {state.data.model ? (
            <p className="groq-rec-meta">
              Model: <code>{state.data.model}</code>
            </p>
          ) : null}
          {state.data.summary ? <p className="groq-rec-summary">{state.data.summary}</p> : null}

          {state.data.routine_tips.length > 0 ? (
            <div className="groq-rec-block">
              <h4 className="groq-rec-subtitle">Routine tips</h4>
              <ul className="groq-rec-list">
                {state.data.routine_tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {state.data.product_directions.length > 0 ? (
            <div className="groq-rec-block">
              <h4 className="groq-rec-subtitle">Product directions</h4>
              <ul className="groq-rec-product-list">
                {state.data.product_directions.map((p, i) => (
                  <li key={i} className="groq-rec-product">
                    <div className="groq-rec-product-head">
                      <strong>{p.category || "Category"}</strong>
                      {p.product_type ? <span className="groq-rec-product-type">{p.product_type}</span> : null}
                    </div>
                    {p.why ? <p className="groq-rec-why">{p.why}</p> : null}
                    {p.ingredient_examples.length > 0 ? (
                      <p className="groq-rec-ingreds">
                        Ingredient examples: {p.ingredient_examples.join(", ")}
                      </p>
                    ) : null}
                    {p.patch_test_note ? (
                      <p className="groq-rec-patch">{p.patch_test_note}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {state.data.avoid.length > 0 ? (
            <div className="groq-rec-block">
              <h4 className="groq-rec-subtitle">Often worth easing off</h4>
              <ul className="groq-rec-list">
                {state.data.avoid.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {state.data.disclaimer ? (
            <p className="groq-rec-disclaimer" role="note">
              {state.data.disclaimer}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
