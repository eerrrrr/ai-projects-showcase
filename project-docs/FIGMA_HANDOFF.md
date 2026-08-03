# Approved Figma frames

Status: TEMPLATE — fill in once frames are approved in
`03 — Approved Screens`. Only put links here once a frame is genuinely
approved, not a Stitch draft still under review in `00 — Stitch Inbox`.

Figma file: [link]

```
Homepage desktop:
  frame link:
  notes:

Homepage mobile:
  frame link:
  notes:

Featured project preview (card/index state):
  frame link:
  notes:

Featured case-study page desktop (e.g. Job Screening Validation Workflow):
  frame link:
  notes:

Featured case-study page mobile:
  frame link:
  notes:

Supporting / Learning project compact view:
  frame link:
  notes:

Navigation states:
  frame link:
  notes:
```

## Figma MCP connection (for Claude Code implementation)

Once ready to implement, connect Claude Code to the running Figma
desktop app:

```powershell
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```

Then restart Claude Code and run `/mcp` to confirm the connection before
asking Claude to read frames directly.
