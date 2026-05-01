/**
 * Renders structured “what to improve + how” guidance (tools, habits, topical actives).
 * Copy is educational only — not medical or prescription advice.
 */

type FocusArea = {
  title: string;
  priority?: string;
  based_on?: string[];
  habits?: string[];
  tools?: { item: string; use: string }[];
  topical_actives?: { name: string; role: string; caution?: string }[];
  avoid_note?: string;
};

export type ImprovementPlaybookData = {
  disclaimer?: string;
  summary?: string;
  focus_areas?: FocusArea[];
};

export function isImprovementPlaybook(block: unknown): block is ImprovementPlaybookData {
  if (!block || typeof block !== "object" || Array.isArray(block)) return false;
  const fa = (block as ImprovementPlaybookData).focus_areas;
  return Array.isArray(fa) && fa.length > 0;
}

function priorityClass(p: string | undefined): string {
  const x = (p ?? "").toLowerCase();
  if (x.includes("high") || x.includes("top")) return "playbook-priority playbook-priority--high";
  if (x.includes("low") || x.includes("optional")) return "playbook-priority playbook-priority--low";
  return "playbook-priority playbook-priority--mid";
}

export function ImprovementPlaybookView({ data }: { data: ImprovementPlaybookData }) {
  const areas = data.focus_areas ?? [];

  return (
    <div className="playbook-root">
      {data.summary ? <p className="playbook-summary">{data.summary}</p> : null}
      {data.disclaimer ? (
        <p className="playbook-disclaimer" role="note">
          {data.disclaimer}
        </p>
      ) : null}

      <div className="playbook-cards">
        {areas.map((area, idx) => (
          <article key={`${area.title}-${idx}`} className="playbook-card">
            <header className="playbook-card-head">
              <h3 className="playbook-card-title">{area.title}</h3>
              {area.priority ? (
                <span className={priorityClass(area.priority)}>{area.priority}</span>
              ) : null}
            </header>

            {area.based_on && area.based_on.length > 0 ? (
              <p className="playbook-based-on">
                <span className="playbook-based-label">Linked to scan themes:</span>{" "}
                {area.based_on.join(" · ")}
              </p>
            ) : null}

            {area.habits && area.habits.length > 0 ? (
              <div className="playbook-block">
                <h4 className="playbook-subtitle">Daily habits & technique</h4>
                <ul className="playbook-bullet-list">
                  {area.habits.map((h, hi) => (
                    <li key={hi}>{h}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {area.tools && area.tools.length > 0 ? (
              <div className="playbook-block">
                <h4 className="playbook-subtitle">Tools & physical helpers</h4>
                <ul className="playbook-tool-list">
                  {area.tools.map((t, ti) => (
                    <li key={`${t.item}-${ti}`}>
                      <span className="playbook-tool-name">{t.item}</span>
                      <span className="playbook-tool-use">{t.use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {area.topical_actives && area.topical_actives.length > 0 ? (
              <div className="playbook-block">
                <h4 className="playbook-subtitle">Topical types / ingredients to discuss with a retailer or clinician</h4>
                <p className="playbook-ingredient-lead">
                  Examples of ingredient families — not product endorsements. Introduce one new active at a time.
                </p>
                <ul className="playbook-ingredient-list">
                  {area.topical_actives.map((a) => (
                    <li key={a.name}>
                      <div className="playbook-ingredient-head">
                        <span className="playbook-ingredient-name">{a.name}</span>
                        <span className="playbook-ingredient-role">{a.role}</span>
                      </div>
                      {a.caution ? <p className="playbook-ingredient-caution">{a.caution}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {area.avoid_note ? (
              <p className="playbook-avoid">
                <strong>Avoid / patch-test:</strong> {area.avoid_note}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
