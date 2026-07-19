<div align="center">

# 🏠 PacketReady

### *Know your numbers. Walk in prepared.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Groq](https://img.shields.io/badge/Groq-LLM-FF6B35?style=for-the-badge)](https://groq.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

> **Built for the Hack Nation AI Hackathon 2026** 🏆
> *Category: Civic Tech / Housing Access*

<br/>

<img src="https://img.shields.io/badge/Status-Live%20Demo-brightgreen?style=flat-square" />
<img src="https://img.shields.io/badge/AI%20Powered-Groq%20LLaMA%203.3-blueviolet?style=flat-square" />
<img src="https://img.shields.io/badge/Screens-3%20Step%20Flow-orange?style=flat-square" />

<br/>

[![▶️ Watch Demo](https://img.shields.io/badge/▶%20Watch%20Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://youtu.be/k98aCVORN2s)
[![🌐 Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://packet-ready.vercel.app)

</div>

---

## 🎯 What is PacketReady?

**PacketReady** is an AI-powered housing application assistant that helps renters understand whether their income meets housing program requirements — **before they ever walk into an office.**

Millions of renters lose affordable housing opportunities not because they don't qualify, but because they walk in **unprepared**: wrong documents, missing paystubs, misunderstood income limits. PacketReady solves this.

---

## 🏆 Hackathon Context

This project was submitted to the **[Hack Nation AI Hackathon 2026](https://hacknation.ai)** under the **Civic Tech / Housing Access** track.

| | |
|---|---|
| 🗓️ **Hackathon** | Hack Nation AI 2026 |
| 🎯 **Track** | Civic Tech & Social Good |
| 🤖 **AI Stack** | Groq API + LLaMA 3.3 70B |
| 📍 **Data Source** | HUD MTSP Income Limits (FY2026) |
| 🏙️ **Demo Area** | Boston-Cambridge-Quincy, MA-NH |

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Smart Document Extraction** | Upload a PDF paystub or paste income text — AI extracts income, employer, pay period automatically |
| 🧮 **Deterministic Calculations** | Income math is done by code, never by AI — guaranteed accuracy |
| 💬 **Rules Q&A (Safety-Filtered)** | Ask natural language questions about income limits; AI is blocked from making eligibility decisions |
| 📋 **Checklist Generator** | Screen 3 builds a personalized document checklist based on your confirmed profile |
| 📤 **Export Ready** | Copy your checklist as plain text or print it |
| 🔐 **Privacy First** | Nothing is stored server-side — all data lives in your browser session |

---

## 🖥️ The 3-Screen Flow

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Screen 1: PROFILE         Screen 2: UNDERSTAND           │
│   ────────────────          ─────────────────────          │
│   Upload paystub or    ─►   See your income vs.            │
│   paste income text         the HUD limit for your         │
│   AI extracts fields        household size                  │
│   You confirm numbers       Ask AI questions safely         │
│                             ──────────────────────         │
│                        ─►   Screen 3: PREPARE              │
│                             ──────────────────             │
│                             Get your document              │
│                             checklist                       │
│                             Copy & print it                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (Local)

### 1. Clone the repo

```bash
git clone https://github.com/mr-ahtashamulhaq/hack-nation-ai-hackathon.git
cd hack-nation-ai-hackathon
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment

```bash
cp .env.example .env
```

Edit `.env` and add your Groq API key:

```
GROQ_API_KEY=gsk_your_key_here
```

Get a free key at 👉 [console.groq.com/keys](https://console.groq.com/keys)

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Tech Stack

```
┌──────────────────────────────────────────────────┐
│  Frontend                                        │
│  ├── Next.js 16.2 (App Router)                  │
│  ├── React 19                                    │
│  ├── Tailwind CSS v4                             │
│  └── TypeScript 5                               │
├──────────────────────────────────────────────────┤
│  AI / LLM                                        │
│  ├── Groq SDK                                   │
│  └── LLaMA 3.3 70B Versatile                   │
├──────────────────────────────────────────────────┤
│  Document Processing                             │
│  └── pdf-parse (server-side PDF text extract)   │
├──────────────────────────────────────────────────┤
│  Data                                            │
│  └── HUD MTSP FY2026 Income Limits (JSON)       │
└──────────────────────────────────────────────────┘
```

---

## 🛡️ AI Safety Design

PacketReady is built with **intentional AI constraints**:

- 🚫 The AI is **never** allowed to say "you are eligible" or "you qualify"
- 🚫 A server-side word filter enforces this — even if the LLM tries to slip through
- ✅ All income math (delta, comparison) is done by deterministic code
- ✅ Every response cites the source data and effective date
- ✅ The app always reminds users that a **housing officer** makes final decisions

---

## 📁 Project Structure

```
hack-nation-ai-hackathon/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Screen 1 — Profile
│   │   ├── understand/page.tsx   # Screen 2 — Understand
│   │   ├── prepare/page.tsx      # Screen 3 — Prepare
│   │   └── api/
│   │       ├── extract/route.ts  # POST — income extraction via Groq
│   │       └── rules-qa/route.ts # POST — Q&A with safety filters
│   ├── components/
│   │   ├── ExtractionPanel.tsx
│   │   ├── ChecklistPanel.tsx
│   │   └── ExportPanel.tsx
│   └── lib/
│       └── session-context.tsx   # Client-side session state
├── data/
│   ├── mtsp-boston-2026.json     # HUD income limits data
│   └── test-docs/                # Synthetic test documents
├── .env.example                  # Environment variable template
├── DEPLOYMENT.md                 # Full deployment guide
└── package.json
```

---

## 🌐 Deploy

See the full **[DEPLOYMENT.md](./DEPLOYMENT.md)** guide for:
- ▲ Vercel (one-click, recommended)
- 🖥️ Self-hosted Node.js
- 🐳 Docker

---

## 👤 Author

**Ahtasham ul Haq**
GitHub: [@mr-ahtashamulhaq](https://github.com/mr-ahtashamulhaq)

---

## 📄 License

MIT © 2026 Ahtasham ul Haq

---

<div align="center">

*Made with ❤️ for the Hack Nation AI Hackathon 2026*

**[▶️ Watch Demo](https://youtu.be/k98aCVORN2s)** &nbsp;|&nbsp; **[🚀 Live Demo](https://packet-ready.vercel.app)** &nbsp;|&nbsp; **[📖 Deployment Guide](./DEPLOYMENT.md)** &nbsp;|&nbsp; **[🐛 Report Bug](https://github.com/mr-ahtashamulhaq/hack-nation-ai-hackathon/issues)**

</div>
