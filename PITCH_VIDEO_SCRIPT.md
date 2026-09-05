# 🎬 Razorpay Nexus — Complete Exhaustive Pitch Script & UI Details

> **Live Frontend App:** https://razorpay-nexus.web.app  
> **Live Backend API:** https://razorpay-nexus.onrender.com  
> **GitHub Repository:** https://github.com/Saathwik56/razorpay-nexus  

---

## ⏱️ Exhaustive Video Timeline

| Time | Page / Tab | Components & Features Covered | Button Actions |
|---|---|---|---|
| **0:00 – 0:35** | **Navbar & Overview** | Header Logo, Status Badge (6/6 Subsystems Green), Quick API Modal | Click *"API Credentials"* key icon button |
| **0:35 – 1:15** | **AI Catalog Passport** | UCP Schema, Price bounds, Inventory stock, AI discovery tags | Hover product cards, click *"View AI Metadata Schema"* |
| **1:15 – 2:05** | **Policy Center** | Order limits, Daily GMV caps, Category switches, Risk score slider | Change Order Limit, toggle Alcohol OFF, click *"Save Policy Rules"* & *"Simulate Policy Check"* |
| **2:05 – 3:00** | **AI Buyer Simulator** | Gemini 1.5 Flash NL search, Intent pills, Bounded Quotes (10m TTL), Sandbox Checkout | Click preset chip, click *"Run AI Buyer Query"*, click *"Generate Bounded Quote & Place Order"* |
| **3:00 – 3:45** | **Revenue Dashboard** | Total GMV, Agentic GMV, Recharts area chart, Agentic vs Human Pie Chart | Click *"30 Days"* filter, hover Pie Chart slices, click *"Refresh Dashboard Data"* |
| **3:45 – 4:30** | **Audit Trail & Test Lab** | Real-time Audit Stream, Actor pills, JSON payloads, Automated compliance assertions | Expand audit log row, pick preset test, click *"Execute Selected Test Case"* |
| **4:30 – 5:00** | **State Trace & System Health** | State Machine timeline (CREATED ➔ AUTHORIZED ➔ CAPTURED), Subsystem diagnostics | Click *"Trigger Live Subsystem Diagnostic Check"*, conclude presentation |

---

## 📜 Full Page-by-Page Script & All Button Actions

### **SECTION 1: Navbar & Global Control Bar (0:00 – 0:35)**
* **Component:** `Navbar.tsx` & `DemoControlBar.tsx`
* **Features Displayed:**
  - Header Logo: "Razorpay Nexus" with gradient badge "Agentic Control Plane"
  - Global Live Status Badge: `ONLINE (6/6 Subsystems Green)`
  - Quick API Credentials Manager Trigger
* **🎙️ Voiceover:**
  > *"Hi everyone! Welcome to Razorpay Nexus — the production-grade Agentic Commerce Control Plane and Governance Infrastructure. As autonomous AI agents begin making purchases on behalf of users, merchants need complete control over financial limits, catalog access, and security.*  
  > *Notice our top status bar showing 6 out of 6 core governance subsystems running live. Let's explore every layer of this control plane."*
* **🔘 Button Clicks:**
  1. Point mouse to `ONLINE (6/6 Subsystems Green)` badge.
  2. Click **API Credentials** key button on Navbar to show credentials modal, then close it.

---

### **SECTION 2: Overview & AI Catalog Passport (0:35 – 1:15)**
* **Component:** `AICatalogPassport.tsx`
* **Features Displayed:**
  - Product Cards: Wireless Earbuds, Fitness Watch, Protein Powder, Whey Isolate
  - Price tags, Inventory stock levels, Category pills, AI-discoverable status
  - Merchant UCP Schema & AI Passport Metadata Card (HMAC Protocol, Max limit ₹50k)
* **🎙️ Voiceover:**
  > *"First is the AI Catalog Passport. Before an AI agent can purchase from a merchant, the merchant exposes an AI-discoverable catalog schema specifying allowed categories, stock availability, and agent permissions.*  
  > *Here we see active merchant products like Fitness Watches and Protein Powders, each tagged with real-time price bounds and AI discovery metadata."*
* **🔘 Button Clicks:**
  1. Click **AI Catalog Passport** tab.
  2. Hover product card: *"Whey Protein Isolate - ₹2,499"*.
  3. Click **"View AI Metadata Schema"** on card to highlight JSON discovery metadata.

---

### **SECTION 3: Policy Center (1:15 – 2:05)**
* **Component:** `PolicyCenter.tsx`
* **Features Displayed:**
  - Financial Controls: Max Single Order Amount (₹50k), Max Daily Autonomous GMV (₹2L), Max Discount % (15%), Human Approval Threshold (₹10k)
  - Category Switches: Fitness (ON), Electronics (ON), Apparel (ON), Alcohol (OFF)
  - Risk Score Gating Slider (Max Allowed Risk: 0.25)
* **🎙️ Voiceover:**
  > *"Next is the Policy Center, where merchants define deterministic business rules. Merchants can adjust single order limits, set daily autonomous spending caps, and gate sensitive product categories."*
* **🔘 Button Clicks:**
  1. Click **Policy Center** tab.
  2. Click **Max Single Order Limit** input, change `50000` to `30000`.
  3. Toggle **Alcohol Category** switch to **OFF**.
  4. Click **"Save Policy Rules"** *(Voiceover: "The policy parameters update instantly in SQLite via Prisma.")*
  5. Click **"Simulate Policy Check"** *(Voiceover: "The Policy Engine evaluates all 10 deterministic rules in under 2ms, returning ALLOW or DENY.")*

---

### **SECTION 4: Gemini AI Buyer Simulator (2:05 – 3:00)**
* **Component:** `AIBuyerSimulator.tsx`
* **Features Displayed:**
  - Preset Chips: "Post-workout recovery products under ₹3000", "Earbuds under ₹5000", "Bulk Wine ₹80,000"
  - Gemini 1.5 Flash Intent Parsing Badge & Parsed Intent Pills (Keywords, Category, Price)
  - Cryptographic Bounded Quote Card with 10-minute TTL expiry countdown timer
  - Explicit User Consent Dialog
  - Razorpay Sandbox Order Card displaying Razorpay Order ID (`order_P...`)
* **🎙️ Voiceover:**
  > *"Now let's test an autonomous AI buyer. The buyer types a natural language request: 'I need post-workout recovery products under ₹3000'."*
* **🔘 Button Clicks:**
  1. Click **AI Buyer Simulator** tab.
  2. Click preset chip: **"Post-workout recovery products under ₹3000"**.
  3. Click **"Run AI Buyer Query"** *(Voiceover: "Nexus sends the query to Gemini 1.5 Flash, which parses intent into keywords, category 'Fitness', and max price ₹3,000.")*
  4. Highlight **Powered by Gemini 1.5 Flash** badge and intent pills.
  5. Click **"Generate Bounded Quote & Place Order"** *(Voiceover: "Nexus generates a 10-minute signed quote, validates policy rules, prompts user consent, and executes on Razorpay Sandbox — returning a live Razorpay Order ID.")*
  6. Click **"Reset Agent Chat"**.

---

### **SECTION 5: Revenue Dashboard (3:00 – 3:45)**
* **Component:** `RevenueDashboard.tsx`
* **Features Displayed:**
  - KPI Cards: Total GMV, Agentic Revenue, Conversion Rate %, Policy Pass Rate %
  - Recharts Area Chart with time range filters (7D, 30D, 90D)
  - Agentic vs. Human Revenue Donut/Pie Chart with interactive segment tooltips
  - Policy Health & ROI Upside Widget
* **🎙️ Voiceover:**
  > *"In the Merchant Revenue Dashboard, merchants track the commercial impact of AI buyers."*
* **🔘 Button Clicks:**
  1. Click **Revenue Dashboard** tab.
  2. Click time filter pill: **"30 Days"**.
  3. Hover mouse over blue **Agentic Orders** segment on Pie Chart *(Voiceover: "Here we track exact revenue share — showing 28.5% of total GMV driven by AI agents versus direct human checkouts.")*
  4. Point to **Policy Pass Rate: 99.9%** KPI card.
  5. Click **"Refresh Dashboard Data"**.

---

### **SECTION 6: Audit Trail & Interactive Test Lab (3:45 – 4:30)**
* **Component:** `AuditTrailView.tsx` & `TestLabView.tsx`
* **Features Displayed:**
  - Real-time Audit Stream, Search Bar, Actor Filters (`USER`, `AI_BUYER`, `POLICY_ENGINE`, `WEBHOOK`, `SYSTEM`)
  - Expandable Log Rows showing raw Prompt JSON, Gemini Intent, Policy Verdict, HMAC Signature
  - Test Lab Cases: Budget Limit Exceeded, Restricted Category, Replay Attack, Valid Order Flow
* **🎙️ Voiceover:**
  > *"For compliance, every single action is recorded in an immutable Audit Trail."*
* **🔘 Button Clicks:**
  1. Click **Audit Trail** tab.
  2. Click top log row to expand *(Voiceover: "Expanding a record reveals the exact prompt, policy evaluation verdict, and Razorpay HMAC signature validation.")*
  3. Click **Test Lab** tab.
  4. Select test: **"Exceed Single Order Limit Test"**.
  5. Click **"Execute Selected Test Case"** *(Voiceover: "Our test lab runs live policy assertions to verify that violations are blocked instantly with remediation steps.")*

---

### **SECTION 7: Transaction Trace & System Health (4:30 – 5:00)**
* **Component:** `TransactionTraceView.tsx` & `SystemHealthView.tsx`
* **Features Displayed:**
  - State Machine Timeline: `CREATED` ➔ `AUTHORIZED` ➔ `CAPTURED`
  - 6 Core Subsystem Cards: Fastify REST API, SQLite DB, Policy Engine, Webhook Handler, Quote Engine, State Machine
  - Subsystem Latency Metrics & Operational Statuses
  - Razorpay Key ID & Webhook Secret Credentials Manager
* **🎙️ Voiceover:**
  > *"Finally, Nexus includes full state machine tracing and diagnostic health monitoring."*
* **🔘 Button Clicks:**
  1. Click **System Health** tab.
  2. Click **"Trigger Live Subsystem Diagnostic Check"** *(Voiceover: "All 6 core subsystems verify live in parallel.")*
* **🎙️ Conclusion:**
  > *"With 51 passing automated tests, Docker support, and full cloud deployment on Firebase Hosting and Render, Razorpay Nexus is ready to power trusted agentic commerce. Thank you!"*
