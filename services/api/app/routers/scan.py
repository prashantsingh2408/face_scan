"""Scan orchestration — dev worker runs in-process after upload (replace with Redis/RQ later)."""

import asyncio
import hashlib
import uuid
from datetime import datetime, timezone
from enum import Enum

from fastapi import APIRouter, BackgroundTasks, File, HTTPException, UploadFile
from pydantic import BaseModel, Field

from app.report_placeholder import build_demo_face_report

router = APIRouter()


class ScanJobStatus(str, Enum):
    queued = "queued"
    running = "running"
    succeeded = "succeeded"
    failed = "failed"


class ScanJob(BaseModel):
    job_id: str
    status: ScanJobStatus
    created_at: str
    message: str | None = None
    finished_at: str | None = None
    results: dict | None = Field(default=None, description="Populated when status is succeeded")


_jobs: dict[str, ScanJob] = {}
_payloads: dict[str, bytes] = {}


def _guess_format(data: bytes) -> str:
    if len(data) >= 3 and data[:3] == b"\xff\xd8\xff":
        return "jpeg"
    if len(data) >= 8 and data[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    return "unknown"


def _set_job(job_id: str, **updates: object) -> None:
    if job_id not in _jobs:
        return
    _jobs[job_id] = _jobs[job_id].model_copy(update=updates)


async def _process_face_job(job_id: str) -> None:
    """Placeholder pipeline: validate bytes, simulate work, attach mock feature bundle."""
    await asyncio.sleep(0.15)
    if job_id not in _jobs:
        return
    _set_job(
        job_id,
        status=ScanJobStatus.running,
        message="Analyzing image…",
    )
    data = _payloads.pop(job_id, None)
    if not data:
        _set_job(
            job_id,
            status=ScanJobStatus.failed,
            message="Internal error: image payload missing.",
            finished_at=datetime.now(timezone.utc).isoformat(),
        )
        return

    await asyncio.sleep(0.55)

    fmt = _guess_format(data)
    digest = hashlib.sha256(data).hexdigest()[:20]
    image_meta = {
        "format": fmt,
        "bytes": len(data),
        "sha256_prefix": digest,
    }
    results = {
        "analysis_version": "dev-0.2-template",
        "faceology_report": build_demo_face_report(image_meta),
    }

    _set_job(
        job_id,
        status=ScanJobStatus.succeeded,
        message="Scan complete (dev placeholder results).",
        finished_at=datetime.now(timezone.utc).isoformat(),
        results=results,
    )


@router.post("/scan/face", response_model=ScanJob)
async def create_face_scan(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
) -> ScanJob:
    """Accept a face image and queue an in-process analysis job."""
    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="empty file")
    if len(raw) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="file too large (max 15MB)")

    job_id = str(uuid.uuid4())
    _payloads[job_id] = raw
    job = ScanJob(
        job_id=job_id,
        status=ScanJobStatus.queued,
        created_at=datetime.now(timezone.utc).isoformat(),
        message="Queued — starting analysis…",
    )
    _jobs[job_id] = job
    background_tasks.add_task(_process_face_job, job_id)
    return job


@router.get("/scan/jobs/{job_id}", response_model=ScanJob)
def get_scan_job(job_id: str) -> ScanJob:
    if job_id not in _jobs:
        raise HTTPException(status_code=404, detail="job not found")
    return _jobs[job_id]
