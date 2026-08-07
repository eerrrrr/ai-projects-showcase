# Update report — Project 01 Docker/n8n forensic verification

**Date:** 2026-07-25
**Scope:** verification only in this specific pass (no wording changes were needed — the
prior "Local workflow" wording was already correct). Also includes: Selected-systems chip
trim (5→3 max per project) and color unification, both requested alongside this
verification. Files touched: `src/data/projects.json` (`overviewChips` only),
`src/styles/global.css`, `src/components/ProofSummary.tsx`.

## Why this re-check was needed

The earlier check only looked inside the `job-application-filter` project folder
(no Dockerfile/compose file, `n8n` as a plain npm devDependency) and concluded "no
Docker." That's necessary but not sufficient — Docker could have been run manually
(`docker run ...` from the CLI, or via Docker Desktop's GUI) without ever leaving a
Dockerfile or compose file inside the project folder. This pass checked actual Docker
runtime state and command history directly, per the requested verification steps.

## Evidence gathered

**`docker ps -a`** — two containers exist, both using the real n8n image:
```
NAMES          IMAGE                            STATUS
elastic_cray   docker.n8n.io/n8nio/n8n:latest   Exited (143) 6 months ago
n8n            docker.n8n.io/n8nio/n8n          Exited (0) 6 months ago
```

**`docker images`** — confirms the image is present locally:
```
docker.n8n.io/n8nio/n8n   latest   524bd974e19c   11 months ago   1.73GB
```
(Also present: `kronos-sandbox` and `mcp/playwright` — unrelated to n8n.)

**`docker volume ls`** — `n8n_data` volume exists, mounted by the `n8n` container at
`/home/node/.n8n` (n8n's own data directory).

**`docker inspect n8n` / `docker inspect elastic_cray`** — creation and exit timestamps:

| Container | Created | Exited | Port mapping | Compose config |
|---|---|---|---|---|
| `n8n` | 2025-08-19 | 2026-01-21 | none (`Ports: map[]`) | none found |
| `elastic_cray` | 2026-01-21 (same day, seconds later) | 2026-01-21 | none | none found |

`docker compose ls --all` returns no config files for either container — they were run
as bare `docker run` containers, not through a compose file. Environment variables
inside `n8n` are just the image's own defaults (`NODE_VERSION`, `N8N_RELEASE_TYPE`,
etc.) — nothing project-specific.

**Command history** — `Get-Content (Get-PSReadLineOption).HistorySavePath | Select-String
"docker|n8n"` returned Docker-related lines only (stopping Docker Desktop/services for
unrelated VPN/battery diagnostics) — no `docker run`/`docker start` command mentioning
n8n anywhere in the retained PowerShell history. No `.bash_history` file exists to check
on this machine.

**File search across the whole `D:\ai-test` workspace** (not just the project folder):
```
*docker*  → D:\ai-test\kronos_sandbox\Dockerfile   (unrelated project — this is what
                                                      the "kronos-sandbox" image in
                                                      Docker Desktop actually belongs to)
            D:\ai-test\Other people skill\MeiGen-AI-Design-MCP-main\Dockerfile (unrelated)
*compose* → no matches
```
No Dockerfile or compose file anywhere in the workspace references n8n or
`job-application-filter`.

**`job-application-filter` project's own files**, for comparison: `package.json`,
`n8n_workflows/`, and the local `n8n-start.log`/`n8n-start-err.log` are all dated
**2026-07-20 / 2026-07-21** — consistent with a local `npm`/`npx n8n` start (the log
filenames are exactly what that produces), not a Docker container.

## Conclusion

Docker-run n8n did happen on this machine — that instinct was correct, and it's not
"no evidence." But the two containers were created **2025-08-19** and **2026-01-21**,
with no port mapping and no compose config (consistent with a brief, disconnected
experiment, not a working setup), while `job-application-filter`'s own files are all
from **2026-07-20/21** — five to eleven months later. There is no file, container, or
history evidence connecting Docker to this specific project; everything about the
project's actual build (npm devDependency, local start logs) points to a local n8n
process instead.

**Decision: kept "Local workflow"**, not "Docker" and not the cautious middle-ground
"Docker environment checked" wording — the evidence doesn't sit in an ambiguous middle,
it actively points away from Docker for this specific project. Writing "Docker n8n" on
Project 01 would attribute a different, unrelated exploration to this project. No
wording change was made to Project 01's chips or copy as a result of this check (they
were already accurate).

## Also done in this pass (requested alongside the verification)

**Chips capped at 3, "Local workflow" dropped entirely** (not just from Project 01 —
it was never accurate to add it as a distinct tag once the Docker question was settled
either way, since "local" isn't a capability/tool). All 7 `overviewChips` arrays
trimmed from 4-5 items down to exactly 3, keeping the strongest tool + mechanism
identifiers per project:

| # | Project | Chips |
|---|---|---|
| 01 | Job Search Automation System | n8n · Rule-based scoring · Human review |
| 02 | Investment Reasoning Learning Database | Python · SQLite · Source-first |
| 03 | Source-to-Figma Data Visualization Pipeline | Notion · Figma handoff · Human review |
| 04 | AI Output Review & Debug Memory System | Rule-based gate · Phrase scan · Debug memory |
| 05 | Method of Loci | Python · Gemini AI · SQLite |
| 06 | AI-Assisted Video Pipeline | ffmpeg · Resolve API · Privacy pass |
| 07 | Blender + ComfyUI | Blender · ComfyUI · Wan2.1 |

**Card color unified across all 7 cards.** Removed the three `.system-card--quiet`
color-override rules in `global.css` (`.mono--accent`, `h3`, and the chip color) and the
conditional `system-card--quiet` class application in `ProofSummary.tsx` — Projects 05-07
(tier 2/3) now render with identical title/number/chip color to Projects 01-04 at rest.
The class conditional was removed rather than left inert, since it no longer did
anything.

## Build & verification

- `python -c "import json..."` — all 7 `overviewChips` arrays confirmed at exactly 3 items.
- `npm run build` (`tsc -b && vite build`) — 0 errors.
- Live DOM check (Puppeteer, `vite preview`, 1440×900): confirmed all 7 cards show
  identical `h3`/number/chip computed color (previously Projects 05-07 were muted
  differently); confirmed chip rows are 1 row for 6 projects and 2 rows for Project 04
  (its 3-chip text is simply longer) — well within the "max 2 rows" target the original
  5-chip layout was breaking.

## Not touched

`ProjectCard.tsx`, `WorkflowWalkthrough.tsx`, `useWorkflowWalkthrough.ts`, auto-zip
logic, scroll-spy logic, Selected-systems layout (card structure/links unchanged, only
color + chip content), Hero, Plasma, Footer, deployment config.

**Not committed or pushed** — awaiting explicit "go commit" / "go push".
