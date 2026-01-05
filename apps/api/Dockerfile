# FleetSure API Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source code
COPY apps/api ./apps/api

# Generate Prisma client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy built assets
COPY --from=base /app/apps/api/dist ./dist
COPY --from=base /app/apps/api/prisma ./prisma
COPY --from=base /app/apps/api/package.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/api/node_modules ./apps_node_modules

# Generate Prisma client in production image
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
