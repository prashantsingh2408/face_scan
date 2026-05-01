import { useCallback, useEffect, useRef, useState } from "react";

type Turn = { role: "user" | "assistant"; content: string };

async function readErrorMessage(res: Response): Promise<string> {
  const raw = await res.text();
  try {
    const j = JSON.parse(raw) as { detail?: unknown };
    if (typeof j.detail === "string") return j.detail;
    if (Array.isArray(j.detail) && j.detail[0] && typeof (j.detail[0] as { msg?: string }).msg === "string") {
      return (j.detail[0] as { msg: string }).msg;
    }
  } catch {
    /* not JSON */
  }
  return raw.slice(0, 400) || `Request failed (${res.status}).`;
}

export function FaceReportChat({ report }: { report: Record<string, unknown> }) {
  const [messages, setMessages] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    const nextHistory: Turn[] = [...messages, { role: "user", content: text }];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/v1/chat/face-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextHistory,
          faceology_report: report,
        }),
      });
      if (!res.ok) {
        throw new Error(await readErrorMessage(res));
      }
      const data = (await res.json()) as { reply?: string };
      const reply = typeof data.reply === "string" ? data.reply.trim() : "";
      if (!reply) throw new Error("Empty reply from chat API.");
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chat failed.");
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, report]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <section className="face-chat" aria-label="Chat about your scan">
      <div className="face-chat-head">
        <h3 className="face-chat-title">Chat about this scan</h3>
        <p className="face-chat-lead">
          Ask questions in plain language. Answers use your report data only (Groq) — educational, not medical
          advice.
        </p>
      </div>

      <div className="face-chat-log" role="log" aria-live="polite">
        {messages.length === 0 && (
          <p className="face-chat-empty">
            Try: “What does my scan suggest for dryness?” or “Explain the improvement playbook in simple terms.”
          </p>
        )}
        {messages.map((m, i) => (
          <div key={`${m.role}-${i}`} className={`face-chat-bubble face-chat-bubble--${m.role}`}>
            <span className="face-chat-role">{m.role === "user" ? "You" : "Assistant"}</span>
            <div className="face-chat-text">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="face-chat-bubble face-chat-bubble--assistant face-chat-bubble--typing">
            <span className="spinner spinner--inline" aria-hidden />
            Thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="face-chat-error" role="alert">
          {error}
        </p>
      )}

      <div className="face-chat-compose">
        <textarea
          className="face-chat-input"
          rows={2}
          placeholder="Ask about your results…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={loading}
          maxLength={3500}
          aria-label="Message"
        />
        <button type="button" className="btn btn-primary face-chat-send" onClick={() => void send()} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </section>
  );
}
