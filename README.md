# flydownwind.ch

Static website for Downwind (privacy policy, support, imprint, beta) – GitHub Pages, custom domain `flydownwind.ch`.

- Texts: `build.mjs` (English at `/`, German at `/de/`). After editing: `node build.mjs`, then commit the generated HTML.
- Preview: `node tools/serve.cjs` → http://localhost:5180/
- Open Graph image: `node tools/og.cjs` (needs `sharp`).
- No tracking, no analytics, no cookies, no external fonts or scripts. Fonts: Barlow Condensed, IBM Plex Sans (SIL OFL, `assets/fonts/`).
- Public TestFlight link: `BETA_LINK` in `build.mjs`.
