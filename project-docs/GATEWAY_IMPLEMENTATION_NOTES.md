# Gateway Implementation Notes

Status: working notes.

Implementation choices:
- BrowserRouter is used with `import.meta.env.BASE_URL` so the site respects the GitHub Pages project base path.
- `public/404.html` redirects deep links back into the SPA with a `redirect` query parameter.
- The gateway scene uses `frameloop="demand"` and only invalidates during camera transitions.
- Reduced motion switches the camera instantly and skips the animated tabletop experience.
- Mobile and WebGL failure both fall back to an accessible static HTML layout.

Known limitation:
- The maintained external architecture URL was not discoverable in this repository snapshot, so it is isolated behind the gateway object config and must be filled in once confirmed.