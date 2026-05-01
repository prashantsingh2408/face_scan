#!/usr/bin/env python3
"""YouCam API smoke test (V2 Bearer, optional V1 RSA auth).

V2 (simplest): set YOUCAM_API_KEY only — used as Authorization: Bearer <key>.

V1 (legacy): set YOUCAM_API_KEY (client_id) and YOUCAM_RSA_PUBLIC_B64 (Secret Key,
the Base64 body between BEGIN/END PUBLIC KEY, no PEM headers). Script obtains
access_token then you can call v1 endpoints.

Usage:
  Keys can live in a ``.env`` file next to this script (YOUCAM_API_KEY,
  YOUCAM_RSA_PUBLIC_B64). Or set env vars manually:

  export YOUCAM_API_KEY='sk-...'
  python3 youcam_probe.py

  # Optional: also try V1 auth + credit
  export YOUCAM_RSA_PUBLIC_B64='MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...'
  python3 youcam_probe.py --v1-credit

  # Match API Playground “HD” single concern (do not mix HD + SD in one request):
  python3 youcam_probe.py --playground-hd

  # After uploading in console, you can pass file id instead of URL:
  # YOUCAM_SRC_FILE_ID=... in .env

Docs: https://yce.makeupar.com/document/v1.x/index.html
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import sys
from pathlib import Path
import time
import urllib.error
import urllib.request

V2_BASE = "https://yce-api-01.makeupar.com/s2s/v2.0"
V1_BASE = "https://yce-api-01.makeupar.com/s2s/v1.0"
SAMPLE_FACE = (
    "https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg"
)


def load_dotenv(path: Path) -> None:
    if not path.is_file():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        val = val.strip().strip("'").strip('"')
        if key and key not in os.environ:
            os.environ[key] = val


def request_json(
    base: str,
    method: str,
    path: str,
    bearer: str,
    body: dict | None = None,
) -> tuple[int, dict]:
    url = f"{base}{path}"
    data = None
    headers = {
        "Authorization": f"Bearer {bearer}",
        "Content-Type": "application/json",
    }
    if body is not None:
        data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            raw = resp.read().decode("utf-8")
            return resp.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            parsed = {"_raw": raw}
        return e.code, parsed


def v1_obtain_access_token(client_id: str, raw_pub_b64: str) -> str:
    from cryptography.hazmat.backends import default_backend
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.primitives.asymmetric import padding

    raw_b = raw_pub_b64.strip().encode("ascii")
    pem = (
        b"-----BEGIN PUBLIC KEY-----\n"
        + b"\n".join(raw_b[i : i + 64] for i in range(0, len(raw_b), 64))
        + b"\n-----END PUBLIC KEY-----\n"
    )
    pub = serialization.load_pem_public_key(pem, backend=default_backend())
    ts = int(time.time() * 1000)
    plain = f"client_id={client_id}&timestamp={ts}".encode()
    ct = pub.encrypt(plain, padding.PKCS1v15())
    id_token = base64.b64encode(ct).decode("ascii")
    url = f"{V1_BASE}/client/auth"
    payload = json.dumps({"client_id": client_id, "id_token": id_token}).encode()
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            out = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        raise RuntimeError(e.read().decode(errors="replace")[:800]) from e
    token = (out.get("data") or {}).get("access_token") or out.get("access_token")
    if not token:
        raise RuntimeError(f"V1 auth failed: {json.dumps(out)[:800]}")
    return token


def print_skin_result_summary(payload: dict) -> None:
    """Print per-concern lines from a successful skin-analysis poll (Playground-style)."""
    data = payload.get("data") or {}
    results = data.get("results") or {}
    outputs = results.get("output")
    if not outputs and isinstance(data.get("output"), list):
        outputs = data.get("output")
    if not outputs:
        return
    print("\n--- Parsed scores ---")
    for item in outputs:
        if not isinstance(item, dict):
            continue
        name = item.get("type", "?")
        ui = item.get("ui_score")
        raw = item.get("raw_score")
        masks = item.get("mask_urls") or []
        n_masks = len(masks) if isinstance(masks, list) else 1
        print(f"  {name}: ui_score={ui} raw_score={raw} mask_urls={n_masks}")


def build_skin_analysis_body(playground_hd: bool) -> dict:
    """Build POST /task/skin-analysis JSON (SD or HD only — never mix)."""
    file_id = os.environ.get("YOUCAM_SRC_FILE_ID", "").strip()
    if file_id:
        body: dict = {"src_file_id": file_id}
        label = f"src_file_id={file_id[:24]}..."
    else:
        url = os.environ.get("YOUCAM_SRC_FILE_URL", "").strip() or SAMPLE_FACE
        body = {"src_file_url": url}
        label = f"src_file_url={url[:60]}..."

    if playground_hd:
        body["dst_actions"] = ["hd_acne"]
        body["miniserver_args"] = {"enable_mask_overlay": False}
        body["pf_camera_kit"] = False
    else:
        raw = os.environ.get("YOUCAM_DST_ACTIONS", "").strip()
        if raw:
            body["dst_actions"] = [x.strip() for x in raw.split(",") if x.strip()]
        else:
            body["dst_actions"] = ["wrinkle", "pore", "texture", "acne"]
    body["format"] = "json"
    return body, label


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--v1-credit",
        action="store_true",
        help="After V2 probe, run V1 RSA auth and GET v1.0/client/credit",
    )
    parser.add_argument(
        "--playground-hd",
        action="store_true",
        help="Use HD-only payload like API Playground (e.g. hd_acne only)",
    )
    args = parser.parse_args()

    load_dotenv(Path(__file__).resolve().parent / ".env")

    key = os.environ.get("YOUCAM_API_KEY", "").strip()
    if not key:
        print("Set YOUCAM_API_KEY (dashboard API Key, usually sk-...).", file=sys.stderr)
        return 1

    body, src_label = build_skin_analysis_body(args.playground_hd)
    mode = "playground-style HD" if args.playground_hd else "SD (or YOUCAM_DST_ACTIONS)"
    print(f"--- V2 POST /task/skin-analysis ({mode}) — {src_label} ---")
    status, data = request_json(V2_BASE, "POST", "/task/skin-analysis", key, body)
    print(f"HTTP {status}")
    print(json.dumps(data, indent=2)[:6000])
    if status == 401:
        print(
            "\nNote: 401 InvalidApiKey usually means the API Key string does not match "
            "the console (typo), or the key is not yet active.",
            file=sys.stderr,
        )
        return 2
    if status != 200:
        return 3

    task_id = (data.get("data") or {}).get("task_id")
    if not task_id:
        print("No task_id.", file=sys.stderr)
        return 4

    print(f"\n--- V2 Poll GET /task/skin-analysis/<task_id> ---")
    for i in range(25):
        time.sleep(2)
        st, poll = request_json(V2_BASE, "GET", f"/task/skin-analysis/{task_id}", key)
        inner = poll.get("data") or poll
        state = inner.get("status") or inner.get("task_status")
        print(f"poll {i + 1}: HTTP {st} status={state}")
        if st != 200:
            print(json.dumps(poll, indent=2)[:2000])
            return 5
        if state in ("success", "completed", "failed", "error"):
            print(json.dumps(poll, indent=2)[:8000])
            if state in ("success", "completed"):
                print_skin_result_summary(poll)
            if state not in ("success", "completed"):
                return 6
            break
    else:
        print("Polling timeout.", file=sys.stderr)
        return 7

    if args.v1_credit:
        rsa = os.environ.get("YOUCAM_RSA_PUBLIC_B64", "").strip()
        if not rsa:
            print("Set YOUCAM_RSA_PUBLIC_B64 for --v1-credit.", file=sys.stderr)
            return 8
        print("\n--- V1 POST /client/auth ---")
        try:
            access = v1_obtain_access_token(key, rsa)
        except Exception as e:
            print(e, file=sys.stderr)
            return 9
        print("access_token obtained (prefix):", access[:18] + "...")
        print("\n--- V1 GET /client/credit ---")
        st, c = request_json(V1_BASE, "GET", "/client/credit", access)
        print(f"HTTP {st}")
        print(json.dumps(c, indent=2)[:4000])

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
