# RentReady — Deployment Guide

## Overview

RentReady is a Next.js 16 application that uses the **Groq API** (LLM) for income extraction and rules Q&A. The simplest deployment path is **Vercel** (zero-config for Next.js). A Docker path is also covered.

---

## Prerequisites

| Requirement | Details |
|---|---|
| Node.js | v18 or later |
| npm | v9 or later |
| Groq API Key | [console.groq.com/keys](https://console.groq.com/keys) |
| Git | Installed and repo pushed to GitHub |
| Vercel account | [vercel.com](https://vercel.com) — free tier is enough |

---

## Option A — Deploy on Vercel (Recommended)

### Step 1 — Push to GitHub

Make sure the project is committed and pushed to a GitHub repository (public or private). The `.gitignore` already excludes `.env`, `.next`, and `node_modules`.

### Step 2 — Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Click **"Import Git Repository"**.
3. Select your GitHub account and find `hack-nation-ai-hackathon` (or whatever you named it).
4. Click **Import**.

### Step 3 — Configure Environment Variables

On the Vercel import screen, before clicking **Deploy**, scroll down to **"Environment Variables"** and add:

| Key | Value |
|---|---|
| `GROQ_API_KEY` | `gsk_your_groq_api_key_here` |

> ⚠️ **Critical:** The app reads the `.env` file directly as a fallback for local dev. On Vercel, environment variables are injected through the platform — do NOT commit the `.env` file.

### Step 4 — Deploy

Click **Deploy**. Vercel will:
- Run `npm install` automatically
- Run `next build`
- Serve the production app globally via CDN

Your app will be live at `https://your-project-name.vercel.app`.

### Step 5 — Verify the Deployment

1. Open your Vercel URL in the browser.
2. Go to Screen 1 (Profile) — paste some income text and click **Process Text**.
3. Confirm extraction works (you should see income fields populate).
4. Navigate to Screen 2 (Understand) — ask a question.
5. Navigate to Screen 3 (Prepare) — verify the checklist renders.