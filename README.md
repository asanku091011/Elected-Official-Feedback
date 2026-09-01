# Civic — Elected Official Feedback App

A mobile app that connects constituents with every elected official who represents them — anonymously, safely, and routed to the right office automatically.

Built for the **Congressional App Challenge** — Virginia's 10th District.

---

## What It Does

Civic bridges the gap between citizens and their government at every level — from school boards to the U.S. Senate. Constituents can submit anonymous feedback, and officials get real-time analytics on what their communities actually care about.

### For Constituents
- Enter your address and instantly see every official who represents you
- Submit feedback anonymously — your identity is never shared
- Categorize your issue so it reaches the right office
- Respond to micro-polls sent by your officials

### For Officials
- View aggregated feedback from constituents in real time
- Filter and categorize incoming responses
- Identify trends and emerging issues before they escalate
- Send targeted micro-polls to gather specific input
- Geographic analytics showing where issues are concentrated

---

## Features

- 🔒 **Anonymous response collection** — privacy by default
- 📍 **Automatic official lookup** — federal, state, county, and local
- 📊 **Trend analytics** — frequency, geography, and issue patterns
- 🗳️ **Official micro-polls** — targeted constituent outreach
- 🛡️ **Content moderation** — filters harmful or threatening responses
- 🔀 **Smart routing** — directs feedback to the correct office automatically

---

## Government Levels Supported

- U.S. Senators
- U.S. Representatives
- State government officials
- County and locality officials
- School board members

---

## Tech Stack

- **React Native** (Expo SDK 54)
- **Node.js** v22

---

## Getting Started

```bash
npm install
npx expo start --tunnel
```

Scan the QR code with the Expo Go app on your phone.

---

## Project Structure

```
├── App.js
├── index.js
├── app.json
├── assets/
└── src/
    ├── screens/
    │   └── HomeScreen.js
    └── theme/
        └── index.js
```

---

*Congressional App Challenge 2026 — VA-10*