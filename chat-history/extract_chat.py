#!/usr/bin/env python3
"""Extract human-readable chat from Claude Code session JSONL."""
import json
import sys
from pathlib import Path


def text_from_content(content):
    """Concatenate text parts; ignore tool_use / tool_result blocks."""
    if isinstance(content, str):
        return content.strip()
    if not isinstance(content, list):
        return ""
    parts = []
    for item in content:
        if not isinstance(item, dict):
            continue
        t = item.get("type")
        if t == "text":
            parts.append(item.get("text", "").strip())
        elif t == "thinking":
            continue
        elif t == "tool_use":
            name = item.get("name", "tool")
            parts.append(f"_[tool: {name}]_")
        elif t == "tool_result":
            continue
    return "\n".join(p for p in parts if p)


def is_system_reminder(text):
    return "<system-reminder>" in text or "<task-notification>" in text


def extract(jsonl_path, out_path):
    with open(jsonl_path) as f:
        records = [json.loads(line) for line in f if line.strip()]

    chunks = []
    for r in records:
        if r.get("type") not in {"user", "assistant"}:
            continue
        msg = r.get("message")
        if not isinstance(msg, dict):
            continue
        role = msg.get("role")
        content = msg.get("content")
        text = text_from_content(content)
        if not text:
            continue
        if role == "user" and is_system_reminder(text):
            continue
        ts = r.get("timestamp", "")[:19]
        chunks.append((role, ts, text))

    with open(out_path, "w") as f:
        f.write("# Chat Transcript\n\n")
        f.write(f"_Session: {jsonl_path.name}_\n\n")
        f.write(f"_Total turns: {len(chunks)}_\n\n---\n\n")
        for role, ts, text in chunks:
            label = "User" if role == "user" else "Claude"
            f.write(f"## {label} · {ts}\n\n{text}\n\n---\n\n")

    print(f"Wrote {out_path} ({len(chunks)} turns)")


if __name__ == "__main__":
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent / "session-2026-05-13.jsonl"
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else src.with_suffix(".md")
    extract(src, dst)
