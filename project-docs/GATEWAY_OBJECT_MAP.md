# Gateway Object Map

Status: source-of-truth draft.

Objects:
- `ai`: thin 3D card stack, route `/ai`, transitional landing for the existing AI portfolio.
- `architecture`: miniature architectural study model, route `/architecture`, transition page to the maintained external portfolio.
- `future`: abstract object for future Making / Game / Product work, route `/about` for now.

Required fields for each object:
- id
- title
- category
- route
- description
- ctaLabel
- objectType
- position
- rotation
- scale
- focusCameraPosition
- focusCameraTarget
- enabled
- external
- externalUrl

Notes:
- The home gateway should only need a new config entry plus one new geometry component for future expansion.
- The external architecture URL is intentionally isolated so it can be filled in without touching the route wiring.