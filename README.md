# Fabricaze Frontend Web Application 🌐

> **Gateway to Digital Manufacturing in India**  
> Modern Next.js 15 + React 19 + Tailwind CSS marketplace platform connecting buyers with verified Indian MSME manufacturers.

---

## 🎨 Design System & Page Blueprint

The platform matches the official Fabricaze Pitch Deck & Lovable Design:

| Route | View | Description | Deck Slide Reference |
|---|---|---|---|
| `/` | **Landing Page** | High-conversion hero, live instant quoting widget, $500B MSME opportunity, 4-step workflow, and capability spectrum | Pitch Deck / Intro |
| `/client/submit-job` | **CAD Upload & Spec Configurator** | Drag & drop CAD file upload (.step, .dwg, .stl, .pdf), material selector, process, tolerances (±0.01mm), and live cost projection | **Page 14 / Page 8** |
| `/client/bids` | **Quotation Comparison** | Multi-vendor competitive bids with pseudo-name anonymity, ISO certs, lead times, award project with Escrow, and vendor chat | **Page 15 / Page 9** |
| `/client/manufacturers` | **Find Manufacturers Directory** | List view and Map view with filters for city hubs (Indore, Pune, Ahmedabad), machine capabilities, and certifications | **Page 16 / Page 10** |
| `/client/orders` | **Orders & Quality Verification** | 6-step shop floor milestone progression, CMM inspection sheets, Hardness Test (HT), and Material Test (MT) downloads | Deck / System Flow |
| `/admin/dashboard` | **Executive Super-Dashboard** | High-altitude platform KPIs: Total Jobs Posted (1,247), Active MSMEs (89), Revenue, Disputes, and urgent action alerts | **Page 17** |
| `/admin/users` | **User Management** | Client accounts & MSME audit tables with verification toggles and city clustering | **Page 18** |
| `/admin/jobs` | **Job Management** | Open, Quoted, and In-Production RFQ batches with budget brackets and manager assignments | **Page 19** |
| `/admin/quotes` | **Quotation Monitoring** | Automated price anomaly detection: flags quotes with > 25% or +34% variance above expected index | **Page 20** |
| `/admin/disputes` | **Dispute Resolution** | Independent third-party escrow mediation with refund/disburse workflows | **Page 21** |
| `/manufacturer/dashboard` | **MSME Spindle Portal** | Live matching RFQs, competitive bid submission, active batch milestone tracker | Architecture Flow |
| `/manufacturer/machines` | **Fleet & Capacity Manager** | Full CRUD for CNCs, Lathes, 5-Axis VMCs, working envelopes (X/Y/Z), and hourly rates | Architecture Flow |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.local.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🛡️ Anti-Disintermediation & Trust Architecture
Fabricaze utilizes a proprietary **Pseudo-name System** (e.g. `Precision Tech #IND-4102`). Buyers evaluate manufacturers purely on machine capability, tolerance compliance, verified ratings, and ISO certifications — preventing private bypass while building trust on-platform.
