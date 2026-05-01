import { useCallback, useEffect, useRef, useState } from "react";
import { resolveFaceologyReport } from "./demoFaceologyReport";
import { IconBrand, IconCamera, IconCheck, IconChevronDown, IconSession } from "./icons";
import { FaceReportChat } from "./FaceReportChat";
import { ReportView } from "./ReportView";
import { useFaceLandmarkAnalysis } from "./useFaceLandmarkAnalysis";

type ScanJob = {
  job_id: string;
  status: string;
  created_at: string;
  message: string | null;
  finished_at?: string | null;
  results?: Record<string, unknown> | null;
};

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Please choose an image file (JPEG, PNG, or WebP).";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `That file is too large (${Math.round(file.size / (1024 * 1024))}MB). Max size is 15MB.`;
  }
  if (file.size < 512) {
    return "That file looks too small to be a valid image.";
  }
  return null;
}

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
  return raw.slice(0, 280) || `Request failed (${res.status}).`;
}

async function postFaceScan(file: File): Promise<ScanJob> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/v1/scan/face", {
    method: "POST",
    body,
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<ScanJob>;
}

async function getScanJob(jobId: string): Promise<ScanJob> {
  const res = await fetch(`/api/v1/scan/jobs/${jobId}`);
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<ScanJob>;
}

function statusClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "queued") return "status-badge status-queued";
  if (s === "running") return "status-badge status-running";
  if (s === "succeeded" || s === "completed") return "status-badge status-succeeded";
  if (s === "failed" || s === "error") return "status-badge status-failed";
  return "status-badge status-queued";
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function isActiveStatus(s: string): boolean {
  const x = s.toLowerCase();
  return x === "queued" || x === "running";
}

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewObjectUrl = useRef<string | null>(null);
  const lastScanFileRef = useRef<File | null>(null);
  const reportPanelRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<ScanJob | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const setPreviewFromFile = useCallback((file: File) => {
    if (previewObjectUrl.current) {
      URL.revokeObjectURL(previewObjectUrl.current);
      previewObjectUrl.current = null;
    }
    const url = URL.createObjectURL(file);
    previewObjectUrl.current = url;
    setPreviewUrl(url);
    setFileName(file.name);
  }, []);

  const clearAll = useCallback(() => {
    if (previewObjectUrl.current) {
      URL.revokeObjectURL(previewObjectUrl.current);
      previewObjectUrl.current = null;
    }
    lastScanFileRef.current = null;
    setPreviewUrl(null);
    setFileName(null);
    setJob(null);
    setErr(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const runScan = useCallback(async (file: File) => {
    const bad = validateImageFile(file);
    if (bad) {
      setErr(bad);
      return;
    }
    lastScanFileRef.current = file;
    setErr(null);
    setJob(null);
    setLoading(true);
    try {
      setJob(await postFaceScan(file));
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const retryLastScan = useCallback(async () => {
    const f = lastScanFileRef.current;
    if (!f) return;
    await runScan(f);
  }, [runScan]);

  useEffect(() => {
    if (!job?.job_id || !isActiveStatus(job.status)) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const j = await getScanJob(job.job_id);
        if (!cancelled) setJob(j);
      } catch {
        if (!cancelled) setErr("Lost connection while checking scan status.");
      }
    };
    const id = window.setInterval(tick, 500);
    void tick();
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [job?.job_id, job?.status]);

  const succeeded = job?.status?.toLowerCase() === "succeeded";
  const failed = Boolean(
    job && !succeeded && ["failed", "error"].includes(job.status?.toLowerCase() ?? ""),
  );

  useEffect(() => {
    if (!succeeded || !reportPanelRef.current) return;
    const t = window.setTimeout(() => {
      reportPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(t);
  }, [succeeded, job?.job_id]);

  const onFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const bad = validateImageFile(f);
      if (bad) {
        setErr(bad);
        e.target.value = "";
        return;
      }
      setErr(null);
      setPreviewFromFile(f);
      await runScan(f);
    },
    [runScan, setPreviewFromFile],
  );

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      const f = e.dataTransfer.files?.[0];
      if (!f) return;
      if (!f.type.startsWith("image/")) {
        setErr("Drop an image file (JPEG, PNG, or WebP).");
        return;
      }
      const bad = validateImageFile(f);
      if (bad) {
        setErr(bad);
        return;
      }
      setErr(null);
      setPreviewFromFile(f);
      if (inputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(f);
        inputRef.current.files = dt.files;
      }
      await runScan(f);
    },
    [runScan, setPreviewFromFile],
  );

  const onBrowse = useCallback(() => inputRef.current?.click(), []);

  const faceAnalysis = useFaceLandmarkAnalysis(previewUrl, succeeded && Boolean(previewUrl));
  const analysisVersion =
    succeeded && job?.results && typeof job.results.analysis_version === "string"
      ? job.results.analysis_version
      : null;

  const resolvedReport = succeeded ? resolveFaceologyReport(job?.results ?? null) : null;

  return (
    <div className="app-bg">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden>
            <IconBrand size={20} />
          </div>
          <div>
            <div className="brand-text">Face scan</div>
            <div className="brand-sub">Face scan · dev build</div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {job
            ? succeeded
              ? "Scan complete. Your analysis is ready below."
              : isActiveStatus(job.status)
                ? `Scan status: ${job.status}.`
                : failed
                  ? `Scan ${job.status}. ${job.message ?? ""}`
                  : `Scan status: ${job.status}.`
            : ""}
        </div>

        <header className="page-intro">
          <h1 className="headline">Scan your face</h1>
          <p className="lead">
            Use a clear, front-facing photo in good light. After you upload, we analyze it automatically — then
            open each section below. Photo previews use on-device face detection when available.
          </p>
        </header>

        <section className="card card--hero" aria-label="Upload and results">
          <div className="upload-layout">
            <div className="upload-col">
              <div
                className={`dropzone${drag ? " drag" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                onClick={onBrowse}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onBrowse();
                  }
                }}
              >
                <div className="dropzone-icon" style={{ color: "var(--accent)" }}>
                  <IconCamera size={40} />
                </div>
                <p className="dropzone-title">Drop photo here</p>
                <p className="dropzone-hint">or tap to browse · JPEG, PNG, or WebP · up to 15MB</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/*"
                  hidden
                  onChange={onFile}
                />
              </div>

              <div className="btn-row">
                <button type="button" className="btn btn-primary" onClick={onBrowse} disabled={loading}>
                  {loading ? (
                    <span className="btn-inner">
                      <span className="spinner" aria-hidden />
                      Starting…
                    </span>
                  ) : (
                    "Choose photo"
                  )}
                </button>
                {(previewUrl || job) && (
                  <button type="button" className="btn btn-ghost" onClick={clearAll} disabled={loading}>
                    Clear
                  </button>
                )}
              </div>
            </div>

            {previewUrl && (
              <aside className="preview-aside" aria-label="Preview">
                <div className="preview-wrap">
                  <img src={previewUrl} alt={fileName ? `Preview: ${fileName}` : "Preview"} />
                </div>
                {fileName && <p className="preview-caption">{fileName}</p>}
              </aside>
            )}
          </div>

          {err && (
            <div className="alert alert-error" role="alert">
              <p className="alert-error-text">{err}</p>
              {lastScanFileRef.current && !job && (
                <button type="button" className="btn btn-primary btn-retry" onClick={retryLastScan} disabled={loading}>
                  {loading ? (
                    <span className="btn-inner">
                      <span className="spinner" aria-hidden />
                      Retrying…
                    </span>
                  ) : (
                    "Try upload again"
                  )}
                </button>
              )}
            </div>
          )}

          {job && (
            <div className="result-stack">
              <div className="status-banner">
                <div className="status-banner-main">
                  <span className={statusClass(job.status)}>{job.status}</span>
                  {isActiveStatus(job.status) && (
                    <span className="status-progress-line">Analyzing your photo…</span>
                  )}
                  {succeeded && (
                    <span className="status-success-line">
                      <span className="status-check" aria-hidden>
                        <IconCheck size={20} />
                      </span>
                      Analysis ready — your report is below.
                    </span>
                  )}
                </div>
                {job.message && !succeeded && !failed && <p className="status-msg">{job.message}</p>}
                {failed && (
                  <div className="alert alert-error alert-error--block" role="alert">
                    <p className="alert-title">This scan did not complete</p>
                    <p className="status-msg">{job.message || "Something went wrong during analysis."}</p>
                    {lastScanFileRef.current && (
                      <button type="button" className="btn btn-primary btn-retry" onClick={retryLastScan} disabled={loading}>
                        {loading ? (
                          <span className="btn-inner">
                            <span className="spinner" aria-hidden />
                            Retrying…
                          </span>
                        ) : (
                          "Try again with the same photo"
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <details className="meta-fold">
                <summary className="meta-fold-summary">
                  <span className="meta-fold-summary-inner">
                    <IconSession size={16} className="meta-fold-lead-icon" />
                    Session details
                    <IconChevronDown size={16} className="meta-fold-chevron" aria-hidden />
                  </span>
                </summary>
                <dl className="meta-dl">
                  <div>
                    <dt>Job ID</dt>
                    <dd className="mono">{job.job_id}</dd>
                  </div>
                  <div>
                    <dt>Started</dt>
                    <dd>{formatWhen(job.created_at)}</dd>
                  </div>
                  {job.finished_at && (
                    <div>
                      <dt>Finished</dt>
                      <dd>{formatWhen(job.finished_at)}</dd>
                    </div>
                  )}
                </dl>
              </details>

              {succeeded && job.message && <p className="result-msg result-msg--subtle">{job.message}</p>}

              {succeeded && (
                <div className="report-panel" ref={reportPanelRef}>
                  <div className="report-panel-head">
                    <h2 className="report-panel-title">Your analysis</h2>
                    {analysisVersion && <span className="report-version">{analysisVersion}</span>}
                  </div>
                  {!previewUrl && (
                    <div className="alert alert-warn" role="status">
                      Photo preview is unavailable (session was cleared or refreshed). Section text still
                      shows; re-upload the same image if you want photo crops in each section again.
                    </div>
                  )}
                  {resolvedReport ? (
                    <>
                      <FaceReportChat report={resolvedReport} />
                      <ReportView
                        report={resolvedReport}
                        scanImageUrl={previewUrl}
                        faceAnalysis={faceAnalysis}
                      />
                    </>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </section>

        <p className="footnote">
          Informational preview only — not medical advice. Results depend on lighting, angle, and image
          quality.
        </p>
      </main>
    </div>
  );
}
