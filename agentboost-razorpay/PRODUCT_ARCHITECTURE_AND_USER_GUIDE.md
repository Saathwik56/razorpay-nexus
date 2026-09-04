# AgentBoost — Razorpay Merchant Agentic Commerce OS
## Complete Product Documentation, UI Guide & Technical Blueprint

---

## 1. Executive Summary & Core Concept

### 1.1 What is AgentBoost?
**AgentBoost** is an end-to-end **Agentic Commerce Operating System** built for merchants on the **Razorpay Payment Infrastructure**. It empowers merchants to expand into autonomous AI-driven commerce by allowing AI Buyers (autonomous software agents acting on behalf of consumers) to discover products, negotiate bounded quotes, evaluate merchant-defined policies, and complete secure payments via Razorpay Test & Live Mode APIs.

### 1.2 Why AgentBoost?
With the rapid emergence of open agentic protocols (**ACP - Agentic Commerce Protocol**, **AP2 - Agent Payment Protocol**, **x402 - Web Monetization Headers**) and NPCI's **UAP (Unified Agent Protocol)** initiatives, traditional e-commerce checkouts designed for human clicks are evolving into **machine-to-machine (M2M) transaction flows**.

AgentBoost solves the 3 fundamental challenges of Agentic Commerce:
1. **Discoverability**: Converts legacy product catalogs into agent-readable, structured schema definitions validated by an **AI Merchant Passport**.
2. **Financial Guardrails**: Enforces a **Deterministic Policy Engine** and **Bounded Quote Engine** so AI agents can never overspend, tamper with prices, or bypass merchant limits.
3. **Trust & Governance**: Provides an **Immutable SQLite Audit Trail**, **Raw-Body HMAC Webhook Verification**, and **Monotonic Payment State Machine** so every money action is 100% explainable, audited, and recoverable.

---

## 2. Technical System Architecture

AgentBoost is architected with a decoupled frontend/backend architecture designed for maximum financial security:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             REACT SaaS FRONTEND                                  │
│  Navbar • Dashboard • AI Catalog • AI Buyer • Policy Center • Audit Trail       │
│  Interactive Test Lab • Transaction Trace • System Health • Razorpay Modal       │
└────────────────────────┬─────────────────────────────────────────────────────────┘
                         │ REST API Calls & Real-Time Sync
┌────────────────────────▼─────────────────────────────────────────────────────────┐
│                             FASTIFY NODE.JS BACKEND                              │
│                                                                                  │
│  ┌───────────────────────┐   ┌────────────────────────┐   ┌───────────────────┐  │
│  │ Bounded Quote Engine  │   │ Deterministic Policy   │   │ Razorpay REST API │  │
│  │ (10-min TTL / HMAC)   │──►│ Engine (10 Rules)      │──►│ (GET/POST orders) │  │
│  └───────────────────────┘   └────────────────────────┘   └───────────────────┘  │
│              │                            │                         │            │
│              ▼                            ▼                         ▼            │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                Monotonic Payment State Machine & HMAC Webhook               │ │
│  │                (CREATED ➔ AUTHORIZED ➔ CAPTURED ➔ REFUNDED)                │ │
│  └──────────────────────────────────────┬──────────────────────────────────────┘ │
│                                         │ Direct Writes                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            SQLITE / PRISMA DATABASE                              │
│  AuditLog Table • BoundedQuotes Table • MerchantPolicies Table • Transactions   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Comprehensive UI Page & Component Guide

The AgentBoost UI is divided into **8 main navigation modules** and **5 interactive utility components**:

### 3.1 Top Navigation Bar (`Navbar.tsx`)
* **Brand Badge**: Displays `AgentBoost` logo alongside the active Razorpay environment badge (`TEST MODE`).
* **Navigation Tabs (8 Tabs)**:
  1. `Dashboard` — Merchant Revenue Overview, Sync with Razorpay API, and Product Controls.
  2. `AI Catalog` — Agent Readiness Score, Add Product Modal, and 1-Click Catalog Optimization.
  3. `AI Buyer` — Conversational AI Agent Assistant for ANY product query.
  4. `Policies` — Deterministic Policy Rules & Interactive Action Gates (Order, Payment Link, Refund).
  5. `Audit Trail` — Real-Time Transaction Logs, Custom Test Event Injector & DB Inspection.
  6. `Test Lab` — Interactive 12-Scenario Test Lab with Console Reset & Test Case Approvals.
  7. `Trace` — Forensic 10-Step Lifecycle Sequence Viewer with Visual & JSON modes.
  8. `Health` — Subsystem Latency Diagnostics & Environment Mode Switcher (`Test` vs `Live`).
* **API Config Button (`⚙️ API Config`)**: Opens modal to configure Razorpay Key ID and Key Secret, testing credentials against `https://api.razorpay.com/v1/orders`.

---

### 3.2 Merchant Revenue Dashboard (`RevenueDashboard.tsx`)
* **KPI Metrics Bar**: Total Merchant GMV, Autonomous Agent Revenue, Conversion Rate, and Active Bounded Quotes.
* **Sync with Razorpay API Button**: Fetches real orders directly from `https://api.razorpay.com/v1/orders` using your merchant API credentials.
* **Live Revenue Analytics Chart**: Visual comparison of human vs. AI agent revenue streams over time.

---

### 3.3 AI Catalog & Merchant Passport (`AICatalogPassport.tsx`)
* **AI Readiness Score (0 - 100)**: Measures catalog readability for AI agents.
* **`➕ Add New Product` Button & Modal**: Allows merchants to dynamically add items to the catalog with SKU, category, price, stock, and AI discount rules.
* **`⚡ 1-Click Optimize Catalog` Button**: Injects JSON-LD schemas, attaches ACP/AP2 capability tags, and elevates readiness score to 100%.

---

### 3.4 AI Buyer Simulator (`AIBuyerSimulator.tsx`)
* **Conversational AI Shopping Assistant**: Supports ANY buyer query ("Recommend a watch under 5000", "Show all items", "Buy 2 protein powders").
* **Preset Prompt Pills**: Quick buttons for popular shopping intents.
* **Bounded Quote Summary Card**: Displays locked Quote ID, subtotal, total after discount, and policy status (`APPROVED`).
* **`💳 Approve & Pay` Button**: Launches the official Razorpay test-mode checkout flow.

---

### 3.5 Policy Center (`PolicyCenter.tsx`)
* **Monetary Limits Sliders**: Max Autonomous Transaction Limit (₹5,000 cap), Max Discount Cap (₹300), and Human Approval Gate thresholds.
* **Autonomous Action Gates**: Interactive toggles for *Create Razorpay Orders*, *Create Payment Links*, and *Autonomous Refunds*.
* **Action Gates Explanation Box**: Clear guidance explaining how action gates protect merchant revenue.

---

### 3.6 Audit Trail (`AuditTrailView.tsx`)
* **Live Audit Stream**: Reactive table fetching records directly from SQLite database.
* **Refresh Logs Button**: Refetches logs and displays a clean confirmation toast.
* **`➕ Add Custom Event` Button**: Allows merchants/testers to inject custom test events directly into the database.
* **View Transaction Trace Routing**: Clicking trace on any audit log switches tab to `/trace` and focuses on that transaction ID at the top.

---

### 3.7 Interactive Test Lab (`TestLabView.tsx`)
* **12 Interactive Test Scenarios**: Includes price tampering defense, policy limit checks, webhook HMAC verification, and payment state machine checks.
* **Reset Console & Tests Button**: Resets all test statuses to `NOT_RUN` AND clears the terminal execution console.
* **`✓ Approve Test` Action**: Allows testers to approve passed test cases and filter by Approved / Pending status.

---

### 3.8 Transaction Trace Viewer (`TransactionTraceView.tsx`)
* **Forensic Governance Explanation Banner**: Explains why the trace view exists for machine-to-machine AI payments (financial auditability & compliance).
* **View Mode Switch**: Toggle between **Visual Flow Diagram** and **Raw Payload JSON View**.
* **Direct Transaction Selector**: Picks any order ID or focuses on selected transaction from Audit Trail.

---

### 3.9 System Diagnostics & Health (`SystemHealthView.tsx`)
* **Dynamic Health Pings**: Measures real HTTP latency (ms) to Fastify server, SQLite DB, and Razorpay API.
* **Environment Switcher Modal**: Toggle between **Razorpay Test Mode** and **Razorpay Live Production Mode**.

---

## 4. End-to-End Transaction Overflow & Execution Flow

```
[1. AI Buyer Query] ──(Natural Language)──► [2. Bounded Quote Engine]
                                                    │
                                            (Server Signed & Locked)
                                                    │
                                                    ▼
[4. Razorpay Test Order] ◄──(Approved)─── [3. Policy Engine]
        │                                           │
   (Order ID)                                   (Blocked?)
        │                                           │
        ▼                                           ▼
[5. Razorpay Checkout]                   [Failure Recovery Modal]
        │
   (Payment Event)
        │
        ▼
[6. Webhook Listener] ──(HMAC Digest Match?)──► [7. Payment State Machine]
                                                       │
                                                (CREATED ➔ CAPTURED)
                                                       │
                                                       ▼
                                            [8. SQLite Audit Trail & Trace]
```

---
*Created for Razorpay Agentic Commerce Submission — September 2026*
