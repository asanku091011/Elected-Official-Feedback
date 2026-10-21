# Project Instructions: Congressional App Challenge Entry (VA-10)

Read this entire file before doing anything. It is the source of truth for what we are building and why.

## 1. Mission

We are building an app to win the 2026 Congressional App Challenge in **Virginia's 10th District (Rep. Suhas Subramanyam)**. Every decision should answer one question: **will this make the judges rate the app higher?**

A finished, working, polished app that solves a real problem beats an ambitious app that is half-broken. When in doubt, finish and polish instead of adding.

## 2. Hard constraints

- **Deadline: Monday, October 26, 2026 at 12:00 PM (noon) EST** per the national schedule. This is a midday cutoff, not end of day. VA-10's page on subramanyam.house.gov must be checked to confirm. Plan to submit by **Sunday, Oct 25** at the latest.
- Submissions cannot be modified after the deadline.
- One app per student per year. App must be original and built after Oct 30, 2025.
- The app must be functional. Judges review a demo video, source code and written answers.
- **AI use must be fully disclosed** in the submission, and students must show real individual contribution and understanding. Keep an `AI_USAGE.md` file (see section 7) that logs what the agent generated. Never hide AI help.
- Any language and any platform is allowed.

## 3. How we win

Judging is by district staff and local judges. Criteria typically cover (1) quality and originality of the idea, (2) implementation and functionality, and (3) excellence of coding and design. The app is judged mostly through the **demo video** and **written answers**, so those matter as much as the code.

What wins at the district level:
1. **A concrete problem with a real user.** Name who it helps and how. A local problem beats a vague one.
2. **It works, end to end, without crashes.** Judges will not forgive a broken core flow. Cut features before shipping bugs.
3. **A clean, intentional design.** Consistent colors, readable type, clear navigation, no leftover placeholder text, no Lorem ipsum, no dead buttons.
4. **A story.** Why the student built it, what they learned, what they would do next.

## 4. Audience: the congressman

Rep. Subramanyam is a former White House technology policy adviser (Obama administration), serves on the House Science, Space, and Technology Committee and the Oversight and Government Reform Committee, and has worked on AI policy, small AI businesses, data center security, government tech modernization, online safety for kids, education, and affordability. Loudoun County anchors the district, which also includes parts of Fairfax and Prince William and Fauquier and Rappahannock counties.

Use this to shape the app and the submission **without being pandering or partisan**:
- Favor themes that overlap with his work: **responsible AI, kids' online safety and privacy, civic tech and making government services easier, education, local community needs, cybersecurity, accessibility.**
- The app must stay **nonpartisan**. No political messaging, no named politicians inside the app.
- Where it is honest and natural, the app can mention that it serves **Northern Virginia / Loudoun residents**. Do not fake local data.
- Do not mention Rep. Subramanyam in the app UI. The alignment should come from what the app does.

## 5. Features

> Statuses below were checked against the code on Tue, Oct 20, 2026. Change them as work lands.

| # | Feature | Status (done / partial / not started) | Priority (must / should / nice) |
|---|---------|----------------------------------------|----------------------------------|
| 1 | Issue picker with search over 13 topics (roads, schools, housing, utilities, safety, data centers, privacy, immigration, benefits, health, taxes, transit, voting) | done | must |
| 2 | Routing result: the office that handles the issue, why, what it can do, and what it honestly cannot do | done | must |
| 3 | Message composer with a labeled template, length rules, placeholder/shouting/link warnings, and a threat check | done | must |
| 4 | Preview screen showing exactly what would be sent, with warnings before saving | done | must |
| 5 | Save on device with a readable reference number, copy-to-clipboard, and a link to the office’s official contact page | done | must |
| 6 | Dashboard that groups saved messages by level of government and by issue, with a demo-data notice | done | should |
| 7 | Offices directory filterable by level of government, linking only official sites | done | should |
| 8 | About screen with routing sources, privacy explanation, accessibility notes, credits, and AI disclosure | done | must |
| 9 | Anonymous by default; ZIP and name optional; delete one message or clear all | done | must |
| 10 | Official accounts, verified sign-in, server delivery, or micro-polls | not started | nice (out of scope for Oct 26) |
| 11 | Geographic analytics beyond showing an optional ZIP code | not started | nice (out of scope for Oct 26) |

**App one-liner:** Civic helps a Northern Virginia resident find the office of government that can actually act on their concern, then write and send a clear message to it.

**Target user:** Residents of Virginia’s 10th District — students, parents, commuters, and neighbors in Loudoun and nearby counties — who have a local problem and do not know which office handles it.

**Problem it solves:** People send concerns to the wrong office and never hear back. Civic explains who has the authority, what that office cannot do, and how to write a message staff will read — while storing nothing on a server.

## 6. Instructions for the agent

### First steps
1. Read this file, then inspect the project (structure, README, package/config files, existing code) before changing anything.
2. Compare the codebase to the feature table in section 5. Update the Status column to match reality, then tell the owner what you found.
3. Propose a short plan ordered by: **(a)** core flow works, **(b)** must-have features complete, **(c)** bugs and edge cases fixed, **(d)** design polish, **(e)** nice-to-haves.

### Working rules
- **Do not break what already works.** Make small, testable changes. Run the app and any tests after each meaningful change.
- **No placeholders in shipped code:** no TODOs left in UI, no fake buttons, no hardcoded demo text pretending to be real data.
- **Handle errors gracefully:** empty states, bad input, no network, loading states. Nothing should crash or show a raw error.
- **Keep it simple and readable.** The student must be able to explain every part of the code. Prefer clear code with short comments over clever code. Explain non-obvious changes in plain language when you make them.
- **Accessibility:** good color contrast, readable font sizes, labels on inputs, keyboard and screen reader basics where relevant, works on small screens.
- **Privacy and safety (important because the student is a minor and the audience is a congressional office):** collect the minimum data, never store sensitive personal info unnecessarily, never commit API keys or secrets (use environment variables and a `.gitignore`), do not copy copyrighted assets or code without a license. Use original or properly licensed images and libraries and list them in the README.
- **No invented facts.** If the app shows statistics, local data, or claims, they must be real and sourced, or clearly labeled as sample data.
- Do not add large new dependencies or rewrite the architecture late in the project unless the owner agrees.

### Design standard
- Pick one consistent palette, one or two fonts, consistent spacing and components.
- Clear first screen: a new user should understand what the app does within 5 seconds.
- Include a polished app icon/name/logo (original), a splash or welcome screen if appropriate, and consistent navigation.
- Test the main flow as a first-time user and fix every rough edge.

### Code quality (judges can read the source)
- Organized folder structure, meaningful names, no dead code or leftover debug logs.
- A strong `README.md` containing: what the app does, who it is for, how to run it, tech stack, screenshots, credits, and the AI disclosure.
- Basic tests or at least a manual test checklist for the core flow.

## 7. AI disclosure log

Create and maintain `AI_USAGE.md`. After meaningful work, append an entry: date, what the agent generated or changed, and what the student reviewed, modified or wrote themselves. This is used for honest disclosure in the submission.

## 8. Submission package checklist

Prepare these in the project (in a `/submission` folder) so the owner can copy them into the portal at congressionalappchallenge.us:

- [ ] **Demo video** script (target 2 to 3 minutes; the portal requires a YouTube or Vimeo link). Structure: 15 sec hook (the problem), 60 to 90 sec live walkthrough of the core flow, 30 sec on what the student built and learned, 15 sec on the impact and next steps. Keep it clear, well lit, with audible narration. No copyrighted music.
- [ ] **Short summary** of the app (a few sentences).
- [ ] **Inspiration**: the personal, real story behind why it was built.
- [ ] **What I learned** during the process (specific technical lessons and challenges overcome).
- [ ] **Source code** ready to upload, clean, with README.
- [ ] **AI usage disclosure** text based on `AI_USAGE.md`.
- [ ] Screenshots.
- [ ] Registered on the student portal and eligibility confirmed (enrolled in middle or high school on Oct 26, 2026; lives or attends school in VA-10; teams of up to 4 with at least half in the district).

The agent should draft all written pieces in the student's voice (simple, honest, specific) and let the student edit. They must reflect the student's genuine experience, so ask the owner for personal details instead of inventing them.

## 9. Timeline (assuming today is Tue, Oct 20, 2026)

| Day | Goal |
|-----|------|
| Tue Oct 20 | Audit the code, update the feature table, fix the core flow |
| Wed Oct 21 | Finish must-have features, fix bugs |
| Thu Oct 22 | Design polish, accessibility, empty/error states |
| Fri Oct 23 | **Feature freeze.** Testing, README, AI_USAGE.md |
| Sat Oct 24 | Record the demo video, write the submission answers |
| Sun Oct 25 | Final review and **submit** |
| Mon Oct 26 | Buffer only. Deadline is noon. |

## 10. Definition of done

- The core flow works start to finish with no crashes on a fresh install or run.
- Every feature marked "must" is complete and polished.
- No placeholder text, broken links or dead buttons.
- README, AI_USAGE.md and the `/submission` folder are complete.
- The student can explain how every part works.
