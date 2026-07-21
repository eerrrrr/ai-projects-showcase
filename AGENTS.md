# ai-projects-showcase — agent entry

**Purpose:** Data-driven React rebuild of the Arcto/Aurinkokarhu job-application
showcase (originally `D:\ai-test\reports\AI_PROJECTS_SHOWCASE_2026-07.html`, a
single static file). Five flagship AI projects, mapped against a target
company's stated needs, rendered from JSON so the showcase can be re-ordered,
edited, or extended (new project, new target company) without touching
component code. See `00_SYSTEM.md` for full state and design rationale.

**Type:** tool / static site (Vite + React 18 + TypeScript, no backend).

## Source of truth

`00_SYSTEM.md` — current state, what's been ported and verified, what's still open.

## Run + test

```powershell
cd D:\ai-test\ai-projects-showcase
npm install
npm run dev      # http://localhost:5190/ai-projects-showcase/
npm run build    # tsc -b && vite build -> dist/
npm run preview  # serve the production build locally
```

## Safe to change

- `src/data/projects.json` — edit, reorder, or add project entries (the
  original 5 plus, e.g., the reconciliation-exception-review or Staria
  evidence-review demos as they mature).
- `src/data/page-content.json` — hero copy, tool-area mapping, stats,
  supporting-systems cards, role-fit checklist — everything that's specific
  to one target company/application.
- `src/styles/global.css` — visual design; class names are shared with the
  original static HTML on purpose, so diffing against it stays easy.

## Needs approval first

- Adding a backend, database, or any external write (this is a static site
  by design — keep it that way unless explicitly asked).
- `git init` / creating the GitHub repo / pushing / enabling GitHub Pages —
  deliberately left as a manual, confirmed-first step (see 00_SYSTEM.md).
- Touching the live portfolio site (`E:\my-portfolio-website\eerrrrr.portfolio.github.io`)
  — that site has its own "no React, no JSON migration" hands-off rule from
  an earlier stability decision. This project exists specifically so that
  rule never needs to be broken.

## Dependencies

`react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `typescript` — same
versions as the one other React project in this workspace,
`E:\AI_editing\auto-typesetting-cover-tool\`. No MCP, no API keys, no
Notion/database dependency.

## Risks / unknowns

- Content was ported by hand from the original HTML into JSON; verify new
  edits against `D:\ai-test\reports\AI_PROJECTS_SHOWCASE_2026-07.html` if in
  doubt about original wording or a specific verified number.
- Visual parity was checked via build output + bundle content grep, not a
  pixel-level automated screenshot diff (headless-browser MCP tools were
  unavailable in the session that built this) — a manual side-by-side check
  against the original HTML is still worth doing once.
- `vite.config.ts` sets `base: '/ai-projects-showcase/'` for a GitHub Pages
  project-site deploy; change this if the repo ends up somewhere else (a
  user-site repo, a custom domain, etc.).
