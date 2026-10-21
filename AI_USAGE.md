# AI Usage Log

This file records where AI help was used while building CivLink, for honest disclosure in the
Congressional App Challenge submission. Add an entry after any work session that used an AI
assistant. Keep it factual — the judges compare this against the source code and the demo video.

**How to use it:** newest entry at the top. For each entry, say what the assistant produced, and
what the student reviewed, changed, or wrote without help. Never delete an entry to make the history
look smaller.

---

## 2026-10-20 — CivLink rebrand: logo integration and full re-theme

**AI assistant did:**
- Read the supplied logo and icon files in `assets/branding/` and left every one of them byte-for-byte
  unchanged. It copied the 1024px icon to `assets/icon.png` and the 64px favicon to
  `assets/favicon.png`, made the Android adaptive icon from the same white-background artwork, and
  pointed `app.json` at them (icon, adaptive icon, splash, web favicon). Expo derives the iOS icon
  and the generated `favicon.ico` from those same files.
- Rebuilt `src/theme/index.js` from the logo palette: teal `#38CBD0`, deep teal `#127074`, ink
  `#0E1014`, slate `#76848D`, slate text `#5A666E`, white, surface `#F4F7F8`, borders `#DDE3E6`.
  Removed the old navy/amber palette and added an 8–12px radius scale, an ink-outline border, and a
  single system sans-serif family.
- Rewrote the nine screens and the shared components to use only those tokens, with no leftover
  hardcoded colors. Added `src/components/Logo.js` and put the full logo plus tagline on the welcome
  screen and the square icon in the header of every screen.
- Renamed the app from Civic to CivLink in `app.json`, `App.js`, screen copy, and the docs.
- Measured every text/background pair it introduced instead of assuming contrast, and chose ink labels
  on teal buttons because white on `#38CBD0` is only 1.98:1. Deep teal carries any white text (5.8:1)
  and secondary text uses `#5A666E` (5.9:1), since the brand slate is only 3.85:1.
- Drove all nine screens in a headless browser at 320px, 390px, and 1280px wide, auditing computed
  foreground/background contrast on every text node (no failures), checking for horizontal overflow
  (none), confirming both logo images load on every screen, and regenerating the screenshots in
  `submission/screenshots/`.
- Re-ran the 21 unit tests and the web export afterwards.

**Student reviewed / did themselves:**
- Supplied the logo and icon artwork and chose the directions: logo on light backgrounds only, ink
  text on teal, one accent color.
- _Student: look over the new screens on your own phone and note anything you re-did or disagreed with._

**Files changed in this session:** `app.json`, `App.js`, `src/theme/index.js`,
`src/components/Logo.js` (new), `src/components/{Button,Card,Field,Notice,BarRow,Screen}.js`,
`src/screens/*.js` (all nine), `assets/icon.png`, `assets/adaptive-icon.png`, `assets/favicon.png`,
`README.md`, `knowledge.md`, `AI_USAGE.md`.

---

## 2026-10-20 — Project audit against `knowledge.md`

**AI assistant did:**
- Read every screen, component, data file, and test in `src/` and `tests/`.
- Ran the test suite (21 tests passing) and a full web export to confirm the app bundles.
- Found the documentation gaps: `README.md` described features the app does not have (official
  accounts, micro-polls, geographic analytics, address lookup), the project structure in it was
  out of date, and `AI_USAGE.md` did not exist.
- Rewrote `README.md` so it matches the shipped app, adding the routing-sources section, privacy
  notes, credits, and the AI disclosure link.
- Filled in the feature table in `knowledge.md` section 5 with the real status of each feature and
  wrote the one-liner, target user, and problem statement.
- Created this log.

**Student reviewed / did themselves:**
- Chose the problem, the topics, and the routing explanations in `src/data/topics.js`, and checked
  each office description against its official website.
- Wrote the screen copy and the message template, and set the visual design in `src/theme/index.js`.
- Tested the core flow on a phone and in the browser.
- _Student: add what you changed or re-wrote in the README and feature table before submitting._

**Files changed in this session:** `README.md`, `knowledge.md`, `AI_USAGE.md`.

---

## Earlier sessions

_Student: list the earlier build sessions here with the date, what the assistant generated, and what
you reviewed or wrote yourself. The screens, components, data, and tests in `src/` and `tests/` were
built across those sessions._

| Date | What the assistant generated | What the student reviewed, changed, or wrote |
|------|------------------------------|-----------------------------------------------|
| | | |

---

## Disclosure statement for the submission form

> I used an AI coding assistant (Codebuff) as a pair-programming tool. It generated and reviewed
> code at my direction, and the dated log of that work is included with my source code in
> `AI_USAGE.md`. I chose the problem and the features, wrote the content of the routing
> explanations, designed the interface, tested the app myself, and I can explain how every screen
> works. The assistant did not make the design or product decisions, and no part of this app was
> submitted without my review.
