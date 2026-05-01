# YouCam API probe

Perfect Corp **YouCam** skin-analysis API probe. **Do not commit `.env`** — API keys stay local (see `.gitignore`).

This folder used to live at `test/face scan/`; it is now **`face_scan/youcam_probe/`**. It still has its own `.git` if you use that remote.

## Setup

From **`face_scan/youcam_probe/`**:

```bash
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
# Create .env with YOUCAM_API_KEY=... (and optional vars); never commit it.
python3 youcam_probe.py
python3 youcam_probe.py --playground-hd
```

## Publishing (optional)

Create an empty **private** repo, add `origin`, then `git push -u origin main`.

### GitLab

```bash
git remote add origin git@gitlab.com:YOUR_GROUP/face-scan.git
git push -u origin main
```
