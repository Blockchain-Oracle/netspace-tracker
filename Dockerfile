FROM node:18-alpine AS base
USER root
RUN apk add --no-cache python3 make g++ gcc libc-dev bash
RUN npm install -g pnpm
WORKDIR /app

FROM base AS deps
COPY package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install
RUN cd node_modules/better-sqlite3 && npm run build-release

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json
RUN pnpm run build

FROM base AS runner
ENV NODE_ENV production

RUN mkdir -p /app/data # Runs as root

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


RUN chown -R nextjs:nodejs /app

USER nextjs # Switch to the non-root user for running the app

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

VOLUME ["/app/data"] # /app/data is now owned by nextjs

EXPOSE 3000

CMD ["pnpm", "start"] 