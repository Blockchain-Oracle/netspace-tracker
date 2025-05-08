FROM node:18-alpine AS base
# Switch to root for system package installation
USER root
RUN apk add --no-cache python3 make g++ gcc libc-dev bash
RUN npm install -g pnpm
# /app will be created by root and owned by root
WORKDIR /app

# Install dependencies
FROM base AS deps
# User root is inherited from the 'base' stage's end state
COPY package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml
# If you use package-lock.json as well, uncomment the next line
# COPY package-lock.json ./package-lock.json

RUN pnpm install
# Explicitly build better-sqlite3
RUN cd node_modules/better-sqlite3 && npm run build-release

# Build the application
FROM base AS builder
# User root is inherited
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm run build

# Production image
FROM base AS runner
# User root is inherited
ENV NODE_ENV production

# Runs as root
RUN mkdir -p /app/data

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Change ownership of the entire /app directory to the new user/group
RUN chown -R nextjs:nodejs /app

# Switch to the non-root user for running the app
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# /app/data is now owned by nextjs
VOLUME ["/app/data"]

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"] 