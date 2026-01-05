# FleetSure - Claude Code Master Prompt

> **IMPORTANT**: Read this entire file first before executing any code. This is your complete project context.

---

## 🎯 PROJECT IDENTITY

**Brand Name**: FleetSure (capital S, no space - NEVER write "Fleet Sure" or "Fleetsure")
**Domain**: fleetsure.co
**Tagline**: "Guaranteed fleet uptime, on-demand."

**Legacy Names to Replace**: If you encounter "West Coast Diesel", "West Coast Diesel Pros", "WCD", "IronFleet", or "LoadOps" in any context, replace with "FleetSure".

---

## 📋 ONE-SENTENCE SUMMARY

FleetSure is an Uber-style platform connecting commercial fleets with independent diesel mechanics and parts runners for roadside repair and scheduled maintenance, guaranteeing <60-minute response times on the I-5 corridor (WA + OR).

---

## 🏗️ EXECUTION SEQUENCE

**You MUST follow this exact order:**

### Phase 0: Setup (Do This First)
1. Create the folder structure (see FOLDER_STRUCTURE.md)
2. Initialize the monorepo with package.json files
3. Set up TypeScript configs
4. Create environment variable templates

### Phase 1: Documentation (Week 0)
1. Write all /docs/*.md files with real content
2. Create the database schema design
3. Document all API endpoints
4. Write the security model

### Phase 2: Foundation (Week 1)
1. Set up PostgreSQL with Prisma
2. Create database migrations
3. Build authentication system
4. Implement RBAC (Role-Based Access Control)

### Phase 3: Core Backend (Week 2)
1. Job service (create, assign, status)
2. Mechanic service (profiles, availability)
3. Runner service (tasks, delivery tracking)
4. SLA timer engine
5. Parts fulfillment flow

### Phase 4: Frontend (Week 3)
1. Fleet/Dispatcher portal (web)
2. Mechanic PWA
3. Runner PWA
4. Admin console

### Phase 5: Integration & Polish (Week 4)
1. Stripe billing integration
2. Maps integration (Mapbox)
3. SMS notifications (Twilio)
4. End-to-end testing
5. Deployment setup

---

## 👥 USER ROLES (ONLY THESE 4)

| Role | Description | Platform |
|------|-------------|----------|
| **Fleet/Dispatcher** | Primary payer. Requests service, monitors jobs, pays invoices | Web portal |
| **Mechanic** | 1099 contractor. Accepts jobs, performs repairs, requests parts | Mobile PWA |
| **Runner** | Parts delivery. Picks up from vendors, delivers to mechanics | Mobile PWA |
| **Admin** | Internal FleetSure ops. Dispatch, support, management | Web console |

**NOT in MVP**: Consumer driver app. Drivers call their fleet dispatcher, not FleetSure directly.

---

## ✅ MVP FEATURES (BUILD THESE)

### Fleet/Dispatcher Portal
- [ ] Request service (location, truck, issue type, urgency)
- [ ] Real-time ETA display (mechanic + runner)
- [ ] Job status tracking (full state machine)
- [ ] Monthly invoices + job history
- [ ] SLA report (% jobs under 60 min)
- [ ] Multiple dispatcher seats per fleet
- [ ] Vehicle list management

### Mechanic App
- [ ] Job feed with accept/decline
- [ ] GPS navigation to job site
- [ ] Request parts (from catalog or free text)
- [ ] Upload job photos
- [ ] Mark job phases complete
- [ ] View earnings/payment history

### Runner App
- [ ] Pickup task alerts
- [ ] Navigation to vendor/depot
- [ ] Scan/confirm part pickup
- [ ] Navigate to mechanic
- [ ] Proof of delivery (photo)
- [ ] Delivery confirmations

### Admin Console
- [ ] Live job map view
- [ ] Manual job assignment
- [ ] Mechanic/runner management
- [ ] Fleet account management
- [ ] SLA monitoring dashboard
- [ ] Basic reporting

### Backend/SLA Engine
- [ ] Auto-assign nearest available mechanic
- [ ] Auto-assign nearest available runner
- [ ] SLA clock management with checkpoints
- [ ] SLA breach flagging
- [ ] Audit trail for all state changes

### Parts Fulfillment (MVP)
- [ ] Part request from job
- [ ] Vendor selection (Napa/FleetPride/local)
- [ ] Runner pickup assignment
- [ ] Delivery tracking
- [ ] Cost pass-through + markup

---

## ❌ EXPLICITLY OUT OF SCOPE (DO NOT BUILD)

- Telematics integration (Samsara/Geotab)
- Predictive maintenance / AI diagnosis
- Inventory management / owned depots
- Multi-language support
- Consumer-facing driver app
- Messaging threads / chat
- Fancy UX animations
- National expansion features
- Scheduling calendars for mechanics

---

## 🗺️ GEOGRAPHIC SCOPE

**MVP Territory**: Washington + Oregon only
**Primary Corridor**: I-5
**Initial Bases**:
- Kent/Tacoma, WA (primary)
- Portland, OR (secondary)

**Target Network**:
- 25 independent mechanics
- 3-4 runners

---

## 💰 BUSINESS MODEL

### Fleet Contracts (Primary Revenue)
- $500-$1,000 per truck/month
- Includes: Priority dispatch, SLA guarantee, parts coordination
- Overages billed per job

### Per-Job (Backup Revenue)
- Emergency roadside: $650-$1,200
- Platform fee: 18-20%

### Parts
- Pass-through cost + 10-20% markup
- Delivery fee included

---

## 🛠️ TECH STACK (MANDATORY)

```
Frontend:
├── Next.js 14+ (App Router)
├── TypeScript (strict mode)
├── TailwindCSS
├── shadcn/ui components
├── TanStack Query (data fetching)
├── Mapbox GL JS (maps)
└── PWA configuration (workbox)

Backend:
├── NestJS (Node.js framework)
├── TypeScript (strict mode)
├── PostgreSQL (primary database)
├── Prisma (ORM)
├── Redis (queues, caching, SLA timers)
├── Bull (job queues)
└── Socket.io (real-time updates)

External Services:
├── Stripe (payments/invoicing)
├── Mapbox (maps/geocoding/routing)
├── Twilio (SMS notifications)
├── Resend (transactional email)
├── Sentry (error tracking)
└── S3/R2 (file storage)

Infrastructure:
├── Vercel (frontend hosting)
├── Fly.io (API hosting)
├── Railway (managed Postgres)
├── Upstash (managed Redis)
└── GitHub Actions (CI/CD)
```

---

## 🔐 SECURITY REQUIREMENTS

1. **Authentication**: JWT + refresh tokens, secure httpOnly cookies
2. **Authorization**: RBAC with role hierarchy (Admin > Fleet > Mechanic > Runner)
3. **Multi-tenancy**: Fleet isolation at database level
4. **Rate Limiting**: Per-endpoint limits, abuse prevention
5. **Input Validation**: Zod schemas on all inputs
6. **Audit Logging**: All state changes logged with actor, timestamp, before/after
7. **Secrets Management**: Environment variables, never committed
8. **HTTPS**: Enforced everywhere

---

## 📊 JOB STATE MACHINE

```
REQUESTED
    ↓ (mechanic assigned)
ASSIGNED
    ↓ (mechanic accepts)
ACCEPTED
    ↓ (mechanic starts driving)
EN_ROUTE
    ↓ (mechanic arrives)
ON_SITE
    ↓ (if parts needed)
PARTS_REQUESTED → PARTS_DISPATCHED → PARTS_DELIVERED
    ↓ (repair complete)
COMPLETED
    ↓ (payment processed)
PAID

[CANCELLED can occur from: REQUESTED, ASSIGNED, ACCEPTED]
```

---

## ⏱️ SLA CHECKPOINTS

| Checkpoint | Timer Starts | Target |
|------------|--------------|--------|
| Assignment | Job created | 5 min |
| Acceptance | Job assigned | 5 min |
| En Route | Job accepted | 2 min |
| Arrival | Mechanic dispatched | 45 min |
| **Total Response** | Job created | **60 min** |

---

## 📁 DOCUMENT READING ORDER

Read these files in order for complete context:

1. `CLAUDE_CODE_MASTER_PROMPT.md` (this file)
2. `FOLDER_STRUCTURE.md` (repo layout)
3. `DATABASE_SCHEMA.md` (data model)
4. `API_SPECIFICATION.md` (endpoints)
5. `USER_FLOWS.md` (UX flows)
6. `BUILD_CHECKLIST.md` (execution tasks)

---

## 🚀 START COMMAND

After reading all context files, begin with:

```bash
# 1. Create project directory
mkdir fleetsure && cd fleetsure

# 2. Initialize monorepo
npm init -y

# 3. Create folder structure
# (follow FOLDER_STRUCTURE.md exactly)

# 4. Begin Phase 0 tasks from BUILD_CHECKLIST.md
```

---

## ⚠️ CRITICAL REMINDERS

1. **Always use "FleetSure"** - capital S, no space
2. **Mobile-first** for Mechanic and Runner apps
3. **SLA is sacred** - every state change must be timestamped
4. **No inventory** in MVP - use vendor pickup only
5. **Multi-tenant from day 1** - fleet data isolation
6. **Money as integers** - store cents, not dollars (no floats)
7. **Audit everything** - who did what, when

---

*Continue to FOLDER_STRUCTURE.md for repository layout →*
