# FleetSure - Build Checklist

> 4-week MVP build schedule for solo developer. Check off tasks as completed.

---

## 📋 Pre-Build Setup (Day 0)

### Environment Setup
- [ ] Install Node.js 20 LTS
- [ ] Install pnpm (`npm install -g pnpm`)
- [ ] Install Docker Desktop
- [ ] Create GitHub repository: `fleetsure`
- [ ] Set up VS Code with extensions:
  - [ ] ESLint
  - [ ] Prettier
  - [ ] Prisma
  - [ ] Tailwind CSS IntelliSense
  - [ ] Thunder Client (API testing)

### Account Setup
- [ ] Create Railway account (database hosting)
- [ ] Create Vercel account (frontend hosting)
- [ ] Create Fly.io account (API hosting)
- [ ] Create Stripe account (payments)
- [ ] Create Mapbox account (maps)
- [ ] Create Twilio account (SMS)
- [ ] Create Resend account (email)
- [ ] Create Sentry account (error tracking)

### Domain & Branding
- [ ] Verify fleetsure.co domain ownership
- [ ] Set up DNS records
- [ ] Create logo assets (can be simple text logo for MVP)

---

## 🗓️ WEEK 1: Foundation

### Day 1-2: Project Scaffold

**Monorepo Setup**
- [ ] Create folder structure (per FOLDER_STRUCTURE.md)
- [ ] Initialize root package.json
- [ ] Configure pnpm workspaces
- [ ] Set up Turborepo
- [ ] Create docker-compose.yml for local dev
- [ ] Start Postgres + Redis containers
- [ ] Verify containers running

**Shared Packages**
- [ ] Create `packages/shared-types`
- [ ] Define core TypeScript types (Job, User, Fleet, etc.)
- [ ] Create `packages/shared-utils`
- [ ] Implement money utilities (cents conversion)
- [ ] Implement date utilities
- [ ] Create shared ESLint config

### Day 3-4: Backend Foundation

**NestJS Setup**
- [ ] Initialize NestJS app in `apps/api`
- [ ] Configure TypeScript strict mode
- [ ] Set up environment validation (Joi/Zod)
- [ ] Configure CORS
- [ ] Set up global exception filter
- [ ] Set up validation pipe
- [ ] Create health check endpoint

**Database Setup**
- [ ] Install Prisma
- [ ] Create schema.prisma (per DATABASE_SCHEMA.md)
- [ ] Run initial migration
- [ ] Create Prisma service
- [ ] Create seed script with test data
- [ ] Verify database connection

**Redis Setup**
- [ ] Install Bull for job queues
- [ ] Configure Redis connection
- [ ] Create base queue processor
- [ ] Test queue functionality

### Day 5: Authentication

**Auth Module**
- [ ] Create auth module
- [ ] Implement JWT strategy
- [ ] Implement refresh token logic
- [ ] Create login endpoint
- [ ] Create register endpoint
- [ ] Create refresh token endpoint
- [ ] Create logout endpoint
- [ ] Implement password hashing (bcrypt)

**Guards & Decorators**
- [ ] Create JWT auth guard
- [ ] Create roles guard
- [ ] Create @Roles() decorator
- [ ] Create @CurrentUser() decorator
- [ ] Test auth flow with Thunder Client

### Day 6-7: Core Modules (Part 1)

**Users Module**
- [ ] Create users module
- [ ] Implement user CRUD
- [ ] Implement role-based filtering

**Fleets Module**
- [ ] Create fleets module
- [ ] Implement fleet CRUD
- [ ] Implement fleet stats endpoint
- [ ] Implement dispatcher management

**Vehicles Module**
- [ ] Create vehicles module
- [ ] Implement vehicle CRUD
- [ ] Link vehicles to fleets

---

## 🗓️ WEEK 2: Core Backend

### Day 8-9: Jobs Module

**Jobs CRUD**
- [ ] Create jobs module
- [ ] Implement create job endpoint
- [ ] Implement job listing with filters
- [ ] Implement job detail endpoint
- [ ] Implement job status update
- [ ] Implement job cancellation

**Job Status Machine**
- [ ] Define status transitions
- [ ] Validate status changes
- [ ] Record status history
- [ ] Emit events on status change

**Job Assignment**
- [ ] Create assignment logic
- [ ] Find nearest available mechanic
- [ ] Auto-assign on job creation
- [ ] Manual assignment endpoint (admin)

### Day 10-11: Mechanics & Runners

**Mechanics Module**
- [ ] Create mechanics module
- [ ] Implement mechanic registration
- [ ] Implement mechanic auth (separate from users)
- [ ] Implement profile update
- [ ] Implement location update
- [ ] Implement availability toggle
- [ ] Implement job acceptance/decline
- [ ] Implement earnings endpoint

**Runners Module**
- [ ] Create runners module
- [ ] Implement runner registration
- [ ] Implement runner auth
- [ ] Implement location update
- [ ] Implement availability toggle
- [ ] Implement task listing

**Runner Tasks**
- [ ] Create runner task entity
- [ ] Implement task assignment
- [ ] Implement task status updates
- [ ] Link tasks to part deliveries

### Day 12-13: Parts Fulfillment

**Parts Module**
- [ ] Create parts module
- [ ] Implement part request (from job)
- [ ] Implement part listing (for job)
- [ ] Implement part status update
- [ ] Implement vendor listing

**Part Delivery Flow**
- [ ] Create part delivery entity
- [ ] Link delivery to runner task
- [ ] Track pickup/delivery timestamps
- [ ] Handle proof of delivery

**Vendor Integration (MVP)**
- [ ] Seed part vendors (NAPA, FleetPride)
- [ ] Implement nearest vendor lookup
- [ ] Store vendor contact info

### Day 14: SLA Engine

**SLA Service**
- [ ] Create SLA module
- [ ] Define SLA checkpoints
- [ ] Calculate SLA remaining time
- [ ] Implement SLA breach detection

**SLA Background Jobs**
- [ ] Create SLA check queue
- [ ] Schedule periodic SLA checks
- [ ] Flag at-risk jobs
- [ ] Flag breached jobs
- [ ] Log breach events

**SLA Reporting**
- [ ] Implement SLA stats endpoint
- [ ] Calculate compliance percentage
- [ ] List breached jobs

---

## 🗓️ WEEK 3: Frontend

### Day 15-16: Next.js Setup

**Project Setup**
- [ ] Initialize Next.js in `apps/web`
- [ ] Configure TypeScript
- [ ] Set up Tailwind CSS
- [ ] Install shadcn/ui
- [ ] Create component library structure
- [ ] Set up TanStack Query
- [ ] Create API client wrapper

**Layout & Navigation**
- [ ] Create root layout
- [ ] Create auth layout (login/register pages)
- [ ] Create fleet layout (sidebar, header)
- [ ] Create mechanic layout (mobile nav)
- [ ] Create runner layout (mobile nav)
- [ ] Create admin layout (sidebar)

**Auth Pages**
- [ ] Create login page
- [ ] Create register page
- [ ] Implement auth context/hook
- [ ] Handle token storage
- [ ] Implement protected routes

### Day 17-18: Fleet Portal

**Dashboard**
- [ ] Create fleet dashboard page
- [ ] Display active jobs summary
- [ ] Display SLA compliance
- [ ] Quick actions card

**Job Request Flow**
- [ ] Create job request page
- [ ] Location picker with Mapbox
- [ ] Vehicle selector
- [ ] Issue type selector
- [ ] Urgency selector
- [ ] Review & submit step
- [ ] Confirmation view

**Job Tracking**
- [ ] Create jobs list page
- [ ] Job status filters
- [ ] Job detail page/panel
- [ ] Live mechanic location on map
- [ ] Status timeline

**Other Fleet Pages**
- [ ] Create vehicles list page
- [ ] Create invoices list page
- [ ] Create SLA report page

### Day 19-20: Mechanic PWA

**PWA Configuration**
- [ ] Configure Next.js PWA
- [ ] Create manifest.json
- [ ] Create service worker
- [ ] Add app icons
- [ ] Test install prompt

**Mechanic Pages**
- [ ] Create mechanic login page
- [ ] Create job feed page
- [ ] Job card component
- [ ] Create job detail page
- [ ] Accept/decline actions
- [ ] Status update buttons
- [ ] Parts request form
- [ ] Photo upload
- [ ] Create earnings page
- [ ] Create profile page

**Location Features**
- [ ] Request location permission
- [ ] Send location updates
- [ ] Navigation button (open maps app)

### Day 21: Runner PWA

**Runner Pages**
- [ ] Create runner login page
- [ ] Create task list page
- [ ] Task card component
- [ ] Create task detail page
- [ ] Accept/decline actions
- [ ] Pickup confirmation + photo
- [ ] Delivery confirmation + photo
- [ ] Create earnings page

---

## 🗓️ WEEK 4: Integration & Polish

### Day 22-23: Admin Console

**Admin Dashboard**
- [ ] Create admin dashboard
- [ ] Live metrics cards
- [ ] SLA alerts panel
- [ ] Live map with jobs/mechanics/runners

**Management Pages**
- [ ] Create jobs management page
- [ ] Manual assignment panel
- [ ] Create mechanics list page
- [ ] Mechanic approval flow
- [ ] Create runners list page
- [ ] Create fleets list page
- [ ] Create SLA report page

### Day 24-25: Real-time & Notifications

**WebSocket Setup**
- [ ] Set up Socket.io on backend
- [ ] Create jobs gateway
- [ ] Emit job updates
- [ ] Emit location updates
- [ ] Emit SLA warnings

**Frontend Real-time**
- [ ] Create useRealtime hook
- [ ] Subscribe to job updates
- [ ] Update UI on events
- [ ] Show toast notifications

**SMS Notifications**
- [ ] Set up Twilio
- [ ] Send job assigned SMS (to dispatcher)
- [ ] Send mechanic arriving SMS (to driver)
- [ ] Send job completed SMS

**Email Notifications**
- [ ] Set up Resend
- [ ] Welcome email template
- [ ] Invoice email template
- [ ] Send invoice emails

### Day 26-27: Billing

**Stripe Integration**
- [ ] Set up Stripe SDK
- [ ] Create billing module
- [ ] Implement customer creation
- [ ] Implement payment method storage

**Invoicing**
- [ ] Create invoice entity (already in schema)
- [ ] Generate monthly invoices
- [ ] Create invoice PDF
- [ ] Invoice list endpoint
- [ ] Invoice detail endpoint

**Payments**
- [ ] Create payment intent
- [ ] Handle payment webhook
- [ ] Update invoice status
- [ ] Frontend payment flow

### Day 28: Testing & Deployment

**Testing**
- [ ] Write unit tests for SLA service
- [ ] Write unit tests for job status machine
- [ ] Write e2e test for job creation flow
- [ ] Write e2e test for mechanic accept flow
- [ ] Manual testing of all flows

**Deployment**
- [ ] Set up Railway Postgres (production)
- [ ] Set up Upstash Redis (production)
- [ ] Deploy API to Fly.io
- [ ] Deploy web to Vercel
- [ ] Configure environment variables
- [ ] Set up custom domains
- [ ] Configure SSL
- [ ] Set up Sentry error tracking
- [ ] Verify production deployment

**Documentation**
- [ ] Update README with setup instructions
- [ ] Document API endpoints
- [ ] Create operations runbook
- [ ] Document deployment process

---

## ✅ MVP Definition of Done

### Core Functionality
- [ ] Fleet can create emergency job request
- [ ] Fleet can track job status in real-time
- [ ] Mechanic can accept/decline jobs
- [ ] Mechanic can update job status
- [ ] Mechanic can request parts
- [ ] Runner can accept delivery tasks
- [ ] Runner can complete deliveries with proof
- [ ] Admin can view dashboard
- [ ] Admin can manually assign jobs
- [ ] SLA timers work correctly
- [ ] SLA breaches are flagged

### Technical Requirements
- [ ] All API endpoints secured with JWT
- [ ] RBAC implemented correctly
- [ ] Database migrations work
- [ ] Seed data loads correctly
- [ ] Real-time updates work
- [ ] PWA installable on mobile
- [ ] Production deployment stable

### Quality
- [ ] No critical bugs
- [ ] Core flows tested
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Mobile responsive

---

## 📝 Daily Standup Template

Use this for tracking progress:

```
Date: ____

Yesterday:
- Completed: 
- Blockers:

Today:
- Plan to complete:
- Need help with:

Notes:
```

---

## 🚨 Risk Mitigation

### If Behind Schedule

**Week 1 behind:**
- Skip shared ESLint config
- Use simpler auth (no refresh tokens initially)

**Week 2 behind:**
- Skip runner module (mechanics pick up parts)
- Simplify SLA to just breach detection

**Week 3 behind:**
- Skip runner PWA
- Admin console: dashboard only
- Use basic styling (no polish)

**Week 4 behind:**
- Skip email notifications
- Skip invoice PDF generation
- Manual billing (Stripe dashboard)
- Deploy with basic monitoring

---

*Track progress daily. Adjust scope if needed. Ship the MVP!*
