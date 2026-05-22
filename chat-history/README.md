# Chat history

Records of brainstorming sessions.

| File | Description |
|---|---|
| `session-2026-05-13.jsonl` | Raw Claude Code session export (full tool calls + reasoning). ~6.0 MB. |
| `session-2026-05-13.md` | Cleaned markdown transcript (user + assistant text only; tool calls collapsed to `[tool: NAME]`). ~370 KB, 584 turns. |
| `extract_chat.py` | Script to convert JSONL → markdown. Usage: `python3 extract_chat.py <jsonl> [out.md]` |

## Re-extracting

```bash
cd chat-history
python3 extract_chat.py session-2026-05-13.jsonl
```

## Notes

- The JSONL is the canonical source. Re-run the script to regenerate the markdown after any edits to the extractor.
- System reminders and pure tool-result content are filtered out of the markdown for readability.
