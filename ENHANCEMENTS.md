# Ionity Website — Digital Enhancement (v1.1)

A premium, B2B-focused polish pass over the static site. All changes are additive
and reversible; the immersive THREE.js backdrops are preserved throughout.

## New shared layer

- **`assets/css/enhance.css`** — global premium layer (loaded last on every page):
  refined typography, premium scrollbar/selection, accessible focus rings, the
  premium loader + page-transition styles, the B2B footer "network" bar, and full
  `prefers-reduced-motion` support.
- **`assets/js/enhance.js`** — engine for the premium loader, cinematic page
  transitions, footer-network "you are here" enhancement, conservative encoding
  repair, and a skip-to-content link / `role="main"` landmark.

## What changed

### Loading experience (was "childish")
- Replaced the `SYSTEM INITIALIZING` (Courier) loader and the
  `NEURAL LINK // SYNCING` "warp" loader + whoosh sound with a single premium
  loader: obsidian aurora field, IONITY wordmark, orbital ring, gradient progress.
- Cinematic, silent page transitions between every internal page.
- Fixed: ctrl/cmd-click now opens links in a new tab (legacy code hijacked it).

### B2B professionalism
- **Audio is now strictly opt-in** on `index.html` and `lander.html` — the ambient
  binaural drone no longer auto-plays on mouse-move; it is enabled only via the
  "Enable ambient sound" control.
- Homepage hero rewritten from a cryptic "Access System" framing to a clear value
  proposition + "Explore Solutions" CTA (DOM ids and interaction preserved).
- About-page origin story rewritten from a personal childhood narrative to a
  third-person company origin (founding year, problem solved, disciplines, sectors).
- Removed the CRT "scanline" overlays from 19 interior pages.

### Cross-site traffic
- A **static, crawlable footer "Ionity Network" bar** on all 23 pages linking
  **ionity.today**, **ionity.co.za** (highlighted), and **ionity.world**.

### Compliance / SEO / accessibility
- **Consent Mode v2 ordering fixed**: the consent default now runs before GA4
  (`G-0GH52FYXR0`) initialises on every analytics page.
- **Consent gate fixed**: choosing "Necessary only" no longer grants analytics or
  marketing; consent is now applied per category and reflected immediately.
- Removed the dead `GTM-XXXXXX` placeholder triggers (no more 404 requests).
- Added `rel="noopener"` to the WhatsApp link; skip-link + `role="main"` landmark.
- Repaired all mojibake (registered marks, em-dashes, a `×` glyph) site-wide.

## Known follow-ups (need a business decision)
- **Real analytics ID**: a placeholder `GTM-XXXXXX` container remains referenced;
  drop in the real GTM ID (or remove the scaffolding) if GTM is actually used.
- **One CMP**: SecurePrivacy and the custom cookie-manager both exist; standardise
  on one consent mechanism.
- Optional copy polish (emoji-as-iconography; a few grandiose lines) left in place
  to preserve brand voice.

— Generated as part of the v1.1 enhancement pass.
