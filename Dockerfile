FROM node:18-alpine AS base

# Install dependencies needed for better-sqlite3
RUN apk add --no-cache python3 make g++ gcc libc-dev bash

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml* build-sqlite.sh ./
RUN chmod +x build-sqlite.sh
RUN pnpm install 

# Explicitly build better-sqlite3
RUN cd node_modules/better-sqlite3 && npm run build-release

# Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/build-sqlite.sh ./build-sqlite.sh
COPY . .
RUN chmod +x build-sqlite.sh
RUN pnpm run build

# Production image
FROM base AS runner
ENV NODE_ENV production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Set proper permissions for SQLite databases
RUN mkdir -p /app/data
VOLUME ["/app/data"]

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"] 