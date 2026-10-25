# CivLink — judge quickstart

**Live web app:** add the deployed HTTPS address here before submitting
(`https://________________`). The build is ready — see “Deploy” below — but this folder was prepared
before the public link existed.

**Source:** this repository. **Tests:** `npm test` (40 tests). **Web build:** `npm run build:web`.

CivLink is a prototype. Every official account, announcement, poll, and response number shipped with
the app is **sample data** and is labeled as such in the interface. No real office or agency is
represented, and no real official has been onboarded.

---

## The 60-second demo path

1. Open the app. On the home screen, tap **Open the Official Portal**.
2. Tap **Sign in as Sample staff account** (there is no password).
3. Open **Polls → New poll**. Write a question, two options, pick **Loudoun County**, and tick the
   four neutrality checks. Tap **Publish to residents**.
4. Tap **Sign out**, then **Updates from your area** on the home screen. The new poll is at the top.
5. Open it, choose an answer, tap **Record my response**, and read the results.
6. Return to the portal and open **Polls → Results** for that poll to see the count change and
   **Export results as CSV**.

To demo announcements instead: portal → **Announcements → New announcement**, write a title and
body, pick an area, and **Publish now**. It appears in the same resident feed.

---

## Demo accounts

| Account | Role | What it can do |
|---|---|---|
| Sample staff account | Official | Create and publish polls and announcements, reply to questions |
| Sample administrator | Admin | Everything above, plus approve or deny official access requests |

There are **no passwords**. A real rollout would require a server, a verified `.gov` email, a
password or SSO, and a human approval step. The prototype shows the request → `.gov` format check →
administrator approval flow, and creates a demo official account when approved.

To try it: sign out, on the Official Portal screen fill in **Request official access** with any name
and an address ending in `.gov` (for example `staff@sample.gov`), send it, then sign in as the
**Sample administrator** and open **Access requests**.

---

## Reset the demo

1. Sign in to the Official Portal as any account.
2. Scroll to **Reset demo data** and tap it twice.

This restores the seeded sample polls, announcements, and questions, clears poll responses, deletes
demo accounts created on the device, and signs you out. Saved resident messages are separate and are
not deleted.

---

## What is real, and what is simulated

**Works on the device:** publishing, scheduling, audience selection, the neutrality checklist,
one-response-per-poll voting, results and turnout, CSV export, announcements, questions and replies,
access-request approval, audit log, message writing and saving, area selection, notification
preferences, and the in-app unread feed.

**Simulated / not built:** real authentication, a server, real delivery to residents, push
notifications, email digests, SMS, live official lookup, app-store distribution, and events/RSVP.
Sample response numbers are seeded and labeled; they are not real constituent data.

**Privacy:** votes carry no identity; officials see totals and turnout by locality only. All demo
data stays in the browser or device storage.

---

## Device notes

- Works in a normal browser on desktop, iPhone, and Android; no install is needed.
- iPhone/iPad install: open the link in Safari → Share → Add to Home Screen.
- Android install: Chrome menu → Install app (or Add to Home screen).
- The **Get CivLink** screen shows the current web address, a QR code when the address is public
  HTTPS, copy-link, and install steps.
- The layout is designed for small screens and was exercised at a 390px phone width.

---

## Deploy the web build

```bash
npm install
npm run build:web
```

Upload `dist/` to any static host (Netlify Drop, Netlify, Vercel, GitHub Pages at the domain root).
`netlify.toml` and `vercel.json` are included. Set `EXPO_PUBLIC_WEB_APP_URL` to the final HTTPS
address if you also build a phone app, so its Get CivLink page can show the same QR code.

---

## Troubleshooting

- **A poll does not appear for a resident.** Check the poll's audience includes the resident's
  selected area, that it is open (not scheduled or draft), and that notification settings are on for
  that area and category.
- **Publish is disabled.** Complete every neutrality checklist item and fix the validation message
  on the question, options, audience, or dates.
- **Results say “Not enough responses yet.”** Results stay hidden below five responses; the CSV
  export is locked at the same threshold.
- **Nothing is saved after a reload.** The browser may be blocking storage. The app keeps working for
  the session and reports the problem.
