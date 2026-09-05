# 🎬 Razorpay Nexus — 5-Minute Pitch Video Script & Recording Blueprint

> **Project:** Razorpay Nexus — Agentic Commerce Control Plane  
> **Live Demo Frontend:** https://razorpay-nexus.web.app  
> **Live Demo Backend API:** https://razorpay-nexus.onrender.com  

---

## ⏱️ Video Breakdown at a Glance

| Time Slot | Section | Core Focus | Key UI Navigation |
|---|---|---|---|
| **0:00 – 0:45 (45s)** | 1. Problem & Hook | Infrastructure gap in Agentic Commerce | Landing / Overview Hero Page |
| **0:45 – 1:45 (60s)** | 2. Architecture & Policy Engine | Bounded Quotes & Deterministic Policy Gating | Policy Engine Tab |
| **1:45 – 2:45 (60s)** | 3. Gemini AI Buyer Demo | Natural language intent extraction to Razorpay Sandbox Order | AI Buyer Simulator Tab |
| **2:45 – 3:45 (60s)** | 4. Revenue Analytics | Agentic vs. Human Revenue metrics | Revenue Dashboard Tab |
| **3:45 – 4:30 (45s)** | 5. Security & State Machine | Audit trail, HMAC-SHA256 signatures, state machine | Audit Trail / Test Lab Tab |
| **4:30 – 5:00 (30s)** | 6. Engineering Maturity & Wrap-up | 51 Vitest tests, CI/CD, Docker, production readiness | Summary & Architecture View |

---

## 📜 Second-by-Second Voiceover Script & Visual Actions

### **SECTION 1: Hook & The Problem (0:00 – 0:45)**

#### **🎙️ Voiceover:**
> *"Hi everyone! As AI agents evolve from simple chat assistants into autonomous buyers that make transactions on behalf of users, a major infrastructure gap emerges: How do merchants govern, bound, and trust AI transactions at scale? Without guardrails, autonomous buyers can bypass business rules, exceed budget constraints, or trigger fraudulent state changes.*
> 
> *Welcome to **Razorpay Nexus** — a production-grade Agentic Commerce Control Plane & Governance Infrastructure designed to make every merchant AI-discoverable while ensuring every single AI transaction is explainable, bounded, policy-gated, and cryptographically verified."*

#### **🖥️ UI Navigation & Actions:**
1. Open the live URL `https://razorpay-nexus.web.app`.
2. Mouse over the main hero banner: **Razorpay Nexus — Agentic Commerce Control Plane**.
3. Highlight the status pill: **"Governance Infrastructure for Autonomous Commerce"**.

---

### **SECTION 2: Architectural Overview & Policy Engine (0:45 – 1:45)**

#### **🎙️ Voiceover:**
> *"Razorpay Nexus is built on three core governance pillars:*
> 1. *A **Bounded Quote Engine** that locks price, inventory, and TTL before payment execution.*
> 2. *A **Deterministic Policy Engine** that evaluates real-time transaction constraints like spending limits, risk scores, and catalog permissions.*
> 3. *A **Strict Payment State Machine** enforcing monotonic transition states from `CREATED` to `AUTHORIZED` to `CAPTURED`, backed by HMAC-SHA256 signature verification.*
> 
> *Let's see how policy enforcement prevents unverified transactions."*

#### **🖥️ UI Navigation & Actions:**
1. Click on the **"Policy Engine"** tab in top navigation.
2. Hover over active rules:
   - `MAX_SINGLE_ORDER_AMOUNT`: ₹50,000
   - `ALLOWED_CATEGORIES`: Electronics, Apparel, Fitness
   - `REQUIRES_HUMAN_APPROVAL_ABOVE`: ₹10,000
3. Click **"Simulate Policy Check"** to show instant `PASSED` / `DENIED` status badges.

---

### **SECTION 3: Live AI Buyer Agent Demo with Gemini (1:45 – 2:45)**

#### **🎙️ Voiceover:**
> *"Now let me demonstrate our **AI Buyer Simulator**. Here, autonomous AI agents interact with the catalog using natural language.*
> 
> *Watch what happens when an AI buyer submits: **'I need post-workout recovery products under ₹3000'**.*
> 
> *Nexus calls **Gemini 1.5 Flash** to extract structured intent — identifying category, target price bounds, and keywords in real time. The agent receives a cryptographically signed quote with a 15-minute TTL. Once approved by the policy engine, the AI buyer places the order via Razorpay Sandbox, generating an official Razorpay Order ID!"*

#### **🖥️ UI Navigation & Actions:**
1. Click on **"AI Buyer Simulator"** tab.
2. In the query box, paste or type:
   `I need post-workout recovery products under ₹3000`
3. Click **"Run AI Buyer Query"**.
4. Highlight the **"Powered by Gemini 1.5 Flash"** badge and extracted intent pills: `[Keyword: workout]`, `[Category: Fitness]`, `[Max: ₹3000]`.
5. Click **"Generate Bounded Quote & Place Order"**.
6. Point to the green confirmation banner displaying the real **Razorpay Order ID** (`order_P...`).

---

### **SECTION 4: Real-time Analytics & Governance (2:45 – 3:45)**

#### **🎙️ Voiceover:**
> *"Switching to the **Merchant Revenue Dashboard**, merchants gain real-time visibility into agentic commerce growth.*
> 
> *Notice our **Agentic vs. Human Revenue** breakdown chart — tracking what percentage of revenue is driven by autonomous AI buyers versus direct human checkouts. We can see AI agents accounting for 28.5% of total gross merchandise value.*
> 
> *Beside it, the **Policy Execution Health** metric guarantees 99.9% compliance across all incoming AI API quotes."*

#### **🖥️ UI Navigation & Actions:**
1. Click on **"Revenue Dashboard"** tab.
2. Scroll to the **"Agentic vs. Human Revenue"** Pie/Donut Chart.
3. Hover over the **Agentic Orders** slice (Blue) and **Human Orders** slice (Emerald) to trigger tooltips.
4. Point to the top KPI cards: Total GMV, Agentic GMV, Bounded Quotes Issued, and Policy Pass Rate.

---

### **SECTION 5: Cryptographic Audit Trail & Razorpay State Machine (3:45 – 4:30)**

#### **🎙️ Voiceover:**
> *"For compliance and debugging, Nexus logs every decision in an immutable **Audit Trail**.*
> 
> *Every transaction records the full agent prompt, Gemini's parsed intent, the matched policy rule ID, and the raw Razorpay HMAC signature header.*
> 
> *If an attacker attempts a replay attack or state bypass, the state machine halts the transaction instantly."*

#### **🖥️ UI Navigation & Actions:**
1. Click on **"Audit Trail / Test Lab"** tab.
2. Expand the top log entry corresponding to your demo transaction.
3. Highlight JSON keys:
   - `intent_summary`
   - `policy_verdict: ALLOW`
   - `razorpay_order_id`
   - `hmac_verified: true`

---

### **SECTION 6: Summary & Engineering Maturity (4:30 – 5:00)**

#### **🎙️ Voiceover:**
> *"Under the hood, Razorpay Nexus is built for enterprise production:*
> - *Fully unit and integration tested with **51 Vitest test suites** covering policy bounds, security headers, and webhook state machines.*
> - *Containerized via **Docker** and deployed on **Render** (Node.js/Fastify Backend) and **Firebase Hosting** (React Frontend).*
> - *Integrated directly with **Razorpay Sandbox APIs**.*
> 
> *Razorpay Nexus is the bridge between autonomous AI commerce and trusted merchant governance. Thank you!"*

#### **🖥️ UI Navigation & Actions:**
1. Switch back to **Overview** page or display README architecture diagram.
2. Show a quick screen snippet of terminal running `npm test` showing **51 passing tests**.
3. Display final slide with repository and live URLs.

---

# 🧪 Pre-Scripted Test Scenarios to Demo in Video

| Test Case # | Prompt to Type | Demonstrates | Expected UI Result |
|---|---|---|---|
| **1. Natural Language Intent** | `"I need post-workout recovery products under ₹3000"` | Gemini NL intent extraction & bounded quote creation | Green `PASSED` badge + Razorpay Order ID created |
| **2. Policy Enforcement** | `"Buy bulk wireless headphones for ₹80,000"` | Single order limit enforcement (`MAX_LIMIT` ₹50,000) | Red `POLICY_DENIED` badge with budget error reason |
| **3. Category Protection** | `"Order 5 bottles of wine for tonight"` | Catalog governance gating | Yellow `POLICY_BLOCKED` badge ("Category not allowed") |

---

# ⚡ Pre-Recording Checklist

1. **Warm Up Backend**: Visit `https://razorpay-nexus.onrender.com/health` 2 minutes before recording so Render free instance is active.
2. **Resolution**: Record in 1080p (1920x1080) with 60 FPS.
3. **Browser Zoom**: Set browser zoom to 100% or 110% for crisp font display.
