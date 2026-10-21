# AI Usage Log

This file records where AI help was used while building Civic, for honest disclosure in the
Congressional App Challenge submission. Add an entry after any work session that used an AI
assistant. Keep it factual — the judges compare this against the source code and the demo video.

**How to use it:** newest entry at the top. For each entry, say what the assistant produced, and
what the student reviewed, changed, or wrote without help. Never delete an entry to make the history
look smaller.

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
