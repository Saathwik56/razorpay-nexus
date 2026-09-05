# 🎬 Razorpay Nexus — Pitch Video Script & UI Action Guide

> **Live Frontend:** https://razorpay-nexus.web.app  
> **Live Backend API:** https://razorpay-nexus.onrender.com  

---

## ⏱️ Video Breakdown

| Time | Tab | Action / Buttons Clicked |
|---|---|---|
| **0:00 – 0:40** | **Overview** | Click **"Launch AI Buyer Demo"** button |
| **0:40 – 1:30** | **Policy Engine** | Edit order limit, toggle Alcohol OFF, click **"Save Policy Rules"** & **"Simulate Policy Check"** |
| **1:30 – 2:30** | **AI Buyer Simulator** | Click prompt chip, click **"Run AI Buyer Query"**, click **"Generate Bounded Quote & Place Order"** |
| **2:30 – 3:30** | **Revenue Dashboard** | Click **"30 Days"**, hover on **Agentic vs Human Revenue** pie chart, click **"Refresh Dashboard Data"** |
| **3:30 – 4:30** | **Audit Trail / Test Lab** | Expand log row, select test case, click **"Execute Selected Test Case"** |
| **4:30 – 5:00** | **System Health** | Click **"Trigger Live Subsystem Diagnostic Check"** |

---

## 📜 Full Second-by-Second Script & Button Actions

### **SECTION 1: Overview & Problem (0:00 – 0:40)**
* **Tab:** Overview / Home
* **🎙️ Voiceover:**
  > *"Hi everyone! As AI agents evolve into autonomous buyers making real transactions on behalf of users, a major problem arises: How do merchants govern, bound, and trust AI transactions at scale? Without guardrails, AI agents can bypass business rules or exceed spending limits.*  
  > *Welcome to Razorpay Nexus — an Agentic Commerce Control Plane designed to make merchants AI-discoverable while ensuring every transaction is explainable, bounded, policy-gated, and verified."*
* **🔘 Button Click:** Click blue **"Launch AI Buyer Demo"** button on hero banner.

---

### **SECTION 2: Policy Engine (0:40 – 1:30)**
* **Tab:** Policy Engine
* **🎙️ Voiceover:**
  > *"Here in the Policy Engine, merchants configure strict financial and catalog guardrails for autonomous agents."*
* **🔘 Button Actions:**
  1. Click **Max Single Order Limit** input, change `50000` to `30000`.
  2. Toggle **Alcohol Category** switch to **OFF**.
  3. Click **"Save Policy Rules"** *(Voiceover: "Rules update instantly in our database.")*
  4. Click **"Simulate Policy Check"** *(Voiceover: "The engine evaluates rules in under 2ms, returning ALLOW or DENY.")*

---

### **SECTION 3: Gemini AI Buyer Simulator (1:30 – 2:30)**
* **Tab:** AI Buyer Simulator
* **🎙️ Voiceover:**
  > *"Now let's see an autonomous AI buyer in action."*
* **🔘 Button Actions:**
  1. Click preset chip: **"Post-workout recovery products under ₹3000"**.
  2. Click **"Run AI Buyer Query"** *(Voiceover: "Nexus calls Gemini 1.5 Flash to extract structured intent — parsing keywords, category, and budget in real time.")*
  3. Click **"Generate Bounded Quote & Place Order"** *(Voiceover: "Nexus issues a signed quote, policy-checks it, and executes the order via Razorpay Sandbox.")*
  4. Click **"Reset Agent Chat"**.

---

### **SECTION 4: Revenue Dashboard (2:30 – 3:30)**
* **Tab:** Revenue Dashboard
* **🎙️ Voiceover:**
  > *"The Revenue Dashboard gives real-time visibility into agentic commerce performance."*
* **🔘 Button Actions:**
  1. Click time filter: **"30 Days"**.
  2. Hover mouse over the **Agentic Orders** segment on the **Agentic vs Human Revenue Pie Chart** *(Voiceover: "We track revenue share driven by AI agents versus human checkouts.")*
  3. Click **"Refresh Dashboard Data"**.

---

### **SECTION 5: Audit Trail & Test Lab (3:30 – 4:30)**
* **Tab:** Audit Trail / Test Lab
* **🎙️ Voiceover:**
  > *"Every AI action is logged in an immutable cryptographic Audit Trail."*
* **🔘 Button Actions:**
  1. Click **top log entry row** to expand JSON details *(Voiceover: "Reveals full prompt, Gemini intent, policy verdict, and HMAC validation.")*
  2. Select test case: **"Exceed Single Order Limit Test"**.
  3. Click **"Execute Selected Test Case"** *(Voiceover: "Our test lab executes live policy assertions.")*

---

### **SECTION 6: System Health & Conclusion (4:30 – 5:00)**
* **Tab:** System Health / Config
* **🎙️ Voiceover:**
  > *"Finally, Nexus includes full diagnostic monitoring."*
* **🔘 Button Actions:**
  1. Click **"Trigger Live Subsystem Diagnostic Check"** *(Voiceover: "All 6 core subsystems are verified live.")*
* **🎙️ Conclusion:**
  > *"With 51 passing automated tests, Docker support, and full cloud deployment on Firebase and Render, Razorpay Nexus is ready for enterprise agentic commerce. Thank you!"*
