"""Placeholder worker: poll API or consume Redis jobs, run OpenCV/MediaPipe/torch.

Wire this after choosing a queue (RQ, Celery, ARQ) and storing frames in object storage.
"""

def main() -> None:
    print("faceology-worker: add job consumer + inference pipeline here")


if __name__ == "__main__":
    main()
