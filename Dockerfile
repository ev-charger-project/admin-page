# Stage 1: Build
FROM oven/bun:1.1.22 AS builder
ARG NEXT_PUBLIC_EV_CHARGER_SERVICE_BASE_URL
ENV NEXT_PUBLIC_EV_CHARGER_SERVICE_BASE_URL=$NEXT_PUBLIC_EV_CHARGER_SERVICE_BASE_URL
ARG NEXT_PUBLIC_AUTH_SERVICE_BASE_URL
ENV NEXT_PUBLIC_AUTH_SERVICE_BASE_URL=$NEXT_PUBLIC_AUTH_SERVICE_BASE_URL
ARG NEXT_PUBLIC_VERSION
ENV NEXT_PUBLIC_VERSION=$NEXT_PUBLIC_VERSION
WORKDIR /app
COPY package.json bun.lockb next.config.mjs ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Stage 2: Serve
FROM oven/bun:1.1.22
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

RUN bun install next
EXPOSE 3000

CMD ["bun", "start"]
