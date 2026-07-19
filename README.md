<div align="center">

# 🏠 PacketReady

### A paperwork copilot for renters applying to affordable housing , built for Hack-Nation's 6th Global AI Hackathon

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-View_App-8b3a2a?style=for-the-badge)](https://packet-ready.vercel.app)
[![Watch Demo](https://img.shields.io/badge/▶️_Watch_Demo-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/k98aCVORN2s)

![Status](https://img.shields.io/badge/status-complete-brightgreen?style=flat-square)
![Track](https://img.shields.io/badge/track-RealDoor%20(RealPage)-8b3a2a?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq%20%7C%20Llama%203.3%2070B-orange?style=flat-square)
![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

</div>

---

## 🎬 See it in action

<div align="center">

| 🔴 Live App | ▶️ Demo Video |
|:---:|:---:|
| [packet-ready.vercel.app](https://packet-ready.vercel.app) | [Watch on YouTube](https://youtu.be/k98aCVORN2s) |

</div>

---

## 📋 Table of Contents

- [The Hackathon](#-the-hackathon)
- [The Track We Chose](#-the-track-we-chose)
- [The Problem](#-the-problem)
- [What We Built](#-what-we-built)
- [How It Solves the Problem](#-how-it-solves-the-problem)
- [The Three Screens](#-the-three-screens)
- [Non-Negotiables We Built In](#-non-negotiables-we-built-in)
- [Tech Stack](#-tech-stack)
- [Data Source](#-data-source)
- [Scope](#-scope)
- [Running It Locally](#-running-it-locally)

---

## 🎉 The Hackathon

Built solo for **Hack-Nation's 6th Global AI Hackathon**, run in collaboration with the **MIT Club of Northern California** and the **MIT Club of Germany**. The event ran six sponsored challenge tracks , this project is a submission to one of them.

## 🎯 The Track We Chose

> **Challenge 03 , RealDoor**, powered by **RealPage**

An application-readiness copilot for renters navigating affordable housing paperwork.

## 😮‍💨 The Problem

Affordable housing programs publish real income rules, but they're:

- 📄 Buried in dense government tables nobody has time to parse
- 🧾 Paired with paperwork that's easy to submit wrong or incomplete
- 🧮 Impossible to self-check without doing the math yourself against a table you have to go find

The result? Applications get delayed **for weeks** over a document mistake that could've been caught in advance. This isn't a "who deserves housing" problem , it's a **friction problem**. Nobody needs an AI to make that call. Someone just needs to show up at the housing office with the right numbers already checked and the right documents already in hand.

## 🛠️ What We Built

**PacketReady** , a renter-facing web app scoped to:

| Scope | Value |
|---|---|
| 🌆 Metro area | Boston-Cambridge-Quincy, MA-NH HUD Metro FMR Area |
| 🏛️ Program | LIHTC, using HUD's MTSP 60% Income Limits |
| 📅 Rule year | FY2026, effective May 1, 2026 |
| 📁 Documents | 100% synthetic , no real renter data, ever |

## 💡 How It Solves the Problem

PacketReady never decides anything. It reads, extracts, calculates, and organizes , the renter confirms every step, and a real housing officer still makes the actual call. It's a paperwork assistant, not a judge.

## 🧭 The Three Screens

<table>
<tr>
<td width="33%" valign="top">

### 1️⃣ Profile
**Human-confirmed extraction**

Upload a synthetic pay stub. The app pulls out only allowlisted fields (name, gross pay, pay period, employer), shows the exact source text behind each one, and waits for you to confirm or fix it before anything downstream uses it.

</td>
<td width="33%" valign="top">

### 2️⃣ Understand
**Cited rules, real math**

Ask "am I under the income limit?" and get your confirmed income, the actual HUD limit for your household size, the arithmetic connecting them, the source table, and the effective date. Never a yes/no verdict.

</td>
<td width="33%" valign="top">

### 3️⃣ Prepare
**Renter-controlled packet**

A checklist flags missing or expired documents. Preview, edit, download, or fully delete your packet , nothing is ever auto-sent anywhere.

</td>
</tr>
</table>

## 🛡️ Non-Negotiables We Built In

These aren't nice-to-haves, they're the actual grading bar:

- 🚫 **No decisioning** , never says "eligible," "qualify," "approved," or "denied," ever
- ✏️ **Every field is correctable** before it's used anywhere else
- 🧪 **Prompt-injection resistant** , tested live by hiding a fake instruction inside an uploaded document
- 🗑️ **Full deletion** , one click wipes the session, verifiably
- ♿ **Accessible** , keyboard-operable, labeled fields, no color-only status indicators
- 🔒 **Synthetic data only** , nothing here is a real person's real paperwork

## ⚙️ Tech Stack

<div align="center">

| Layer | Tool | Cost |
|---|---|:---:|
| Frontend + Backend | **Next.js** (App Router, React) | 🆓 |
| Styling | **Tailwind CSS** | 🆓 |
| AI Model | **Groq** , `llama-3.3-70b-versatile` | 🆓 |
| Document Parsing | `pdf-parse` (no OCR needed , synthetic docs are text-based) | 🆓 |
| Rules Data | Static local JSON, hand-verified from HUD | 🆓 |
| State | React state only , no database | 🆓 |
| Hosting | **Vercel** (Hobby plan) | 🆓 |
| Version Control | **GitHub** | 🆓 |

</div>

Every piece here is free, with no credit card and no waitlisted sponsor credits required.

## 📊 Data Source

Income limits are pulled directly from HUD's official [FY2026 MTSP Income Limits](https://www.huduser.gov/datasets/il/il2026/summary-mtsp.odn) for the **60% Income Limits** tier , the standard LIHTC set-aside test , frozen as a local file rather than fetched live, exactly as the challenge brief requires.

## 🔭 Scope

**In scope:** the three screens above, one metro, one program, one rule year, synthetic documents, live on Vercel.

**Out of scope:** property discovery/search, multiple metros or programs, real user accounts, admin dashboards, live HUD data fetching.

## 🚀 Running It Locally

```bash
git clone <this-repo>
cd packetready
npm install
```

Create a `.env.local` file:

```
GROQ_API_KEY=your_groq_api_key_here
```

Then run:

```bash
npm run dev
```

---

<div align="center">

Built solo, with a lot of vibe coding, for renters who deserve a faster path to the paperwork they need. 🏡

</div>
