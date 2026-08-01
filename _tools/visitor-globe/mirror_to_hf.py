#!/usr/bin/env python3
"""Copy the committed visitor snapshot to a Hugging Face dataset.

Strictly a second location. git is already the durable store — this exists so
the map does not live on one provider's servers, which is the mistake that lost
it twice before (see seed_history.py). Nothing reads from here; if the upload
fails, the snapshot in the repo is unaffected and the site does not notice.

    HF_TOKEN=hf_... python3 _tools/visitor-globe/mirror_to_hf.py
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, "..", ".."))
SNAPSHOT = os.path.join(ROOT, "assets", "visitor-globe", "visitors.json")

DATASET = os.environ.get("VISITOR_DATASET", "jankin123/visitor-globe-data")
TOKEN = os.environ.get("HF_TOKEN") or os.environ.get("HF_WRITE_TOKEN")


def main():
    if not TOKEN:
        print("no HF_TOKEN; skipping the off-site mirror")
        return 0
    if not os.path.exists(SNAPSHOT):
        print(f"nothing to mirror: {SNAPSHOT} does not exist")
        return 0

    from huggingface_hub import HfApi

    with open(SNAPSHOT, encoding="utf-8") as f:
        snapshot = json.load(f)
    regions, total = snapshot.get("regions", 0), snapshot.get("total", 0)

    api = HfApi(token=TOKEN)
    api.create_repo(DATASET, repo_type="dataset", private=True, exist_ok=True)
    api.upload_file(
        path_or_fileobj=SNAPSHOT,
        path_in_repo="visitors.json",
        repo_id=DATASET,
        repo_type="dataset",
        commit_message=f"{regions} regions / {total} visits",
    )
    print(f"mirrored {regions} regions / {total} visits to {DATASET}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
