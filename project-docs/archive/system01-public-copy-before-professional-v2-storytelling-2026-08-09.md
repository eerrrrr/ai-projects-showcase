# System 01 public copy — archived before the Professional V2 storytelling replacement

Archived 2026-08-09, immediately before rewriting `projects.json`'s `job-application-filter` entry to
tell the real Professional V2 story (test harness + gated production control path + structured error
handler) instead of the older OpenClaw/Notion-handoff story. This is the exact entry as it existed at
that point, verbatim, for reference/rollback.

```json
{
  "id": "job-application-filter",
  "index": 1,
  "total": 7,
  "tier": 1,
  "tierLabel": "Featured proof",
  "title": "Job Screening Validation Workflow",
  "shortTitle": "Job Screening Validation Workflow",
  "taglineHtml": "Validation gate for OpenClaw-style task records. OpenClaw was the early experiment; n8n is the verified rebuild.",
  "valueHtml": "Checks and normalizes OpenClaw-style task records before they reach Notion, and keeps every outcome — including a failed write — visible.",
  "problemHtml": "Task records from an OpenClaw-style router (or manual entry) arrive in inconsistent shapes — tags as strings instead of arrays, non-ISO dates, oversized text, missing fields — any of which can silently break a Notion write or make it look like it succeeded when it didn't.",
  "workflowHtml": "I built a real n8n workflow that normalizes incoming records, validates required fields and safety rules, maps them into a schema-safe Notion payload, and routes each one to a review state (READY / NEEDS_REVIEW / BLOCKED) before any write is attempted. A Manual Trigger runs six repeatable test records; a Webhook input is built for a real sender but not yet published or authenticated.",
  "resultShortHtml": "A live Notion write was attempted and failed safely — the integration didn't yet have permission on the target database — so no fake success was reported; every record's outcome stays visible.",
  "whatItProvesHtml": "I can build a validation gate that keeps AI/router output honest before it reaches a shared system, and report a failed write honestly instead of hiding it.",
  "productionSignalHtml": "Real n8n execution &middot; 6 records normalized and validated &middot; schema-safe Notion payload built &middot; live write attempt failed safely, not silently",
  "tags": ["n8n", "OpenClaw", "Notion", "Human-in-the-loop"],
  "keyNumber": "6",
  "keyLabel": "task records processed · 3 review states · 1 write attempt, failed safely",
  "goalHtml": "<ul><li>Check AI/router output before it reaches Notion.</li><li>Normalize inconsistent field shapes (tags, dates, text length) before anything is judged.</li><li>Separate records into READY, NEEDS_REVIEW and BLOCKED instead of writing everything the same way.</li><li>Keep a human-readable report of what happened, including failures.</li><li>Never report a successful write that didn't actually happen.</li></ul>",
  "methodHtml": "<ul><li>Start from OpenClaw-style task records — a manual test set, plus a Webhook input built for a real sender.</li><li>Normalize field shapes first: tags, dates, long text, unknown fields.</li><li>Validate required fields and safety rules before mapping anything toward Notion.</li><li>Map into the exact Notion payload shape, then assign a review state.</li><li>Attempt the write only for approved records; report success and failure honestly.</li></ul>",
  "resultHtml": "<ul><li>Explored the first job-screening logic in OpenClaw.</li><li>Rebuilt it as a verified n8n workflow with normalization, validation and Notion payload mapping.</li><li>Ran the workflow on 6 controlled records: 1 READY, 3 NEEDS_REVIEW, 2 BLOCKED.</li><li>Attempted a live Notion write; it failed safely on a permission error, and that failure stayed visible instead of being hidden.</li><li>Kept every record's outcome — including the failed write — visible in the report.</li></ul>",
  "failureHandledHtml": "<ul><li>OpenClaw is shown as early exploration, not a finished product.</li><li>Malformed fields (string tags, non-ISO dates, oversized text) are normalized instead of breaking the write.</li><li>The one live Notion write attempt failed on a permission error — the workflow reported that failure rather than a fake success.</li><li>Nothing is silently dropped from the report.</li></ul>",
  "decisionHtml": "<ul><li>AI/router output is validated and normalized, but not trusted blindly.</li><li>NEEDS_REVIEW and BLOCKED records are not written without a human decision.</li><li>A failed write is reported as a failure, never disguised as success.</li><li>The report supports judgment; it does not replace it.</li></ul>",
  "limitationHtml": "<ul><li>Uses controlled test records, not a live sender yet.</li><li>The Webhook input is built but not authenticated or published.</li><li>The one live Notion write attempt failed on a permission error — production use still needs that access granted, plus retry, dedupe and an independent error workflow.</li><li>Human review is still required before any write.</li></ul>",
  "stagesLabel": "Workflow — validate before Notion write, human decides",
  "stageCountLabel": "6 stages",
  "stages": [
    { "num": 1, "actor": "sys", "actorLabel": "Script", "title": "Intake trigger", "body": "A Manual Trigger runs six repeatable test records; a Webhook input is built for a real sender but not yet published or authenticated.", "caption": "Two trigger paths feed the same normalization step: manual test fixtures and a not-yet-live Webhook.", "miniNodes": ["Manual test fixtures", "Webhook built, not published", "No auto-run in background"] },
    { "num": 2, "actor": "sys", "actorLabel": "Script", "title": "Normalize record", "body": "Incoming records are unwrapped, checked against an allowed-field list, and cleaned into one consistent shape before anything is judged.", "caption": "Tag strings become arrays, unknown fields are dropped, every record gets a correlation ID.", "miniNodes": ["Tags string → array", "Unknown fields removed", "Correlation ID assigned"] },
    { "num": 3, "actor": "sys", "actorLabel": "Script", "title": "Validate safety rules", "body": "Required fields, intent, dates, long text and oversized URLs are checked before anything is mapped toward Notion.", "caption": "Malformed dates and oversized text fall back instead of breaking the write; missing required fields are flagged, not guessed.", "miniNodes": ["Required fields checked", "Date / URL / text fallback", "Missing data flagged"] },
    { "num": 4, "actor": "sys", "actorLabel": "Script", "title": "Map Notion payload", "body": "Validated records are mapped into the exact property shape Notion's API requires — before any write is attempted.", "caption": "Schema-safe payload preview, built and checked before touching the live database.", "miniNodes": ["Schema-safe mapping", "Payload preview built", "No write yet"] },
    { "num": 5, "actor": "human", "actorLabel": "Human", "title": "Route review state", "body": "Each record becomes READY, NEEDS_REVIEW or BLOCKED — only READY records are eligible for a write; the rest wait for a human decision.", "caption": "Three review states keep every record visible instead of silently writing or silently dropping it.", "miniNodes": ["READY", "NEEDS_REVIEW", "BLOCKED"] },
    { "num": 6, "actor": "out", "actorLabel": "Output", "title": "Review report / write outcome", "body": "The workflow generates a human-readable report; a real write attempt is reported honestly, including when it fails.", "caption": "One live write attempt failed on a Notion permission error — the workflow reported that failure instead of a fake success.", "miniNodes": ["Markdown report", "Real write attempted", "Failure reported, not hidden"] }
  ],
  "transferHeading": "Transfer",
  "transferItems": [
    "Normalizes inconsistent field shapes before validation.",
    "Reports a failed write honestly instead of a fake success."
  ],
  "valueLine": "OpenClaw-style intake → n8n validation → Notion-safe review handoff.",
  "overviewChips": ["n8n", "Notion validation gate", "Safe failure"],
  "miniRoadmap": ["Intake", "Normalize + validate", "Review state", "Notion handoff"],
  "proofChips": ["n8n", "OpenClaw-style input", "Claude Code", "Notion API", "Safe failure"],
  "finalRoadmap": "Task record → normalize → validate → Notion payload → review state → report / write outcome",
  "finalTakeaway": "Check first. Normalize before judging. Report failure honestly."
}
```

**Why this was replaced:** this copy described the `openclaw-notion-sync-v2` workflow (6 records, Notion payload mapping, a claimed failed live write) under the `job-application-filter` project id — a mismatch documented in
`D:\ai-test\N8N_WORKFLOWS_AND_WEBSITE_STORYTELLING_AUDIT.md` and the Notion page "System 01 — COMPLETE Reference"
(page id `3b717aa1-9775-81a7-bbde-f1ab67bdd517`). Separately, the actual `job-application-filter` system was
rebuilt as "Professional V2" (`D:\ai-test\job-screening-validation-v3\`) — a deterministic 8-case test harness,
a gated production control path (real Wait-for-human-decision form, pre-write guard, controlled audit receipt),
and a structured error handler — which is a stronger, more accurate, and more its-own-real-artifact story than
either the old copy above or a rename to match `openclaw-notion-sync`. This replacement tells System 01's real
current story rather than picking between the two old mismatched options.
