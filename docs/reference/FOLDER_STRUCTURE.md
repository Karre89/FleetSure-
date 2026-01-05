# FleetSure - Repository Folder Structure

> Create this exact structure before writing any code.

---

## 📁 Complete Folder Tree

```
fleetsure/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Continuous integration
│   │   ├── deploy-web.yml            # Frontend deployment
│   │   └── deploy-api.yml            # Backend deployment
│   └── PULL_REQUEST_TEMPLATE.md
│
├── apps/
│   ├── web/                          # Next.js frontend (all portals)
│   │   ├── app/
│   │   │   ├── (auth)/               # Auth routes group
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── (fleet)/              # Fleet portal routes
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── jobs/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── vehicles/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── invoices/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reports/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── (mechanic)/           # Mechanic PWA routes
│   │   │   │   ├── jobs/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── earnings/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── (runner)/             # Runner PWA routes
│   │   │   │   ├── tasks/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── deliveries/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── (admin)/              # Admin console routes
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── jobs/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── mechanics/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── runners/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── fleets/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reports/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── api/                  # Next.js API routes (minimal, proxy only)
│   │   │   │   └── health/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── manifest.ts           # PWA manifest
│   │   │   └── globals.css
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── shared/               # Shared components
│   │   │   │   ├── header.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── error-boundary.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── fleet/                # Fleet-specific components
│   │   │   │   ├── job-request-form.tsx
│   │   │   │   ├── job-card.tsx
│   │   │   │   ├── vehicle-list.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── mechanic/             # Mechanic-specific components
│   │   │   │   ├── job-feed.tsx
│   │   │   │   ├── job-actions.tsx
│   │   │   │   ├── parts-request.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── runner/               # Runner-specific components
│   │   │   │   ├── task-card.tsx
│   │   │   │   ├── pickup-scanner.tsx
│   │   │   │   ├── delivery-proof.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── admin/                # Admin-specific components
│   │   │   │   ├── job-map.tsx
│   │   │   │   ├── assignment-panel.tsx
│   │   │   │   ├── sla-dashboard.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   └── maps/                 # Map components
│   │   │       ├── map-container.tsx
│   │   │       ├── job-marker.tsx
│   │   │       ├── mechanic-marker.tsx
│   │   │       └── route-display.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   ├── use-jobs.ts
│   │   │   ├── use-location.ts
│   │   │   ├── use-realtime.ts
│   │   │   └── use-sla-timer.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── api-client.ts         # API wrapper
│   │   │   ├── auth.ts               # Auth utilities
│   │   │   ├── mapbox.ts             # Mapbox configuration
│   │   │   ├── utils.ts              # General utilities
│   │   │   └── constants.ts
│   │   │
│   │   ├── stores/                   # Zustand stores (if needed)
│   │   │   ├── auth-store.ts
│   │   │   └── job-store.ts
│   │   │
│   │   ├── types/
│   │   │   └── index.ts              # Shared TypeScript types
│   │   │
│   │   ├── public/
│   │   │   ├── icons/
│   │   │   │   ├── icon-192.png
│   │   │   │   └── icon-512.png
│   │   │   └── ...
│   │   │
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── api/                          # NestJS backend
│       ├── src/
│       │   ├── main.ts               # Entry point
│       │   ├── app.module.ts         # Root module
│       │   │
│       │   ├── common/
│       │   │   ├── decorators/
│       │   │   │   ├── roles.decorator.ts
│       │   │   │   └── current-user.decorator.ts
│       │   │   ├── guards/
│       │   │   │   ├── jwt-auth.guard.ts
│       │   │   │   └── roles.guard.ts
│       │   │   ├── filters/
│       │   │   │   └── http-exception.filter.ts
│       │   │   ├── interceptors/
│       │   │   │   └── audit-log.interceptor.ts
│       │   │   ├── pipes/
│       │   │   │   └── validation.pipe.ts
│       │   │   └── middleware/
│       │   │       └── rate-limit.middleware.ts
│       │   │
│       │   ├── config/
│       │   │   ├── config.module.ts
│       │   │   ├── database.config.ts
│       │   │   ├── redis.config.ts
│       │   │   └── env.validation.ts
│       │   │
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── auth.module.ts
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── strategies/
│       │   │   │   │   ├── jwt.strategy.ts
│       │   │   │   │   └── local.strategy.ts
│       │   │   │   └── dto/
│       │   │   │       ├── login.dto.ts
│       │   │   │       └── register.dto.ts
│       │   │   │
│       │   │   ├── users/
│       │   │   │   ├── users.module.ts
│       │   │   │   ├── users.controller.ts
│       │   │   │   ├── users.service.ts
│       │   │   │   └── dto/
│       │   │   │       └── ...
│       │   │   │
│       │   │   ├── fleets/
│       │   │   │   ├── fleets.module.ts
│       │   │   │   ├── fleets.controller.ts
│       │   │   │   ├── fleets.service.ts
│       │   │   │   └── dto/
│       │   │   │       └── ...
│       │   │   │
│       │   │   ├── jobs/
│       │   │   │   ├── jobs.module.ts
│       │   │   │   ├── jobs.controller.ts
│       │   │   │   ├── jobs.service.ts
│       │   │   │   ├── jobs.gateway.ts      # WebSocket gateway
│       │   │   │   └── dto/
│       │   │   │       ├── create-job.dto.ts
│       │   │   │       └── update-job.dto.ts
│       │   │   │
│       │   │   ├── mechanics/
│       │   │   │   ├── mechanics.module.ts
│       │   │   │   ├── mechanics.controller.ts
│       │   │   │   ├── mechanics.service.ts
│       │   │   │   └── dto/
│       │   │   │       └── ...
│       │   │   │
│       │   │   ├── runners/
│       │   │   │   ├── runners.module.ts
│       │   │   │   ├── runners.controller.ts
│       │   │   │   ├── runners.service.ts
│       │   │   │   └── dto/
│       │   │   │       └── ...
│       │   │   │
│       │   │   ├── parts/
│       │   │   │   ├── parts.module.ts
│       │   │   │   ├── parts.controller.ts
│       │   │   │   ├── parts.service.ts
│       │   │   │   └── dto/
│       │   │   │       └── ...
│       │   │   │
│       │   │   ├── sla/
│       │   │   │   ├── sla.module.ts
│       │   │   │   ├── sla.service.ts
│       │   │   │   └── sla.processor.ts     # Bull queue processor
│       │   │   │
│       │   │   ├── billing/
│       │   │   │   ├── billing.module.ts
│       │   │   │   ├── billing.controller.ts
│       │   │   │   ├── billing.service.ts
│       │   │   │   └── stripe.service.ts
│       │   │   │
│       │   │   ├── notifications/
│       │   │   │   ├── notifications.module.ts
│       │   │   │   ├── notifications.service.ts
│       │   │   │   ├── email.service.ts
│       │   │   │   └── sms.service.ts
│       │   │   │
│       │   │   └── audit/
│       │   │       ├── audit.module.ts
│       │   │       └── audit.service.ts
│       │   │
│       │   └── prisma/
│       │       ├── prisma.module.ts
│       │       └── prisma.service.ts
│       │
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       │
│       ├── test/
│       │   ├── app.e2e-spec.ts
│       │   └── jest-e2e.json
│       │
│       ├── nest-cli.json
│       ├── tsconfig.json
│       ├── tsconfig.build.json
│       ├── package.json
│       └── .env.example
│
├── packages/                         # Shared packages
│   ├── shared-types/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── job.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── fleet.types.ts
│   │   │   ├── mechanic.types.ts
│   │   │   ├── runner.types.ts
│   │   │   ├── parts.types.ts
│   │   │   ├── sla.types.ts
│   │   │   └── api.types.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-utils/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── money.ts              # Money handling utilities
│   │   │   ├── dates.ts              # Date/time utilities
│   │   │   ├── geo.ts                # Geolocation utilities
│   │   │   └── validation.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── eslint-config/
│       ├── index.js
│       └── package.json
│
├── docs/                             # Project documentation
│   ├── README.md                     # Documentation index
│   ├── PRD.md                        # Product requirements
│   ├── USER_FLOWS.md                 # User journey maps
│   ├── ARCHITECTURE.md               # System design
│   ├── DATABASE.md                   # Data model
│   ├── API.md                        # API specification
│   ├── SLA.md                        # SLA rules and timers
│   ├── PARTS_FLOW.md                 # Parts fulfillment
│   ├── SECURITY.md                   # Security model
│   ├── TESTING.md                    # Test plan
│   ├── DEPLOYMENT.md                 # Deploy guide
│   ├── OPERATIONS.md                 # Ops runbook
│   └── ROADMAP.md                    # Future phases
│
├── tasks/                            # Execution tracking
│   ├── BUILD_CHECKLIST.md            # Week-by-week tasks
│   └── ISSUES.md                     # GitHub issues list
│
├── scripts/
│   ├── setup-dev.sh                  # Dev environment setup
│   ├── seed-data.sh                  # Seed database
│   └── deploy.sh                     # Deployment helper
│
├── .gitignore
├── .nvmrc                            # Node version
├── package.json                      # Root package.json
├── pnpm-workspace.yaml               # Monorepo workspace config
├── turbo.json                        # Turborepo config
├── README.md                         # Project README
└── docker-compose.yml                # Local dev services
```

---

## 📝 File Creation Order

Create files in this order to avoid dependency issues:

### Step 1: Root Configuration
```bash
# Create directories
mkdir -p fleetsure/{apps/{web,api},packages/{shared-types,shared-utils,eslint-config},docs,tasks,scripts,.github/workflows}

# Create root files
touch fleetsure/{.gitignore,.nvmrc,package.json,pnpm-workspace.yaml,turbo.json,README.md,docker-compose.yml}
```

### Step 2: Documentation
```bash
cd fleetsure/docs
touch README.md PRD.md USER_FLOWS.md ARCHITECTURE.md DATABASE.md API.md SLA.md PARTS_FLOW.md SECURITY.md TESTING.md DEPLOYMENT.md OPERATIONS.md ROADMAP.md

cd ../tasks
touch BUILD_CHECKLIST.md ISSUES.md
```

### Step 3: Backend Structure
```bash
cd ../apps/api
# Create NestJS structure (use nest-cli or manual)
nest new api --skip-install --package-manager pnpm
# Then create module folders...
```

### Step 4: Frontend Structure
```bash
cd ../web
# Create Next.js app
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false
# Then create route groups and components...
```

### Step 5: Shared Packages
```bash
cd ../../packages/shared-types
npm init -y
touch src/index.ts src/job.types.ts src/user.types.ts
# Repeat for other packages...
```

---

## 🔑 Key Configuration Files

### Root package.json
```json
{
  "name": "fleetsure",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "db:migrate": "pnpm --filter api prisma migrate dev",
    "db:seed": "pnpm --filter api prisma db seed"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

### pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {}
  }
}
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: fleetsure
      POSTGRES_PASSWORD: fleetsure_dev
      POSTGRES_DB: fleetsure_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

*Continue to DATABASE_SCHEMA.md for data model →*
