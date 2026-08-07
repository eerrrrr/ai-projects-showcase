# Gateway Greybox Build

Status: in progress.

Scope:
- New root-route 3D tabletop gateway.
- `/ai` preserves the existing AI portfolio.
- `/architecture` is a transition page to the maintained architecture portfolio.
- `/about` provides a minimal supporting page.

Rules:
- Use real 3D geometry, not images on paper.
- Keep the overlay secondary to the tabletop scene.
- Keep fallback content usable without WebGL.
- Respect reduced-motion preferences.
- Keep the implementation lightweight.

Validation targets:
- Home route loads with and without WebGL.
- Category buttons and focus states work on keyboard.
- Camera focus returns to overview.
- GitHub Pages deep links survive refresh through the 404 redirect bridge.