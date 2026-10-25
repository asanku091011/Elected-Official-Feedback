# CivLink — submission answer drafts

These are drafts. Replace every `[bracketed]` note with your own details before pasting anything into
the portal. The judges compare these answers with the video and the source, so only keep claims that
are true for you.

---

## Short summary (a few sentences)

CivLink is an app that helps a Northern Virginia resident find the office of government that can
actually act on their concern, then write a clear message and send it through that office's own
contact page. It explains what each office can and cannot do, keeps messages on the device, and adds
an updates feed with neutral polls for the resident's area. It also includes an Official Portal
prototype where a sample office can publish polls and announcements, see aggregate results, and reply
to resident questions.

---

## Inspiration

**Draft:**

> [Describe the real moment that started this. For example: “When [a neighbor / my family / a
> friend] had a [pothole / school bus / flooding / trash] problem, we called the county and were
> told it was VDOT's road. Then VDOT said it was the town's. Nobody was wrong and nothing happened.”]
>
> That was the part that stuck with me: the problem was not that people do not care. It is that
> nobody tells you which office has the authority, and by the time you find out, you have already
> given up. I wanted an app that answers that question first, before it asks you to write anything.
>
> [Add one sentence about why this matters to you personally, and what you want to do after high
> school.]

**Keep it specific.** A named street, a named problem, and what an office said is stronger than a
general claim that civic engagement matters.

---

## What I learned

**Draft:**

> I learned that most of the work in an app like this is not the screens. It is deciding what the
> data is allowed to say.
>
> - **Routing is a data problem.** Each topic needed an office, a reason, a list of what the office
>   can do, and an honest limit. Writing “what it cannot do” was harder than writing what it can.
> - **Sample data has to look like sample data.** The portal seeds polls and announcements. I kept
>   the seeded numbers separate from responses recorded on the device, labeled them on every result,
>   and blocked the CSV export while results are hidden. Otherwise a demo would quietly become a
>   fake statistic.
> - **Publishing needs rules.** A poll cannot publish until the neutrality checklist is complete.
>   The app flags campaign wording and exclamation points automatically, and the publish button
>   stays disabled until the poll is valid.
> - **Privacy changes the design.** A vote stores the poll, the chosen options, and a locality — no
>   name or account. Officials see totals. That decision made the results screen simpler and the
>   demo more honest.
> - **Boundaries are not a detail.** I originally assumed Fairfax and Arlington were in the
>   district. They are not, or not entirely. Arlington is in VA-8, and only parts of Fairfax and
>   Prince William are in VA-10. The app now says that on the area picker, the local government
>   pages, and the data sources screen.
> - **Testable code is explainable code.** The poll counting, CSV escaping, and date rules are plain
>   functions with unit tests. I can explain them line by line, and that made the screens easier to
>   debug.
>
> [Add your own concrete bug or lesson. For example: “The hardest bug was [describe it]. I fixed it
> by [describe what you changed].”]

---

## What would you do next?

**Draft:**

> Next I would add a real server and verified official accounts, so an office could publish to
> residents for real. That also means a written retention policy, human moderation, and an appeals
> path — the content policy page lists what is missing today. After that: push notifications with the
> iPhone install rules, an email digest for residents who want one, events and town halls with RSVP,
> and a small pilot with one local office to see whether neutral polls actually get answered.

---

## AI usage disclosure (short version for the form)

> I used an AI coding assistant (Codebuff) as a pair-programming tool. It generated and reviewed code
> at my direction, and the dated log of that work is included with my source code in `AI_USAGE.md`. I
> chose the problem and the features, wrote the content of the routing explanations, designed the
> interface, tested the app myself, and I can explain how every screen works. The assistant did not
> make the design or product decisions, and no part of this app was submitted without my review.

---

## Facts to keep straight in every answer

- CivLink is a **prototype**, not a government service, and is not affiliated with any office.
- The portal contains **sample organizations only**.
- The **in-app feed** is the only delivery channel; push, email, and SMS are not built.
- **Arlington is in VA-8**; only parts of Fairfax and Prince William are in VA-10.
- Poll results carry **sample response numbers that are labeled**, and results are hidden below five
  responses.
- No address or location is collected; the resident picks an area.
