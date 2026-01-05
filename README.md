# FleetSure

> Guaranteed fleet uptime, on-demand.

FleetSure is an Uber-style platform connecting commercial truck fleets with independent diesel mechanics and parts runners for roadside repair and scheduled maintenance.

## Overview

- **Target Market**: I-5 corridor (Washington + Oregon)
- **SLA Guarantee**: <60 minute response time
- **Users**: Fleet dispatchers, Mechanics, Runners, Admins

## Tech Stack

### Frontend
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- TailwindCSS + shadcn/ui
- TanStack Query
- Mapbox GL JS
- PWA (workbox)

### Backend
- NestJS
- TypeScript (strict mode)
- PostgreSQL + Prisma
- Redis + Bull (queues)
- Socket.io (real-time)

### External Services
- Stripe (payments)
- Mapbox (maps)
- Twilio (SMS)
- Resend (email)

## Project Structure

```
fleetsure/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # Next.js frontend
├── packages/
│   ├── shared-types/ # Shared TypeScript types
│   └── shared-utils/ # Shared utilities
├── docs/
│   └── reference/    # Project documentation
└── .claude/
    └── skills/       # Claude Code skills
```

## Getting Started

### Prerequisites
- Node.js 20 LTS
- pnpm 8+
- Docker Desktop

### Setup
```bash
# Clone the repository
git clone https://github.com/Karre89/FleetSure-.git
cd fleetsure

# Install dependencies
pnpm install

# Start local services (Postgres, Redis)
docker-compose up -d

# Run database migrations
pnpm db:migrate

# Start development servers
pnpm dev
```

## Documentation

See `/docs/reference/` for:
- [Database Schema](docs/reference/DATABASE_SCHEMA.md)
- [API Specification](docs/reference/API_SPECIFICATION.md)
- [Folder Structure](docs/reference/FOLDER_STRUCTURE.md)
- [Build Checklist](docs/reference/BUILD_CHECKLIST.md)

## License

Private - All rights reserved.
